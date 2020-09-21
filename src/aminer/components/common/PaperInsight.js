import React, { } from 'react';
import { component } from 'acore';
import consts from 'consts';
import { FM } from 'locales';
import { MustReadReason } from 'aminer/core/pub/widgets/info';
import styles from './PaperInsight.less';

const PaperInsight = props => {
  const { text } = props;

  const onSharePaper = (text) => {
    const url = window.location.href;
    const a = () => window.open(`http://service.weibo.com/share/share.php?title=${text}&url=${url}&source=bookmark&appkey=2992571369`);
    if (/Firefox/.test(navigator.userAgent)) {
      setTimeout(a, 0);
    } else {
      a();
    }
  }

  return (
    <div className={styles.paperInsight}>
      <div className={styles.summary}>
        <span className={styles.labelText}>
          <FM id="aminer.paper.headline" defaultMessage="Wei bo" />
        </span>
        <FM id='aminer.common.colon' defaultMessage=': ' />
        <span onClick={onSharePaper.bind(this, text)} className={styles.weibo} style={{ backgroundImage: `url(${consts.ResourcePath}/sys/aminer/layout/v1/home_sprites.png)` }}></span>
      </div>
      <div className={styles.headline}>
        <MustReadReason showComment={false} reasonClass="reasonText" paper={{ reason: text }} />
      </div>
    </div>
  )
}

export default component()(PaperInsight);
