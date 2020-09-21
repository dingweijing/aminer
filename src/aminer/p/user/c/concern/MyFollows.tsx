import React, { useState, useEffect } from 'react';
import { Link, component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { sysconfig } from 'systems';
import { getLangLabel } from 'helper';
import { IKeyword, IKeywordSocial, IUserInfo } from 'aminer/components/common_types';
import FollowEntities from './FollowEntities';
import FollowTopics from './FollowTopics';
import { Suggest } from '../notification';
import RecommendTopics from './RecommendTopics';
import styles from './MyFollows.less';

const { REQUIRE_TOPICS_LENGTH } = sysconfig;
interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  select_loading: boolean;
  selectTopics: IKeywordSocial[];
  defaultTopics: IKeyword[];
}

const MyFollows: React.FC<IPropTypes> = props => {
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  const { dispatch, selectTopics, defaultTopics, userinfo } = props;

  const [follow_loading, setFollowLoading] = useState<boolean>(false);

  // TODO: xenaluo -- Recommend Topics
  // const getRecommend = () => {
  //   dispatch({
  //     type: 'social/GetRecommendNotifications',
  //   }).then(() => {
  //     setFollowLoading(false);
  //   });
  // };
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

  const getExpertisedTopics = () => {
    dispatch({
      type: 'social/ListTopic',
    }).then(res => {
      // getRecommend();
    });
  };

  useEffect(() => {
    getExpertisedTopics();
    GetRecommendTopic();
  }, []);

  // useEffect(() => {
  //   if (selectTopics && !selectTopics?.length) {
  //     setIsEdit(true);
  //   }
  //   if (selectTopics) {
  //     getRecommend(selectTopics);
  //   }
  // }, [selectTopics]);

  return (
    <div className={classnames(styles.myFollows, 'my_follows')}>
      <div className="follow_topics_content">
        {!!selectTopics?.length && (
          <>
            <div className="label">
              <FM id="aminer.user.follows.topics" />
            </div>
            <div>
              <FollowTopics />
            </div>
          </>
        )}
        {!!defaultTopics?.length && (
          <span className="hot_recommend">
            <span className="text">
              <FM id="aminer.user.recommend.related" defaultMessage="" />
              {/* <FM id="aminer.common.colon" /> */}
            </span>
            <div className="recomment_keyword">
              <RecommendTopics
                setFollowLoading={setFollowLoading}
                follow_loading={follow_loading}
              />
            </div>
          </span>
        )}
        <div className="edit">
          <div className="suggest_part">
            <Suggest setFollowLoading={setFollowLoading} follow_loading={follow_loading} userinfo={userinfo} />
          </div>
        </div>
      </div>
      <div className="margin"></div>

      <div className="follow_entities">
        <div className="label">
          <FM id="aminer.user.follows.entities" />
        </div>
        <FollowEntities />
      </div>
    </div>
  );
};

export default component(
  connect(({ auth, loading, social }) => ({
    user: auth.user,
    // page_loading: loading.effects['social/GetUser'],
    select_loading: loading.effects['social/ListTopic'],
    defaultTopics: social.defaultTopics,
    selectTopics: social.selectTopics,
  })),
)(MyFollows);
