// getSchedule

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { page, connect, withRouter, history, Link } from 'acore';
import { classnames } from 'utils';
import { Tabs, Collapse, Divider } from 'antd';
import { formatMessage, FM } from 'locales';
import { parseUrlParam, getLangLabel } from 'helper';
import { useResizeEffect } from 'helper/hooks';
import PropTypes from 'prop-types';
import { isLogin, isRoster, isAuthed } from 'utils/auth';
import {
  KeywordsList,
  TimeTable,
  LeftAuthorList,
  Papers,
  Authors,
  Schedule,
  ChineseAuthors,
  ChineseStudent,
  ConfSearchBox,
  MostViewAndLike,
  SetOrGetViews,
  OrgPdfDownloadList,
} from './c';
import styles from './PaperHomePage.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;

const HomePage = props => {
  // 中间tab
  const {
    filters,
    hideSearch = false,
    hideMostViewAndLike = false,
    // middleTabJson,
    hiddenInLeftAuthors,
    type,
  } = props;
  const { language } = parseUrlParam(props, {}, ['language']);

  // const { type: urlType } = helper.parseMatchesParam(props, {}, ['type']);
  const [middleKey, setMiddleKey] = useState();
  // 左侧filter显示
  const menuRef = useRef();
  const { leftTabJsonConfig, middleTabConfig } = props;
  const { confInfo, dispatch, user } = props;

  useResizeEffect(menuRef);

  useEffect(() => {
    SetOrGetViews('click', dispatch, confInfo.id);
  }, []);

  const onChangeMiddleTab = key => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'homepage_navigator',
        payload: JSON.stringify(key),
      },
    });
    if (key !== 'GCT') {
      // 清空category
      dispatch({ type: 'aminerConf/clearFiltersCategory' });
      setMiddleKey(key);
    }
  };

  let tempLeftTab;
  let tempMiddleTab;
  let paperMiddleTab;
  if (confInfo && confInfo.config) {
    const { config } = confInfo;
    const { left = [] } = config;
    tempLeftTab = left.length > 0 ? left : leftTabJsonConfig;
    tempMiddleTab =
      config[type] && config[type].navigator ? config[[type]].navigator : middleTabConfig;
    paperMiddleTab = config.paper && config.paper.navigator ? config.paper.navigator : [];
  } else {
    tempLeftTab = leftTabJsonConfig;
    tempMiddleTab = middleTabConfig;
    paperMiddleTab = [];
  }

  useEffect(() => {
    if (language) {
      setMiddleKey(language);
    } else {
      setMiddleKey(tempMiddleTab[0]);
    }
  }, [tempMiddleTab]);

  const renderLeftTabHead = (tab, icon) => (
    <div className="left-tab">
      <svg className="icon" aria-hidden="true">
        <use xlinkHref={`#${icon}`} />
      </svg>
      <FM id={`aminer.conf.${tab}.legend`} />
    </div>
  );

  const showMenu = useCallback(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.style.display === 'block') {
      menuRef.current.style.display = 'none';
      dispatch({ type: 'aminerConf/setisMobileClickMenu', payload: false });
    } else {
      dispatch({ type: 'aminerConf/setisMobileClickMenu', payload: true });
      menuRef.current.style.display = 'block';
    }
  }, []);

  const onSearch = value => {
    SetOrGetViews('click', dispatch, confInfo.id);
    if (value === '') {
      dispatch({ type: 'aminerConf/updateStateByKey', payload: { searchQuery: null } });
    } else {
      dispatch({
        type: 'aminerConf/updateStateByKey',
        payload: { searchQuery: value },
      });
      setMiddleKey('paper');
    }
  };

  const downloadAllPdf = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
    } else {
      history.push(`/conf/${confInfo.short_name}/download/all`);
    }
  };
  return (
    <div
      className={classnames(styles.homePage, {
        [styles.flexGrow]:
          confInfo.config && confInfo.config.right && confInfo.config.right.length === 0,
      })}
    >
      {paperMiddleTab.includes('paper') && (
        <div className={classnames('leftBlock', { innerMarginTop60: !hideSearch })} ref={menuRef}>
          <Collapse defaultActiveKey={tempLeftTab.map(tab => tab)}>
            {tempLeftTab.map(tab => {
              return (
                <Panel header={renderLeftTabHead(tab, leftTabJson[tab].icon)} key={tab}>
                  {leftTabJson[tab].content({ confInfo, menuRef, showMenu, SetOrGetViews })}
                </Panel>
              );
            })}
          </Collapse>
          {!hideMostViewAndLike && paperMiddleTab.includes('paper') && (
            <MostViewAndLike id={confInfo.id} SetOrGetViews={SetOrGetViews} />
          )}
        </div>
      )}
      <div className="centerContent">
        {!hideSearch && <ConfSearchBox onSearch={onSearch} />}
        {type === 'paper' && <OrgPdfDownloadList confInfo={confInfo} />}
        {type === 'roster' && (
          <a
            href="https://gct.aminer.cn/eb/series?name=CCF%E6%8E%A8%E8%8D%90%E4%BC%9A%E8%AE%AE[A%E7%B1%BB]"
            target="_blank"
            onClick={onChangeMiddleTab.bind(null, 'GCT')}
            className="desktop_device outside_chain"
          >
            <img
              src="https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_GCT.png"
              alt="GCT"
            />
          </a>
        )}
        <Tabs
          defaultActiveKey={middleKey}
          activeKey={middleKey}
          onChange={onChangeMiddleTab}
          animated={false}
        >
          {tempMiddleTab &&
            tempMiddleTab.map(tab => {
              if (filters && filters.aid && hiddenInLeftAuthors.includes(tab)) {
                return '';
              }
              return (
                <TabPane
                  tab={
                    <div className="center-tab">
                      <span className="tabIcon">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref={`#${middleTabJsonDefault[tab].icon}`} />
                        </svg>
                      </span>
                      <FM id={`aminer.conf.${tab}.legend`} />
                    </div>
                  }
                  key={tab}
                >
                  {middleTabJsonDefault[tab].content({
                    confInfo,
                    tab: middleKey,
                    SetOrGetViews,
                    tempMiddleTab: paperMiddleTab,
                  })}
                </TabPane>
              );
            })}
        </Tabs>
        <div className="mobile_device mobile_left_filter_icon" id="homepageMenu">
          <svg className="icon menu_icon" aria-hidden="true" onClick={showMenu}>
            <use xlinkHref="#icon-menu2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  hideSearch: PropTypes.bool,
  hideMostViewAndLike: PropTypes.bool,
  middleTabConfig: PropTypes.array,
  hiddenInLeftAuthors: PropTypes.array,
  leftTabJsonConfig: PropTypes.array,
};

