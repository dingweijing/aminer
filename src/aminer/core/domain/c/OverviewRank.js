import React from 'react'
import { FM } from 'locales';

import { getProfileUrl } from 'utils/profile-utils';
import { page, connect, history, Link } from 'acore';
import { ExpertLink } from 'aminer/components/widgets';
import PersonLink from 'aminer/components/pops/person/PersonLink.tsx';
import styles from './OverviewRank.less'

const OverviewRank = (props) => {
  const { topAuthorRank, infocardHide, topConfRank, infocardShow, onClickAuthorMore, onClickConfMore } = props;

  return (
    <div className={styles.topRanks}>
      <div className={styles.topRank}>
        <div className={styles.rankTitle}>
          <FM id='aminer.channel.topAuthor' />
          <div className={styles.seeMore} onClick={onClickAuthorMore}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id='aminer.common.more' />
          </div>
        </div>
        <div className={styles.rankContent}>
          {topAuthorRank && !!topAuthorRank.length && topAuthorRank.map((author, index) => {
            const params = {
              // id: `sid_${author.id}`,
              // to: getProfileUrl(author.name, author.id),
              authorTarget: '_blank',
              author,
              position: { x: 60 },
              withEnName: true
              // onClick: onClickAuthor,
            };
            return (
              <div className={styles.topItem} key={`${author.id}${index}`}>
                <ExpertLink author={author}>
                  {index + 1}.{" "}
                  <PersonLink {...params} className={styles.authorLink} />
                </ExpertLink>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.topRank}>
        <div className={styles.rankTitle}>
          <FM id='aminer.channel.topVenues' />
          <div className={styles.seeMore} onClick={onClickConfMore}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id='aminer.common.more' />
          </div>
        </div>
        <div className={styles.rankContent}>
          {topConfRank && !!topConfRank.length && topConfRank.map((conf, index) => {
            let confContent = `${index + 1}. ${conf.name}`
            return (
              <div className={styles.topItem} key={`${conf.id}${index}`} title={confContent}>{confContent}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OverviewRank
