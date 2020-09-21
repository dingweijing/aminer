import React, { useMemo, useEffect, Dispatch } from 'react';
import { component, connect } from 'acore';
import { message } from 'antd';
import { getLangLabel } from 'helper';
import { formatMessage } from 'locales';
import { IKeyword, IKeywordSocial } from 'aminer/components/common_types';
import styles from './RecommendTopics.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  defaultTopics: IKeyword[];
  selectTopics: IKeywordSocial[];
  follow_loading: boolean;
  setFollowLoading: Dispatch<boolean>;
}

const RecommendTopics: React.FC<IPropTypes> = props => {
  const {
    defaultTopics,
    selectTopics,
    dispatch,
    target = '_blank',
    follow_loading,
    setFollowLoading,
  } = props;

  // useEffect(() => {
  //   getRecommend();
  // }, [selectTopics]);

  // console.log({ defaultTopics });
  const addSelected = async (topic: IKeyword, index: number) => {
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
        setFollowLoading(false);
      });
    }
  };

  return (
    <>
      {!!defaultTopics?.length && (
        <div className={styles.recommendTopics}>
          {defaultTopics.map((item, index) => {
            const { topic, topic_zh, id } = item;
            return (
              <span
                className="tag"
                key={id}
                onClick={() => {
                  addSelected(item, index);
                }}
              >
                {topic || topic_zh || ''}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
};

export default component(
  connect(({ auth, social, loading }) => ({
    user: auth.user,
    selectTopics: social.selectTopics,
    defaultTopics: social.defaultTopics,
  })),
)(RecommendTopics);
