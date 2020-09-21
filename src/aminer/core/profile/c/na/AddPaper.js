import React, { useState, useRef, useEffect, useMemo, useImperativeHandle, forwardRef, Fragment } from 'react';
import { connect, component, Link } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage, enUS, FM } from 'locales'
import classnames from 'classnames';
import { AnnotationZone } from 'amg/zones';
import { Spin } from 'aminer/components/ui';
import { Input, Switch, Button, Checkbox, message, Tooltip } from 'antd';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import { authorInitialCap, getPubLabels } from 'aminer/core/pub/utils'
import { AffirmPaper } from '../annotation';
import SelectPaperVersion from './SelectPaperVersion';
import styles from './AddPaper.less';


const initVerifyDA = (aid, data) => {
  let isFlag = false;
  if (data && data.length > 0) {
    data.forEach(flag => {
      if (flag.person_id === aid && flag.flag === 'affirm_author') {
        isFlag = true
      }
    })
  }
  return isFlag;
}

const AddPaper = props => {
  const { pid, loading, dispatch, resetList, profilePubsTotal } = props;
  const [isRecheck, setIsRecheck] = useState(true);
  const [commitList, setCommitList] = useState(null);
  const searchRef = useRef();
  const serchcomRef = useRef();
  const paperPos = useRef();
  // useEffect(() => {
  //   return () => {
  //     dispatch({ type: 'modal/close' })
  //   }
  // }, [])

  const reCheckPaper = (data, poses) => {

    // console.log('poses', poses)
    paperPos.current = poses;
    searchRef.current.style.display = 'none';
    setIsRecheck(false);
    setCommitList(data)
  };

  const showRecheckComponent = () => {
    serchcomRef.current.init();
    searchRef.current.style.display = 'block';
    setIsRecheck(true);
  }

  const resetStatus = () => {
    resetList && resetList();
    showRecheckComponent();
  }

  // TODO 中英文切换
  return (
    <div className={styles.addPaperComponent}>
      <div className="tab_content">
        <div className="tab_line">
          <span className="tab">
            <FM id="aminer.common.search" dafaultMessage="Search" />
          </span>
        </div>
        <div className="main-content">
          {/* {isRecheck && ( */}
          <div className="wrapper" ref={searchRef}>
            <SearchComponent ref={serchcomRef} dispatch={dispatch} pid={pid} reCheckPaper={reCheckPaper} loading={loading} />
          </div>
          {/* )} */}
          {!isRecheck && (
            <CommitComponent profilePubsTotal={profilePubsTotal} resetList={resetStatus} dispatch={dispatch} poses={paperPos.current} pid={pid} paperList={commitList} goback={showRecheckComponent} />
          )}
        </div>
      </div>
    </div>
  )
}

export default component(connect(({ loading }) => ({
  loading: loading.effects['aminerSearch/addSearchPaper']
})))(AddPaper)


