import React, { useMemo } from 'react'
import { FM } from 'locales';
import { classnames } from 'utils';
import styles from './VenuesRank.less'

const VenuesRank = (props) => {
  const { topConfRank, onClickOverview } = props;

  const titleRightZone = [
    ({index}) => (
      <div key={6} className={styles.personRanking}>
        {index <= 2 && (
          <div className={styles.top}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={`#icon-ai10_rank_${index + 1}`} />
            </svg>
          </div>
        )}
        {index > 2 && index <= 9 && (
          <div className={classnames(styles.no, styles.top)}>
            <span>{index + 1}</span>
          </div>
        )}
        {index > 9 && (
          <div className={styles.no}>
            <span>{index + 1}</span>
          </div>
        )}
      </div>
    )
  ];

  const confs = useMemo(() => {
    if (!topConfRank) {
      return [];
    }
    return topConfRank.map(item => ({ title: item.name }));
    
  }, [topConfRank])

  return (
    <div className={styles.topRanks}>
      <div className={styles.topRank}>
        <div className={styles.rankTitle}>
          <FM id='aminer.channel.topVenues' />
          <div className={styles.seeMore} onClick={onClickOverview}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id='aminer.channel.tab.overview' />
          </div>
        </div>
        <div className={styles.rankContent}>
          {topConfRank && !!topConfRank.length && topConfRank.map((conf, index) => {
            return (
              <div className={styles.topItem} key={`${conf.id}${index}`} title={`${index+1}. ${conf.name}`}>
                <div className={styles.venueName}>{conf.name}</div>
                <div key={6} className={styles.personRanking}>
                  {index <= 2 && (
                    <div className={styles.top}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={`#icon-ai10_rank_${index + 1}`} />
                      </svg>
                    </div>
                  )}
                  {index > 2 && index <= 9 && (
                    <div className={classnames(styles.no, styles.top)}>
                      <span>{index + 1}</span>
                    </div>
                  )}
                  {index > 9 && (
                    <div className={styles.no}>
                      <span>{index + 1}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VenuesRank
