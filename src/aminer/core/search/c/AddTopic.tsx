/**
 * Created by yangyanmei on 17/8/31.
 * Author: Elivoa, 2019-08-08
 * refactor by Bo Gao, 2019-08-08 Rewrite.
 */
import React, { useState, useMemo } from 'react';
import { component, connect } from 'acore';
import { message } from 'antd';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { FM, formatMessage, enUS } from 'locales';
import strings from 'utils/strings';
import styles from './AddTopic.less';

/**
 * queryObj - 传入的queryObject
 * data - 预加载的数据，格式：topic.topic
 */
const AddTopic = props => {
  const { dispatch, data, loading } = props;

  const topics = data || props.topic || [];

  const topic_label = useMemo(() => {
    const labels = topics?.map(item => item.label || '') || [];
    let label = labels[0];
    labels.forEach(item => {
      if (item?.length > label?.length) {
        label = item;
      }
    });
    return label;
  }, [topics]);

  const addSelected = () => {
    if (loading) {
      return;
    }
    dispatch({
      type: 'social/FollowTopic',
      payload: {
        name: topic_label,
        op: '',
      },
    }).then(new_topic => {
      if (new_topic) {
        message.success({
          content: formatMessage({ id: 'aminer.subscribe.success' }),
          duration: 3,
        });
      }
    });
  };

  if (!topic_label) {
    return <></>;
  }

  return (
    <div className={classnames(styles.addTopic, 'add-topic')} onClick={addSelected}>
      <FM id="aminer.subscribe.topic" values={{ topic: topic_label }} />
    </div>
  );
};

export default component(
  connect(({ topic, loading }) => ({
    topic: topic.topic,
    loading: loading.effects['social/FollowTopic'],
  })),
)(AddTopic);
