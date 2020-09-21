import React, { useMemo } from 'react'
import { FM } from 'locales';
import { getProfileUrl } from 'utils/profile-utils';
import { page, connect, history, Link } from 'acore';
import PersonLink from 'aminer/components/pops/person/PersonLink.tsx';
import PersonList from 'aminer/components/expert/PersonList.tsx';
import { PersonItem } from 'aminer/p/user/components';
import { classnames } from 'utils';
import styles from './AuthorRank.less';

const AuthorRank = (props) => {
  const { topAuthorRank, infocardHide, infocardShow, onClickOverview } = props;

  const contentRightZone = [
    ({person}) => {
      const order = person.order;
      return (
        <div key={6} className={styles.personRanking}>
          {order <= 2 && (
            <div className={styles.top}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={`#icon-ai10_rank_${order}`} />
              </svg>
            </div>
          )}
          {order > 2 && order <= 9 && (
            <div className={classnames(styles.no, styles.top)}>
              <span>{order}</span>
            </div>
          )}
          {order > 9 && (
            <div className={styles.no}>
              <span>{order}</span>
            </div>
          )}
        </div>
      )
    }
  ];

  const authors = useMemo(() => {
    if (!topAuthorRank) return null;
    return topAuthorRank.map(author => {
      const { metric = {} } = author;
      author.indices = {
        hindex: metric['h-index'] || 0,
        citations: metric['citation_count'] || 0,
        pubs: metric['paper_count'] || 0,
      }
      author.tags = [];
      if (!author.profile) {
        author.profile = {};
      }
      return author;
    })
  }, [topAuthorRank])

  
  return (
    <div className={styles.topRanks}>
      <div className={styles.topRank}>
        <div className={styles.rankTitle}>
          <FM id='aminer.channel.topAuthor' />
          <div className={styles.seeMore} onClick={onClickOverview}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id='aminer.channel.tab.overview' />
          </div>
        </div>
        <div className={styles.rankContent}>
          <PersonList
            className='personItem'
            id="aminerPersonList"
            leftZone={[]}
            nameRightZone={contentRightZone}
            persons={authors}
            contentBottomZone={[]}
            showViews={false}
            target='_blank'
            mode='list'
        />
        </div>
      </div>
    </div>
  )
}

export default AuthorRank
