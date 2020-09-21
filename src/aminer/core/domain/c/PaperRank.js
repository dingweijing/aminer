import React from 'react'
import { FM } from 'locales';
import { classnames } from 'utils';
import { page, connect, history, Link } from 'acore';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import styles from './PaperRank.less';

const PaperRank = (props) => {
  const { onClickOverview, topPaper } = props;

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

  const keywordsZone = [
    ({ paper }) => {
      const { keywords } = paper;
      return (
        <div className={styles.tags}>
          {keywords && keywords.map((tag, index) => {
            if (!tag) return null;
            return (
              <div className={styles.tag}>{tag}</div>
            )
          })}
        </div>
      )
    }
  ]

  return (
    <div className={styles.topRanks}>
      <div className={styles.topRank}>
        <div className={styles.rankTitle}>
          <FM id='aminer.channel.topPaper' />
          <div className={styles.seeMore} onClick={onClickOverview}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id='aminer.channel.tab.overview' />
          </div>
        </div>
        <div className={styles.rankContent}>
          <PublicationList
            id="aminerPaperList"
            className={styles.paperList}
            papers={topPaper || []}
            isShowPdfIcon={false}
            contentRightZone={[]}
            titleRightZone={[]}
            showInfoContent={[]}
            venueZone={[]}
            titleRightZone={titleRightZone}
            keywordsZone={[]}
          />
        </div>
      </div>
    </div>
  )
}

export default PaperRank
