/**
 * Created by yangyanmei on 17/8/31.
 * Author: Elivoa, 2019-08-08
 * refactor by Bo Gao, 2019-08-08 Rewrite.
 */
import React, { useState, useEffect } from 'react';
import { component, connect, } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { FM, formatMessage, enUS } from 'locales';
import strings from 'utils/strings';
import TopicBarChart from '@/core/search/widgets/topicBarChart';
import styles from './SearchKnowledge.less';

const maxDescNum = 100;

const SearchKnowledgeTopic = props => {
  const { topic, topicIndex } = props;
  const [more, setMore] = useState(false);
  const toggleDesc = () => {
    setMore(!more);
  }
  if (!topic || (!topic.label && !topic.label_zh) || !topic.freq) {
    return <></>;
  }
  let { label, label_zh, desc, desc_zh } = topic;
  const locale = sysconfig.Locale;
  const isDefaultLocale = locale === enUS;
  if (!isDefaultLocale) {
    [label, label_zh] = [label_zh, label]
  }
  const description = isDefaultLocale ? desc || desc_zh : desc_zh || desc;

  const { className, kid } = props;

  return (
    <div className={classnames(styles.searchKgContent, styles[className], 'search-kg-content')} key={`topic${topicIndex}`}>
      {(label || label_zh) && (
        <div className="inner-box">
          <h1>
            <strong>{label || label_zh}</strong>
            {label_zh && label && <span>&nbsp; ({label_zh})</span>}
            {/* <i className={`fa ${more ? 'fa-angle-up' : 'fa-angle-down'}`} style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={this.toggleDesc} /> */}

          </h1>
          <h2 className="sub-title-color">
            <strong>{formatMessage({ id: 'aminer.topic.popularity_over_time', defaultMessage: 'Popularity Over Time' })}</strong>
          </h2>

          <TopicBarChart topic={topic} kid={`kid_${topicIndex}`} />

          {/* {description && (
            <h2 className="sub-title-color">
              <strong>{formatMessage({ id: 'aminer.topic.description', defaultMessage: 'Description' })}</strong>
            </h2>
          )}
          {description && (
            <p className="desc">
              {more
                ? description
                : description && description.length > maxDescNum
                  ? `${description.slice(0, maxDescNum)}...`
                  : description}
            </p>
          )} */}

          {description && more && (
            <div>
              <h2 className="sub-title-color">
                <strong>{formatMessage({ id: 'aminer.topic.description', defaultMessage: 'Description' })}</strong>
              </h2>
              <p className="desc">
                {description}
              </p>
            </div>
          )}

          {description && description.length > maxDescNum && (
            <span className="morebtn" onClick={toggleDesc}>
              {more
                ? <FM id="aminer.common.hideDescription" defaultMessage="Hide Description" />
                : <FM id="aminer.common.seeDescription" defaultMessage="See Description" />
              }
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * queryObj - 传入的queryObject
 * data - 预加载的数据，格式：topic.topic
 */
const SearchKnowledge = props => {
  const { dispatch, data, queryObj, kid } = props;
  const { translatedText, translatedLanguage } = props;

  let mention;
  if ((queryObj && queryObj.query) || (queryObj.advanced && queryObj.advanced.term)) {
    if (translatedLanguage === 2 && translatedText) {
      mention = translatedText;
    } else {
      mention = queryObj.query || strings.firstNonEmptyQuery(queryObj);
    }
  }

  useEffect(() => {
    if (!data) { // 如果有数据传入，不再获取数据了。或者没有topic也就不出来了。
      dispatch({ type: 'topic/getTopicByMention', payload: { mention } });
    }
  }, [mention])
  const topics = data || props.topic || [];

  return (
    <div className={styles.searchKg}>
      {topics.map((item, index) => <SearchKnowledgeTopic topic={item} topicIndex={`${kid}${index}`} key={`searchKnowledgeTopic${index}`} />)}
    </div>
  )
}

export default component(
  connect(({ topic, search }) => ({
    topic: topic.topic,
    translatedLanguage: search.translatedLanguage,
    translatedText: search.translatedText,
  })),
)(SearchKnowledge);