const CommitComponent = props => {
  const { paperList: propsList, goback, poses, pid, dispatch, resetList, profilePubsTotal } = props
  const [paperList, setPaperList] = useState(propsList);
  const [pos, setPos] = useState(poses);
  const [aIdToPubs, setAIdToPubs] = useState();
  const [conCommit, setConCommit] = useState(profilePubsTotal < 5);
  useState(() => {
    setPaperList(propsList);
    setPos(poses);
  }, [propsList, poses]);

  useEffect(() => {
    const apaper = paperList && paperList[0] || {};
    const { authors = [] } = apaper;
    const highA = authors.find((n, m) => m === pos[apaper.id]) || {};
    setConCommit(!highA.id || highA.name);
    let ids = [];
    authors.map(({ id }) => {
      if (id) { ids.push(id) }
    });
    dispatch({
      type: 'pub/getPersonPubNum',
      payload: {
        "offset": 0, "size": 0,
        "aggregation_all": ["author"],
        "authors_id": ids,
        "es_search_condition": {
          "include_and": {
            "conditions": [{
              "search_type": "terms",
              "field": "authors.id",
              "origin": ids,
            }]
          }
        },
        "schema": {}
      },
    }).then((authorsItem) => {
      const map = {};
      authorsItem && authorsItem.length && authorsItem.map(({ term, count }) => {
        map[term] = count;
      });
      let posID = authors[pos[apaper.id]] && authors[pos[apaper.id]]['id'];
      setConCommit((map[posID] || 0) < 5);
      setAIdToPubs(map);
    })
  }, [paperList]);

  const handleRemovePaper = index => {
    // console.log('index', index);
    const newList = [...paperList];
    newList.splice(index, 1)
    setPaperList(newList);
  }

  const handleSubmit = () => {
    const pubs = paperList.map(item => ({
      i: item.id,
      r: pos[item.id]
    }))

    dispatch({
      type: 'profile/AddPubsToPerson',
      payload: { id: pid, pubs }
    }).then(res => {
      message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }))
      resetList()
    })
  }

  const goBack = () => {
    if (goback) {
      goback()
    }
  }

  const handleAuthor = (pid, i, pubNum) => {
    const newPos = { ...pos };
    newPos[pid] = i;
    setPos(newPos);
    setConCommit((pubNum || 0) < 5);
  }

  const checkPersonPubs = () => {
    setConCommit(true);
  }

  return (
    <div className="commit_content">
      {paperList && (
        <>
          <div className="paperlist_wrapper">
            <PublicationList className="addPaperList_commit" id="addPaperList"
              showAuthorCard={false}
              papers={paperList}
              abstractLen={80}
              showInfoContent={[]}
              titleLinkDomain
              authorsZone={[({ paper, index }) => {
                const { authors } = paper;
                return (
                  <div className="authors">
                    {authors && authors.length > 0 && authors.slice(0, 20).map((author, i) => {
                      let { name, name_zh } = author;
                      const locale = sysconfig.Locale;
                      const isDefaultLocale = locale === enUS;

                      if (!isDefaultLocale) {
                        [name, name_zh] = [name_zh, name]
                      }

                      name = authorInitialCap(name || name_zh)


                      return (
                        <span key={i}>
                          <span
                            className={classnames('author link', { active: i === pos[paper.id], warn: author.id })}
                            onClick={() => { handleAuthor(paper.id, i, aIdToPubs && aIdToPubs[author.id]) }}
                          >
                            <Tooltip placement='top' title={`论文数: ${aIdToPubs && aIdToPubs[author.id] || '#'}`}>
                              {name || name_zh || ''}
                            </Tooltip>
                          </span>
                          {author.id && (
                            <span onClick={checkPersonPubs}>
                              <Link to={`/profile/${author.id}`} className="to_profile" target="_blank">
                                <svg className="icon" aria-hidden="true">
                                  <use xlinkHref="#icon-lianjie" />
                                </svg>
                              </Link>
                            </span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                )
              }]}
              contentRightZone={[({ paper, index }) => {
                return (
                  <svg key="24" style={{ cursor: 'pointer' }} className="icon" aria-hidden="true" onClick={() => {
                    handleRemovePaper(index)
                  }}>
                    <use xlinkHref="#icon-modal_close" />
                  </svg>
                )
              }]}
            />
            <div className="submit_line">
              <Button type="primary" onClick={goBack}>
                {formatMessage({ id: 'aminer.paper.submit.back', defaultMessage: 'Back' })}
              </Button>
              <Tooltip title={conCommit ? "" : "请点击高亮作者查看"}>
                <Button type="primary" onClick={handleSubmit} disabled={!conCommit}>
                  {formatMessage({ id: 'aminer.paper.submit', defaultMessage: 'Submit' })}
                </Button>
              </Tooltip>
            </div>
          </div>
        </>
      )}
    </div >
  )
}

const SearchComponent = forwardRef((props, ref) => {
  const { pid, dispatch, reCheckPaper, loading, lock } = props;
  const [filter, setFilter] = useState(false);
  const [paperList, setPaperList] = useState(null);
  const [selectList, setSelectList] = useState([]);
  const term = useRef('');
  // const name = useRef('');
  // const org = useRef('');
  const ID = useRef('');
  const page = useRef(0);
  const total = useRef();
  const poses = useRef({});
  const end = useRef();

  useImperativeHandle(ref, () => ({
    init: () => {
      setSelectList([]);
    }
  }));

  // const handleChangeName = e => {
  //   name.current = e.currentTarget.value;
  // }

  // const handleChangeOrg = e => {
  //   org.current = e.currentTarget.value;
  // }

  const checkPaperVersion = (i, item) => {
    paperList[i] = item;
    setPaperList([...paperList]);
  }

  const handleChangeTerm = e => {
    term.current = e.currentTarget.value;
  }

  const handleChangeID = e => {
    ID.current = e.currentTarget.value;
  }

  const toggleFilter = () => {
    setFilter(!filter)
  }

  const onSearchPaper = e => {
    setPaperList(null);
    page.current = 1;
    advPaperSearch(true)
  }

  const loadMore = () => {
    advPaperSearch()
  }

  const selectPaper = (i, id) => {
    const index = selectList.indexOf(i)
    const newList = [...selectList];
    if (index === -1) {
      dispatch({ type: 'profile/profilePapersNa', payload: { aid: pid, pid: id } })
        .then(pos => {
          poses.current[id] = pos || 0;
        })
      newList.push(i)
    } else {
      newList.splice(index, 1)
    }
    setSelectList(newList);
  }

  // const end = paperList && paperList.length === total.current;


  const advPaperSearch = (reset = false) => {
    if (term.current || ID.current) {
      const conditions = [];
      if (ID.current) {
        conditions.push({
          search_type: "term", field: "_id",
          "need_process": "sync_pub",
          origin: ID.current,
        })
      }
      if (term.current) {
        conditions.push({
          search_type: "multi_match",
          fields_raw: ["title", "title_zh"],
          to_score: true,
          query: term.current,
          minimum_should_match: "80%"
        })
      }
      const esSearchCondition = {
        include_or: { conditions }
      }
      if (filter) {
        esSearchCondition.exclude_and = {
          conditions: [{
            search_type: "term",
            field: "authors.id", "origin": pid
          }]
        }
      }
      dispatch({
        type: 'aminerSearch/addSearchPaper',
        payload: {
          searchType: "advance", esSearchCondition,
          pagination: { current: page.current, pageSize: 20 },
          query: { advanced: true },
          aggregation: [],
        }
      }).then(data => {
        if (!data.items) {
          return
        }
        if (!paperList || reset) {
          end.current = data.items.length >= data.total;
          setPaperList(data.items)
        } else {
          const newList = paperList.concat(data.items)
          end.current = newList.length >= data.total;
          setPaperList(newList)
        }
        total.current = data.total;
        page.current += 1;
      })
    }
  }

  const handleReCheckPaper = () => {
    const naList = paperList.filter((item, index) => selectList.includes(index))
    if (reCheckPaper) {
      reCheckPaper(naList, poses.current)
    }
  }

  return (
    <div className="search_content">
      <div className="search_wrapper">
        <div className="search_part">
          <div className="search_line">
            {/* <Input className="name" placeholder={formatMessage({ id: 'aminer.search.placeholder.name', defaultMessage: 'Name' })}
              onChange={handleChangeName}
              onPressEnter={onSearchPaper}
            />
            <Input className="aff" placeholder={formatMessage({ id: 'aminer.search.placeholder.organization', defaultMessage: 'Organization' })}
              onChange={handleChangeOrg}
              onPressEnter={onSearchPaper}
            /> */}
            <Input className="aff" placeholder="ID"
              onChange={handleChangeID}
              onPressEnter={onSearchPaper}
            />
          </div>
          <div className="search_line">
            <Input className="keyword" placeholder={formatMessage({ id: 'aminer.search.placeholder.keywords', defaultMessage: 'KeyWords' })}
              onChange={handleChangeTerm}
              onPressEnter={onSearchPaper}
            />
            <Button type="primary" className="search_btn"
              icon="search" onClick={onSearchPaper}
            />
          </div>
        </div>
        <div className="right_part">
          <div className="filter_part">
            <span><FM id="aminer.person.paperna.filter" defaultMessage="Filter out existing papers"></FM>&nbsp;&nbsp;</span>
            <Switch onClick={toggleFilter} checked={filter}
              checkedChildren="Yes" unCheckedChildren="No"
            />
          </div>
          {selectList && selectList.length > 0 && (
            <Button className='recheck' type="primary" onClick={handleReCheckPaper}>
              {formatMessage({ id: 'aminer.paper.recheck', defaultMessage: 'Recheck' })}
            </Button>
          )}
        </div>
      </div>
      <div className="paperlist_wrapper">
        <Spin loading={loading} />
        {paperList && paperList.length > 0 ? (
          <>
            <PublicationList className="addPaperList_search" id="addPaperList"
              showAuthorCard={false}
              papers={paperList}
              abstractLen={80}
              showInfoContent={[]}
              titleLinkDomain
              isAuthorsClick={false}
              titleRightZone={[({ paper, index }) => <SelectPaperVersion checkPaperVersion={checkPaperVersion} index={index} pid={pid} key="selectpaper" id={paper.id} />]}
              contentRightZone={[({ paper, index }) => {
                // const flag = initVerifyDA(pid, paper.flags)
                const { authors } = paper
                const authorsID = (authors && authors.map(author => author.id)) || [];
                // console.log('authorsID', authorsID, pid, authorsID.includes(pid), paper.id);
                return (
                  <Fragment key={paper.id}>
                    {authorsID.includes(pid) && (
                      // <span>已确认</span>'
                      <div className="cont">
                        <Checkbox checked disabled />
                        <AnnotationZone>
                          <AffirmPaper aid={pid} pid={paper.id} flags={paper.flags} lock={lock}
                          />
                        </AnnotationZone>
                      </div>
                    )}
                    {!authorsID.includes(pid) && (
                      <Checkbox checked={selectList.includes(index)} onClick={() => { selectPaper(index, paper.id) }} />
                    )}

                  </Fragment>
                )
              }]}
            />
            {!end.current && (
              <div className="load_more" onClick={loadMore}>
                <FM id="aminer.common.loadmore" formatMessage="Load more" />
              </div>
            )}

          </>

        ) : !loading && <div className="emptyText">No Data</div>}
      </div>

    </div>
  )
})
