/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import { connect, component, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import consts from 'consts';
import { formatMessage, FM } from 'locales';
import { classnames } from 'utils';
import styles from './index.less';


const data: any = {
  title: {
    id: 'aminer.home.nav.academicrank',
    defaultMessage: 'Academic Rankings',
  },
  list: [
    {
      titleID: 'aminer.home.rankings.ai10',
      ldefault: 'AI-10 Most Influential Scholars',
      href: '/ai10'
    },
    // {
    //   titleID: 'aminer.home.rankings.csranking',
    //   ldefault: 'CSRanking',
    //   href: '//csrankings.aminer.cn/'
    // },
    {
      titleID: 'aminer.home.rankings.conference_rank',
      descID: 'aminer.home.rankings.conference_rank.desc',
      ldefault: 'Conference Rank',
      descdefault: 'Rank conferences in Computer Science by Impact Factor.',
      href: '/ranks/conf'
    },
    {
      titleID: 'aminer.home.rankings.organization_rank',
      descID: 'aminer.home.rankings.organization_rank.desc',
      ldefault: 'Organization Rank',
      descdefault: 'Rank organizations by different metrics.',
      href: '/ranks/org'
    },
    {
      titleID: 'aminer.home.rankings.rank_main',
      descID: 'aminer.home.rankings.rank_main.desc',
      ldefault: 'Researcher Rank_main',
      descdefault: 'Rank researchers by various metrics.',
      href: '/ranks/experts'
    },
    {
      titleID: 'aminer.home.rankings.best',
      descID: 'aminer.home.rankings.best.desc',
      ldefault: 'Best Papers vs Top Cited Papers',
      descdefault: 'Best papers and top cited papers in Computer Science.',
      href: '/bestpaper'
    }
  ]
}



const isOutUrl = href => href.search(/^\/\//) !== -1

const RankingHome: React.FC<{}> = () => {

  const renderTitle = sdata => {

    const { title, titleID, ldefault, type } = sdata

    return (
      <>
        {(title || !titleID) && (
          <span>{title}</span>
        )}
        {titleID && (
          <FM id={titleID} defaultMessage={ldefault} />
        )}
        {type === 'hot' && (
          <img src={`${consts.ResourcePath}/sys/aminer/homepage/hot.png`} alt="hot" />
        )}
        {type === 'new' && (
          <img src={`${consts.ResourcePath}/sys/aminer/homepage/news.png`} alt="news" />
        )}
      </>
    )
  }


  return (
    <Layout
      className="ranks"
      pageTitle={formatMessage({ id: 'aminer.home.nav.academicrank', defaultMessage: 'Academic Rankings' })}
    >
      <article className={styles.ranksHome}>
        <section>
          <div className="menu" key={data.title.id}>
            <div className="headline">
              <h1>
                <FM id={data.title.id} defaultMessage={data.title.defaultMessage} />
              </h1>
            </div>
            <div className="menu_content">
              <ul className="menuList">
                {data.list && data.list.map(item => {
                  // const itemKey = item.titleID || item._id
                  const { type } = item;

                  const element = isOutUrl(item.href) ? (
                    <a href={item.href}
                      className={classnames('title', { padding: !!type })}
                      target="_blank" rel="noopener noreferrer"
                    >
                      {renderTitle(item)}
                    </a>
                  ) : (
                      <Link to={item.href} className="title">
                        {renderTitle(item)}
                      </Link>
                    )

                  return (
                    <li key={item.titleID} className="listItem">
                      <div>
                        {element}
                        {(item.descID || item.desc) && (
                          <p className="desc">
                            {item.descID && (
                              <FM id={item.descID} defaultMessage={item.descdefault} />
                            )}
                            {item.desc && !item.descID && (
                              <span>{item.desc}</span>
                            )}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              {data.areaImage && (
                <a href={data.areaImage.link} target="_blank" rel="noopener noreferrer">
                  <img className="menu_image" src={data.areaImage.image} alt="" />
                </a>
              )}
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}

// export default component(connect(() => ({})))(RanksHome);
export default RankingHome;
