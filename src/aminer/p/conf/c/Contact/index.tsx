// getSchedule

import React, { useEffect } from 'react';
import { page, connect } from 'acore';
import { FM } from 'locales';
import consts from 'consts';
import { SetOrGetViews } from '../SetOrGetViews';
import styles from './index.less';

const Contact = props => {
  const { dispatch } = props;
  const { confInfo = {} } = props;
  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  return (
    <div className={styles.contact}>
      <div>
        <p className="desc">
          <FM
            id="aminer.conf.contact.wechart"
            values={{ conf: confInfo && confInfo.short_name && confInfo.short_name.split(' ')[0].toUpperCase() }}
          />
        </p>
        <img src={`${consts.ResourcePath}/data/conf/xiaomai.jpeg`} alt="xiaomai" />
      </div>
    </div>
  );
};

export default page(connect())(Contact);
