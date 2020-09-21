/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useMemo } from 'react';
import { connect, component, isBrowser } from 'acore';
import { sysconfig } from 'systems';
import { FM, enUS, formatMessage } from 'locales';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { Checkbox, message, Popconfirm, Tooltip, Input, Button, Tabs, Badge } from 'antd';
import { Loading } from 'components/ui';
import { useSSRTwoPassRender } from 'helper/hooks';
import pubHelper from 'helper/pub';
import Clipboard from 'clipboard';
import axios from 'axios';
import { loadJsZip } from 'utils/requirejs';
import { setPubStyle } from 'aminer/core/pub/utils';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './PaperCollector.less';

const { TabPane } = Tabs;

const authorInitialCap = author => {
  const hasCapReg = /[\u4E00-\u9FA5A-Z]/g;
  if (author && !hasCapReg.test(author)) {
    return author.replace(/( |^)[a-z]/g, L => L.toUpperCase());
  }
  return author;
};

const renderAuthor = authors => {
  const author_length = 3;
  if (authors && !!authors.length) {
    return (
      <>
        {authors.slice(0, author_length).map((author, index) => {
          let { name, name_zh } = author;
          const locale = sysconfig.Locale;
          const isDefaultLocale = locale === enUS;
          if (!isDefaultLocale) {
            [name, name_zh] = [name_zh, name];
          }
          name = authorInitialCap(name || name_zh);
          return (
            <span key={`${name}${index}`}>
              <span className="author">{name || name_zh || ''}</span>
              {((index !== author_length - 1 && authors.length > index + 1) ||
                authors.length > author_length) && <span>,&nbsp;</span>}
            </span>
          );
        })}
        {authors.length > author_length && <span>et al.</span>}
      </>
    );
  }
  return <></>;
};

const isMobileFunc = () => {
  let isMobiles;
  if (global && global.isMobile) {
    isMobiles = global.isMobile;
  }
  else if (isBrowser() && window && window.navigator && window.navigator.userAgent) {
    isMobiles = /mobile|android|iphone|ipad|phone/i.test(window.navigator.userAgent);
  }
  return isMobiles;
};

