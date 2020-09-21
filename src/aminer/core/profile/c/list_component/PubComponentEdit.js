import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { isLogin, isRoster, isLockAuth, isPeekannotationlog, isBianYiGeToken, isStarPaperRole } from 'utils/auth';
import { Tooltip, Modal, message } from 'antd';
import { Spin } from 'aminer/components/ui';
import { FM, formatMessage } from 'locales';
import pubHelper from 'helper/pub';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import styles from './PubComponentEdit.less';
import { AddPaperComponent } from '../na';
import { AffirmPaper, DelCheckbox, StarPaperToPerson } from '../annotation';
import DeletePubByIds from '../DeletePubByIds';
import ConfirmDel from './ConfirmDel';
import ComfirmStarPaper from './ComfirmStarPaper';

const pubsInfoContent = [
  {
    name: 'cited_num',
    props: {
      citedShowZero: false,
    },
  },
  'label',
  'bibtex',
  {
    name: 'url',
    props: { showLable: false, placement: 'rightTop', maxWidth: '250px' },
  },
];

const PubComponent = props => {
  const [years, setYears] = useState(null);
  const [citations, setCitations] = useState(null);
  const [sort, setSort] = useState('year');
  const [year, setYear] = useState('recent');
  const [citation, setCitation] = useState('top');
  const [sortFilter, setSortFilter] = useState([]);
  const [isShowDelPubCheckbox, setIsShowDelPubCheckbox] = useState(false);
  const [starMap, setStarMap] = useState({});
  const [isStarSort, setIsStarSort] = useState(false);
  // const [delPubList, setDelPubList] = useState([]);
  const destroy = useRef(false);
  const {
    profilePubs,
    profilePubsTotal,
    dispatch,
    pid: aid,
    size = 20,
    profileID,
    user,
    loading,
    lock,
    canAnnotate,
    peekannotationlog,
    ShowAnnotation,
    checkDelPubs,
  } = props;
  // console.log('profilePubs', profilePubs.length)
  const getProfilePapers = ({
    sorts = sort,
    syear = year,
    n_citation = '',
    filter = sortFilter,
  }) => {
    const params = {
      id: aid,
      size,
    };
    if (sorts === 'star') {
      params.sorts = ['!year'].concat(filter);
      params.affirm_author = 'star';
      params.year = syear;
    }
    else if (sorts === 'confirm' || sorts === 'unconfirm') {
      params.sorts = ['!year'].concat(filter);
      params.affirm_author = sorts === 'confirm';
    } else {
      params.sorts = [`!${sorts}`].concat(filter);
    }
    if (sorts === 'year') {
      params.year = syear;
    }
    if (sorts === 'n_citation') {
      params.n_citation = n_citation;
    }
    dispatch({
      type: `profile/${sorts === 'star' ? 'getPersonPapersStar' : 'getPersonPapers'}`,
      payload: params, // offset: (page.current) * size,
    });
  };

  const userIsRoster = isRoster(user) || isPeekannotationlog(user);

  const getPubStats = () => {
    dispatch({
      type: 'profile/GetPersonPubsStats',
      payload: { id: aid },
    }).then(stat => {
      const { year: pubYears, citation: pubCitations } = stat || {};
      if (!destroy.current) {
        setYears(pubYears);
        setCitations(pubCitations && pubCitations.reverse());
        onChangeSort('year');
      }
    });
  };

  useEffect(() => {
    if (aid) {
      getPubStats();
    }
    return () => {
      destroy.current = true;
    };
  }, [aid]);

  const isUserEdit = () => {
    if (lock) {
      if (isLockAuth(user)) {
        Modal.error({
          content: '请解锁后修改',
        });
      } else {
        Modal.error({
          content: '信息已被锁不能修改，请联系 feedback@aminer.cn',
        });
      }
      return false;
    }
    return true;
  };

  const loadMorePapers = () => {
    getProfilePapers({ sorts: sort });
  };

  const resetList = async () => {
    await dispatch({ type: 'profile/resetPubPage' });
    getProfilePapers({ sorts: sort });
  };

  const onChangeSort = async selectsort => {
    setIsStarSort(false); // todo 
    setCitation('top');
    setYear('recent');
    setSort(selectsort);
    // selectsort !== 'star' && onAddSortFilter([]);
    await dispatch({ type: 'profile/resetPubPage' });
    getProfilePapers({ sorts: selectsort });
  };

  const onChangeYear = async selectyear => {
    if (selectyear === 'all' && !isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    setYear(selectyear);
    await dispatch({ type: 'profile/resetPubPage' });
    getProfilePapers({ syear: selectyear });
  };

  const onChangeCitation = async item => {
    if (item === 'all' && !isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    setCitation(typeof item === 'string' ? item : item.nl);
    await dispatch({ type: 'profile/resetPubPage' })
    const params = typeof item === 'string' ? '' : item.nh !== 0 ? {
      gte: item.nl, lt: item.nh
    } : { gte: item.nl }
    getProfilePapers({ n_citation: params })
  }

  const onDeletePubByIds = () => {
    if (!isUserEdit()) {
      return;
    } // TODO ?
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'Remove pubs by ids',
        content: <DeletePubByIds id={aid} resetList={resetList} />,
      },
    });
  };

  const onAddSortFilter = async filter => {
    let newSortFilter = [...filter];
    if (typeof filter === 'string') {
      newSortFilter = [...sortFilter];
      const index = sortFilter.indexOf(filter);
      if (index !== -1) {
        newSortFilter.splice(index, 1);
      } else {
        newSortFilter.push(filter);
      }
    }
    setSortFilter(newSortFilter);
    await dispatch({ type: 'profile/resetPubPage' });
    getProfilePapers({ filter: newSortFilter });
  };

  const confirmPaper = async () => {
    if (sort === 'confirm' || sort === 'unconfirm') {
      // await dispatch({ type: 'profile/resetPubPage' })
      // getProfilePapers({ sort })
    }
  };

  const onChangeIsDelPubStatus = selectsort => {
    if (!isUserEdit()) {
      return;
    }
    // console.log({ isShowDelPubCheckbox });
    setIsShowDelPubCheckbox(!isShowDelPubCheckbox);
  };

  const updateDelPubs = payload => {
    dispatch({
      type: 'profile/updateDelPubs',
      payload,
    });
  };

  const onCheckedAllPubs = () => {
    // console.log("On checked all pubs");
    if (checkDelPubs && profilePubs && checkDelPubs.length === profilePubs.length) {
      updateDelPubs({ list: [] });
    } else {
      updateDelPubs({
        list: profilePubs.map(item => item.id),
      });
    }
  };

  const confirmDelPubs = () => {
    if (checkDelPubs.length === 0) {
      message.error(
        formatMessage({ id: 'aminer.paper.del.select', defaultMessage: 'Please select papers' }),
      );
      return;
    }
    const papers = profilePubs.filter((item, index) => {
      return checkDelPubs.includes(item.id);
    });
    // console.log({ papers })
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.delete', defaultMessage: 'Remove Paper' }),
        height: '80vh',
        className: 'delete',
        afterClose: () => {
          updateDelPubs({ list: [] });
        },
        content: (
          <ConfirmDel
            updateDelPubs={updateDelPubs}
            papers={papers}
            resetList={resetList}
            aid={aid}
          />
        ),
      },
    });
  };

  const handleViewAll = () => {
    if (sort === 'year') {
      onChangeYear('all');
    }
    if (sort === 'n_citation') {
      onChangeCitation('all');
    }
  };

  // useEffect(() => {
  //   addPapers();
  // }, [pid])

  const addPapers = () => {
    if (!isUserEdit()) {
      return;
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.add', defaultMessage: 'Add Paper' }),
        width: '900px',
        height: '80vh',
        content: (
          <AddPaperComponent
            profilePubsTotal={profilePubsTotal}
            pid={aid}
            resetList={resetList}
            lock={lock}
          />
        ),
      },
    });
  };

  // if (!profilePubsTotal || !profilePubs.length) {
  //   return false
  // }
  const maxPubSize = useMemo(() => {
    const max = years && Math.max(...years.map(item => item.size));
    return max && max > 10 ? max : 10;
  }, [years]);

  const setStarMapFun = (pub) => {
    if (starMap[pub.id]) {
      delete starMap[pub.id]
    } else {
      starMap[pub.id] = pub;
    }
    setStarMap({ ...starMap });
  }

  const starResetList = () => {
    resetList();
    setStarMap({});
    dispatch({ type: 'modal/close' })
  }

  const openStarPaperToPerson = () => {
    const items = Object.keys(starMap);
    if (items && items.length) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: `检查星标论文(${items.length})`,
          content: (
            <ComfirmStarPaper
              pid={aid} data={starMap}
              resetList={starResetList}
            />
          )
        }
      })
    } else {
      message.warning('请选择星标论文')
    }
  }

  const pubRightZone = () => {
    const zone = [];
    zone.push(({ paper }) => {
      return <StarPaperToPerson hasStarRole={isStarPaperRole(user)} aid={aid} starMap={starMap} setStarMapFun={setStarMapFun} paper={paper} />
    });
    if ((canAnnotate || peekannotationlog) && ShowAnnotation) {
      zone.push(({ paper }) => (
        <div className="affirmWrap">
          <AffirmPaper
            key={1}
            aid={aid}
            pid={paper.id}
            flags={paper.flags}
            lock={lock}
            isStar={pubHelper.PaperHasStar(paper.flags)}
            afterConfirmPaper={confirmPaper}
          />
        </div>
      ));
    }
    if (isShowDelPubCheckbox) {
      zone.push(({ paper }) => (
        <DelCheckbox isStar={pubHelper.PaperHasStar(paper.flags)} updateDelPubs={updateDelPubs} key={11} pid={paper.id} />
      ));
    }
    return zone;
  };

  return (
    <section className={styles.profilePapers}>
      <Spin loading={loading} />
      <div className="part_title">
        <span>
          <span className="title">
            <FM id="aminer.person.papers" defaultMessage="Papers" />
          </span>
        </span>
        <div className="opr_line">
          <div className="opr_pubs desktop_device">
            {userIsRoster && (
              <span
                className={classnames('btn')}
                onClick={onDeletePubByIds.bind()}
              >
                <span className='aicon'>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-modal_close" />
                  </svg>
                </span>
                按 ID 删除论文
              </span>
            )}
            {isLogin(user) && !isBianYiGeToken(user) && (
              <span className={classnames('btn')} onClick={addPapers}>
                <span className='aicon'>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-add" />
                  </svg>
                </span>
                {formatMessage({ id: 'aminer.paper.add', defaultMessage: 'Add Paper' })}
              </span>
            )}
            {isLogin(user) && !isBianYiGeToken(user) && (
              <>
                <span
                  className={classnames('btn', { active: isShowDelPubCheckbox })}
                  onClick={onChangeIsDelPubStatus.bind(null, 'delPub')}
                >
                  <span className='aicon'>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-modal_close" />
                    </svg>
                  </span>
                  {formatMessage({ id: 'aminer.paper.delete', defaultMessage: 'Remove Paper' })}
                </span>
              </>
            )}
          </div>
          <div className="pubs_sort">
            <span
              className={classnames('sort', { active: sort === 'year' })}
              onClick={onChangeSort.bind(null, 'year')}
            >
              {formatMessage({ id: 'aminer.paper.sort.year', defaultMessage: 'By Year' })}
            </span>
            <span
              className={classnames('sort', { active: sort === 'n_citation' })}
              onClick={onChangeSort.bind(null, 'n_citation')}
            >
              {formatMessage({
                id: 'aminer.paper.sort.citation',
                defaultMessage: 'By Citation',
              })}
            </span>
            {userIsRoster && (
              <span
                className={classnames('sort', {
                  active: sortFilter.includes('title'),
                })}
                onClick={onAddSortFilter.bind(null, 'title')}
              >
                {formatMessage({
                  id: 'aminer.paper.sort.title',
                  defaultMessage: 'By Title',
                })}
              </span>
            )}
            <span
              className={classnames('sort last_sort', { active: sort === 'star' })}
              onClick={onChangeSort.bind(null, 'star')}
            >
              按星标排序
            </span>
            {userIsRoster && (
              <>
                <span
                  className={classnames('sort specialspan_annotate', {
                    active: sort === 'confirm',
                  })}
                  onClick={onChangeSort.bind(null, 'confirm')}
                >
                  已确认
                </span>
                <span
                  className={classnames('sort specialspan_annotate', {
                    active: sort === 'unconfirm',
                  })}
                  onClick={onChangeSort.bind(null, 'unconfirm')}
                >
                  未确认
                </span>
              </>
            )}
          </div>
        </div>

      </div>
      <div className="part_content">

        <div className="select_btn">
          {isShowDelPubCheckbox && (
            <>
              <span
                className={classnames('btn', {
                  active:
                    checkDelPubs &&
                    profilePubs &&
                    profilePubs.length === checkDelPubs.length,
                })}
                onClick={onCheckedAllPubs.bind()}
              >
                {formatMessage({
                  id: 'aminer.paper.delete.checkall',
                  defaultMessage: 'Check All',
                })}
              </span>
              <span className={classnames('btn del')} onClick={confirmDelPubs.bind()}>
                {formatMessage({
                  id: 'aminer.paper.del.submit',
                  defaultMessage: 'Delete Papers',
                })}
              </span>
            </>
          )}
          {isStarPaperRole(user) && (
            <span className={classnames('btn star')} onClick={openStarPaperToPerson}>
              确认星标
              <span style={{ color: '#1890ff' }}>({Object.keys(starMap).length})</span>
            </span>
          )}
        </div>

        {sort === 'year' && years && years.length > 0 && (
          <div className="pubs_year">
            <span className="label">
              {formatMessage({ id: 'aminer.paper.year', defaultMessage: 'Year' })}
            </span>
            <div className="years">
              <div>
                <span
                  className={classnames('year', { active: year === 'all' })}
                  onClick={onChangeYear.bind(null, 'all')}
                >
                  {formatMessage({ id: 'aminer.paper.year.all', defaultMessage: 'All' })}
                </span>
                <span
                  className={classnames('year', { active: year === 'recent' })}
                  onClick={onChangeYear.bind(null, 'recent')}
                >
                  {formatMessage({
                    id: 'aminer.paper.year.recent',
                    defaultMessage: 'Recent',
                  })}
                  ({size})
                </span>
              </div>
              <div className="select_year">
                <div className="select_year_inner">
                  {years.map(item => (
                    <Tooltip
                      placement="top"
                      key={item.year}
                      title={`${item.year}: ${item.size}`}
                      overlayStyle={{ boxShadow: 'none' }}
                    // mouseEnterDelay={0.02}
                    >
                      <span
                        className={classnames('year_bar', { active: year === item.year })}
                        onClick={onChangeYear.bind(null, item.year)}
                      >
                        <span
                          className="bar"
                          style={{ height: `${(item.size / maxPubSize) * 100}%` }}
                        ></span>
                        <span className="bar_label">{item.year}</span>
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {sort === 'n_citation' && citations && citations.length > 0 && (
          <div className="pubs_year pubs_citation">
            <span className="label">
              {formatMessage({ id: 'aminer.paper.citation', defaultMessage: 'Citation' })}
            </span>
            <div className="years">
              <span
                className={classnames('year', { active: citation === 'all' })}
                onClick={onChangeCitation.bind(null, 'all')}
              >
                {formatMessage({ id: 'aminer.paper.citation.all', defaultMessage: 'All' })}
              </span>
              <span
                className={classnames('year', { active: citation === 'top' })}
                onClick={onChangeCitation.bind(null, 'top')}
              >
                {formatMessage({
                  id: 'aminer.paper.citation.top',
                  defaultMessage: 'Top',
                })}
                ({size})
              </span>
              {citations.map(item => (
                <Fragment key={item.nl}>
                  {item.size !== 0 && (
                    <span
                      className={classnames('year', { active: citation === item.nl })}
                      onClick={onChangeCitation.bind(null, item)}
                    >
                      {item.nh === 0 && `>= ${item.nl}`}
                      {item.nh !== 0 && `${item.nl} ~ ${item.nh}`}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}


        <PublicationList
          className="profliePaperList"
          pid={aid}
          papers={profilePubs}
          contentRightZone={pubRightZone()}
          titleLinkDomain
          // showAbstract={false}
          highlightAuthorIDs={[aid]}
          showInfoContent={pubsInfoContent}
          end={
            (profilePubs && !(profilePubs.length < profilePubsTotal)) ||
            (sort === 'year' && year === 'recent') ||
            (sort === 'n_citation' && citation === 'top')
          }
        />

        {((sort === 'year' && year === 'recent') ||
          (sort === 'n_citation' && citation === 'top')) && (
            <div className="more_paper">
              <span className="more_btn" onClick={handleViewAll}>
                <FM id="aminer.common.viewall" defaultMessage="View All" />
              </span>
            </div>
          )}
        {profilePubs &&
          profilePubs.length < profilePubsTotal &&
          ((sort === 'year' && year !== 'recent') ||
            (sort === 'n_citation' && citation !== 'top') || sort === 'confirm' || sort === 'unconfirm' || sort === 'star') && (
            <div className="more_paper">
              <span className="more_btn" onClick={loadMorePapers}>
                <FM id="aminer.common.loadmore" defaultMessage="Load More" />
              </span>
            </div>
          )}
      </div>
    </section>
  );
};

export default component(
  connect(({ loading, auth, profile, debug }) => ({
    user: auth.user,
    canAnnotate: auth.canAnnotate,
    peekannotationlog: auth.peekannotationlog,
    ShowAnnotation: debug.ShowAnnotation,
    profileID: profile.profileID,
    profilePubs: profile.profilePubs,
    profilePubsTotal: profile.profilePubsTotal,
    checkDelPubs: profile.checkDelPubs,
    loading: loading.effects['profile/getPersonPapers'],
  })),
)(PubComponent);
