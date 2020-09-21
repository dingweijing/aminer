import cookies from 'utils/cookie';
import { splitStrByPlusSign } from 'utils/search-utils'
import { sysconfig } from 'systems';

const defaultTab = 'person';

// const tabs = ['person', 'pub', 'gct', 'news'];
const tabs = ['person', 'pub'];

const forceTypes = {
  person: 'person',
  people: 'person',
  pub: 'pub',
  gct: 'gct',
  news: 'news'
}

const resource = [
  'pubmed',
  'dblp'
];

const fieldKeys = {"101":"SCI_Medicine","102":"Mathmatics","103":" Physics","104":"Mechanics","105":"Electrical and Electronic Engineering","106":"Medicine","107":"Clinical Medicine","108":"Pharmacy","109":"Economics","110":"Sociology","111":"Education","112":"Sports Science","113":"Astronomy","114":"Geography","115":"Physical Geography","116":"Geology","117":"Biology","118":"History of Science","119":"Optics","120":"Instruments","121":"Metallurgy Engineering","122":"Communication and Information Science","123":"Construction","124":"Geological Engineering","125":"Mining and Mine Processing","126":"Petroleum Engineering","127":"Transportation","128":"Marine and Ocean Engineering","129":"Aerospace Engineering","130":"Nuclear Science and Tech","131":"Agricultural Engineering","132":"Forestry","133":"Environmental Science and Engineering","134":"Biomedical Engineering","135":"Food Science and Engineering","136":"Management","137":"SCI_Chemistry","138":"SCI_Psychology","139":"SCI_Immunology_and_Microbiology","140":"SCI_Neuroscience"};

const domainsTreeData = [{"key":"101","title":"101"},{"key":"102","title":"102"},{"key":"103","title":"103"},{"key":"104","title":"104"},{"key":"105","title":"105"},{"key":"106","title":"106",},{"key":"107","title":"107"},{"key":"108","title":"108"},{"key":"109","title":"109"},{"key":"110","title":"110"},{"key":"111","title":"111"},{"key":"112","title":"112"},{"key":"113","title":"113"},{"key":"114","title":"114"},{"key":"115","title":"115"},{"key":"116","title":"116"},{"key":"117","title":"117"},{"key":"118","title":"118"},{"key":"119","title":"119"},{"key":"120","title":"120"},{"key":"121","title":"121"},{"key":"122","title":"122"},{"key":"123","title":"123"},{"key":"124","title":"124"},{"key":"125","title":"125"},{"key":"126","title":"126"},{"key":"127","title":"127"},{"key":"128","title":"128"},{"key":"129","title":"129"},{"key":"130","title":"130"},{"key":"131","title":"131"},{"key":"132","title":"132"},{"key":"133","title":"133"},{"key":"134","title":"134"},{"key":"135","title":"135"},{"key":"136","title":"136"},{"key":"137","title":"137"},{"key":"138","title":"138"},{"key":"139","title":"139"},{"key":"140","title":"140"}]

