// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { message } from 'antd';
// import UpdateConfInfo from '../UpdateConfInfo'
import styles from './Jurisdiction.less';

const Jurisdiction = props => {
  const { conf, dispatch } = props;
  const [publicStatus, setPublicStatus] = useState((conf && conf.is_public) || false);

  const updateAuthority = () => {
    const fields = {};
    fields.id = conf.id;
    fields.is_public = !conf.is_public;
    dispatch({
      type: 'aminerConf/UpdateConf',
      payload: fields,
    }).then(result => {
      if (result.succeed) {
        message.success('修改成功');
        // TODO: 刷新页面
        setPublicStatus(!publicStatus);
      }
    });
  };
  return (
    <div className="lockIcon" onClick={updateAuthority}>
      {publicStatus ? '开' : '私'}
    </div>
  );
};

export default page(connect())(Jurisdiction);
