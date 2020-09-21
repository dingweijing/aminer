import React, { useEffect, useState } from 'react';
import { component, connect, } from 'acore';
import { Popconfirm, message } from 'antd';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IKeywordSocial } from 'aminer/components/common_types';
import styles from './FollowTopics.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  // userinfo: IUserInfo;
  selectTopics: IKeywordSocial[];
}

const FollowTopics: React.FC<IPropTypes> = props => {
  const { dispatch, selectTopics } = props;

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
          duration: 1,
        });
      }
    });
  };

  return (
    <div className={classnames(styles.followTopics, 'follow_topics')}>
      {selectTopics?.map((topic, index) => {
        const { name, name_zh, input_name } = topic;
        const topic_name = input_name || name || name_zh || '';
        // { edit_mode: isEdit }
        return (
          <div className={classnames('topic_btn')} key={topic.id}>
            {true && (
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
            )}
            <div className={classnames('mytopic')}>
              <span className="topic">{topic_name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default component(
  connect(({ social }) => ({
    selectTopics: social.selectTopics,
  })),
)(FollowTopics);
