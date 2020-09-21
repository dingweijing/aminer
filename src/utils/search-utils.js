import { sysconfig } from 'systems';
import cookies from 'utils/cookie';

const types = {
  person: '/person', // 这里的路径应该改成/person
  // person: '',
  pub: '/pub',
  paper: '/pub',
  gct: '/gct',
  news: '/news'
}

const getSearchPathname = (query, advanceSearch, domain, inputSearchType) => {
  // const searchType = inputSearchType || cookies.getCookie('searchType') || 'person'; // 点tab切换的被改成了pub/pearon存cookie
  const searchType = inputSearchType || 'person'; // 点tab切换的被改成了pub/pearon存cookie
  const routerPath = `/${sysconfig.SearchPagePrefix}${types[searchType]}`;
  // const routerPath = `/${sysconfig.SearchPagePrefix}/person`;

  // let curField = '', curTime = '', curResource = '';
  let pathname = '';

  // 切换搜索词时，保留field/time/resource参数 // 不再保留 2020.3.31
  // const curSearch = (window.location && window.location.search) || ''; // '?field=xxx&time=xxx'
  // if (curSearch) {
  //   const curSearchParams = {};
  //   curSearch.slice(1).split('&').forEach(item => {
  //     const [ key, value ] = item.split('=');
  //     curSearchParams[key] = value;
  //   });
  //   if (Object.keys(curSearchParams).length) {
  //     curField = curSearchParams['field'] || '';
  //     curTime = curSearchParams['time'] || '';
  //     curResource = curSearchParams['resource'] || '';
  //   }
  // }

  if (typeof query === 'string') {
    pathname = `${routerPath}?t=b&q=${query}`
  }
  if (typeof query === 'object') {
    if (!query.advanced) {
      pathname = `${routerPath}?t=b&q=${query.query}`
    } else {
      pathname = `${routerPath}?t=a&k=${query.advanced.term}&n=${query.advanced.name}&o=${query.advanced.org}`
    }
    if (advanceSearch) {
      Object.keys(advanceSearch).forEach(key => {
        // key = [searchIn, author, conference, keywords]
        const value = advanceSearch[key];
        if (key === 'searchIn' && value !== 'all') {
          pathname += `&searchIn=${value}`;
        } else {
          const clear = new Set(value.split('+')); // 去重
          pathname += `&${key}=${[...clear].join('+')}`;
        }
      })
    }
    if (domain && domain.length) {
      pathname += `&domain=${domain.join('+')}`;
    }
  }

  // if (curField) {
  //   pathname += `&field=${curField}`;
  // }
  // if (curTime) {
  //   pathname += `&time=${curTime}`;
  // }
  // if (curResource) {
  //   pathname += `&resource=${curResource}`;
  // }

  return pathname;
}

const getSearchPathname2 = (query = '', advanceSearch, domain, searchType = 'person') => {
  const routerPath = `/${sysconfig.SearchPagePrefix}${types[searchType]}`;
  let pathname = `${routerPath}?t=b&q=${query}`;

  if (advanceSearch && typeof advanceSearch === 'object') {
    Object.keys(advanceSearch).forEach(key => {
      const value = advanceSearch[key];
      if (!value) return;
      if (key === 'searchIn' && value !== 'all') {
        pathname += `&searchIn=${value}`;
      } else {
        const clear = new Set(value.split('+')); // 去重
        pathname += `&${key}=${[...clear].join('+')}`;
      }
    })
  }
  if (domain && domain.length) {
    pathname += encodeURI(`&domain=${domain.join('+')}`);
  }
  return pathname;
}

const getParamsFromUrl = newUrl => {
  const params = {};
  newUrl.split('?')[1].split('&').forEach(item => {
    const [key, value] = item.split('=');
    params[key] = decodeURIComponent(value);
  })
  return params;
}

const toThousands = num1 => {
  let num = (num1 || 0).toString()
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3) + result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}

const formatNumberWithK = number => {
  if (number <= 1000) {
    return `${number}`
  }
  const temp = parseInt(number / 1000, 10)
  return `${toThousands(temp)}k`
}

const formatNumberWithKZero = number => {
  if (number < 10000) {
    return `${toThousands(number)}`
  }
  return `${toThousands(number)} +`
  // const temp = parseInt(number / 1000, 10)
  // return `${toThousands(temp * 1000)}`
}

function splitStrByComma(str) {
  const splited = str.split(/\,|\，/);
  const result = [];
  splited.forEach(item => {
    const trimmed = item.trim();
    if (trimmed) {
      result.push(trimmed);
    }
  })
  return result;
}

function splitStrByPlusSign(str) {
  const splited = str.split(/\+/);
  const result = [];
  splited.forEach(item => {
    const trimmed = item.trim();
    if (trimmed) {
      result.push(trimmed);
    }
  })
  return result;
}

function removeTimeFromEsSearch(esSearchCondition) {
  if (esSearchCondition && esSearchCondition.include_and) {
    let { conditions = [] } = esSearchCondition.include_and;
    conditions = conditions.filter(item => item.field !== 'year');
    if (conditions.length) {
      esSearchCondition.include_and.conditions = conditions;
      return esSearchCondition;
    } else {
      return {};
    }
  }
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

function buildEsSearchCondition({fields, resource, time, searchIn, author, conference, keywords, topkeywords, org, domain, query}) {
  const esSearchCondition = {};
  const fieldOrigin = [];
  const includeAndConditions = [], includeOrConditions = [];

  // 从domain中取出field
  let newFields = [], newDomain = [];
  if (fields) {
    newFields = fields.split('+');
  }
  if (domain) {
    const domainArr = domain.split('+');
    domainArr.forEach(item => {
      newDomain.push(item);
    })
  }

  buildFieldOrigin.addFields(newFields.join('+'), fieldOrigin, { when: newFields && newFields.length })
    .addResource(resource, fieldOrigin, { when: resource });

  buildConditions.addFieldOrigin(fieldOrigin, includeAndConditions, { when: fieldOrigin && fieldOrigin.length })
    .addTime(time, includeAndConditions, { when: time })
    .addConference(conference, includeAndConditions, { when: conference })
    .addKeywords(keywords, includeAndConditions, { when: keywords})
    .addAuthor(author, includeAndConditions, { when: author })
    .addOrg(org, includeAndConditions, { when: org })
    .addTopKeywords(topkeywords, includeAndConditions, { when: topkeywords})
    .addDomain(newDomain.join('+'), includeAndConditions, { when: newDomain && newDomain.length});

  let searchInQuery = query;
  if (typeof query === 'object') {
    searchInQuery = query.query;
  }
  if (searchIn === 'title') {
    includeAndConditions.push(esSearch.searchInTitle(searchInQuery));
  } else if (searchInQuery && (author || conference || keywords)) { // searchIn === 'all'
    includeAndConditions.push(esSearch.searchInAll(searchInQuery));
  }

  if (includeAndConditions.length) {
    esSearchCondition.include_and = { conditions: includeAndConditions };
  }
  if (includeOrConditions.length) {
    esSearchCondition.include_or = { conditions: includeOrConditions };
  }
  return esSearchCondition;
}

export { getSearchPathname, formatNumberWithK, formatNumberWithKZero, splitStrByComma, splitStrByPlusSign, removeTimeFromEsSearch, getParamsFromUrl, getSearchPathname2, buildEsSearchCondition }
