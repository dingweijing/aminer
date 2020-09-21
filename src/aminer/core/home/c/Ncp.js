import React from 'react';
import { component, Link } from 'acore';
import { FM } from 'locales';
import { classnames } from 'utils';
import { ncp } from '../data/home-data';
import styles from './Ncp.less';

const Ncp = () => {
  return (
    <section className={styles.ncpWrap}>
      <div className={styles.ncp}>
        {ncp && ncp.map(item => {
          const params = {
            key: item.key,
            to: item.link,
          };
          if (item.target) {
            params.target = '_blank';
            params.rel = 'noopener noreferrer';
          }
          return (
            <Link className={styles.outer} {...params}>
              <div className={styles.outer_content}>
                <div className={styles.icon_section}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={`#${item.icon}`} />
                  </svg>
                </div>
                <div className={styles.introduce}>
                  <span className={styles.title}>
                    <FM id={item.title} />
                  </span>
                </div>
              </div>
              {/* </div> */}
            </Link>
          )
        })}
      </div>
    </section>
  );
};
export default component()(Ncp);
