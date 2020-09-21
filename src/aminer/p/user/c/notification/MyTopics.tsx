import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { Popconfirm, message } from 'antd';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { ITopic } from 'aminer/p/user/notification_types';
import { IKeywordSocial } from 'aminer/components/common_types';
import styles from './MyTopics.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  topics: IKeywordSocial[];
  // topic_ids: string[] | null;
  // ntypes: string[] | null;
  // user: IUser;
  // routePath: string;
}

const MyTopics: React.FC<IPropTypes> = props => {
  const { dispatch, topics } = props;

  const delSelected = (topic: IKeywordSocial, index: number) => {
    dispatch({
      type: 'social/UnFollowTopic',
      payload: {
        id: topic?.id,
        op: 'cancel',
        index,
      },
    }).then((res: boolean) => {
      if (res) {
        message.success({
          content: formatMessage({ id: 'aminer.common.del.success' }),
          key: 5,
          duration: 1,
        });
      }
    });
  };

  if (!topics || !topics.length) {
    return <></>;
  }

  return (
    <section className={classnames(styles.myTopics)}>
      <div className="select_topics">
        <span className="label">
          <FM id="aminer.social.keyword.select" />
          <FM id="aminer.common.colon" />
        </span>
        <div className="topics">
          {/* <span
            className={classnames('topic_btn all', {
              active: focusTopics?.length === topics?.length,
            })}
          >
            <span className="topic" onClick={onSelectAll}>
              <FM id="aminer.header.collector.selectAll" />
            </span>
          </span> */}
          {topics?.map((topic, index) => {
            const { name, name_zh, input_name } = topic;
            const topic_name = input_name || name || name_zh || '';
            return (
              <div className={classnames('topic_btn')} key={topic.id}>
                <Popconfirm
                  overlayClassName="confirm_certified_popconfirm"
                  placement="left"
                  title={formatMessage({ id: 'aminer.social.attente.delete' })}
                  onConfirm={() => {
                    delSelected(topic, index);
                  }}
                  okText={formatMessage({ id: 'aminer.logout.confirm.ok' })}
                  cancelText={formatMessage({ id: 'aminer.logout.confirm.cancel' })}
                >
                  <div className="close">
                    <svg className={classnames('icon', 'close_svg')} aria-hidden="true">
                      <use xlinkHref="#icon-modal_close" />
                    </svg>
                  </div>
                </Popconfirm>
                <span
                  className="topic"
                  // onClick={() => {
                  //   onFocusTopic(topic?.id);
                  // }}
                >
                  <span className="text">{topic_name}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {/* TODO: 订阅 api */}
        {/* <SubscribeInput /> */}
      </div>
    </section>
  );
};

export default component(
  connect(({ auth, social }) => ({
    user: auth.user,
  })),
)(MyTopics);
