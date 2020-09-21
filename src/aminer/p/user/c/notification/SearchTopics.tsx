import React, { useEffect, useState, Dispatch } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { Popconfirm, message } from 'antd';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { isLogin } from 'utils/auth';
import { FM, formatMessage, enUS } from 'locales';
import { ITopic, INotificationItem } from 'aminer/p/user/notification_types';
import { IKeywordSocial, IKeyword, IUserInfo } from 'aminer/components/common_types';
import { Suggest, MyTopics, SubscribeBtn } from './index';
import styles from './SearchTopics.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  defaultTopics: IKeyword[];
  selectTopics: IKeywordSocial[];
  follow_loading: boolean;
  setFollowLoading: Dispatch<boolean>;
  onSelectChange: () => void;
  // topic_ids: string[] | null;
  // ntypes: string[] | null;
  // user: IUser;
  // routePath: string;f
}

const SearchTopics: React.FC<IPropTypes> = props => {
  const {
    dispatch,
    defaultTopics,
    selectTopics,
    userinfo,
    follow_loading,
    setFollowLoading,
    onSelectChange,
  } = props;

  // console.log({ defaultTopics });
  const is_login = isLogin(userinfo);

  const addSelected = async (topic: IKeyword, index: number) => {
    if (!is_login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (follow_loading) {
      return;
    }
    setFollowLoading(true);
    // 换一个新的 suggest topic
    const new_topic_id = await dispatch({
      type: 'social/FollowTopic',
      payload: {
        id: topic?.id,
        op: '',
      },
    });
    if (new_topic_id) {
      message.success({
        content: formatMessage({ id: 'aminer.common.add.success' }),
        duration: 1,
      });
      dispatch({
        type: 'social/addSelectedTopics',
        payload: {
          topic: {
            id: topic?.id,
            name: topic?.topic,
            name_zh: topic?.topic_zh,
          },
        },
      });

      dispatch({
        type: 'social/GetDefaultAndChange',
        payload: {
          num: 1,
          index,
        },
      }).then(res => {
        console.log('new', res);
        setFollowLoading(false);
      });
      if (onSelectChange) {
        onSelectChange();
      }
    }
  };

  return (
    <div className={classnames(styles.searchTopics, 'customize_search')}>
      <div className="top_part">
        <div className="customize_part">
          <p className="title">
            <FM id="aminer.social.customize.view" />
          </p>
          <p className="desc">
            <FM id="aminer.social.customize.desc" />
          </p>
        </div>
        {!!defaultTopics?.length && (
          <span className="hot_recommend">
            <div className="keywords">
              {defaultTopics.map((item, index) => {
                const { topic, topic_zh } = item || {};
                return (
                  <span
                    key={item.id}
                    className="keyword"
                    onClick={() => {
                      addSelected(item, index);
                    }}
                  >
                    {topic || topic_zh || ''}
                  </span>
                );
              })}
            </div>
          </span>
        )}
        <div className="suggest_part">
          <Suggest
            userinfo={userinfo}
            follow_loading={follow_loading}
            setFollowLoading={setFollowLoading}
            onSelectChange={onSelectChange}
          />
        </div>
      </div>
      {is_login && (
        <div className="bottom">
          <div>{!!selectTopics?.length && <MyTopics topics={selectTopics} />}</div>
          <div className="s_btn">
            <SubscribeBtn userinfo={userinfo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default component(connect(({ social, loading }) => ({})))(SearchTopics);
