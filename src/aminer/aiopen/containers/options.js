

const VIEW_ID = 'sid90k3ei0aijopokds32dfg'; // 统计访问量id
const COLLABORATIONS = {
  /* IMGS: ['http://zhipu.ai/skin/images/logo.jpg', 33, 20, 19, 18, 17,
   16, 15, 14, 13, 11, 4,
   9, 8, 7, 5, 3, 2], */
  IMGS: [33, 20, 17, 7, 14, 13,
    8, 9, 11, 3, /* 7, 17 */4, 5,
    2, 19, 18, 'http://zhipu.ai/skin/images/logo.jpg', 16, 15
  ],
  BASE_URL: 'http://zhipu.ai//uploads/linkPic/linkPic_'
}

const GEOS = [{ name: 'China', value: 'China', name_cn: '中国' },
{ name: 'United States', value: 'United States', name_cn: '美国' }, { name: 'EU', value: 'EU', name_cn: '欧盟' },
{ name: 'North America', value: 'North America', name_cn: '北美洲' },
{ name: 'South America', value: 'South America', name_cn: '南美洲' },
{ name: 'Asia', value: 'Asia', name_cn: '亚洲' }, { name: 'Oceania', value: 'Oceania', name_cn: '大洋洲' },
{ name: 'Europe', value: 'Europe', name_cn: '欧洲' }, { name: 'Africa', value: 'Africa', name_cn: '非洲' }]


const ListOpts = {
  SELECT_OPTIONS: [{
    key: 'author_order',
    title: 'Author Order',
    title_cn: '作者位次',
    options: [
      { name_cn: '第一作者', value: 'first', name: 'First' },
      { name_cn: '最后位作者', value: 'last', name: 'Last' },
      { name_cn: '其他', value: 'other', name: 'Other' }],
    defaultValue: [],
  },
  {
    key: 'geo',
    title: 'Country/Area',
    options: GEOS,
    title_cn: '国家/地区',
    defaultValue: [],
  },
  {
    key: 'genders',
    title: 'Gender',
    options: [{ name: 'male', value: 'male', name_cn: '男' }, { name: 'female', value: 'female', name_cn: '女' }],
    title_cn: '性别',
    defaultValue: ['male', 'female'],
  },
  {
    key: 'type',
    title: 'Rankings',
    options: [{ name: 'Country', value: 'Country', name_cn: '国家' }, { name: 'Organization', value: 'Org', name_cn: '机构' },
    { name: 'Person', value: 'Person', name_cn: '学者' }, { name: 'Publication', value: 'Pub', name_cn: '论文' }],
    title_cn: '类型',
    defaultValue: 'Person',
    single: true
  }]
}

const RankOpts = {
  opts: [
    { title: 'AI2000学者', href: '#', id: 'aiopen.rank.menu1' },
    { title: '数据统计', href: '#', id: 'aiopen.rank.menu2' },
  ],
  opts2: [
    { title: 'Country distribution', href: '#', id: 'aiopen.rank.map.country' },
    { title: 'Institutional distribution', href: '#', id: 'aiopen.rank.map.organization' },
    { title: 'Gender ratio', href: '#', id: 'aiopen.rank.map.gender' },
  ],
  SELECT_OPTIONS: [{
    key: 'domain',
    title: 'Domain',
    title_cn: '领域',
    options: [
      { name_cn: '经典AI', value: 'AAAI/IJCAI', name: 'AAAI/IJCAI' },
      { name_cn: '机器学习', value: 'Machine Learning', name: 'Machine Learning' },
      { name_cn: '机器人', value: 'robot', name: 'Robot' }],
    defaultValue: 'AAAI/IJCAI',
    single: true,
  },
  {
    key: 'Journal/Conference',
    title: 'Journal/Conference',
    options: [
    { name: 'China', value: 'China', name_cn: '中国' },
    { name: 'United States', value: 'United States', name_cn: '美国' },
    { name: 'EU', value: 'EU', name_cn: '欧盟' },
    { name: 'North America', value: 'North America', name_cn: '北美洲' },
    { name: 'South America', value: 'South America', name_cn: '南美洲' },
    { name: 'Asia', value: 'Asia', name_cn: '亚洲' }, { name: 'Oceania', value: 'Oceania', name_cn: '大洋洲' },
    { name: 'Europe', value: 'Europe', name_cn: '欧洲' }, { name: 'Africa', value: 'Africa', name_cn: '非洲' }
  ],
    title_cn: '期刊/会议',
    defaultValue: [],
  },
  {
    key: 'genders',
    title: 'Gender',
    options: [
      { name: 'all', value: 'all', name_cn: '全部' },
      { name: 'male', value: 'male', name_cn: '男' },
      { name: 'female', value: 'female', name_cn: '女' }
    ],
    title_cn: '性别',
    defaultValue: 'all',
    single: true,
  },
  {
    key: 'geo',
    title: 'Country/Area',
    options: [
    { name: 'All', value: 'All', name_cn: '全部' },
    { name: 'China', value: 'China', name_cn: '中国' },
    { name: 'United States', value: 'United States', name_cn: '美国' },
    { name: 'EU', value: 'EU', name_cn: '欧盟' },
    { name: 'Other', value: 'Other', name_cn: '其他' },
    // { name: 'North America', value: 'North America', name_cn: '北美洲' },
    // { name: 'South America', value: 'South America', name_cn: '南美洲' },
    // { name: 'Asia', value: 'Asia', name_cn: '亚洲' }, { name: 'Oceania', value: 'Oceania', name_cn: '大洋洲' },
    // { name: 'Europe', value: 'Europe', name_cn: '欧洲' }, { name: 'Africa', value: 'Africa', name_cn: '非洲' }
  ],
    title_cn: '国家/地区',
    defaultValue: 'All',
    single: true
  },
  {
    key: 'author_order',
    title: 'Author Order',
    title_cn: '作者位次',
    options: [
      { name_cn: '全部', value: 'all', name: 'All' },
      { name_cn: '第一作者', value: 'first', name: 'First' },
      { name_cn: '最后位作者', value: 'last', name: 'Last' },
      { name_cn: '其他', value: 'other', name: 'Other' }],
    defaultValue: 'all',
    single: true,
  },
  {
    key: 'year',
    title: 'Rankings',
    options: [
      { name: '2020', value: '2020', name_cn: '2020' },
      { name: '2021', value: '2021', name_cn: '2021' }
    ],
    title_cn: '年度',
    defaultValue: '2020'
  }]

}

export { VIEW_ID, RankOpts, ListOpts, COLLABORATIONS, GEOS }