const fieldsTreeData = [
  { key: 'medicine',
    title: 'medicine' ,
    type: 'jconf',
    children: [
    { key: 'thyroid_cancer', title: 'thyroid cancer', type: 'jconf' },
    { key: 'myocardial_infarction', title: 'myocardial infarction', type: 'jconf' },
    { key: 'lung_cancer', title: 'lung cancer' , type: 'jconf'},
    { key: 'kidney', title: 'kidney', type: 'jconf' },
    {
      key: 'hypertension_&_hyperlipidemia',
      title: 'hypertension & hyperlipidemia', type: 'jconf'
    },
    { key: 'heart_failure', title: 'heart failure', type: 'jconf' },
    { key: 'diabetic_retinitis', title: 'diabetic retinitis' , type: 'jconf'},
    { key: 'diabetes', title: 'diabetes' , type: 'jconf'},
    { key: 'atrial_fibrillation', title: 'atrial fibrillation', type: 'jconf' }
  ]},
  { key: 'chemistry', title: 'chemistry', type: 'jconf' },
  { key: 'physics', title: 'physics', type: 'jconf' },
  { key: 'materials', title: 'materials', type: 'jconf' },
  {
    key: 'environmental_science_&_engineering',
    title: 'environmental science & engineering',
    type: 'jconf'
  },
  { key: 'pharmacy', title: 'pharmacy', type: 'jconf' },
  { key: 'mathematics', title: 'mathematics', type: 'jconf' },
  { key: 'instruments', title: 'instruments', type: 'jconf' },
  {
    key: 'food_science_&_engineering',
    title: 'food science & engineering', type: 'jconf'
  },
  { key: 'metallurgy_engineering', title: 'metallurgy engineering' , type: 'jconf'},
  {
    key: 'mining_&_mine_processing',
    title: 'mining & mine processing', type: 'jconf'
  },
  { key: 'optics', title: 'optics', type: 'jconf' },
  { key: 'nuclear_science_&_tech', title: 'nuclear science & tech', type: 'jconf' },
  { key: 'petroleum_engineering', title: 'petroleum engineering', type: 'jconf' },
  { key: 'mechanics', title: 'mechanics', type: 'jconf' },
  { key: 'history_of_science', title: 'history of science', type: 'jconf' },
  { key: 'clinical_medicine', title: 'clinical medicine', type: 'jconf' },
  { key: 'astronomy', title: 'astronomy', type: 'jconf' },
  { key: 'electronic_engineering', title: 'electronic engineering', type: 'jconf' },
  { key: 'economics', title: 'economics', type: 'jconf' },
  { key: 'biology', title: 'biology', type: 'jconf' },
  { key: 'biomedical_engineering', title: 'biomedical engineering', type: 'jconf' },
  { key: 'sociology', title: 'sociology', type: 'jconf' },
  { key: 'management', title: 'management', type: 'jconf' },
  { key: 'geological_engineering', title: 'geological engineering', type: 'jconf' },
  { key: 'transportation', title: 'transportation', type: 'jconf' },
  { key: 'hydrology', title: 'hydrology', type: 'jconf' },
  { key: 'aerospace_engineering', title: 'aerospace engineering', type: 'jconf' },
  { key: 'construction', title: 'construction' , type: 'jconf'},
  {
    key: 'marine_&_ocean_engineering',
    title: 'marine & ocean engineering', type: 'jconf'
  },
  { key: 'sports_science', title: 'sports science' , type: 'jconf'},
  { key: 'forestry', title: 'forestry' , type: 'jconf'},
  { key: 'physical_geography', title: 'physical geography' , type: 'jconf'},
  { key: 'geography', title: 'geography', type: 'jconf' },
  { key: 'education', title: 'education', type: 'jconf' },
  {
    key: 'communication_&_information_science',
    title: 'communication & information science', type: 'jconf'
  },
  { key: 'geology', title: 'geology', type: 'jconf' },
  { key: 'agricultral_engineering', title: 'agricultral engineering' , type: 'jconf'}
]

const withoutAdv = ['gct', 'news', 'pub'];  // 论文搜索页面不再需要旧的高级搜索按钮

