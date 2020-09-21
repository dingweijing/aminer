import React, { useEffect } from 'react';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { KeywordCluster } from './TopicClusterType';
import styles from './TopicList.less';

interface Proptypes {
  keywordsList: KeywordCluster[];
  onChangeQuery?: (config: { query: string | undefined }) => any;
  curQuery: string | undefined;
}

const TopicList = (props: Proptypes) => {
  const { keywordsList, onChangeQuery, curQuery } = props;

  const onChangeQueryToParent = (query: string | undefined) => {
    if (onChangeQuery) {
      if (query === curQuery) {
        onChangeQuery({ query: '' });
      } else {
        onChangeQuery({ query });
      }
    }
  };
  return (
    <div className={styles.topic}>
      <div className="legend">
        <FM id="aminer.topic.keyWords" defaultMessage="" />
      </div>
      <div className="topic_list">
        {keywordsList &&
          keywordsList.length > 0 &&
          keywordsList.slice(0, 10).map(topic => {
            return (
              <span
                className={classnames({ active: curQuery === topic.value })}
                key={topic.value}
                onClick={onChangeQueryToParent.bind(null, topic.value)}
              >
                {topic.value}
              </span>
            );
          })}
      </div>
    </div>
  );
};

export default TopicList;
