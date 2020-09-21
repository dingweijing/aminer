import React, { useMemo } from 'react';
import { component, connect } from 'acore';
import { getLangLabel } from 'helper';
import { ITopic } from 'aminer/p/user/notification_types';
import styles from './TopicTags.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  topics: string[];
}

const TopicTags: React.FC<IPropTypes> = props => {
  const { topics, dispatch, target = '_blank' } = props;

  // return false;

  return (
    <>
      {topics && topics.length !== 0 && (
        <div className={styles.topicTags}>
          {topics.slice(0, 5).map((item, index) => {
            // const { topic, topic_zh, id } = item;
            return (
              <span className="tag" key={item}>
                {/* {getLangLabel(topic, topic_zh)} */}
                {item}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
};

export default component(connect())(TopicTags);
