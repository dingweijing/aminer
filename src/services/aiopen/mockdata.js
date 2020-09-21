const rankList = {
  scholar: [
    /* {
      title: 'AI 2000 Most Influential Scholars',
      title_cn: 'AI 2000 人工智能最具影响力学者排行',
      // video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      thumbNail: 'https://static.aminer.cn/misc/aiopen/img/video_ai2000.png',
      desc: 'The AI 2000 Most Influential Scholar Annual List will name 2,000 of the world’s top-cited research scholars from the fields of artificial intelligence over the next ten years (2020–2029).',
      desc_cn: 'AI 2000 人工智能全球最具影响力学者榜单（以下称为 AI 2000）旨在未来10年通过AMiner学术数据在全球范围内遴选2000位人工智能学科最有影响力、最具活力的顶级学者。',
      link1: 'https://www.aminer.cn/ai2000',
      link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe56de92c7f9be219ac03f',
    }, */
    {
      title: 'Conference Rank',
      title_cn: '计算机学科会议（期刊）排名',
      // video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      // thumbNail: 'https://fileserver.aminer.cn/data/ai_company/rgzngj.jpg',
      thumbNail: require('./confrankbanner.jpg'),
      desc: `This white paper outlines the developments of artificial intelligence
          (AI) across various sectors in China. The mission is to provide an open forum for
          professionals, policymakers, and the general public to understand where China’s
          AI industry stands in 2020 and where the opportunities lie ahead. It covers the
          emerging AI innovations and inventions in China, generating a blueprint for how
          AI technologies have been shaping traditional industries, education,
          healthcare, finance, public services and, by extension, people’s
          everyday lives. The white paper is compiled by leveraging AI technologies to collect
          and analyze millions of open data from scientific publications, news articles, patents, startup websites, business reports, and more.`,
      desc_cn: '该榜单为了让大家更好地了解计算机科学领域会议和期刊的影响力，方便计算机科学领域的研究人员选择合适平台。榜单基于 2015 年 1 月到 2020 年 7 月五年多的数据，选取了六大指数，以中国计算机学会（以下简称 CCF）和清华大学发布的两种不同的计算机科学会议（期刊）榜单为基础，对会议（期刊）从学术影响力、产业影响力、TOP 论文质量等多维度多角度进行综合性评估。',
      link1: 'https://www.aminer.cn/ranks/conf',
      // link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe56de92c7f9be219ac03f',
    },
    {
      title: 'China\'s AI Industry White Paper 2020',
      title_cn: '中国人工智能产业格局',
      // video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      thumbNail: 'https://fileserver.aminer.cn/data/ai_company/rgzngj.jpg',
      desc: `This white paper outlines the developments of artificial intelligence
      (AI) across various sectors in China. The mission is to provide an open forum for
      professionals, policymakers, and the general public to understand where China’s
      AI industry stands in 2020 and where the opportunities lie ahead. It covers the
      emerging AI innovations and inventions in China, generating a blueprint for how
      AI technologies have been shaping traditional industries, education,
      healthcare, finance, public services and, by extension, people’s
      everyday lives. The white paper is compiled by leveraging AI technologies to collect
      and analyze millions of open data from scientific publications, news articles, patents, startup websites, business reports, and more.`,
      desc_cn: '这是一个以数据为驱动、用算法生成、动态更新的中国人工智能产业格局导航，聚焦AI技术在商业实践中的运用。我们坚信，AI在未来必将重新定义世界经济。为此，专门打造一个人工智能开放平台，旨在寻找那些具有商业潜力的技术型创新公司，并将它们呈现给大众。我们真诚得欢迎所有热爱AI的朋友们参与，一起携手推动行业的发展。',
      link1: '/industry',
      // link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe56de92c7f9be219ac03f',
    },
    {
      title: 'AI 2000 ',
      title_cn: 'AI 2000',
      // video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      thumbNail: 'https://fileserver.aminer.cn/data/aiopenindex/ai2000.png',
      desc: 'The AI 2000 Most Influential Scholar Annual List will name 2,000 of the world’s top-cited research scholars from the fields of artificial intelligence over the next ten years (2020–2029).',
      desc_cn: 'AI 2000 人工智能全球最具影响力学者榜单（以下称为 AI 2000）旨在未来10年通过AMiner学术数据在全球范围内遴选2000位人工智能学科最有影响力、最具活力的顶级学者。',
      link1: 'https://www.aminer.cn/ai2000',
      link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe56de92c7f9be219ac03f',
    },
    {
      title: 'Women in AI',
      title_cn: '人工智能全球女性榜单',
      video: '//player.bilibili.com/player.html?aid=412527254&bvid=BV1xV411f7ii&cid=172639470&page=1',
      thumbNail: 'https://static.aminer.cn/misc/aiopen/img/video_women_in_ai.jpg',
      desc: "The Women in AI List names the world's most influential female scholars from the fields of artificial intelligence.",
      desc_cn: '人工智能全球女性榜单（Women in AI）旨在通过AMiner学术数据在全球范围内遴选人工智能学科最有影响力、最具活力的女性顶级学者。',
      link1: 'https://www.aminer.cn/women-in-ai',
      link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe574d92c7f9be219b01fa',
    },
    {
      title: 'ICLR 2013-2020',
      title_cn: 'ICLR 2013-2020',
      // video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      thumbNail: 'https://static.aminer.cn/misc/aiopen/img/video_iclr2013.png',
      desc: 'ICLR started in 2013 and has held eight sessions by 2020. Tsinghua AMiner collected 1,892 papers over the eight years. According to the citations of the papers, the 50 Chinese with the highest ...',
      desc_cn: 'ICLR从2013年开始，到2020年一共举办了8届。清华AMiner收录了这8年中1892篇论文。根据论文的引用量，将其中被引量最高的50名华人和其中被引量最高的100篇论文筛选出来，供大家参考。',
      link1: 'https://www.aminer.cn/ai2000/ml/iclr2020',
      link2: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=5ebe57a992c7f9be219b3c98',
    },
    /*  {
       title: 'AI OPEN',
       video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
       thumbNail: 'https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020.jpg',
       desc: 'AI Open is a freely accessible platform to share actionable knowledge and forward-thinking perspectives on the theory of artificial intelligence and its applications. The journal welcomes research articles, review papers, perspectives, short communications and technical notes on all aspects of artificial intelligence and its applications.',
       desc_cn: 'AI Open是一个可免费访问的平台，旨在分享有关人工智能理论及其应用的可行知识和前瞻性观点。该期刊欢迎人工智能及其应用各个领域的研究性文章，综述性文章，前瞻性文章，研究简报和技术分享。',
       link1: 'http://www.keaipublishing.com/cn/journals/ai-open/',
     },
      */
    /*     {
          title: 'xggfdfdvd',
          video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
          thumbNail: 'https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020.jpg',
          desc: '产品定位OpenIndex致力于在全球人工智能领域挖掘有最具影响力，最具活力的顶级学者。目前已经做出来的有3种排行榜，分别是如下个子系统已有的宣传口碑和运营推广'
        },
        {
          video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
          title: 'asdsfdfd',
          thumbNail: 'https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020.jpg',
          desc: '产品定位OpenIndex致力于在全球人工智能领域挖掘有最具影响力，最具活力的顶级学者。目前已经做出来的有3种排行榜，分别是如下个子系统已有的宣传口碑和运营推广'
        }, */
  ],
  pubs: [
    {
      title: 'AI OPEN',
      video: '//player.bilibili.com/player.html?aid=497891051&bvid=BV1GK41157hq&cid=183861845&page=1',
      thumbNail: 'https://static.aminer.cn/misc/aiopen/img/video_aiopen.png',
      desc: 'AI Open is a freely accessible platform to share actionable knowledge and forward-thinking perspectives on the theory of artificial intelligence and its applications. The journal welcomes research articles, review papers, perspectives, short communications and technical notes on all aspects of artificial intelligence and its applications.',
      desc_cn: 'AI Open是一个可免费访问的平台，旨在分享有关人工智能理论及其应用的可行知识和前瞻性观点。该期刊欢迎人工智能及其应用各个领域的研究性文章，综述性文章，前瞻性文章，研究简报和技术分享。',
      link1: 'http://www.keaipublishing.com/cn/journals/ai-open/',
      btnText: 'aiopen.index.rankComponent.learn'
    },
    /* {
      title: 'AI 2000',
      thumbNail: 'https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020.jpg',
      video: '//player.bilibili.com/player.html?aid=753094211&bvid=BV14k4y1k7Tw&cid=188696292&page=1',
      desc: '产品定位OpenIndex致力于在全球人工智能领域挖掘有最具影响力，最具活力的顶级学者。目前已经做出来的有3种排行榜，分别是如下个子系统已有的宣传口碑和运营推广'
    }, */
  ],
  seminar: [
    {
      title: 'AI TIME',
      video: '//player.bilibili.com/player.html?aid=89818618&bvid=BV1h741177DW&cid=153404262&page=1',
      thumbNail: 'https://static.aminer.cn/misc/aiopen/img/video_aitime.png',
      desc: 'AI Time rallies researchers specializing in the field of artificial intelligence. The goal of AI Time is to explore the essence of AI foundations, theories, algorithms, and applications, with an emphasis to encourage debate on AI-related topics.',
      desc_cn: 'AI TIME是清华大学计算机系一群关注人工智能发展，并有思想情怀的青年学者创办的圈子。AI TIME旨在发扬科学思辨精神，邀请各界人士对人工智能理论、算法、场景、应用的本质问题进行探索，加强思想碰撞，打造成为北京乃至全国知识分享的聚集地。',
      link1: 'http://www.aitime.cn/',
      btnText: 'aiopen.index.rankComponent.learn'
    },
  ]
}


