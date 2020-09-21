import React, { useEffect, useState, useRef, useMemo, Fragment } from 'react';
import { component, connect, withRouter, } from 'acore';
import { FM, formatMessage } from 'locales';
// import * as H from 'history';
import { getLangLabel } from 'helper';
import { isLogin, isRoster } from 'utils/auth';
import { classnames } from 'utils';
import dayjs from 'dayjs';
import { getCategoryAndUnclassified, filterUnclassified } from 'helper/data';
import { Pagination, Popconfirm, Tabs, Tooltip, Checkbox } from 'antd';
import { IUser, IUserInfo, IFollowCategory } from 'aminer/components/common_types';
import { MarkPubInfo } from 'aminer/components/pub/pub_type';
import { IFollow } from 'aminer/p/user/notification_types';
import { Spin } from 'aminer/components/ui';
import { MarkPub } from 'aminer/components/widgets';
import { PublicationItem } from 'aminer/components/pub/c';
import { RelatedWork } from 'aminer/components/pub';
import { UnFollow, CatNames, NotePart } from './collection';
import styles from './CollectionsComponent.less';

const OVERVIEW_COUNT = 200;
interface IPropTypes {
  // user: IUser;
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  routePath: string;
  userinfo: IUserInfo;
  // location: H.Location;
  pageSize: number;
  reviewPubs: string[];
  pubCollection: IFollowCategory[];
  pubCategoryMap: {
    [key: string]: IFollowCategory[];
  };
}

