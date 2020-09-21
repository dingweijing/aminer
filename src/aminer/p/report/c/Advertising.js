import React, { PureComponent } from 'react';
import { connect, withRouter } from 'acore';
import styles from './Advertising.less';

export default @connect(({ report }) => ({
  ads: report.ads,
}))

class Advertising extends PureComponent {

  render() {
    const { ads } = this.props;

    return (
      <div className={styles.publicity}>
        {(ads && ads.length) ? ads.map(item => (
          item.link_url ? (
            <a key={item.id} href={item.link_url} target="view_window">
              <img src={item.image} alt={item.title} />
            </a>
          ) : (
            <img src={item.image} alt={item.title} />
          )
        )) : ''}
      </div>
    );
  }
}