const d = {
  tree: [
    {
      id: 'ewew',
      name: 'Qiang Yang',
      name_zh: '杨强',
      citations: 100,
      pubs: 10
    },
    {
      id: 'weqwew',
      name: 'Qiang Yang',
      name_zh: '杨强1',
      citations: 100,
      pubs: 10
    },
    {
      id: 'dfasfs',
      name: 'Qiang Yang',
      name_zh: '杨强2',
      citations: 100,
      pubs: 10
    },
  ]
}

const d2 = {
  tree: [
    {
      id: 'dsds',
      name: 'Qiang Yang',
      name_zh: '杨强666',
      citations: 100,
      pubs: 10
    },
    {
      id: 'dsadsa',
      name: 'Qiang Yang',
      name_zh: '杨强777',
      citations: 100,
      pubs: 10
    },
    {
      id: 'hftg45',
      name: 'Qiang Yang',
      name_zh: '杨强888',
      citations: 100,
      pubs: 10
    },
  ]
}

const mixList = [
  {
    id: 'szdasdsd',
    name: '张三',
    avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1589970680&di=13dd82a76a5160a7591b8adc43be42c1&src=http://c.hiphotos.baidu.com/zhidao/pic/item/a6efce1b9d16fdfae5dcb60cb48f8c5495ee7b9b.jpg',
    job: '张三',
    place: '张三',
    country: '张三',
    tags: ['数据挖掘', '机器学习'],
    num: 1995,
    quoteNum: 34532,
    followed: true,
  },
  {
    id: '23423grf',
    name: 'peter',
    avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=204925906,280181222&fm=26&gp=0.jpg',
    job: '张三',
    place: '张三',
    country: '张三',
    tags: ['数据挖掘', '机器学习'],
    num: 1995,
    quoteNum: 34532,
    followed: true,
  },
  {
    id: 'fsdfdsfe4',
    name: '多想哈斯哦',
    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589980780548&di=de9ab06c21203f1afa6ea0545cd072b3&imgtype=0&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D135986222%2C1776760172%26fm%3D214%26gp%3D0.jpg',
    job: '张三',
    place: '张三',
    country: '张三',
    tags: ['数据挖掘', '机器学习'],
    num: 1995,
    quoteNum: 34532,
    followed: true,
  },
  {
    id: 'gdfth5r5',
    name: '俄服务范围',
    avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2628216388,2947813632&fm=26&gp=0.jpg',
    job: '张三',
    place: '张三',
    country: '张三',
    tags: ['数据挖掘', '机器学习'],
    num: 1995,
    quoteNum: 34532,
    followed: true,
  }
]