const CollectionsComponent: React.FC<IPropTypes> = props => {
  const {
    location,
    dispatch,
    userinfo,
    pageSize = 20,
    loading,
    pubCategoryMap,
    pubCollection,
    reviewPubs,
    collectionMap,
  } = props;
  const { query } = location || {};
  const { list = '' } = query || {};

  const [pubs, setPubs] = useState<MarkPubInfo[]>();
  const [total, setTotal] = useState<number>(0);
  const [review, setReview] = useState<boolean>(false);
  const [review_temp_ids, setTempReview] = useState<string[]>([]);
  // const [isDownload, setIsDownload] = useState(false);
  // const page = useRef<number>(1);
  const pubs_count = useRef<number>(0);

  const getTotal = () => {
    dispatch({
      type: 'collection/GetFollows',
      payload: {
        includes: ['p'],
        offset: 0,
        size: 0,
      },
    }).then(res => {
      const { pub_count } = res || {};
      setTotal(pub_count);
    });
  };

  const getFollows = (page: number) => {
    dispatch({
      type: 'collection/GetFollows',
      payload: {
        includes: ['p'],
        offset: (page - 1) * pageSize,
        size: pageSize,
      },
    }).then((result: IFollow) => {
      const { pubs: papers, pub_count } = result || {};
      pubs_count.current = pub_count;
      setTotal(pub_count);
      setPubs(papers || []);
    });
  };
  const GetFollowsByCategory = (page: number) => {
    dispatch({
      type: 'collection/GetFollowsByCategory',
      payload: {
        ids: [list],
        f_type: 'p',
        offset: (page - 1) * pageSize,
        size: pageSize,
      },
    }).then((result: IFollow) => {
      const { pubs: papers, pubs_count: pub_count } = result || {};
      pubs_count.current = pub_count;
      setPubs(papers || []);
    });
  };
  const getCategoryByFollowIDs = (ids: string[]) => {
    dispatch({
      type: 'collection/GetCategoryByFollowIDs',
      payload: {
        ids,
      },
    });
  };
  const setCollectionMap = (ids: string[]) => {
    const map = ids.reduce((res, cur) => {
      res[cur] = { is_follow: true };
      return res;
    }, {});
    dispatch({
      type: 'collection/setCollectionMap',
      payload: {
        data: map,
      },
    });
  };

  useEffect(() => {
    // const exist_ids = Object.keys(pubCategoryMap);
    const ids = pubs?.map(item => item.id);
    if (ids?.length) {
      getCategoryByFollowIDs(ids);
      setCollectionMap(ids);
    }
  }, [pubs]);

  useEffect(() => {
    resetReviewPubs();
    closeRelateWork();
    setTempReview([]);
    if (list) {
      GetFollowsByCategory(1);
      if (!total) {
        getTotal();
      }
    } else {
      getFollows(1);
    }
  }, [list]);

  const onPageChange = (current: number) => {
    if (!list) {
      getFollows(current);
    } else {
      GetFollowsByCategory(current);
    }
  };

  // const unFollow = (pid: string) => {
  //   const collections = pubCategoryMap && pubCategoryMap[pid];
  //   const params = {
  //     ids: [pid],
  //     f_type: 'p',
  //     op: 'cancel',
  //     cat_id: collections && collections[0]?.id, // FIXME: xenaluo -- fix 取消收藏必须传 cat_id
  //     remove_completely: true,
  //   };
  //   dispatch({
  //     type: 'collection/Follow',
  //     payload: params,
  //   }).then(res => {
  //     dispatch({
  //       type: 'collection/removePubsCategory',
  //       payload: {
  //         pid,
  //       },
  //     });
  //   });
  // };

  const openRelateWork = () => {
    if (pubs_count.current) {
      setReview(true);

      // 开启一键综述，先获取"全部" id, 以防点击「全选」是速度过慢
      if (!review_temp_ids.length) {
        getAllPubIDs();
      }
    }
  };
  const closeRelateWork = () => {
    setReview(false);
    resetReviewPubs();
  };

  const updatePubComment = (pid: string, comment: string) => {
    const pub_ids = pubs?.map(item => item.id);
    const index = pub_ids?.indexOf(pid);
    if ((index || index === 0) && index !== -1 && pubs) {
      const time = new Date();
      const temp_pubs = [...pubs];
      temp_pubs[index].comments = comment;
      temp_pubs[index].nt = `${dayjs(time).format('YYYY/MM/DD')}`;
      setPubs(temp_pubs);
    }
  };

  const onChangeReviewPubs = (pid: string) => {
    dispatch({
      type: 'collection/updateReviewPubs',
      payload: {
        pid,
      },
    });
  };

  const getAllPubIDs = () => {
    const payload = {
      offset: 0,
      size: OVERVIEW_COUNT,
      schema: { publication: ['id'] },
    };
    if (list) {
      payload.ids = [list];
      payload.f_type = 'p';
    } else {
      payload.includes = ['p'];
    }
    const dispatch_params = {
      type: `collection/${list ? 'GetFollowsByCategory' : 'GetFollows'}`,
      payload,
    };

    dispatch(dispatch_params).then((result: IFollow) => {
      const { pubs: papers } = result || {};
      const ids = papers.map(paper => paper.id);
      setTempReview(ids);
    });
  };

  const onSelectAll = () => {
    if (
      reviewPubs.length === pubs_count.current ||
      (pubs_count.current > OVERVIEW_COUNT && reviewPubs.length === OVERVIEW_COUNT)
    ) {
      resetReviewPubs();
    } else {
      dispatch({
        type: 'collection/setReviewPubs',
        payload: { ids: review_temp_ids },
      });
    }
  };

  const resetReviewPubs = () => {
    dispatch({
      type: 'collection/setReviewPubs',
      payload: { ids: [] },
    });
  };

  const confirmeview = () => {
    if (reviewPubs.length !== 0) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({
            id: 'aminer.pub.overview',
            defaultMessage: 'One-click Review',
          }),
          height: '70vh',
          width: 'auto',
          // top: 40,
          content: <RelatedWork selected={reviewPubs} downloadFiles={downloadFiles} />,
        },
      });
    }
  };

  // const no_cat_id = useMemo(() => pubCollection && pubCollection[pubCollection.length - 1]?.id, [
  //   pubCollection,
  // ]);
  const [c, not_cat] = useMemo(() => {
    return getCategoryAndUnclassified(pubCollection);
  }, [pubCollection]);

  return (
    <div className={classnames(styles.collectionsComponent, 'collections-component')}>
      <div className="title_part">
        <h3 className="title_name">
          <FM id="aminer.user.collection.title" />
        </h3>
        <div className="cat_desc">
          <FM
            id="aminer.user.collection.desc"
            values={{
              total: total || 0,
              classify: <FM id="aminer.user.collection.classify" />,
              sum: <FM id="aminer.user.collection.sum" />,
            }}
          />
        </div>
      </div>
      <div className="function_part">
        <div
          className={classnames('func_btn sum', { open: review || !pubs_count.current })}
          onClick={openRelateWork}
        >
          <div className="func_title">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-trolley"></use>
            </svg>
            <FM id="aminer.pub.overview" />
          </div>
          <div className="func_desc">
            <FM id="aminer.user.collector.relatedWork.desc" />
          </div>
        </div>

        <Tooltip
          overlayClassName="userpage-tooltip"
          placement="topLeft"
          title={formatMessage({
            id: 'aminer.follows.wait',
            defaultMessage: 'Coming soon',
          })}
        >
          <div className="func_btn disable">
            <div className="func_title">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-suyuan"></use>
              </svg>
              <FM id="aminer.user.collector.source" />
            </div>
            <div className="func_desc">
              <FM id="aminer.user.collector.source.desc" />
            </div>
          </div>
        </Tooltip>

        <Tooltip
          overlayClassName="userpage-tooltip"
          placement="topLeft"
          title={formatMessage({
            id: 'aminer.follows.wait',
            defaultMessage: 'Coming soon',
          })}
        >
          <div className="func_btn disable">
            <div className="func_title">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-ziyuan"></use>
              </svg>
              <FM id="aminer.user.collector.intensive" />
            </div>
            <div className="func_desc">
              <FM id="aminer.user.collector.intensive.desc" />
            </div>
          </div>
        </Tooltip>
      </div>
      <p className="list_total">
        <FM
          id={`aminer.user.list.${!list ? 'all' : list === not_cat?.id ? 'unclassified' : 'total'}`}
          values={{ total: pubs_count.current || 0 }}
        />
      </p>
      {!!pubs?.length && (
        <div className="publist_content">
          <div className={classnames('review_control', { show: review })}>
            <div className="review_content">
              <div className="check_all">
                <Checkbox
                  checked={
                    reviewPubs.length === pubs_count.current ||
                    (pubs_count.current > OVERVIEW_COUNT && reviewPubs.length === OVERVIEW_COUNT)
                  }
                  onChange={onSelectAll}
                />
                <span className="text">
                  <FM id="aminer.pub.overview.all" defaultMessage="All" />
                </span>
              </div>
              <div
                className={classnames('confirm_review', { disable: reviewPubs.length === 0 })}
                onClick={confirmeview}
              >
                {!!reviewPubs?.length && <i className="count">{reviewPubs.length}</i>}
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-trolley"></use>
                </svg>
                <FM id="aminer.pub.overview.confirm" defaultMessage="Start Overview" />
              </div>
              <div className="close" onClick={closeRelateWork}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-modal_close"></use>
                </svg>
                <span className="text">
                  <FM id="aminer.common.cancel" defaultMessage="Cancel" />
                </span>
              </div>
            </div>
          </div>
          <div className={classnames('pub_list', { open: review })}>
            <Spin loading={loading} />
            {pubs.map((pub, index) => {
              const { comments, nt, t, id: pid } = pub || {};

              const infoContent: any[] = [
                'cited_num',
                'bibtex',
                { name: 'url', props: { placement: 'left' } },
              ];
              // if (list && list !== no_cat_id) {
              //   infoContent.push(
              //     <NotePart
              //       pid={pub?.id}
              //       cid={list}
              //       comments={comments}
              //       updatePubComment={updatePubComment}
              //     />,
              //   );
              // }
              // if (collectionMap[pid]) {
              //   infoContent.push(
              //     <UnFollow pubCategoryMap={pubCategoryMap} paper={pub} unFollow={unFollow} />,
              //   );
              // }

              return (
                <div className="mark_pub_list_item" key={pid}>
                  <div className={classnames('checkbox', { open: review })}>
                    {review && (
                      <Checkbox
                        checked={reviewPubs.includes(pid)}
                        onChange={() => {
                          onChangeReviewPubs(pid);
                        }}
                      />
                    )}
                  </div>
                  <div className={classnames('pub_info', { open: review })}>
                    <PublicationItem
                      key={pid}
                      paper={pub}
                      paper_index={index}
                      showInfoContent={infoContent}
                      abstractZone={[]}
                      // contentRightZone={[]}
                      contentRightZone={[
                        ({ paper }: { paper: MarkPubInfo }) => {
                          return <MarkPub key={5} paper={paper} withNum={false} />;
                        },
                      ]}
                      infoRightZone={[
                        ({ paper }: { paper: MarkPubInfo }) => {
                          const pub_cats = filterUnclassified(
                            pubCollection,
                            pubCategoryMap[paper.id],
                          );
                          return <CatNames key={8} categories={pub_cats} />;
                        },
                      ]}
                    />
                    <div className="bottom_line">
                      <div className="reason">
                        {list && list !== not_cat?.id && (
                          <>
                            <div className="comment">
                              <NotePart
                                pid={pub?.id}
                                cid={list}
                                comments={comments}
                                updatePubComment={updatePubComment}
                              />
                            </div>
                            {/* <span className="note_time">
                            {nt && <span>@{dayjs(nt).format('YYYY/MM/DD')} </span>}
                            <FM id="aminer.pub.collection.note" />
                            <FM id="aminer.common.colon" />
                          </span> */}
                            {comments && (
                              <span
                                className="note"
                                dangerouslySetInnerHTML={{
                                  __html: comments.replace(/\n/g, '<br>'),
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="time">
                        {/* {!!(pubCategoryMap && pubCategoryMap[pub.id]) && ( */}
                        <div className="mark_time">
                          {t && dayjs(t).format('YYYY-MM-DD HH:mm')}{' '}
                          {t && formatMessage({ id: 'aminer.paper.collect' })}
                        </div>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!!pubs?.length && !!pubs_count.current && pubs_count.current > pageSize && (
        <div className="pagination">
          <Pagination
            defaultCurrent={1}
            total={pubs_count.current}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default component(
  withRouter,
  connect(({ auth, loading, collection }) => ({
    // user: auth.user,
    loading:
      loading.effects['collection/GetFollows'] ||
      loading.effects['collection/GetFollowsByCategory'],
    pubCategoryMap: collection.pubCategoryMap,
    pubCollection: collection.pubCollection,
    reviewPubs: collection.reviewPubs,
    collectionMap: collection.collectionMap,
  })),
)(CollectionsComponent);

const downloadFiles = (filename: string, data: string, type: string) => {
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
  // setIsDownload(false);
};
