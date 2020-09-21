import React from 'react';
import { FM } from 'locales';
import { Link } from 'acore';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import styles from './BannerWithICLR.less';

const linkIcon = 'https://fileserver.aminer.cn/sys/aminer/homepage/arrow.png';

const infos = [
  // {
  //   id: 'Topic',
  //   icon: 'https://fileserver.aminer.cn/sys/aminer/homepage/ICLR2020Icon.png',
  //   title: 'aminer.home.banner.title.topic',
  //   link: '/topic?from=home',
  //   rightBgImg: 'https://fileserver.aminer.cn/sys/aminer/homepage/iclrRightIcon.png',
  //   rightBgImgClass: styles.iclrIconImg,
  //   // hot: 'https://fileserver.aminer.cn/sys/aminer/homepage/orangeHot.png',
  //   withLinkIcon: true,
  //   rightZone: [
  //     {
  //       id: 'aminer.home.banner.info.topic.Topic_Model',
  //       title: 'aminer.home.banner.info.topic.Topic_Model',
  //       link: '/search/pub?q=Topic%20Model',
  //       withLinkIcon: true,
  //       formalLink: true,
  //     },
  //     {
  //       id: 'aminer.home.banner.info.topic.Causal_Reasoning',
  //       title: 'aminer.home.banner.info.topic.Causal_Reasoning',
  //       link: '/search/pub?q=Causal%20Reasoning',
  //       withLinkIcon: true,
  //       formalLink: true,
  //     },
  //     {
  //       id: 'aminer.home.banner.info.topic.Question_Answering',
  //       title: 'aminer.home.banner.info.topic.Question_Answering',
  //       link: '/search/pub?q=Question%20Answering',
  //       withLinkIcon: true,
  //       formalLink: true,
  //     }
  //   ]
  // },
  {
    id: 'Conf',
    icon: 'https://fileserver.aminer.cn/sys/aminer/homepage/ICLR2020Icon.png',
    title: `${sysconfig.Cur_Conf_Name}`,
    link: `/conf/${sysconfig.Cur_Conf_Link}`,
    rightBgImg: 'https://fileserver.aminer.cn/sys/aminer/homepage/iclrRightIcon.png',
    rightBgImgClass: styles.iclrIconImg,
    // hot: 'https://fileserver.aminer.cn/sys/aminer/homepage/orangeHot.png',
    withLinkIcon: true,
    rightZone: [
      {
        id: `${sysconfig.Cur_Conf_Link}`,
        title: 'aminer.home.banner.info.conf.desc',
        link: `/conf/${sysconfig.Cur_Conf_Link}`,
        withLinkIcon: false,
        formalLink: true,
      },
    ],
  },
  {
    id: 'COVID-19',
    icon: 'https://fileserver.aminer.cn/sys/aminer/homepage/icon.png',
    key: 'aminer.home.banner.title',
    link: '//covid-19.aminer.cn/',
    linkWithLang: true,
    rightBgImg: 'https://fileserver.aminer.cn/sys/aminer/homepage/bannerCovidIcon.png',
    rightBgImgClass: styles.covidIconImg,
    withLinkIcon: true,
    rightZone: [
      {
        id: 'aminer.home.banner.info.title1',
        title: 'aminer.home.banner.info.title1',
        link: '//aminer.cn/data-covid19/',
        linkWithLang: true,
        withLinkIcon: true,
        formalLink: true,
      },
      {
        id: 'aminer.home.banner.info.title2',
        title: 'aminer.home.banner.info.title2',
        link: '//covid-dashboard.aminer.cn',
        linkWithLang: true,
        withLinkIcon: true,
        formalLink: true,
      },
      {
        id: 'aminer.home.banner.info.title3',
        title: 'aminer.home.banner.info.title3',
        link: '//covid-19.aminer.cn/kg',
        linkWithLang: true,
        withLinkIcon: true,
        formalLink: true,
      },
    ],
  },
];

const BannerWithICLR = props => {
  const { lang } = props;

  const buildLinkWithLang = (link, withLang) => {
    if (withLang) return `${link}?lang=${lang}`;
    return link;
  };

  return (
    <div className={styles.bannerWithICLR}>
      {infos.map(info => {
        const title = info.key ? <FM id={info.key} /> : info.title;
        return (
          <div className={styles.bannerRow} key={info.id}>
            <div className={styles.left}>
              <Link
                to={buildLinkWithLang(info.link, info.linkWithLang)}
                target="_blank"
                className={styles.linkWrap}
              >
                <img className={styles.titleIcon} src={info.icon} alt={info.title} />

                {title}

                {info.hot && <img className={styles.hotIcon} src={info.hot} alt="is hot!" />}
                {info.withLinkIcon && (
                  <img
                    src={linkIcon}
                    className={classnames(styles.linkIcon, info.hot && styles.leaveHot)}
                  />
                )}
              </Link>
            </div>
            <div className={styles.right}>
              {info.rightZone.map(rightItem => {
                if (rightItem.link) {
                  return (
                    <div className={styles.rightItem} key={rightItem.id}>
                      <Link
                        className={classnames(
                          styles.rightLink,
                          rightItem.formalLink && styles.formalLink,
                        )}
                        to={buildLinkWithLang(rightItem.link, rightItem.linkWithLang)}
                        target="_blank"
                      >
                        <FM id={rightItem.title} values={{ conf_name: title }} />
                        {rightItem.withLinkIcon && (
                          <img src={linkIcon} className={styles.linkIcon} />
                        )}
                      </Link>
                    </div>
                  );
                }
                return (
                  <div className={styles.rightItem}>
                    <div className={styles.rightTitle}>
                      <FM id={rightItem.title} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannerWithICLR;