const dataArr = [
  {
    name: '阿富汗',
    value: 28397.812
  },
  {
    name: '安哥拉',
    value: 19549.124
  },
  {
    name: '阿尔巴尼亚',
    value: 3150.143
  },
  {
    name: '阿尔及利亚',
    value: 8441.537
  },
  {
    name: '阿根廷',
    value: 40374.224
  },
  {
    name: '亚美尼亚',
    value: 2963.496
  },
  {
    name: '澳大利亚',
    value: 268.065
  },
  {
    name: '奥地利',
    value: 22404.488
  },
  {
    name: '阿塞拜疆',
    value: 8401.924
  },
  {
    name: '布隆迪',
    value: 9094.718
  },
  {
    name: '比利时',
    value: 9232.753
  },
  {
    name: '贝宁',
    value: 10941.288
  },
  {
    name: '布基纳法索',
    value: 9509.798
  },
  {
    name: '孟加拉国',
    value: 15540.284
  },
  {
    name: '保加利亚',
    value: 151125.475
  },
  {
    name: '波斯尼亚和黑塞哥维那',
    value: 7389.175
  },
  {
    name: '白俄罗斯',
    value: 66402.316
  },
  {
    name: '伯利兹',
    value: 3845.929
  },
  {
    name: '百慕大群岛',
    value: 9491.07
  },
  {
    name: '玻利维亚',
    value: 308.595
  },
  {
    name: '巴西',
    value: 64.951
  },
  {
    name: '文莱',
    value: 716.939
  },
  {
    name: '不丹',
    value: 195210.154
  },
  {
    name: '博茨瓦纳',
    value: 27.223
  },
  {
    name: '柬埔寨',
    value: 716.939
  },
  {
    name: '喀麦隆',
    value: 1969.341
  },
  {
    name: '加拿大',
    value: 4349.921
  },
  {
    name: '中非共和国',
    value: 34126.24
  },
  {
    name: '乍得',
    value: 7830.534
  },
  {
    name: '智利',
    value: 17150.76
  },
  {
    name: '中国',
    value: 1359821.465
  },
  {
    name: '哥伦比亚',
    value: 60508.978
  },
  {
    name: '刚果',
    value: 17150.343
  },
  {
    name: '科特迪瓦',
    value: 17150.343
  },
  {
    name: '哥斯达黎加',
    value: 20624.343
  },
  {
    name: '克罗地亚',
    value: 62191.161
  },
  {
    name: '古巴',
    value: 3573.024
  },
  {
    name: '塞浦路斯',
    value: 46444.798
  },
  {
    name: '捷克共和国',
    value: 4669.685
  },
  {
    name: '民主刚果',
    value: 11281.768
  },
  {
    name: '丹麦',
    value: 1.468
  },
  {
    name: '吉布提',
    value: 1103.685
  },
  {
    name: '多米尼加共和国',
    value: 10553.701
  },
  {
    name: '东帝汶',
    value: 83017.404
  },
  {
    name: '厄瓜多尔',
    value: 834.036
  },
  {
    name: '埃及',
    value: 5550.959
  },
  {
    name: '萨尔瓦多',
    value: 10016.797
  },
  {
    name: '赤道几内亚',
    value: 37062.82
  },
  {
    name: '厄立特里亚',
    value: 15001.072
  },
  {
    name: '爱沙尼亚',
    value: 78075.705
  },
  {
    name: '埃塞俄比亚',
    value: 5741.159
  },
  {
    name: '福克兰群岛',
    value: 46182.038
  },
  {
    name: '斐济',
    value: 1298.533
  },
  {
    name: '芬兰',
    value: 87095.281
  },
  {
    name: '法国',
    value: 5367.693
  },
  {
    name: '法属圭亚那',
    value: 860.559
  },
  {
    name: '法属南部领地',
    value: 49.581
  },
  {
    name: '加蓬',
    value: 63230.866
  },
  {
    name: '冈比亚',
    value: 1556.222
  },
  {
    name: '德国',
    value: 62066.35
  },
  {
    name: '佐治亚州',
    value: 4388.674
  },
  {
    name: '加纳',
    value: 24262.901
  },
  {
    name: '希腊',
    value: 10876.033
  },
  {
    name: '格陵兰',
    value: 1680.64
  },
  {
    name: '危地马拉',
    value: 10876.033
  },
  {
    name: '几内亚',
    value: 696.167
  },
  {
    name: '几内亚比绍',
    value: 11109.999
  },
  {
    name: '圭亚那',
    value: 56.546
  },
  {
    name: '海地',
    value: 14341.576
  },
  {
    name: '赫德岛和麦克唐纳群岛',
    value: 4338.027
  },
  {
    name: '洪都拉斯',
    value: 231.169
  },
  {
    name: '匈牙利',
    value: 786.126
  },
  {
    name: '冰岛',
    value: 7621.204
  },
  {
    name: '印度',
    value: 4338.027
  },
  {
    name: '印度尼西亚',
    value: 9896.4
  },
  {
    name: '伊朗',
    value: 10014.633
  },
  {
    name: '伊拉克',
    value: 240676.485
  },
  {
    name: '爱尔兰',
    value: 15624.648
  },
  {
    name: '以色列',
    value: 4467.561
  },
  {
    name: '意大利',
    value: 240676.485
  },
  {
    name: '象牙海岸',
    value: 30962.38
  },
  {
    name: '牙买加',
    value: 318.042
  },
  {
    name: '日本',
    value: 7420.368
  },
  {
    name: '乔丹',
    value: 60508.978
  },
  {
    name: '克什米尔',
    value: 15921.485
  },
  {
    name: '哈萨克斯坦',
    value: 2741.485
  },
  {
    name: '肯尼亚',
    value: 6454.554
  },
  {
    name: '科索沃',
    value: 127352.833
  },
  {
    name: '科威特',
    value: 15921.127
  },
  {
    name: '吉尔吉斯斯坦',
    value: 40909.194
  },
  {
    name: '老挝',
    value: 5334.223
  },
  {
    name: '老挝人民民主共和国',
    value: 127352.833
  },
  {
    name: '拉脱维亚',
    value: 14364.931
  },
  {
    name: '黎巴嫩',
    value: 51452.352
  },
  {
    name: '莱索托',
    value: 97.743
  },
  {
    name: '利比里亚',
    value: 2991.58
  },
  {
    name: '利比亚',
    value: 6395.713
  },
  {
    name: '立陶宛',
    value: 4341.092
  },
  {
    name: '卢森堡',
    value: 3957.99
  },
  {
    name: '马达加斯加',
    value: 6040.612
  },
  {
    name: '马其顿',
    value: 20758.779
  },
  {
    name: '马拉维',
    value: 2008.921
  },
  {
    name: '马来西亚',
    value: 3068.457
  },
  {
    name: '马里',
    value: 507.885
  },
  {
    name: '毛里塔尼亚',
    value: 2090.519
  },
  {
    name: '墨西哥',
    value: 31642.36
  },
  {
    name: '摩尔多瓦',
    value: 103.619
  },
  {
    name: '蒙古',
    value: 21079.532
  },
  {
    name: '黑山',
    value: 117886.404
  },
  {
    name: '摩洛哥',
    value: 507.885
  },
  {
    name: '莫桑比克',
    value: 13985.961
  },
  {
    name: '缅甸',
    value: 51931.231
  },
  {
    name: '纳米比亚',
    value: 620.078
  },
  {
    name: '荷兰',
    value: 2712.738
  },
  {
    name: '新喀里多尼亚',
    value: 23967.265
  },
  {
    name: '新西兰',
    value: 3609.42
  },
  {
    name: '尼泊尔',
    value: 15013.694
  },
  {
    name: '尼加拉瓜',
    value: 28275.835
  },
  {
    name: '尼日尔',
    value: 2178.967
  },
  {
    name: '尼日利亚',
    value: 246.379
  },
  {
    name: '朝鲜',
    value: 15893.746
  },
  {
    name: '北塞浦路斯',
    value: 159707.78
  },
  {
    name: '挪威',
    value: 5822.209
  },
  {
    name: '阿曼',
    value: 16615.243
  },
  {
    name: '巴基斯坦',
    value: 4891.251
  },
  {
    name: '巴拿马',
    value: 26846.016
  },
  {
    name: '巴布亚新几内亚',
    value: 4368.136
  },
  {
    name: '巴拉圭',
    value: 2802.768
  },
  {
    name: '秘鲁',
    value: 173149.306
  },
  {
    name: '刚果共和国',
    value: 3678.128
  },
  {
    name: '菲律宾',
    value: 29262.83
  },
  {
    name: '波兰',
    value: 93444.322
  },
  {
    name: '葡萄牙',
    value: 6858.945
  },
  {
    name: '波多黎各',
    value: 38198.754
  },
  {
    name: '卡塔尔',
    value: 3709.671
  },
  {
    name: '塞尔维亚共和国',
    value: 1.468
  },
  {
    name: '罗马尼亚',
    value: 10589.792
  },
  {
    name: '俄罗斯',
    value: 6459.721
  },
  {
    name: '卢旺达',
    value: 1749.713
  },
  {
    name: '萨摩亚',
    value: 11749.713
  },
  {
    name: '沙特阿拉伯',
    value: 21861.476
  },
  {
    name: '塞内加尔',
    value: 21861.476
  },
  {
    name: '塞尔维亚',
    value: 18862.257
  },
  {
    name: '塞拉利昂',
    value: 10836.732
  },
  {
    name: '斯洛伐克',
    value: 514.648
  },
  {
    name: '斯洛文尼亚',
    value: 27258.387
  },
  {
    name: '所罗门群岛',
    value: 35652.002
  },
  {
    name: '索马里兰',
    value: 9940.929
  },
  {
    name: '索马里',
    value: 12950.564
  },
  {
    name: '南非',
    value: 526.447
  },
  {
    name: '南乔治亚和南桑德威奇群岛',
    value: 6218.195
  },
  {
    name: '韩国',
    value: 5751.976
  },
  {
    name: '南苏丹',
    value: 6218.195
  },
  {
    name: '西班牙',
    value: 9636.173
  },
  {
    name: '斯里兰卡',
    value: 9636.173
  },
  {
    name: '苏丹',
    value: 3573.024
  },
  {
    name: '苏里南',
    value: 524.96
  },
  {
    name: '斯威士兰',
    value: 5433.437
  },
  {
    name: '瑞典',
    value: 2054.232
  },
  {
    name: '瑞士',
    value: 9382.297
  },
  {
    name: '叙利亚',
    value: 1193.148
  },
  {
    name: '塔吉克斯坦',
    value: 7830.534
  },
  {
    name: '坦桑尼亚',
    value: 9876.785
  },
  {
    name: '泰国',
    value: 11720.781
  },
  {
    name: '巴哈马',
    value: 6306.014
  },
  {
    name: '多哥',
    value: 66402.316
  },
  {
    name: '特立尼达和多巴哥',
    value: 7627.326
  },
  {
    name: '突尼斯',
    value: 5041.995
  },
  {
    name: '土耳其',
    value: 10016.797
  },
  {
    name: '土库曼斯坦',
    value: 1328.095
  },
  {
    name: '乌干达',
    value: 10631.83
  },
  {
    name: '乌克兰',
    value: 72137.546
  },
  {
    name: '阿拉伯联合酋长国',
    value: 44973.33
  },
  {
    name: '大不列颠联合王国',
    value: 33987.213
  },
  {
    name: '坦桑尼亚联合共和国',
    value: 46050.22
  },
  {
    name: '美国',
    value: 3371.982
  },
  {
    name: '美利坚合众国',
    value: 312247.116
  },
  {
    name: '乌拉圭',
    value: 27769.27
  },
  {
    name: '乌兹别克斯坦',
    value: 236.299
  },
  {
    name: '瓦努阿图',
    value: 89047.397
  },
  {
    name: '委内瑞拉',
    value: 236.299
  },
  {
    name: '越南',
    value: 13.565
  },
  {
    name: '西岸',
    value: 22763.008
  },
  {
    name: '西撒哈拉',
    value: 51452.352
  },
  {
    name: '也门',
    value: 13216.985
  },
  {
    name: '赞比亚',
    value: 13076.978
  },
  {
    name: '津巴布韦',
    value: 11056.426
  }
]

export { rankList, d, d2, mixList, dataArr }
