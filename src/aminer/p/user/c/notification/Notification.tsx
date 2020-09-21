import React, { useEffect, useState, useMemo, useRef } from 'react';
import { component, connect, withRouter, Link, routerRedux } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import consts from 'consts';
import dayjs from 'dayjs';
import { sysconfig } from 'systems';
import { isLogin } from 'utils/auth';
import { useGetPubCollections } from 'utils/hooks';
import { Spin } from 'aminer/components/ui';
import { getLangLabel } from 'helper';
import { INotificationItem, IRecommendEntity } from 'aminer/p/user/notification_types';
import { IKeywordSocial, IKeyword, IUserInfo } from 'aminer/components/common_types';
import { MarkPub, OpenModalWithAntd } from 'aminer/components/widgets';
import NotificationList from './NotificationList';
import { SearchTopics, PubModal } from './index';
import styles from './Notification.less';

const { REQUIRE_TOPICS_LENGTH, REQUIRE_RECOMMEND_NUM } = sysconfig;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  allNotifications: INotificationItem[];
  defaultTopics: IKeyword[];
  selectTopics: IKeywordSocial[];
  loading?: boolean;
  login_loading?: boolean;
  recommendIDs: string[];
}
interface ISearchParams {
  start_from?: string;
  topic_ids?: string[] | null;
  ntypes?: string[] | null;
}

const RECOMMEND_POSITION = 2;

// TODO: xenaluo Filters
const Notification: React.FC<IPropTypes> = props => {
  const {
    dispatch,
    loading,
    login_loading,
    defaultTopics,
    selectTopics,
    userinfo,
    user,
    query,
  } = props;
  const { allNotifications, recommendIDs } = props;
  const [follow_loading, setFollowLoading] = useState<boolean>(false);
  const [end, setEnd] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<boolean>(false);
  // const is_recommend = useRef(false);
  const { pid } = query || {};

  const is_login = isLogin(userinfo) || isLogin(user);

  // useGetPubCollections(dispatch, is_login);

  const getExpertisedTopics = () => {
    if (!is_login || selectTopics) {
      return;
    }
    dispatch({
      type: 'social/ListTopic',
    }).then(topic => {
      // getRecommend(topic);
    });
  };

  const GetRecommendTopic = () => {
    if (!defaultTopics) {
      dispatch({
        type: 'social/GetRecommendTopic',
        payload: {
          num: REQUIRE_TOPICS_LENGTH,
        },
      });
    }
  };

  const getAllNotifications = (reset = false) => {
    const n_params = {};
    if (endTime && !reset) {
      n_params.start_time = endTime;
    }
    const r_params = { num: REQUIRE_RECOMMEND_NUM, exclude_ids: recommendIDs || [] };

    if (is_login) {
      dispatch({
        type: 'social/getAllNotifications',
        payload: { reset, n_params, r_params },
      }).then(res => {
        const { e, t } = res;
        setEnd(e);
        setEndTime(t);
      });
    } else {
      dispatch({
        type: 'social/getRNotifications',
        payload: { reset, r_params },
      }).then(res => {
        const { e, t } = res;
        setEnd(e);
        setEndTime(t);
      });
    }
  };

  useEffect(() => {
    if (!login_loading) {
      getExpertisedTopics();
      GetRecommendTopic();
      // getNotifications(true);
      // GetRecommendNotifications();
      getAllNotifications(true);
    }
  }, [login_loading]);

  const onSelectChange = () => {
    // GetRecommendNotifications();
  };

  useEffect(() => {
    getAllNotifications(true);
  }, [selectTopics]);

  const onLoadMore = () => {
    getAllNotifications();
  };

  return (
    <section className={classnames(styles.notification)}>
      {pid && !login_loading && <PubModal pid={pid} userinfo={userinfo} />}
      <SearchTopics
        userinfo={userinfo}
        defaultTopics={defaultTopics}
        selectTopics={selectTopics}
        follow_loading={follow_loading}
        setFollowLoading={setFollowLoading}
        onSelectChange={onSelectChange}
      />
      <div>
        <Spin loading={loading} />

        {!!allNotifications?.length && (
          <div className="notification_list">
            <NotificationList notifications={allNotifications} userinfo={userinfo} />
          </div>
        )}

        {/* !!notifications?.length */}
        {!end && !!allNotifications?.length && (
          <div className="loadmore">
            <span className="loadmore_btn" onClick={onLoadMore}>
              <FM id="aminer.common.loadmore" defaultMessage="Load More" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

// Topic.propTypes = {

// }

export default component(
  connect(({ auth, social, loading }) => ({
    user: auth.user,
    allNotifications: social.allNotifications,
    recommendIDs: social.recommendIDs,
    notifications: social.notifications,
    recommendNotifications: social.recommendNotifications,
    defaultTopics: social.defaultTopics,
    selectTopics: social.selectTopics,
    login_loading: loading.effects['social/GetUser'],
    loading: loading.effects['social/getAllNotifications'],
  })),
)(Notification);
