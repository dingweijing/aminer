/**
 *  Created by BoGao on 2017-10-10;
 */
import React from 'react';
import { Link } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils/index';
import { zhCN } from 'locales';
import styles from './index-hotlinks.less';

const IndexHotLinks = ({ links, urlFunc, withComma }) => {

  const Links = links || [];

  return (
    <div className={styles.keywords}>
      <div className={classnames(styles.inner, 'keywords_innerxxx')}>
        {Links.map((item, index) => {
          let query = '';
          if (sysconfig.Locale === zhCN) {
            query = item.name_zh || item.name;
          } else {
            query = item.name || item.name_zh;
          }
          const key = `${query}_${index}`;
          return (
            <div key={key}>
              <Link to={urlFunc && urlFunc(query)}>{query}</Link>
              {withComma && index !== Links.length - 1 && ','}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndexHotLinks;
