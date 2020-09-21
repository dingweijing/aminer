/* eslint-disable no-restricted-syntax */

// import { getProfileUrl } from 'utils/profile-utils';
// import { sysconfig } from 'systems';

const SuggestSearchKg = ['COVID-19', 'Virology', 'Clustering', 'Automatic Machine Learning'];
const SuggestSearchKg0 = ['Ensemble learning', 'Information Extraction', 'Machine Translation'];

const spliter = {
  en: ', ',
  zh: ', ',
};

const sugg_line2 = [
  {
    name: 'Topics',
    href: 'https://www.aminer.cn/topic',
    value: [
      { name: 'AI in healthcare', id: '5eb61ce292c7f9be2179a099' },
      { name: 'Knowledge Graph', id: '5e7ef61ac1b7e55a5aea64d1' },
      { name: 'Computer Vision', id: '5e7d9a78ea0348b7e22edd96' },
      { name: 'Adversarial Attacks', id: '5ebb578692c7f9be21c07307' },
    ],
  },
];

const profiles = [
  {
    id: '53f566f8dabfae63aff8048f',
    name: 'Masashi Sugiyama',
  },
  {
    id: '5440bcb8dabfae805a6ee350',
    name: 'Mihaela Van Der Schaar',
  },
  {
    id: '53f4694ddabfaeb1a7c989d2',
    name: 'Dale Schuurmans',
  },
  {
    id: '53f4c374dabfaedce565d560',
    name: 'Michal Valko',
  },
  {
    id: '53f48cfedabfaea7cd1d0d8e',
    name: 'Michael I. Jordan',
  },
];

const profiles_line = {
  label: {
    name: 'KDD 2020',
    href: '/conf/kdd2020/',
  },
  profiles: [
    {
      id: '53f42f36dabfaedce54dcd0c',
      name: 'Jiawei Han',
    },
    {
      id: '560590d745ce1e595e69ce3f',
      name: 'Hongxia Yang',
    },
    {
      id: '53f46a3edabfaee43ed05f08',
      name: 'Jie Tang',
    },
    {
      id: '542d413cdabfae11fc4517d5',
      name: 'Hui Xiong',
    },
    {
      id: '53f48ca0dabfaea7cd1cf7e0',
      name: 'Jieping Ye',
    },
    {
      id: '542a3df7dabfae646d542fab',
      name: 'Jiliang Tang',
    },
    {
      id: '53f48dd5dabfaea88977b59d',
      name: 'Thorsten Joachims',
    },
  ],
};

// for (const item of profiles_line) {
//   item.url = getProfileUrl(item.name, item.id);
// }
// for (const item of profiles.zh) {
//   item.url = getProfileUrl(item.name, item.id);
// }

const navs = [
  {
    id: 'aminer.user.rss',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_RSS.png',
    href: '/user/notification',
  },
  {
    id: 'aminer.home.nav.aiopen',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_AI Open Index.png',
    target: '_blank',
    href: 'https://www.aiopenindex.com/',
  },
  {
    id: 'aminer.home.header.nav.gct',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_GCT.png',
    target: '_blank',
    href: 'https://gct.aminer.cn/',
  },
  {
    id: 'aminer.home.header.nav.channel',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Channel.png',
    href: '/channel',
  },
  {
    id: 'aminer.home.nav.conf',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Conf.png',
    href: '/conf',
  },
  {
    id: 'aminer.home.header.nav.thu',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_THU.png',
    href: '/research_report/articlelist',
  },
];

const newarrival = [
  {
    key: 4,
    title_id: 'aminer.home.arrival.ai2000',
    desc: [{ id: 'aminer.home.arrival.ai2000.desc' }],
    // desc_id: 'aminer.home.arrival.ai2000.desc',
    // title: 'NeurIPS2019 conf-plus',
    // desc: '追踪会议信息，详解论文数据',
    link: '/ai2000',
    icon: 'icon-zy-',
    // icon_hover: 'icon--2'
  },
  {
    key: 1,
    title_id: 'aminer.topic.here',
    desc: [
      {
        id: 'aminer.topic.QuestionAnswering',
        link_params: {
          to: '/search/pub?q=Question%20Answering',
          rel: 'noopener noreferrer',
        },
      },
      {
        id: 'aminer.topic.BayesianNetwork',
        link_params: {
          to: '/search/pub?q=Bayesian%20Network',
          rel: 'noopener noreferrer',
        },
      },
    ],
    // desc_id: 'ai2000.female.desc',
    link: '/topic',
    icon: 'icon-AI-',
  },
  {
    key: 3,
    title_id: 'aminer.home.arrival.tree',
    desc: [{ id: 'aminer.home.arrival.tree.desc' }],
    // desc_id: 'aminer.home.arrival.tree.desc',
    // title: '溯源树(MRT)',
    // desc: '帮助学者研究论文演变过程的工具',
    link: '/mrt',
    icon: 'icon-su-',
    // icon_hover: 'icon---'
  },
  {
    key: 2,
    title_id: 'aminer.home.arrival.star',
    desc: [{ id: 'aminer.home.arrival.star.desc' }],
    // desc_id: 'aminer.home.arrival.star.desc',
    link: '//star.aminer.cn/',
    icon: 'icon-mai-1',
    target: true, // new window
    // icon_hover: 'icon--4'
  },
];

const ncp = [
  {
    key: 1,
    icon: 'icon-bd-',
    title: 'aminer.home.ncp.trend',
    link: '//2019-ncov.aminer.cn/data',
    target: true, // new window
  },
  {
    key: 2,
    icon: 'icon-bd-',
    title: 'aminer.home.ncp.expert',
    link: '//2019-ncov.aminer.cn',
    target: true, // new window
  },
  {
    key: 3,
    icon: 'icon-bd-',
    title: 'aminer.home.ncp.timeline',
    link: '/ncp-pubs',
    target: true, // new window
  },
  {
    key: 4,
    icon: 'icon-bd-',
    title: 'aminer.home.ncp.policies',
    link: '//zhengce.aminer.cn/',
    target: true, // new window
  },
  {
    key: 5,
    icon: 'icon-bd-',
    title: 'aminer.home.ncp.knowledge',
    link: '//aminerofficials.github.io/',
    target: true, // new window
  },
];

const searchWords = [
  'Mars Exploration',
  'Recommendation System',
  'Graph Neural Network',
  'Reinforcement Learning',
  'Graph Database',
];

export {
  SuggestSearchKg,
  SuggestSearchKg0,
  spliter,
  profiles,
  profiles_line,
  navs,
  newarrival,
  ncp,
  sugg_line2,
  searchWords,
};
