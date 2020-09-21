import React, { useEffect, useMemo } from 'react';
import { connect, Link, component, } from 'acore';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import PersonPosition from './PersonPosition';
import styles from './Menu.less';

const version = 'v2';
const bannerPath = `${consts.ResourcePath}/sys/aminer/banner/${version}`;

const menus = [
  {
    className: 'ranks',
    title: {
      id: 'aminer.home.nav.academicrank',
      defaultMessage: 'Academic Rankings',
      href: '/ranks/home',
    },
    headerComponent: PersonPosition,
    searchIcon: 'ranking',
    list: [
      {
        titleID: 'ai2000.female.title',
        ldefault: 'Women in AI',
        href: '/women-in-ai',
        icon: 'Wo',
        color: 'rgba(187, 199, 173, 0.6)',
      },
      {
        titleID: 'aminer.home.rankings.conference_rank',
        ldefault: 'Conference Rank',
        href: '/ranks/conf',
        icon: 'Co',
        color: 'rgba(199, 189, 161, 0.6)',
      },
      {
        titleID: 'aminer.home.rankings.organization_rank',
        ldefault: 'Organization Rank',
        href: '/ranks/org',
        icon: 'Or',
        color: 'rgba(152, 190, 199, 0.6)',
      },
      {
        titleID: 'aminer.home.rankings.rank_main',
        ldefault: 'Researcher Rank_main',
        href: '/ranks/experts',
        icon: 'Re',
        color: 'rgba(173, 187, 220, 0.6)',
      },
      {
        titleID: 'aminer.home.rankings.best',
        ldefault: 'Best Papers vs Top Cited Papers',
        href: '/bestpaper',
        icon: 'Be',
        color: 'rgba(167, 193, 191, 0.6)',
      },
    ],
  },
  {
    className: 'experts',
    title: {
      id: 'aminer.home.nav.experts',
      defaultMessage: 'Experts',
      href: '//gct.aminer.cn',
    },
    headerComponent: PersonPosition,
    searchPersonTo: 'https://star.aminer.cn/forecast',
    searchIcon: 'mi',
    searchPlaceholder: {
      id: 'aminer.home.search.placeholder',
      defaultMessage: 'Scholars Predict',
    },
    list: [
      {
        titleID: 'aminer.home.gct.one',
        ldefault: 'Tsinghua university',
        href: 'https://gct.aminer.cn/eb/series?name=%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6',
        // type: 'new',
      },
      {
        titleID: 'aminer.home.gct.two',
        ldefault: 'Harbin University of Technology',
        href:
          'https://gct.aminer.cn/eb/series?name=%E5%93%88%E5%B0%94%E6%BB%A8%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6',
        // type: 'hot',
      },
      {
        titleID: 'aminer.home.gct.three',
        ldefault: 'CCF Recommendation Meetings (Class A)',
        href:
          'https://gct.aminer.cn/eb/series?name=CCF%E6%8E%A8%E8%8D%90%E4%BC%9A%E8%AE%AE[A%E7%B1%BB]',
      },
      {
        titleID: 'aminer.home.gct.four',
        ldefault: 'A.M. Turing Award',
        href: 'https://gct.aminer.cn/eb/gallery/detail/eb/58997b589ed5db58de40a152',
      },
      // {
      //   titleID: 'aminer.home.gct.seventh',
      //   ldefault: 'ICML 2019 Chinese Talents',
      //   href: '//gct.aminer.cn/eb/gallery/detail/eb/5d0860e3530c70ebab37f637'
      // },
      // {
      //   titleID: 'aminer.home.gct.eighth',
      //   ldefault: 'SIGIR 2019 Chinese PhD Talents',
      //   href: '//gct.aminer.cn/eb/gallery/detail/eb/5d4527b3530c70eb4e2a79b9'
      // },
      // {
      //   titleID: 'aminer.home.gct.ninth',
      //   ldefault: 'Chinese Academy of Engineering Talents',
      //   href: '//gct.aminer.cn/eb/gallery/detail/eb/55ebd8b945cea17ff0c53d5a'
      // },
    ],
    areaImage: [
      {
        name: '陈润生',
        link: '/profile/560d166a45cedb33975a4f0e',
        image:
          'https://avatarcdn.aminer.cn/upload/avatar/1569/623/65/560d166a45cedb33975a4f0e_1.png',
      },
      {
        name: '程津培',
        link: '/profile/542a0eeedabfae8832d731e1',
        image:
          'https://avatarcdn.aminer.cn/upload/avatar/999/251/1119/542a0eeedabfae8832d731e1_0.png',
      },
      {
        name: '康乐',
        link: '/profile/5444ce9cdabfae87074e88e6',
        image:
          'https://avatarcdn.aminer.cn/upload/avatar/490/2023/12/5444ce9cdabfae87074e88e6_0.png',
      },
      {
        name: '钱煦',
        link: '/profile/54342e9cdabfaebba584c210',
        image:
          'https://avatarcdn.aminer.cn/upload/avatar/1001/76/2025/54342e9cdabfaebba584c210_0.png',
      },
      {
        name: '郑永飞',
        link: '/profile/542a460fdabfae646d547b55',
        image:
          'https://avatarcdn.aminer.cn/upload/avatar/1446/1791/2034/542a460fdabfae646d547b55_1.png',
      },
    ],
    imageFrom: {
      titleID: 'aminer.home.gct.five',
      titleDefault: 'Chinese Academy of Sciences Scholars',
      link: 'https://gct.aminer.cn/eb/gallery/detail/eb/55ebd8b945cea17ff0c53d5a',
    },
  },
  {
    className: 'thuaitr',
    title: {
      id: 'aminer.home.nav.thuaitr',
      defaultMessage: 'THU AI TR',
      href: '/research_report/articlelist',
    },
  },
  {
    className: 'insight',
    title: {
      id: 'aminer.home.nav.insight',
      defaultMessage: 'Insight',
      href: '//trend.aminer.cn/',
    },
    list: [
      {
        titleID: 'aminer.home.insight.tree',
        _id: '5db2ff0957b37126d6d42f60',
        href: 'https://www.aminer.cn/mrt/',
      },
      {
        titleID: 'aminer.home.insight.aih',
        href: 'https://www.aminer.cn/ai-history',
      },
      {
        titleID: 'aminer.home.insight.mlt',
        href: 'https://trend.aminer.cn/trend/5db1572457b37126d67435e3',
      },
      {
        titleID: 'aminer.home.nav.Trajectory',
        href:
          'https://map.aminer.cn/geo/touch_v2/trajectory?domain=55e6573845ce9da5c99535a9',
      },
      {
        titleID: 'aminer.home.insight.ra',
        href: 'https://analysis.aminer.cn/',
      },
    ],
    areaImage: [
      {
        link: '//www.aminer.cn/ai-history',
        image: `${bannerPath}/area4.png`,
      },
    ],
  },
  {
    className: 'opendata',
    title: {
      id: 'aminer.home.nav.opendata',
      defaultMessage: 'Open Data',
      href: '/data',
    },
    list: [
      // {
      //   title: '小脉学者星探',
      //   _id: 'predict',
      //   href: '//gct.aminer.cn/predict'
      // },
      // {
      //   title: '智源·AMiner同名消歧竞赛',
      //   _id: 'competition',
      //   href: '//www.biendata.com/competition/aminer2019'
      // }
      {
        titleID: 'aminer.menu.covid.title',
        descID: 'aminer.menu.covid.desc',
        _id: 'covid19',
        href: 'https://www.aminer.cn/data-covid19/',
      },
      {
        title: 'Open-Academic-Graph',
        desc: 'Studying the integration of multiple academic graphs',
        _id: 'academic',
        href: 'https://www.aminer.cn/data#Open-Academic-Graph',
      },
      {
        title: 'Name Disambiguation',
        desc: 'Created for studying author name disambiguation',
        _id: 'disambiguation',
        href: 'https://www.aminer.cn/data#Name-Disambiguation',
      },
      {
        title: 'Science Knowledge Graph',
        desc: 'A knowledge graph consisting of concepts, experts, and papers in Computer Science',
        _id: 'science_knowledge',
        href: 'https://www.aminer.cn/data#Science-Knowledge-Graph',
      },
      // {
      //   title: 'Knowledge Graph for AI',
      //   // desc: 'A knowledge graph consisting of concepts, experts, and papers in Computer Science',
      //   _id: 'knowledge_graph-for-AI',
      //   href: '/data#Knowledge-Graph-for-AI',
      // },
      {
        title: 'AMiner Knowledge Graph',
        desc: 'A structured entity network extracted from AMiner',
        _id: 'aMiner_knowledge_graph',
        href: 'https://www.aminer.cn/data#AMiner-Knowledge-Graph',
      },
      // {
      //   title: 'Top 10000 Scholars\' Trajectories',
      //   desc: 'Trajectories of 9992 experts with the greatest h-index in AMiner science 1978',
      //   _id: 'top10000',
      //   href: '/data#Top-10000-Scholars-Trajectories'
      // },
    ],
  },
  {
    className: 'required',
    title: {
      id: 'aminer.home.nav.required',
      defaultMessage: 'Required',
      href: `/conf/${sysconfig.Cur_Conf_Link}`,
    },
    list: [
      {
        title: `${sysconfig.Cur_Conf_Name}`,
        href: `/conf/${sysconfig.Cur_Conf_Link}`,
      },
      {
        // titleID: 'aminer.home.required.Network',
        href: '/topic/5ebb579b92c7f9be21c07ffb',
        title: 'Cloud Robotics',
        title_zh: '云机器人(Cloud Robotics)',
      },
      {
        // titleID: 'aminer.home.required.computation',
        href: '/topic/5f1505e292c7f9be21346ed2',
        title: 'KDD高引论文',
        title_zh: 'KDD高引论文',
      },
      {
        // titleID: 'aminer.home.required.robotics',
        href: '/topic/5e7ef61ac1b7e55a5aea64c6',
        title: 'Semi-supervised Learning',
        title_zh: '半监督学习(Semi-supervised Learning)',
      },
      {
        // titleID: 'aminer.home.required.mining',
        href: '/topic/5f0d536992c7f9be2172470d',
        title: 'Tencent AI Lab',
        title_zh: '腾讯AI Lab(Tencent AI Lab)',
      },
      {
        // titleID: 'aminer.home.required.algorithm',
        href: '/topic/5ef01b4292c7f9be21b7e50a',
        title: 'Tsinghua University-KEG Lab',
        title_zh: '清华大学-知识工程实验室(KEG)',
      },
      {
        // titleID: 'aminer.home.required.reasoning',
        href: '/topic/5f1505ee92c7f9be2134808c',
        title: 'ECCV高引论文',
        title_zh: 'ECCV高引论文',
      },
      {
        // titleID: 'aminer.home.required.intelligence',
        href: '/topic/5eb64b8192c7f9be21d5ea76',
        title: 'Quantum Computation',
        title_zh: '量子计算(Quantum Computation)',
      }
    ],
  },
];

