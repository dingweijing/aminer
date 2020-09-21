import React, { useEffect, useState, Fragment } from 'react';
import { component, connect, history } from 'acore';
import { Tooltip, message } from 'antd';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import { Spin } from 'aminer/components/ui';
import * as profileUtils from 'utils/profile-utils';
import { IFollow } from 'aminer/p/user/notification_types';
import Overview from './Overview';
import FollowsExperts from './FollowsExperts';
import FollowsConfs from './FollowsConfs';
import styles from './FollowEntities.less';

interface IPropTypes {
  // dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  // userinfo: IUserInfo;
  loading: boolean;
}

interface ITabs {
  [key: string]: {
    name_id: string;
    // key: string;
    content?: React.FC | boolean;
    link?: string;
    count_field: string;
    disable: boolean;
    showCount: boolean;
  };
}

const tabs_map: ITabs = {
  // overview: {
  //   name: 'Overview',
  //   // key: 'overview',
  //   content: Overview,
  // },
  expert: {
    name_id: 'aminer.follows.experts.title',
    count_field: 'person_count',
    content: FollowsExperts,
    disable: false,
    showCount: true,
  },
  // pub: {
  //   name_id: 'aminer.follows.pub.title',
  //   count_field: 'pub_count',
  //   link: '/user/collections',
  //   disable: false,
  //   showCount: true,
  // },
  conference: {
    name_id: 'aminer.follows.confs.title',
    count_field: '',
    content: false,
    disable: true,
    showCount: false,
  },
  institution: {
    name_id: 'aminer.follows.orgs.title',
    count_field: '',
    content: false,
    disable: true,
    showCount: false,
  },
};
const tabs = Object.keys(tabs_map);

const FollowEntities: React.FC<IPropTypes> = props => {
  const { dispatch, loading } = props;

  const [key, setKey] = useState<string>('expert');
  const [counts, setCounts] = useState<IFollow>();

  // const { socialstat } = userinfo || {};
  // const Component = tabs_map[key]?.content;
  const changeTab = (tab: string, disable: boolean, link?: string) => {
    if (link) {
      history.push(link);
      return;
    }
    if (!disable) {
      setKey(tab);
    }
  };

  useEffect(() => {
    dispatch({
      type: 'social/GetFollows',
      payload: {
        includes: ['e', 'p'],
        offset: 0,
        size: 0,
      },
    }).then((result: IFollow) => {
      // const { person, person_count } = result || {};
      setCounts(result);
    });
  }, []);

  return (
    <div className={classnames(styles.followEntities, 'follow_entities')}>
      <div className="tabs_control">
        {tabs?.map(tab => {
          const tab_info = tabs_map[tab];
          const { name_id, count_field, disable, showCount, link } = tab_info || {};
          const count = counts && counts[count_field];

          // <Tooltip placement="topRight" title={text}>
          //   <Button>TR</Button>
          // </Tooltip>;

          const ele = (
            <div
              key={tab}
              className={classnames('tab_btn', { active: tab === key, disable })}
              onClick={() => {
                changeTab(tab, disable, link);
              }}
            >
              <span className="tab">
                <FM id={name_id} defaultMessage="" />
              </span>
              {showCount && <span className="count">{count || 0}</span>}
            </div>
          );

          return (
            <>
              {disable && (
                <Tooltip
                  overlayClassName="userpage-tooltip"
                  placement="top"
                  title={formatMessage({
                    id: 'aminer.follows.wait',
                    defaultMessage: 'Coming soon',
                  })}
                >
                  <div className="desktop_device">{ele}</div>
                </Tooltip>
              )}
              {!disable && <>{ele}</>}
            </>
          );
        })}
      </div>
      <div className="tabs_content">
        <Spin loading={loading} />
        {tabs?.map(tab => {
          const tab_info = tabs_map[tab];
          const Component = tab_info.content;
          if (!Component) {
            return <Fragment key={tab}></Fragment>;
          }

          return (
            <div
              className={classnames(styles.content_item, 'content_item', {
                active: tab === key,
                [styles.active]: tab === key,
              })}
              key={tab}
            >
              <Component showDetailFollows={setKey} />
            </div>
          );
        })}
        {/* {Component && <Component showDetailFollows={setKey} />} */}
      </div>
    </div>
  );
};

export default component(
  connect(({ loading }) => ({
    loading: loading.effects['social/GetFollows'],
  })),
)(FollowEntities);