const RelatedWork = props => {
  const { downloadFiles, selected, dispatch } = props;
  let clipboard1 = null,
    clipboard2 = null;
  const [tab, setTab] = useState('relatedWork');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!clipboard1) {
      clipboard1 = new Clipboard('#related_word_copy_btn', {
        target: () => document.getElementById('related_work'),
      });
    }
    if (!clipboard2) {
      clipboard2 = new Clipboard('#related_work_word_copy_btn', {
        target: () => document.getElementById('related_work_word'),
      });
    }
  }, []);

  useEffect(() => {
    const payload = { ids: selected };
    if (tab === 'word') {
      payload.query = 'word';
    }
    dispatch({
      type: 'searchpaper/getPaperRelatedWork',
      payload,
    }).then(data => {
      let content = `${data.desc || ''}${data.article || ''}`;
      if (tab === 'word') {
        content = `${data.desc || ''}${data.word || ''}`;
      }
      setContent(content);
    });
  }, [tab]);

  const onTabChange = key => {
    setTab(key);
    setContent('');
  };

  const copySuccess = () => {
    message.success(
      formatMessage({ id: 'aminer.header.collector.copySuccess', defaultMessage: '复制成功' }),
    );
  };

  const downloadRelatedWork = () => {
    if (content && content.length) {
      downloadFiles('Related work.txt', content);
    } else {
      message.error(
        formatMessage({
          id: 'aminer.header.collector.downloadNull',
          defaultMessage: '没有下载内容',
        }),
      );
    }
  };

  const autoHeight =
    document && document.body && document.body
      ? document.getElementById('aminer_modal_content').offsetHeight - 180
      : 300;
  const renderContent = (content, setContent, copySuccess, download, textAreaId, btnId) => (
    <div>
      <Input.TextArea
        // autoSize={{ minRows: 2, maxRows: 18 }}
        style={{ height: autoHeight, maxHeight: autoHeight }}
        value={content}
        id={textAreaId}
        onChange={e => setContent(e.target.value)}
      />
      <div className={styles.btnLine}>
        <Button id={btnId} onClick={copySuccess} className={styles.btn}>
          <svg className={classnames('icon', styles.copyBtn)} aria-hidden="true">
            <use xlinkHref="#icon-niantie" />
          </svg>
          <FM id="aminer.header.collector.copy" defaultMessage="复制到剪切板" />
        </Button>
        <Button onClick={download} className={styles.btn}>
          <svg className={classnames('icon', styles.downloadBtn)} aria-hidden="true">
            <use xlinkHref="#icon-xiazai" />
          </svg>
          <FM id="aminer.paper.download" defaultMessage="Download" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.relatedwork}>
      <Tabs defaultActiveKey="relatedWork" onChange={onTabChange} animated={false}>
        <TabPane
          tab={formatMessage({
            id: 'aminer.header.collector.txtContent',
            defaultMessage: 'Bibtex 格式',
          })}
          key="relatedWork"
        >
          {renderContent(
            content,
            setContent,
            copySuccess,
            downloadRelatedWork,
            'related_work',
            'related_word_copy_btn',
          )}
        </TabPane>
        <TabPane
          tab={formatMessage({
            id: 'aminer.header.collector.wordContent',
            defaultMessage: 'Word 格式',
          })}
          key="word"
        >
          {renderContent(
            content,
            setContent,
            copySuccess,
            downloadRelatedWork,
            'related_work_word',
            'related_work_word_copy_btn',
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

const PaperCollector = props => {
  const [open, setOpen] = useState(false); // is collector open
  const [selected, setSelected] = useState([]);
  const [isDownload, setIsDownload] = useState(false);
  const {
    className,
    dispatch,
    user,
    paperLiked,
    paperAllLiked,
    paperLikedPagination,
    loading,
    showNum = false,
  } = props;
  let page = 0;
  const [isEnd, setIsEnd] = useState(false);

  let pageSize = 50; // 滚动加载
  const onOpenChange = () => {
    if (isLogin(user)) {
      setOpen(!open);
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const getPaperCollected = (offset = 0, size = 50) => {
    if (props && props.user) {
      if (isEnd) return;
      if ((paperLiked && paperLiked.length) && (paperLiked.length < size + offset)) {
        setIsEnd(true);
        // return;
      }
      dispatch({
        type: 'searchpaper/getPaperCollected',
        payload: { offset, size },
      });
    }
  };

  const isMobile = useMemo(() => isMobileFunc(), []);

  useEffect(() => {
    if (open) {
      getPaperCollected(0, pageSize);
    } else {
      page = 0;
      setIsEnd(false);
      // dispatch({
      //   type: 'searchpaper/update',
      //   payload: {
      //     paperLiked: null,
      //     // paperLikedPagination: {
      //     //   total: null // 这里可能不能置为空
      //     // }
      //   }
      // })
      // setOpen(false);
    }
  }, [open]);

  // 默认一上来加载
  useEffect(() => {
    if (isLogin(user)) {
      dispatch({
        type: 'searchpaper/getPaperCollected',
        payload: { offset: 0, size: 50 },
      }).then((result) => {
        const { count, data } = result || {};
        if (count > 50) {
          dispatch({
            type: 'searchpaper/getAllPaperCollected',
            payload: { offset: 0, size: count },
          })
        } else {
          dispatch({
            type: 'searchpaper/update',
            payload: { paperAllLiked: data || [] },
          })
        }
      });
    }
  }, []);

  const onWrapClick = e => {
    e.stopPropagation();
  };

  const onSelectAllChange = e => {
    if (e && e.target) {
      const { checked } = e.target;
      if (checked) {
        const paperAllLikedIds = (paperAllLiked && paperAllLiked.map(item => item.id)) || [];
        setSelected(paperAllLikedIds);
      } else setSelected([]);
    }
  };
  const loadMorePaperLiked = () => {
    if (loading) return;
    page += 1;
    getPaperCollected(page * pageSize, pageSize);
  };

  const onCheckChange = value => {
    setSelected(value);
  };

  const findDownLoadPdfLinks = enablePdf => {
    const links = [];
    const paperLinks = {};
    paperLiked.forEach((item, index) => {
      if (enablePdf && item.pdf) {
        paperLinks[item.id] = { pdf: item.pdf, name: item.title || `paper-${index}`, id: item.id };
      } else {
        paperLinks[item.id] = {
          pdf: item.pdf || '',
          name: item.title || `paper-${index}`,
          id: item.id,
        };
      }
    });
    selected.forEach(ele => {
      if (paperLinks[ele]) {
        const link = paperLinks[ele].pdf.startsWith('//static')
          ? `https:${paperLinks[ele].pdf}`
          : paperLinks[ele].pdf;
        links.push({ id: paperLinks[ele].id, name: paperLinks[ele].name, pdf: link });
      }
    });
    return links;
  };

  const downloadFiles = (filename, data, type) => {
    const URL = window.URL || window.webkitURL;
    let blob = new Blob([data], { type: type || 'text/plain' });
    const force_saveable_type = 'application/octet-stream';
    if (blob.type && blob.type !== force_saveable_type) {
      // 强制下载，而非在浏览器中打开
      const slice = blob.slice || blob.webkitSlice || blob.mozSlice;
      blob = slice.call(blob, 0, blob.size, force_saveable_type);
    }
    const url = URL.createObjectURL(blob);
    const save_link = document.createElement('a');
    save_link.href = url;
    save_link.download = filename;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    save_link.dispatchEvent(event);
    URL.revokeObjectURL(url);
    setIsDownload(false);
  };

  const downloadPdf = async () => {
    if (window) {
      loadJsZip(async JSZip => {
        const zip = new JSZip();
        const links = findDownLoadPdfLinks(true);
        if (!links || links.length === 0) {
          message.info(
            formatMessage({
              id: 'aminer.header.collector.pleaseSelect',
              defaultMessage: '请选择需要的论文',
            }),
          );
          return;
        }
        setIsDownload(true);
        if (links && links.length > 5) {
          message.error(
            formatMessage({
              id: 'aminer.header.collector.downloadLimit',
              defaultMessage: '最多选择 5 篇论文',
            }),
          );
          setIsDownload(false);
          return;
        }
        // zip.folder('papers')
        for (const item of links) {
          try {
            const data = await axios.get(item.pdf, { responseType: 'blob' });
            zip.file(`${item.name}.pdf`, data.data, { binary: true });
          } catch (error) {
            message.error(
              formatMessage({
                id: 'aminer.header.collector.downloadError',
                defaultMessage: '下载失败，请重试',
              }),
            );
          }
        }
        zip.generateAsync({ type: 'blob' }).then(content => {
          downloadFiles('papers.zip', content);
        });
      });
    }
  };

  const downloadBibtex = async () => {
    const links = findDownLoadPdfLinks();

    if (!links || links.length === 0) {
      message.info(
        formatMessage({
          id: 'aminer.header.collector.pleaseSelect',
          defaultMessage: '请选择需要的论文',
        }),
      );
      // setIsDownload(false)
      return;
    }
    const bibtexData = [];
    setIsDownload(true);
    for (const item of links) {
      try {
        const data = await dispatch({ type: 'aminerSearch/bibtex', payload: { id: item.id } });
        if (data.status) {
          bibtexData.push(item.name);
          data.data.bib &&
            data.data.bib.status &&
            bibtexData.push('BIB:') &&
            bibtexData.push(data.data.bib.data);
          data.data.mla &&
            data.data.mla.status &&
            bibtexData.push('MLA:') &&
            bibtexData.push(data.data.mla.data);
          data.data.apa &&
            data.data.apa.status &&
            bibtexData.push('APA:') &&
            bibtexData.push(data.data.apa.data);
          data.data.chicago &&
            data.data.chicago.status &&
            bibtexData.push('Chicago:') &&
            bibtexData.push(data.data.chicago.data);
          bibtexData.push('\n');
        }
      } catch (error) {
        message.error(
          formatMessage({
            id: 'aminer.header.collector.downloadError',
            defaultMessage: '下载失败，请重试',
          }),
        );
      }
    }

    downloadFiles('bibtex.txt', bibtexData.join('\n'));
  };

  const downloadRelateWork = () => {
    const autoHeight =
      document && document.body && document.body.clientHeight
        ? document.body.clientHeight * 0.9
        : 'auto';
    if (selected && selected.length) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({
            id: 'aminer.header.collector.relatedWork',
            defaultMessage: '一键综述',
          }),
          height: autoHeight,
          width: 'auto',
          top: 40,
          content: (
            <RelatedWork selected={selected} downloadFiles={downloadFiles} dispatch={dispatch} />
          ),
        },
      });
    } else {
      message.info(
        formatMessage({ id: 'aminer.header.collector.pleaseSelect', defaultMessage: '请选择论文' }),
      );
      return;
    }
  };

  const deletePubsMarks = id => {
    dispatch({
      type: 'searchpaper/paperUnMark',
      payload: {
        id,
      },
    });
    // .then(({ data, success }) => {
    //   if (success) {
    //     dispatch({
    //       type: 'searchpaper/paperUnMarkSuccess',
    //       payload: {
    //         id,
    //       }
    //     })
    //   }
    // })
  };

  const deleteManyConfirm = e => {
    // const links = findDownLoadPdfLinks();
    const links = selected;
    // if (!links || links.length === 0) {
    //   message.error(
    //     formatMessage({
    //       id: 'aminer.header.collector.pleaseSelect',
    //       defaultMessage: '请选择需要的论文',
    //     }),
    //   );
    //   return;
    // }
    setIsDownload(true);
    // for (const item of links) {
    //   deletePubsMarks(item.id);
    // }

    links.forEach(like => {
      deletePubsMarks(like);
    });

    message.success(
      formatMessage({ id: 'aminer.header.collector.deleteSuccess', defaultMessage: '删除成功' }),
    );
    setIsDownload(false);
    if (selected.length >= pageSize.length) {
      setSelected([]);
    }
  };

  const deleteOneConfirm = id => {
    deletePubsMarks(id);
    message.success(
      formatMessage({ id: 'aminer.header.collector.deleteSuccess', defaultMessage: '删除成功' }),
    );
    // deletePubs()
  };

  const showNumFun = num => {
    if (!num || num < 0) {
      return 0;
    }
    if (num > 99) {
      return `99+`;
    }
    return num;
  };

  const cancel = e => { };

  return useSSRTwoPassRender(
    {
      render: ({ hasTest, testPassed: isLoggedin }) => (
        <li className={styles.paperCollector}>
          <span
            id="collectorIconAnimation"
            className={classnames(
              'collectorIcon',
              { collectorIconOpen: open },
              { homeIcon: className === 'home' },
              className,
            )}
            onClick={onOpenChange}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-trolley" />
            </svg>
            <>
              {!!showNumFun(paperAllLiked && paperAllLiked.length) && <span className="numBadge"></span>}
            </>
            {/* <span className='collectorText'><FM id='aminer.header.collector' defaultMessage="My Favorites" /></span> */}
          </span>
          <div
            className={classnames(
              'collectorNormal',
              { collectorMobileNormal: isMobile },
              { collector: !isMobile && open },
              { hided: !isMobile && !open },
              { mobileSlideIn: isMobile && open },
              { mobileSlideOut: isMobile && !open },
            )}
            onClick={onWrapClick}
          >
            <div className="collectorWrap">
              <div className="wrapHeader">
                <FM id="aminer.header.collector" defaultMessage="My Favorites" />
                {/* {paperLikedPagination && paperLikedPagination.total && `( ${paperLikedPagination.total || 0} )`} */}
              </div>
              <div className="content">
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={loadMorePaperLiked}
                  hasMore={!isEnd}
                  useWindow={false}
                >
                  <Checkbox.Group
                    value={selected}
                    onChange={onCheckChange}
                    style={{ width: '100%' }}
                  >
                    {paperLiked &&
                      paperLiked.map((paper, index) => {
                        let { id, title, title_zh, authors, num_citation } = paper;
                        const locale = sysconfig.Locale;
                        const isDefaultLocale = locale === enUS;
                        if (!isDefaultLocale) {
                          [title, title_zh] = [title_zh, title];
                        }
                        return (
                          <div key={`${id}${index}`} className="paperItem">
                            {/* <span><Checkbox value={id} /></span> */}
                            <Checkbox value={id} />
                            <div className="paperContent">
                              <a href={pubHelper.genPubTitle(paper)} target="_blank">
                                <div className="paperTitle">{title || title_zh}</div>
                              </a>
                              {renderAuthor(authors)}
                              <div className="paperInfo">
                                <span className="conf">{setPubStyle(paper) || ''}</span>
                                <span className={classnames('cited')}>
                                  <FM id="aminer.paper.cited1" defaultMessage="Cited by" />
                                  <FM id="aminer.common.colon" defaultMessage=": " />
                                  <em>{num_citation || 0}</em>
                                </span>
                              </div>
                            </div>
                            <div className="delBtn">
                              <Popconfirm
                                title={formatMessage({
                                  id: 'aminer.header.collector.deleteCheck',
                                  defaultMessage: '确认删除这篇论文吗？',
                                })}
                                onConfirm={deleteOneConfirm.bind(this, id)}
                                onCancel={cancel}
                                okText={formatMessage({
                                  id: 'aminer.search.filter.confirm',
                                  defaultMessage: '确认',
                                })}
                                cancelText={formatMessage({
                                  id: 'aminer.search.filter.cancel',
                                  defaultMessage: '取消',
                                })}
                              >
                                <svg className="icon" aria-hidden="true">
                                  <use xlinkHref="#icon-delete-" />
                                </svg>
                              </Popconfirm>
                            </div>
                          </div>
                        );
                      })}
                  </Checkbox.Group>
                </InfiniteScroll>
                {loading === true && <Loading fatherStyle="loading" />}
                {isEnd && !loading && (
                  <div className="noMoreTip">
                    <FM id="aminer.header.collector.noMore" defaultMessage="No more." />
                  </div>
                )}
              </div>
              <div className="wrapFooter">
                <span style={{ lineHeight: '22px' }}>
                  <Checkbox
                    onChange={onSelectAllChange}
                    checked={
                      paperLiked && selected.length >= paperLiked.length && selected.length > 0
                    }
                  >
                    <FM id="aminer.header.collector.selectAll" defaultMessage="Select all" />
                  </Checkbox>
                </span>
                <div className="oprBtns">
                  {isDownload && <Loading fatherStyle="loading" />}
                  {!isMobile && !isDownload && (
                    <div className="oprBtn" onClick={downloadRelateWork}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-text" />
                      </svg>
                      <FM id="aminer.paper.topic.paper.summarize" defaultMessage="一键综述" />
                    </div>
                  )}
                  {!isDownload && (
                    <div className="oprBtn">
                      {selected.length > 0 ? (
                        <Popconfirm
                          title={formatMessage({
                            id: 'aminer.header.collector.downloadCheck',
                            defaultMessage: '确认删除这些论文吗？',
                          })}
                          onConfirm={deleteManyConfirm}
                          onCancel={cancel}
                          okText={formatMessage({
                            id: 'aminer.search.filter.confirm',
                            defaultMessage: '确认',
                          })}
                          cancelText={formatMessage({
                            id: 'aminer.search.filter.cancel',
                            defaultMessage: '取消',
                          })}
                        >
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-delete-" />
                          </svg>
                          <FM id="aminer.paper.comment.delete" defaultMessage="Delete" />
                        </Popconfirm>
                      ) : (
                          <span
                            onClick={() => {
                              message.info(
                                formatMessage({
                                  id: 'aminer.header.collector.pleaseSelect',
                                  defaultMessage: '请选择论文',
                                }),
                              );
                            }}
                          >
                            <svg className="icon" aria-hidden="true">
                              <use xlinkHref="#icon-delete-" />
                            </svg>
                            <FM id="aminer.paper.comment.delete" defaultMessage="Delete" />
                          </span>
                        )}
                    </div>
                  )}
                  {/* {!isMobile && !isDownload && (
                  <div className="oprBtn" onClick={downloadBibtex}>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-last" />
                    </svg>
                    <FM id="aminer.paper.bibtex" defaultMessage="Bibtex" />
                  </div>
                )} */}
                  {!isMobile && !isDownload && (
                    <Tooltip
                      placement="bottomLeft"
                      title={formatMessage({
                        id: 'aminer.search.download.tips',
                      })}
                    >
                      <div className="oprBtn" onClick={downloadPdf}>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-xiazai" />
                        </svg>
                        <FM id="aminer.paper.download" defaultMessage="Download" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={open ? 'collectorMask' : 'hided'} onClick={onOpenChange} />
        </li>
      ),
      // failedRender: () => (
      //   <li>   </li>
      // ),
      // defaultRender: () => (<div>empty</div>), // SSR渲染，客户端第一次渲染，或者condition为false时走这个。
      // test: montor => montor[1] && montor[2],
    },
    [open, paperLiked, paperAllLiked, selected, loading, isEnd, isDownload, user, paperLikedPagination],
  );
};
// PaperCollector.getInitialProps = async ({ store, route, isServer }) => {
//   if (!isServer) {
//     return;
//   }

//   if (!paperLiked) {
//     await store.dispatch({
//       type: 'searchpaper/getPaperCollected',
//       payload: { offset: 0, size: 50 },
//     });
//   }
//   const { searchpaper } = store.getState();
//   const {
//     paperLiked,
//     paperLikedPagination,
//   } = searchpaper || {};
//   return { searchpaper: { paperLiked, paperLikedPagination } }
// };
export default component(
  connect(({ auth, searchpaper, loading }) => ({
    user: auth.user,
    paperLiked: searchpaper.paperLiked,
    paperAllLiked: searchpaper.paperAllLiked,
    paperLikedPagination: searchpaper.paperLikedPagination,
    loading: loading.effects['searchpaper/getPaperCollected'],
  })),
)(PaperCollector);
