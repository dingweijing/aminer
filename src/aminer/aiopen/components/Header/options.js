import React from 'react'
import { FM, formatMessage } from 'locales';

const index = {
  headIcon: 'https://static.aminer.cn/misc/aiopen/img/logo2_white.png',
  up_title: 'AI OPEN INDEX',
  // title: '人工智能全球最具影响力学者榜',
  DescComponent: () => (
    <FM
      id="aiopen.header.passage"
      tagName="p"
      values={{
        ai2000: (<a href="https://www.aminer.cn/ai2000?from=aiopen" target="_blank"><FM id="aiopen.header.ai2000" /></a>),
        womeninai: (<a href="https://www.aminer.cn/women-in-ai?from=aiopen" target="_blank"><FM id="aiopen.header.womeninai" /></a>),
        iclr: (<a href="https://www.aminer.cn/conf/iclr2020?from=aiopen" target="_blank"><FM id="aiopen.header.iclr" /></a>),
        cvpr: (<a href="https://www.aminer.cn/conf/cvpr2020/?from=aiopen" target="_blank"><FM id="aiopen.header.cvpr" /></a>),
      }}
    />

  ),
  mobileDesc: `AIOpenIndex是由清华AMiner团队发起的全球人工智能开放平台，是一个以数据为基础构建的全球学术知识图谱，也是一个融合人工智能先进技术的开放平台，
  涵盖学界、业界和研究界。`,
  mobileDesc_EN: 'The AI Open Index tracks and reports the state of artificial intelligence (AI), including its scientific research, industry development, national policies, and societal impact. ',
  /*  desc:
     `AIOpenIndex是由清华AMiner团队发起的全球人工智能开放平台，是一个以数据为基础构建的全球学术知识图谱，也是一个融合人工智能先进技术的开放平台，
    涵盖学界、业界和研究界。曾经推出“AI2000人工智能全球最具影响力的2000位学者”
    “人工智能全球女性榜单”“ICLR2013-2020高引榜单”，被世界几百家知名媒体跟踪报道。历次榜单发布都受到世界著名大学和研究机构的官方认可。`,
   desc_en: 'The AI Open Index tracks and reports the state of artificial intelligence (AI), including its scientific research, industry development, national policies, and societal impact. The Index is derived solely from the publicly-accessible datasets, such as academic publications, patents, and government reports and documents. In the year 2020, it presents the AI 2000 Most Influential Scholar Annual List, Women in AI, and Top AI Conference Profiles (e.g. ICLR, CVPR, etc.), which have been covered by hundreds of media outlets globally and recognized by world-renowned universities and organizations.', */
  bgImg: 'https://static.aminer.cn/misc/aiopen/img/bannerEarth.jpg',
  bg_height: 400,
}

const open = {
  headIcon: 'https://static.aminer.cn/misc/aiopen/img/logo_white.png',
  title: 'AI 2000人工智能全球影响力学者',
  desc: 'AI 2000 人工智能全球最具影响力学者榜单（以下称为 AI 2000）旨在未来10年通过AMiner学术数据在全球范围内遴选2000位人工智能学科最有影响力、最具活力的顶级学者。AMiner.cn 为本榜单提供数据支持。AMiner.cn 由清华大学',
  bgImg: 'https://static.aminer.cn/misc/aiopen/img/banner.jpg',
  bg_height: 316,
}

const company = {
  headIcon: 'https://static.aminer.cn/misc/aiopen/img/logo2_white.png',
  title: '中国人工智能产业格局',
  desc: '这是一个以数据为驱动、用算法生成、动态更新的中国人工智能产业格局导航，聚焦人工智能技术在商业实践中的运用。我们坚信人工智能在未来必将重新定义世界经济。为此，专门打造一个人工智能开放平台，旨在寻找那些具有商业潜力的技术型创新企业、将技术成熟应用到产业巨头企业，并将它们呈现给大众。我们真诚欢迎所有热爱 AI 的朋友们参与，一起携手推动行业的发展。',
  mobileDesc: '这是一个以数据为驱动、用算法生成、动态更新的中国人工智能产业格局导航，聚焦AI技术在商业实践中的运用。',
  bgImg: 'https://static.aminer.cn/misc/aiopen/img/bannerEarth.jpg',
  bg_height: 467,
  hideLangIndicator: true,
  isIndex: false,
  menuOpts: [
    { title: '人工智能全球女性榜单', id: '2', href: 'https://www.aminer.cn/women-in-ai' },
    { title: 'AI 2000人工智能全球最具影响力学者', id: '3', href: 'https://www.aminer.cn/ai2000' },
  ]
}

const companyDetail = {
  headIcon: 'https://static.aminer.cn/misc/aiopen/img/logo2_white.png',
  hideLangIndicator: true,
  bg_height: '73px',
}

const cityrank = {
  headIcon: 'https://static.aminer.cn/misc/aiopen/img/logo2_white.png',
  hideLangIndicator: true,
}

export {
  index, open, company, companyDetail, cityrank
}
