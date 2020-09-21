import React, { Component, useState, useEffect } from 'react';
import { connect } from 'acore';
import { Input, Skeleton, message } from 'antd';
import { FM, formatMessage } from 'locales';
import TabPageScroll from 'components/ui/TabPageScroll';
import WorldMapChart from 'components/ui/WorldMapChart';
import { dataArr } from 'services/aiopen/mockdata';
import { isLogin } from 'utils/auth';
import { Modal } from 'aminer/components/widgets';
import Menu from '../components/Header/Menu';
import Panel from '../components/Panel';
import Selection from '../components/Selection';
import PeopleInfoComponent from '../components/PeopleInfoComponent';
import { RankOpts } from './options';
import styles from './rank.less';
import options from '../components/Selection/options';


const ROWS_NUM = 15;
const randomWidth = Array(ROWS_NUM)
  .fill(0)
  .map(() => `${Math.random().toFixed(2) * 1100}px`);

const { Search } = Input;
const { opts, opts2, SELECT_OPTIONS } = RankOpts;

const Rank = ({ ai2000rank, dispatch, user }) => {
  const { listLoading, mixList, mapList, domainList, followedMap, viewsMap } = ai2000rank;

  const [tab1, setTab1] = useState(0);
  const [selected, setSelected] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const fetchList = () => {
    dispatch({
      type: 'ai2000rank/getPeopleList',
      payload: {
        domain: '5dc122672ebaa6faa962bde8',
        top_n: 100,
        type: 'AI 2000',
        year: 2019,
        // "skipcache": true,
        switches: ['withpub'],
      },
    });
  };

  const fetchMap = () => {
    dispatch({
      type: 'ai2000rank/getMapData',
      payload: {},
    });
  };

  // 获取领域列表
  const fetchDomainList = () => {
    dispatch({
      type: 'ai2000rank/getDomainList',
      payload: {
        year: 2019,
        types: ['AI 2000'],
      },
    });
  };

  const onSelectionChange = res => {
    const { domain, genders, author_order, geo } = res
    setSelected(res);
    let queryParams = '';
    for (let i = 0; i < domainList.length; i += 1) {
      if (domain === domainList[i].value) {
        queryParams = domainList[i].id;
        break;
      }
    }
    const parameter = {
      domain: queryParams,
      top_n: 100,
      type: 'AI 2000',
      year: 2019,
      // "skipcache": true,
      switches: ['withpub'],
    }
    if (genders !== 'all') {
      parameter.gender_filter = genders
    }
    if (author_order !== 'all') {
      parameter.index_filter = author_order
    }
    if (geo !== 'All') {
      parameter.country_filter = geo
    }
    // console.log('query ', queryParams)
    dispatch({
      type: 'ai2000rank/getPeopleList',
      payload: parameter,
    });
  };
  // 获取scholars 关注信息
  // console.log('ids ', personIDList)
  const followedScholarsInfo = () => {
    // const idList = [
    //   '53f458fcdabfaeecd69f5094',
    //   '53f556d3dabfae963d25d9b3',
    //   '53f48041dabfae963d25910a',
    // ];
    if (mixList.length) {
      const IDs = []
      for (let { person: { id: personID } } of mixList ) {
        IDs.push(personID)
      }
    // console.log('person id', IDs)
    dispatch({
      type: 'ai2000rank/userFollowedScholars',
      payload: {
        ids: IDs,
      },
    });
    }
  };
  // 用户登陆
  // const iflogin = () => {
  //   if (isLogin(user)) {
  //     console.log('已登录')
  //     console.log(user)
  //   } else {
  //     console.log('未登录')
  //   }
  // }
  // 用户关注功能
  const doAttention = (personID, ifFollowed) => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
    } else {
      if (!waiting) {
        if (!ifFollowed) {
          dispatch({
            type: 'ai2000rank/personFollow',
            payload: {
              aid: personID,
            },
          }).then(res => {
            if (res === 200) {
              message.info('关注成功')
            } else {
              message.info('操作失败 T_T')
            }
          });
        } else {
          dispatch({
            type: 'ai2000rank/personUnFollow',
            payload: {
              aid: personID,
            },
          }).then(res => {
            if (res === 200) {
              message.info('已取消关注 T_T')
            } else {
              message.info('操作失败 T_T')
            }
          });
        }
      }
      setWaiting(true)
      if (waiting) {
        message.info('点击频率过高,请稍等')
      }
      setTimeout(() => {
        setWaiting(false)
      }, 2000)
      followedScholarsInfo();
    }
  };
  useEffect(() => {
    fetchDomainList();
    fetchList();
    fetchMap();
    // iflogin()
    // followedScholarsInfo();
  }, []);

  SELECT_OPTIONS[0].options = domainList;
  const changeTab1 = idx => {
    setTab1(idx);
  };

  const PanelComponent = () => (
    <Panel
      className={styles.panel}
      title={formatMessage({ id: 'aiopen.panel.title1', defaultMessage: 'Filter' })}
    >
      <Selection
        options={SELECT_OPTIONS}
        onSelectChange={onSelectionChange}
        selectedKeys={selected ? selected : SELECT_OPTIONS[0].options[0]}
      />
    </Panel>
  );
  return (
    <div className={styles.Rank}>
      <div className="top">
        <Menu opts={opts} className={styles.menu} onClick={changeTab1}></Menu>
        <Search
          placeholder={formatMessage({
            id: 'aiopen.rank.search.placeholder',
            defaultMessage: 'Search Scholars',
          })}
          onSearch={value => console.log(value)}
          className="rankSearch"
        />
      </div>
      <TabPageScroll nextIndex={tab1}>
        <div className="bottom">
          <PanelComponent />
          <h2 className="title">经典AI（AAAI/IJCAI）- 机器学习 - 2024年度</h2>
          <div className="list-wrapper">
            <Skeleton
              active
              loading={listLoading}
              className="skeleton"
              paragraph={{ rows: ROWS_NUM, width: randomWidth }}
            >
              {mixList.map(item => (
                <PeopleInfoComponent
                  key={item.id}
                  {...item}
                  doAttention={doAttention}
                  followedMap={followedMap}
                  viewsMap = {viewsMap}
                />
              ))}
            </Skeleton>
          </div>
        </div>
        <div className="bottom bottom2">
          <Menu className={styles.menu2} opts={opts2}></Menu>
          <PanelComponent />
          <WorldMapChart data={dataArr} />
        </div>
      </TabPageScroll>
      <Modal />
    </div>
  );
};

export default connect(({ ai2000rank, auth }) => ({ ai2000rank, user: auth.user }))(Rank);
