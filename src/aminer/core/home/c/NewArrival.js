import React, { Fragment } from 'react';
import { component, Link } from 'acore';
import { FM } from 'locales';
import consts from 'consts';
import { newarrival } from '../data/home-data';
import styles from './NewArrival.less';

const NewArrival = () => {

  return (
    <section className={styles.imageSwipper}>
      {newarrival && newarrival.map(item => {
        const params = {
          key: item.key,
          to: item.link,
        };
        if (item.target) {
          params.target = '_blank';
          params.rel = 'noopener noreferrer';
        }

        return (
          <div className="outer" key={item.key}>
            <div className="outer_content">
              {/* <span className="icon_section">
                <Link {...params}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={`#${item.icon}`} />
                  </svg>
                </Link>
              </span> */}
              <div className="introduce">
                <Link {...params}>
                  <span className="title">
                    <FM id={item.title_id} />
                    {item.type === 'new' && (
                      <img src={`${consts.ResourcePath}/sys/aminer/homepage/news.png`} alt="news" />
                    )}
                  </span>
                </Link>
                {item.desc && !!item.desc.length && item.desc.map((descItem, index) => (
                  <Fragment key={descItem.id}>
                    {descItem.link_params ? (
                      <Link className="desc_link" {...descItem.link_params} to={descItem.link_params.to}>
                        <FM id={descItem.id} />
                      </Link>
                    ) : (
                        <span className="desc">
                          <FM id={descItem.id} />
                        </span>
                      )}
                    {(index + 1 !== item.desc.length) && <span>、</span>}
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="outer_footer">
              <svg className="icon footerIcon" aria-hidden="true">
                <use xlinkHref={`#${item.icon}`} />
              </svg>
              <Link {...params} className="footerMore">
                <FM id="aminer.common.more" />
                <svg className="icon moreIcon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow" />
                </svg>
              </Link>
            </div>
          </div>
        )
      })}
    </section>
  );
};
export default component()(NewArrival);
