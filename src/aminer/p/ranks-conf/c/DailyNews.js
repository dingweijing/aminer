import React, { useEffect } from 'react';
import { component, connect, Link } from 'acore';
import consts from 'consts';
import classnames from 'classnames';
import { FM } from 'locales';
import styles from './DailyNews.less';

const DailyNews = props => {
  const { dailyList, dispatch } = props;

  useEffect(() => {
    // if (!dailyList) {
    //   dispatch({ type: 'rank/getDailyNews', payload: { size: 3 } })
    // }
  }, [])

  return (
    <div className={styles.dailyNews}>
      <span className="daily_title">
        <Link to="/research_report/articlelist" target="_blank">
          <FM id="aminer.home.menu.daily" defaultMessage="Daily News" />
        </Link>
      </span>
      <ul className="daily_list">
        {dailyList && dailyList.length > 0 && dailyList.map((item, index) => {
          const { _id, id, title, type } = item;
          return (
            <li className={classnames('list_item', { [styles.padding]: index < 2 || type })} key={id || _id}>
              <Link to={`/research_report/${id || _id}?download=false`} className={styles.title} title={title} target="_blank">
                <span>{title}</span>
              </Link>
              {(type === 'hot' || index === 0) && (
                <img src={`${consts.ResourcePath}/sys/aminer/homepage/hot.png`} alt="hot" />
              )}
              {(type === 'new' || index === 1) && (
                <img src={`${consts.ResourcePath}/sys/aminer/homepage/news.png`} alt="news" />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default component()(DailyNews);