const labs = [
  {
    iconfont: 'fa-file-code-o',
    titleID: 'aminer.home.labs.open_api',
    descID: 'aminer.home.labs.open_api.desc',
    ldefault: 'Aminer Open',
    descdefault: 'Open community for science big data and knowledge.',
    href: '//open.aminer.cn/',
    isNew: true,
  },
  {
    iconfont: 'fa-venus-mars',
    titleID: 'aminer.home.labs.gender_prediction',
    descID: 'aminer.home.labs.gender_prediction.desc',
    ldefault: 'Gender Prediction',
    descdefault: 'Predict gender with people name and affiliation/location.',
    href: '/gender',
  },
  {
    iconfont: 'fa-database',
    titleID: 'aminer.home.labs.open_data',
    descID: 'aminer.home.labs.open_data.desc',
    ldefault: 'Open Data',
    descdefault: 'Citation network, topic experts, disambiguated names, etc.',
    href: '/data',
  },
  {
    iconfont: 'fa-comments',
    titleID: 'aminer.home.labs.oppen_seminar',
    descID: 'aminer.home.labs.oppen_seminar.desc',
    ldefault: 'Open Seminar',
    descdefault: 'Upcoming academic seminars.',
    href: '/seminar',
  },
];

const rankings = [
  {
    titleID: 'aminer.home.rankings.rank_main',
    descID: 'aminer.home.rankings.rank_main.desc',
    ldefault: 'Researcher Rank_main',
    descdefault: 'Rank researchers by various metrics.',
    href: '/ranks/experts',
  },
  {
    titleID: 'aminer.home.rankings.organization_rank',
    descID: 'aminer.home.rankings.organization_rank.desc',
    ldefault: 'Organization Rank',
    descdefault: 'Rank organizations by different metrics.',
    href: '/ranks/org',
  },
  {
    titleID: 'aminer.home.rankings.conference_rank',
    descID: 'aminer.home.rankings.conference_rank.desc',
    ldefault: 'Conference Rank',
    descdefault: 'Rank conferences in Computer Science by Impact Factor.',
    href: '/ranks/conf',
  },
  {
    titleID: 'aminer.home.rankings.best',
    descID: 'aminer.home.rankings.best.desc',
    ldefault: 'Best Papers vs Top Cited Papers',
    descdefault: 'Best papers and top cited papers in Computer Science.',
    href: '/bestpaper',
  },
];

