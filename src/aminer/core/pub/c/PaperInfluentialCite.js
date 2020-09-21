import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import { List } from 'antd';
import { FM } from 'locales';
import helper from 'helper';
import { PaperInfo } from './index';
import styles from './PubsComponent.less';

const PaperInfluentialCite = props => {
  const { dispatch, id } = props;
  const [citelist, setCitelist] = useState();

  useEffect(() => {
    dispatch({
      type: 'pub/getCitePubsTopN',
      payload: { id, offset: 0, size: 5 }
    })
      .then(data => { // 这里要限制一下num_citation大于等于10的才显示
        const items = data && data.data || [];
        if (items) {
          const arr = items.filter(n => n.num_citation >= 10);
          setCitelist(arr);
        }
      })
  }, [id]);

  // const seeMore = () => {
  //   const point = document.getElementById('citepapers');
  //   helper.routeTo(props, { tab: 'cite' });
  //   point && point.scrollIntoView({
  //     behavior: "instant", block: "start"
  //   });
  // }

  if (!citelist || !citelist.length) {
    return null
  }

  return (
    <div className={styles.pubsList}>
      <p className={styles.topCite}>
        <FM id="aminer.paper.topciteby" defaultMessage="Influential Cited By" />
      </p>
      {citelist && (
        <section className={styles.listContent}>
          <List dataSource={citelist} size="small" className={styles.list}
            renderItem={(item, index) => (
              <List.Item key={item.id || index}>
                <PaperInfo
                  data={item} index={index + 1}
                  showFields={['names', 'title', 'venue', 'date', 'exponent']}
                />
              </List.Item>
            )}
          />
          {/* <div className={styles.seeMore}>
            <a onClick={seeMore} className={styles.point}>
              <FM id="aminer.paper.seemoreCite" defaultMessage="See More Citation" />
            </a>
          </div> */}
        </section>
      )}
    </div>
  )
}

export default component(connect())(PaperInfluentialCite)
