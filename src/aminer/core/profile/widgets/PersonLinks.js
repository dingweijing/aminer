import React, { useEffect, useState, useMemo, memo, Fragment } from 'react';
import { connect, component } from 'acore';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { FM, formatMessage } from 'locales';
import consts from 'consts';
import { isLogin } from 'utils/auth';
import styles from './PersonLinks.less';

const link_icons = [
  // TODO add homepage
  { icon: 'homepage', type: 'homepage', title: 'Homepage' },
  { icon: 'facebook', type: 'facebook', title: 'Facebook' },
  { icon: 'twitter', type: 'twitter', title: 'Twitter' },
  { icon: 'youtube-play', type: 'vl', title: 'YouTube' },
  { icon: 'graduation-cap', type: 'gs', title: 'Google Scholar' },
  { icon: 'weibo', type: 'weibo', title: 'Weibo' },
];

const PersonLinks = props => {
  const { dispatch, personId, links, className, homepage, user } = props;

  // const onClickLink = url => {
  //   if (url) {
  //     window.open(url);
  //   }
  // }

  return (
    <>
      {isLogin(user) && (
        <p className={styles.PersonLinks}>
          {/* <a href={homepage} target="_blank" rel="noopener noreferrer">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-graduation-cap" />
        </svg>
      </a> */}

          {link_icons.map(link => {
            const url =
              link.type === 'homepage' ? homepage : links && links[link.type] && links[link.type].url;
            const params = {
              key: link.type,
              href: url,
              className: classnames('fa-stack fa-lg', { [styles.high]: url }),
            };

            const svg = (
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={`#icon-${link.icon}`} />
              </svg>
            );
            if (link.type === 'weibo' && !url) {
              return false;
            }
            return (
              <Fragment key={link.type}>
                {url && (
                  <Tooltip placement="topLeft" title={`${link.title}: ${url}`} arrowPointAtCenter>
                    <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                      {svg}
                    </a>
                  </Tooltip>
                )}
                {!url && <span className="link">{svg}</span>}
              </Fragment>
            );
          })}
        </p>
      )}
      {!isLogin(user) && (
        <p className={styles.PersonLinks} />
      )}
    </>

  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(PersonLinks);
