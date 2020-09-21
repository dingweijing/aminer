import React, { useMemo, useState } from 'react';
import { component } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { FM } from 'locales';
import styles from './PaperAbstract.less';

const { Pub_Abstract_Chop_Num } = sysconfig;

const PaperAbstract = props => {
  const { abstract, lang, absTitleClass } = props;
  const [absMore, setAbsMore] = useState(false);

  const toggleAbstract = () => {
    setAbsMore(!absMore);
  };

  const content = useMemo(() => {
    if (abstract) {
      return (
        <div className={styles.paperAbstract}>
          <p className={classnames(absTitleClass, styles.absTitle)}>
            <span className={styles.absLabel}>
              <FM id="aminer.paper.abstract" defaultMessage="Abstract" />
            </span>
            <FM id='aminer.common.colon' defaultMessage=': ' />
          </p>
          <div className={styles.abstractText}>
            {absMore || abstract.length <= Pub_Abstract_Chop_Num
              ? abstract
              : `${abstract.slice(0, Pub_Abstract_Chop_Num)}...`}
            {abstract.length > Pub_Abstract_Chop_Num && (
              <span className={styles.morebtn} onClick={toggleAbstract}>
                {absMore ? (
                  <FM id="aminer.common.less" defaultMessage="Less" />
                ) : (
                    <FM id="aminer.common.more" defaultMessage="More" />
                  )}
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  }, [abstract, absMore]);
  return content;
}

export default component()(PaperAbstract)