const schema = [
  'id', 'name', 'name_zh', 'avatar', 'tags', 'is_follow',
  'num_view', 'num_follow', 'is_upvoted', 'num_upvoted', 'is_downvoted', 'bind',
  { profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh', 'org'] },
  { indices: ['hindex', 'gindex', 'pubs', 'citations', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'] }
]


// * functions

const getFieldChildren = (fieldTitle) => {
  // 查找子节点的作弊写法，不适用于其他树结构
  const fieldTreeNode = fieldsTreeData.find(item => item.title === fieldTitle);
  if (fieldTreeNode && fieldTreeNode.children) return fieldTreeNode.children;
  return false;
}
const getFieldParent = (fieldTitle) => {
  // 查找父节点的作弊写法，不适用于其他树结构
  const fieldTreeNode = fieldsTreeData.find(item => {
    if (item.children && item.children.find(item => item.title === fieldTitle)) return true;
    return false;
  });
  if (fieldTreeNode) return fieldTreeNode;
  return false;
}

function judgeSearchType({ pathType, forceType }) {
  if (pathType) {
    return pathType;
  }

  let searchType; // ['person','pub']
  // 只有访问 /search?xxx 的时候才自动判断是否跳转。访问 /search/pub 的时候，就连force参数都应该失效。
  // searchType 的获取顺序：forceType > type > cookie.
  // 注意：仅当点击了tab的时候才记录cookie改变，url参数导致的tab切换并不更改cookie设置。

  if (forceType && (forceType in forceTypes) && tabs.includes(forceTypes[forceType])) {
    searchType = forceTypes[forceType];
  }

  return searchType || loadCookieSearchType() || defaultTab;
}


function loadCookieSearchType() {
  const [v, serverRender] = cookies.syncSSRCookie('searchType');
  const st = serverRender ? v : cookies.getCookie('searchType');
  return st;
}


function composeQueryObject(q, k, n, o, searchType) {
  const queryObject = { query: '', advanced: null }
  let queryAdv = {}
  if (q) {
    queryObject.query = q;
    queryAdv = null;
  }
  if (k || k === '') {
    queryObject.query = k || ''
    queryAdv.term = k || ''
  }
  if (n || n === '') {
    queryAdv.name = n || ''
  }
  if (o || o === '') {
    queryAdv.org = o || ''
  }
  if (searchType === 'pub') {
    queryObject.advanced = null
  } else {
    queryObject.advanced = queryAdv
  }
  return queryObject;
}

function composeQueryObject2(q, k, n, o, searchType) {
  console.log('composeQueryObject2 q, k, n, o, searchType', q, k, n, o, searchType)
  const queryObject = { query: '', advanced: null }
  let queryAdv = {}
  if (q) {
    queryObject.query = q;
    // queryAdv = null;
  }
  if (k || k === '') {
    queryObject.query = k || ''
    queryAdv.term = k || ''
  }
  if (n || n === '') {
    queryAdv.name = n || ''
  }
  if (o || o === '') {
    queryAdv.org = o || ''
  }
  if (searchType === 'pub') {
    queryObject.advanced = null
  } else {
    queryObject.advanced = queryAdv
  }
  return queryObject;
}


// 各个搜索条件的查询条件
const esSearch = {
  fields: (params) => { 
    return {
      type: 'jconf',
      names: params.split('+'),
    }
  },
  fieldOrigin: (params) => {  // fields 外面再包一层
    return {
      need_process: 'origin',
      search_type: 'terms',
      field: 'field_ids',
      to_score: false,
      origin: params
    }
  },
  domain: (params) => {
    return {
      search_type: 'terms',
      field: 'domains',
      to_score: false,
      origin: params.split('+'),
    }
  },
  resource: (params) => {
    return {
      type: 'source',
      names: params.split('+'),
    }
  },
  rangeTime: (startTime, endTime) => {
    return {
      search_type: 'range',
      field: 'year',
      origin: { gte: startTime, lte: endTime },
    }
  },
  termsTime: (params) => {
    return {
      search_type: 'terms',
      field: 'year',
      origin: params.split('+'),
    }
  },
  conference: (params) => {
    return {
      search_type: 'query_string',
      fields_raw:  ["venue","venue_zh"],
      to_score: false,
      query: params.map(item => `(${item})`).join(' '),
    }
  },
  keywords: (params) => {  // 高级搜索框输入的关键词
    return {
      search_type: 'query_string',
      fields_raw: ['keywords', 'keywords_zh'],
      to_score: false,
      query: params.map(item => `(${item})`).join(' '),
    }
  },
  topKeywords: (params) => {  // 左侧筛选项勾选的关键词
    return {
      search_type: 'query_string',
      fields_raw: ['keywords'],
      to_score: false,
      query: params.map(item => `(${item})`).join(' '),
    }
  },
  authorName: (params) => {
    return {
      search_type: 'query_string',
      fields: ['authors.name.standard', 'authors.name_zh'],
      to_score: false,
      query: `("${params}")`,
    }
  },
  authorId: (params) => {
    return {
      search_type: "term",
      field: "authors.id",
      to_score: false,
      origin: params
    }
  },
  org: (params) => {
    return {
      search_type: 'query_string',
      fields: ["authors.org", "authors.org_zh"],
      to_score: false,
      query: params.map(item => `(${item})`).join(' '),
    }
  },
  searchInTitle: (params) => {
    return {
      search_type: 'query_string',
      fields_raw: ['title', 'title_zh'],
      to_score: true,
      query: params,
    }
  },
  searchInAll: (params) => {
    return {
      search_type: 'query_string',
      fields_raw: ["all", "all_zh"],
      to_score: true,
      query: params
    }
  },
}

const buildFieldOrigin = {
  addFields: (params, conditions, config) => {
    if (!config || config.when) {
      conditions.push(esSearch.fields(params));
    }
    return buildFieldOrigin;
  },
  addResource: (params, conditions, config) => {
    if (!config || config.when) {
      conditions.push(esSearch.resource(params));
    }
    return buildFieldOrigin;
  }
};

const buildConditions = {
  addFieldOrigin: (params, condition, config) => {
    if (!config || config.when) {
      condition.push(esSearch.fieldOrigin(params));
    }
    return buildConditions;
  },
  addTime: (params, condition, config) => {
    if (!config || config.when) {
      if (params.includes('-')) {  // time range
        const [startTime, endTime] = params.split('-').sort((a, b) => { return Number(a) - Number(b) });
        condition.push(esSearch.rangeTime(startTime, endTime));
      } else { // time selected
        condition.push(esSearch.termsTime(params));
      }
    }
    return buildConditions;
  },
  addConference: (params, condition, config) => {
    if (!config || config.when) {
      const verified = splitStrByPlusSign(params);
      if (verified && verified.length) {
        condition.push(esSearch.conference(verified));
      }
    }
    return buildConditions;
  },
  addKeywords: (params, condition, config) => {
    if (!config || config.when) {
      const verified = splitStrByPlusSign(params);
      if (verified && verified.length) {
        condition.push(esSearch.keywords(verified));
      }
    }
    return buildConditions;
  },
  addTopKeywords: (params, condition, config) => {
    if (!config || config.when) {
      const verified = splitStrByPlusSign(params);
      if (verified && verified.length) {
        condition.push(esSearch.topKeywords(verified));
      }
    }
    return buildConditions;
  },
  addAuthor: (params, condition, config) => {
    if (!config || config.when) {
      const verified = splitStrByPlusSign(params);
      if (verified && verified.length) {
        const names = [], ids = [];
        // author可能包含从统计图下直接点击的filter和在高级搜索中输入的filter，前者带'@'而后者不带
        verified.forEach(item => {
          if (item.includes('@')) {
            const [name, id] = item.split('@');
            // names.push(name);
            ids.push(id);
          } else {
            names.push(item);
          }
        })
        ids.forEach(id => {
          condition.push(esSearch.authorId(id));
        })
        names.forEach(name => {
          condition.push(esSearch.authorName(name));
        })
      }
    }
    return buildConditions;
  },
  addOrg: (params, condition, config) => {
    if (!config || config.when) {
      const verified = splitStrByPlusSign(params);
      if (verified && verified.length) {
        condition.push(esSearch.org(verified));
      }
    }
    return buildConditions;
  },
  addDomain: (params, condition, config) => {
    if (!config || config.when) {
      condition.push(esSearch.domain(params));
    }
  },
};

// function buildEsSearchCondition({fields, resource, time, searchIn, author, conference, keywords, topkeywords, org, domain, query}) {
//   const esSearchCondition = {};
//   const fieldOrigin = [];
//   const includeAndConditions = [], includeOrConditions = [];

//   // 从domain中取出field
//   let newFields = [], newDomain = [];
//   if (fields) {
//     newFields = fields.split('+');
//   }
//   if (domain) {
//     const domainArr = domain.split('+');
//     domainArr.forEach(item => {
//       newDomain.push(item);
//     })
//   }

//   buildFieldOrigin.addFields(newFields.join('+'), fieldOrigin, { when: newFields && newFields.length })
//     .addResource(resource, fieldOrigin, { when: resource });

//   buildConditions.addFieldOrigin(fieldOrigin, includeAndConditions, { when: fieldOrigin && fieldOrigin.length })
//     .addTime(time, includeAndConditions, { when: time })
//     .addConference(conference, includeAndConditions, { when: conference })
//     .addKeywords(keywords, includeAndConditions, { when: keywords})
//     .addAuthor(author, includeAndConditions, { when: author })
//     .addOrg(org, includeAndConditions, { when: org })
//     .addTopKeywords(topkeywords, includeAndConditions, { when: topkeywords})
//     .addDomain(newDomain.join('+'), includeAndConditions, { when: newDomain && newDomain.length});

//   let searchInQuery = query;
//   if (typeof query === 'object') {
//     searchInQuery = query.query;
//   }
//   if (searchIn === 'title') {
//     includeAndConditions.push(esSearch.searchInTitle(searchInQuery));
//   } else if (searchInQuery && (author || conference || keywords)) { // searchIn === 'all'
//     includeAndConditions.push(esSearch.searchInAll(searchInQuery));
//   }

//   if (includeAndConditions.length) {
//     esSearchCondition.include_and = { conditions: includeAndConditions };
//   }
//   if (includeOrConditions.length) {
//     esSearchCondition.include_or = { conditions: includeOrConditions };
//   }
//   return esSearchCondition;
// }

function buildCurSearchFilter(fields, resource, time, searchIn, author, conference, keywords, org, topkeywords, domain) {
  const curFilter = [];
  // 左侧已选的filter不重复显示在当前的过滤条件中

  // if (time) {
  //   if (time.includes('-')) {
  //     curFilter.push({
  //       key: 'time',
  //       value: time,
  //     })
  //   } else {
  //     time.split('+').forEach(timeIten => {
  //       curFilter.push({
  //         key: 'time',
  //         value: timeIten,
  //       })
  //     })
  //   }
  // }

  // if (resource) {
  //   resource.split('+').forEach(resrc => {
  //     curFilter.push({
  //       key: 'resource',
  //       value: resrc,
  //     })
  //   })
  // }

  // if (fields) {
  //   fields.split('+').forEach(field => {
  //     curFilter.push({
  //       key: 'field',
  //       value: field,
  //     })
  //   })
  // }
  // if (searchIn) {
  //   curFilter.push({
  //     key: 'searchIn',
  //     value: searchIn,
  //   })
  // }
  // if (author) {
  //   const verifiedAuthor = splitStrByPlusSign(author);
  //   verifiedAuthor.forEach(authorItem => {
  //       curFilter.push({
  //         key: 'author',
  //         value: authorItem,
  //       })
  //   })
  // }
  // if (conference) {
  //   const verifiedConf = splitStrByPlusSign(conference);
  //   verifiedConf.forEach(conf => {
  //     curFilter.push({
  //       key: 'conference',
  //       value: conf,
  //     })
  //   })
  // }
  // if (keywords) {
  //   const verifiedKeyword = splitStrByPlusSign(keywords);
  //   verifiedKeyword.forEach(keyword => {
  //     curFilter.push({
  //       key: 'keywords',
  //       value: keyword,
  //     })
  //   })
  // }
  // if (org) {
  //   const verifiedOrg = splitStrByPlusSign(org);
  //   verifiedOrg.forEach(org => {
  //     curFilter.push({
  //       key: 'org',
  //       value: org,
  //     })
  //   })
  // }
    // if (domain) {
  //   const verifiedDomain = splitStrByPlusSign(domain);
  //   verifiedDomain.forEach(domain => {
  //     curFilter.push({
  //       key: 'domain',
  //       value: domain,
  //     })
  //   })
  // }
  return curFilter;
}

function deleteSearchFilter(key, value, field, resource, time, searchIn, author, conference, keywords, org, topkeywords, domain) {
  const params = {};
  const removeParams = [];
  switch(key) {
    case 'field': {
      // 学科的filter可能包含父子层级关系，这里的逻辑应该是：
      // 父节点选中时，所有子节点自动选中；此时若删除一个子节点，则父节点也取消选中
      if (value === field) {
        removeParams.push('field');
      } else {
        // 判断是不是被取消的field一个子节点，如果是则取消其父节点
        let newField = field.split('+');
        const fieldParent = getFieldParent(value);
        if (fieldParent) {
          newField = newField.filter(item => item !== value && item !== fieldParent.title);
        } else {
          newField = newField.filter(item => item !== value);
        }
        params[key] = newField.join('+');
      }
      break;
    }
    case 'resource': {
      if (value === resource) {
        removeParams.push('resource');
      } else {
        params[key] = resource.split('+').filter(item => item !== value).join('+');
      }
      break;
    }
    case 'time': {
      if (value === time) {
        removeParams.push('time');
      } else {
        params[key] = time.split('+').filter(item => item !== value).join('+');
      }
      break;
    }
    case 'searchIn': {
      removeParams.push('searchIn');
      break;
    }
    case 'author': {
      const authorArr = splitStrByPlusSign(author);
      params[key] = authorArr.filter(item => item !== value).join('+');
      break;
    }
    case 'domain': {
      if (value === domain) {
        removeParams.push('domain');
      } else {
        const domainArr = splitStrByPlusSign(domain);
        params[key] = domainArr.filter(item => item !== value).join('+');
      }
      break;
    }
    case 'conference': {
      if (value === conference) {
        removeParams.push('conference');
      } else {
        const conferenceArr = splitStrByPlusSign(conference);
        params[key] = conferenceArr.filter(item => item !== value).join('+');
      }
      break;
    }
    case 'keywords': {
      if (value === keywords) {
        removeParams.push('keywords');
      } else {
        const keywordsArr = splitStrByPlusSign(keywords);
        params[key] = keywordsArr.filter(item => item !== value).join('+');
      }
      break;
    }
    case 'topkeywords': {
      if (value === topkeywords) {
        removeParams.push('topkeywords');
      } else {
        const topkeywordsArr = splitStrByPlusSign(topkeywords);
        params[key] = topkeywordsArr.filter(item => item !== value).join('+');
      }
      break;
    }
    case 'org': {
      if (value === org) {
        removeParams.push('org');
      } else {
        const orgArr = splitStrByPlusSign(org);
        params[key] = orgArr.filter(item => item !== value).join('+');
      }
      break;
    }
  }
  return { params, removeParams };
}
// const toggleAdvancedSearchByQueryObj = (dispatch, queryObj) => {
//   if (queryObj && !queryObj.advanced) {
//     dispatch({ type: 'searchmodel/toggleAdvancedSearch', payload: true });
//   }
//   if (queryObj.queryObj && queryObj.queryObj.advanced) {
//     dispatch({ type: 'searchmodel/toggleAdvancedSearch', payload: false });
//   }
// }


// * export
export default {
  defaultTab,
  tabs,
  schema,

  // search paper filter option
  resource,
  fieldsTreeData,
  domainsTreeData,
  fieldKeys,
  getFieldChildren,

  withoutAdv,
  forceTypes,

  // functions
  judgeSearchType,
  loadCookieSearchType,

  composeQueryObject,
  composeQueryObject2,
  // buildEsSearchCondition,
  buildCurSearchFilter,
  deleteSearchFilter,
}
