/**
 * Created by BoGao on 2019-1-5;
 * Optimized for SEO
 */
import React from 'react';
import { Link } from 'acore';
import { zhCN } from 'locales';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import styles from './HotKeywords.less';
/**
 *
 * @param {*} links - ["DM", "AI"] or [{zh:"DM", en:"树蛙"}]
 */
const HotKeywords = ({ keywords = [], linktofunc, className, withComma }) => {
  return (
    <div className={classnames(styles.HotKeywords, className)}>
      {keywords.map((hw) => {
        let term = hw;
        if (typeof hw !== 'string') {
          term = sysconfig.Locale === zhCN ? hw.zhCN : hw.enUS;
        }

        return (
          <Link key={term} to={linktofunc && linktofunc(term)}>
            {term}
          </Link>
        );
      })}
    </div>
  )

};

export default HotKeywords;
