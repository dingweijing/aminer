import React, { useState } from 'react';
import { component, connect } from 'acore';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { Button, message } from 'antd';
import { FM, formatMessage } from 'locales';
import { IUserInfo } from 'aminer/components/common_types';
import { IRecommendEntity } from 'aminer/p/user/notification_types';
import styles from './NTopic.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  ndata: IRecommendEntity;
  userinfo: IUserInfo;
}

const NTopic: React.FC<IPropTypes> = props => {
  const { ndata, dispatch, userinfo } = props;
  const { data } = ndata || {};
  const { topic, topic_zh, id } = data || {};
  const [show, setShow] = useState<boolean>(true);

  const is_login = isLogin(userinfo);

  const onSubscribe = async () => {
    if (!is_login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    const new_topic_id = await dispatch({
      type: 'social/FollowTopic',
      payload: {
        id,
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
            id,
            name: topic,
            name_zh: topic_zh,
          },
        },
      });
      setShow(false);
    }
  };

  return (
    <div className={classnames(styles.ntopic, { [styles.hide]: !show }, 'notification_content')}>
      <FM
        id="aminer.nreason.topic"
        values={{ field: <span className="field">「{topic || topic_zh || ''}」</span> }}
      />
      <Button onClick={onSubscribe}>
        <FM id="aminer.person.follow" defaultMessage="Follow" />
      </Button>
    </div>
  );
};

export default component(connect())(NTopic);