HomePage.defaultProps = {
  hideSearch: false,
  hideMostViewAndLike: false,
  middleTabConfig: ['paper', 'authors', 'chinese-scholar', 'chinese-first', 'session'],
  hiddenInLeftAuthors: ['chinese-scholar', 'chinese-first'],
  leftTabJsonConfig: ['session', 'keywords', 'leftAuthors'],
};

export default page(
  withRouter,
  connect(({ auth, aminerConf }) => ({
    user: auth.user,
    roles: auth.roles,
    filters: aminerConf.filters,
  })),
)(HomePage);

const middleTabJsonDefault = {
  paper: {
    icon: 'icon-list',
    content: params => <Papers {...params} />,
  },
  authors: {
    icon: 'icon-head',
    content: params => <Authors {...params} />,
  },
  'chinese-scholar': {
    icon: 'icon-head-01',
    content: params => <ChineseAuthors {...params} />,
  },
  'chinese-first': {
    icon: 'icon-w_xuesheng-',
    content: params => <ChineseStudent {...params} />,
  },
  session: {
    icon: 'icon-huiyi',
    content: params => <Schedule {...params} />,
  },
};
const leftTabJson = {
  session: {
    icon: 'icon-time',
    content: params => <TimeTable {...params} />,
  },
  keywords: {
    icon: 'icon-key',
    content: params => <KeywordsList {...params} />,
  },
  leftAuthors: {
    icon: 'icon-head',
    content: params => <LeftAuthorList {...params} />,
  },
};