const isOutUrl = href => href.search(/^\/\//) !== -1 || href.startsWith('http');

const renderTitle = data => {
  const { title, title_zh, titleID, ldefault, type } = data;

  return (
    <>
      {(title || !titleID) && <span>{getLangLabel(title, title_zh)}</span>}
      {titleID && <FM id={titleID} defaultMessage={ldefault} />}
      {type === 'hot' && (
        <img
          className="marked"
          src={`${consts.ResourcePath}/sys/aminer/homepage/hot.png`}
          alt="hot"
        />
      )}
      {type === 'new' && (
        <img
          className="marked"
          src={`${consts.ResourcePath}/sys/aminer/homepage/news.png`}
          alt="news"
        />
      )}
    </>
  );
};

const Menu = props => {
  const { dispatch, dailyList } = props;
  menus[2].list = dailyList && dailyList.slice(0, 4);

  useEffect(() => {
    if (!dailyList) {
      dispatch({ type: 'report/getDailyNews', payload: { size: 4 } });
    }
  }, []);

  return (
    <section className={styles.homeMenu}>
      {menus &&
        menus.map(menuData => (
          <div className={classnames('menu', menuData.className)} key={menuData.title.id}>
            <div className="headLine">
              <h2>
                {isOutUrl(menuData.title.href) ? (
                  <a href={menuData.title.href} target="_blank" rel="noopener noreferrer">
                    <FM id={menuData.title.id} defaultMessage={menuData.title.defaultMessage} />
                  </a>
                ) : (
                    <Link to={menuData.title.href}>
                      <FM id={menuData.title.id} defaultMessage={menuData.title.defaultMessage} />
                    </Link>
                  )}
              </h2>
            </div>
            <div className="menu_content">
              {menuData && menuData.headerComponent && (
                <div className="menu_head">
                  <menuData.headerComponent
                    to={menuData.searchPersonTo}
                    icon={menuData.searchIcon}
                    placeholder={menuData.searchPlaceholder}
                  />
                </div>
              )}
              <ul className="menuList">
                {menuData.list &&
                  menuData.list.map((item, idx) => {
                    // const itemKey = item.titleID || item._id
                    const { type } = item;

                    const element = isOutUrl(item.href) ? (
                      <a
                        href={item.href}
                        className={classnames('title', { padding: !!type })}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {renderTitle(item)}
                      </a>
                    ) : (
                        <Link to={item.href} className="title">
                          {renderTitle(item)}
                        </Link>
                      );
                    let key = item.titleID || item._id;
                    key += `_${idx}`;
                    return (
                      // eslint-disable-next-line no-underscore-dangle
                      <li key={key} className="listItem">
                        <div className="itemContent">
                          <div className="contentLeft">
                            {item.icon && (
                              <span
                                className="itemIcon"
                                style={{ background: item.color || '#D8D8D8' }}
                              >
                                {item.icon}
                              </span>
                            )}
                            {element}
                            {(item.descID || item.desc) && (
                              <p className="desc">
                                {item.descID && (
                                  <FM id={item.descID} defaultMessage={item.descdefault} />
                                )}
                                {item.desc && !item.descID && <span>{item.desc}</span>}
                              </p>
                            )}
                          </div>
                          {item.image && (
                            <a
                              href={item.href}
                              rel="noopener noreferrer"
                              target="_blank"
                              className="itemImg"
                            >
                              <img src={item.image} alt="" />
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
              {menuData.areaImage && (
                <div className="menu_image">
                  {menuData.areaImage.map((item, index) => (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={`${item.id}_${index}`}>
                      <img src={item.image} alt="" />
                    </a>
                  ))}
                </div>
              )}
              {menuData.imageFrom && (
                <p className="image_from">
                  <FM
                    id={menuData.imageFrom.titleID}
                    values={{
                      roster: (
                        <a href={menuData.imageFrom.link} target="_blank" rel="noopener noreferrer">
                          {formatMessage({ id: 'aminer.home.gct.sciences_scholars' })}
                        </a>
                      ),
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        ))}
    </section>
  );
};

export default component(
  connect(({ report }) => ({
    dailyList: report.dailyList,
  })),
)(Menu);
