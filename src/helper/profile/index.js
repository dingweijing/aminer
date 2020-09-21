const getProfileInfo = (data) => {
  const { links = {}, profile: info = {} } = data
  const { resource = {} } = links
  const { resource_link = [] } = resource
  const { url: hp = '' } = resource_link.find(item => item.id === 'hp') || {}
  const { url: dblp = '' } = resource_link.find(item => item.id === 'dblp') || {}
  const param = {
    name: data.name || '',
    name_zh: data.name_zh || '',
    language: info.lang || '',
    gender: info.gender || '',
    position: info.position || '',
    position_zh: info.position_zh || '',
    affiliation: info.affiliation || '',
    affiliation_zh: info.affiliation_zh || '',
    phone: info.phone || '',
    homepage: info.homepage || '',
    fax: info.fax || '',
    address: info.address || '',
    email: info.email || '',
    gs: links.gs && links.gs.url || '',
    hp, dblp,
  };
  return param;
}

const getPositionMap = {
  '教授': { 'zh-CN': '教授', 'en-US': 'Professor' },
  'Professor': { 'zh-CN': '教授', 'en-US': 'Professor' },
  '副教授': { 'zh-CN': '副教授', 'en-US': 'Associate Professor' },
  'Associate Professor': { 'zh-CN': '副教授', 'en-US': 'Associate Professor' },
  '助理教授': { 'zh-CN': '助理教授', 'en-US': 'Associate Professor' },
  '讲师': { 'zh-CN': '讲师', 'en-US': 'Lecturer' },
  '教授级高级工程师': { 'zh-CN': '教授级高级工程师', 'en-US': 'Senior Engineer' },
  'Senior Engineer': { 'zh-CN': '教授级高级工程师', 'en-US': 'Senior Engineer' },
  '高级工程师': { 'zh-CN': '高级工程师', 'en-US': 'Senior Engineer' },
  '工程师': { 'zh-CN': '工程师', 'en-US': 'Engineer' },
  'Engineer': { 'zh-CN': '工程师', 'en-US': 'Engineer' },
  '助理工程师': { 'zh-CN': '助理工程师', 'en-US': 'Assistant Engineer' },
  'Assistant Engineer': { 'zh-CN': '助理工程师', 'en-US': 'Assistant Engineer' },
  '研究员': { 'zh-CN': '研究员', 'en-US': 'Research' },
  'Research': { 'zh-CN': '研究员', 'en-US': 'Research' },
  '副研究员': { 'zh-CN': '副研究员', 'en-US': 'Associate Research' },
  'Associate Research': { 'zh-CN': '副研究员', 'en-US': 'Associate Research' },
  '助理研究员': { 'zh-CN': '助理研究员', 'en-US': 'Associate Research' },
  '博士生': { 'zh-CN': '博士生', 'en-US': 'Ph.D' },
  'Ph.D': { 'zh-CN': '博士生', 'en-US': 'Ph.D' },
  '硕士生': { 'zh-CN': '硕士生', 'en-US': 'Master' },
  'Master': { 'zh-CN': '硕士生', 'en-US': 'Master' },
  '本科生': { 'zh-CN': '本科生', 'en-US': 'Bachelor' },
  'Bachelor': { 'zh-CN': '本科生', 'en-US': 'Bachelor' },
  '学生': { 'zh-CN': '学生', 'en-US': 'Student' },
  'Student': { 'zh-CN': '学生', 'en-US': 'Student' },
}

const personLangArray = [
  { value: '', name: 'Unknown' },
  { value: 'chinese', name: 'Chinese' },
  { value: 'english', name: 'English' },
  { value: 'greek', name: 'Greek' },
  { value: 'german', name: 'German' },
  { value: 'french', name: 'French' },
  { value: 'japanese', name: 'Japanese' },
  { value: 'indian', name: 'Indian' },
  { value: 'korean', name: 'Korean' },
  { value: 'italian', name: 'Italian' },
  { value: 'portuguese', name: 'Portuguese' },
]


export {
  getProfileInfo,
  getPositionMap,
  personLangArray
}
