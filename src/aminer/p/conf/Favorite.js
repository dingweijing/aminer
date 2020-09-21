// getSchedule
import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Tabs, BackTop } from 'antd';
import { Spin } from 'aminer/components/ui';
import { isLogin } from 'utils/auth';
import { formatMessage, FM } from 'locales';
import Like from './Like';
import Recommend from './Recommend';
import styles from './Favorite.less';

const { TabPane } = Tabs;
const Favorite = props => {
  const [activeKey, setActiveKey] = useState('like');
  const { confInfo, user, roles } = props;

  const callback = key => {
    setActiveKey(key);
  };

  return (
    <div className={styles.favorite}>
      <Tabs
        // defaultActiveKey={activeKey}
        activeKey={activeKey}
        onChange={callback}
        animated={false}
      >
        {Object.keys(tabJson).map(k => {
          return (
            <TabPane
              tab={formatMessage({ id: `aminer.conf.tab.${tabJson[k].tab}` })}
              key={tabJson[k].key}
            />
          );
        })}
      </Tabs>
      <div className={styles.threeBlock}>
        {tabJson[activeKey].content({
          confInfo,
          user,
          roles,
          activeKey,
        })}
      </div>
    </div>
  );
};

export default page(connect())(Favorite);

const tabJson = {
  like: {
    tab: 'Like',
    key: 'like',
    content: params => <Like {...params} />,
  },
  recommend: {
    tab: 'Recommend',
    key: 'recommend',
    content: params => <Recommend {...params} />,
  },
};
