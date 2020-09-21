// Author: Elivoa, 2018-10-12

import { cloneDeep } from 'lodash';

const sampleQueryObject = {
  query: {
    query: 'data mining',
    advanced: { term: '', aff: '', name: '' },
    ai: {}//?
  },
  filters: {
    eb: {}
  }
}
if (sampleQueryObject) {/* */ }

// construct query object
const constructQueryObject = ({ query, term, aff, name }) => {
  if (term || aff || name) {
    return { advanced: { term, aff, name } }
  } else {
    return { query }
  }
}

// construct query object
const mergeToNewFilter = (filter, { key, value, enable, count }) => {
  const newFilter = cloneDeep(filter);
  // special for eb filter.
  // TODO eb can be a list.
  if (key === 'eb') {
    if (enable) {
      if (!newFilter.eb) {
        newFilter.eb = {}
      }
      newFilter.eb = value // change this to enable multi-eb;
    } else {
      delete newFilter.eb
    }
    return newFilter;
  }

  // for filter that not eb
  if (enable) {
    newFilter[key] = value
  } else {
    delete newFilter[key];
  }
  return newFilter;
}

const isQueryEmpty = (queryObject) => {
  if (queryObject && queryObject.advanced) {
    const { name, org, term, texts } = queryObject.advanced;
    if ((!name && !org && !term) && !texts) {
      return true
    }
    return false;
  }

  if (queryObject && queryObject.query && queryObject.query !== '-') {
    return false;
  }
  return true;
}

const filterHasEB = (filter) => {
  return filter && filter.eb && filter.eb.id;
}

//   "advquery": {
//     "texts": [{
//         "source": "name",
//         "text": "juanzi li"
//     }]
// },
const makeAdvQuery = (advanced) => {
  if (!advanced) {
    return null;
  }
  const { name, org, term, texts } = advanced;
  const q = {
    name: name && name.trim(),
    org: org && org.trim(),
    term: term && term.trim(),
  }
  if (!q.name && !q.org && !q.term && !texts || (!q.name && !q.org && !q.term && texts.length === 0)) {
    return null;
  }
  let tempTexts = [];
  if (q.name) {
    tempTexts.push({ source: "name", text: q.name });
  }
  if (q.org) {
    tempTexts.push({ source: "org", text: q.org });
  }
  if (q.term) {
    tempTexts.push({ source: "term", text: q.term });
  }
  if (texts && texts.length > 0) {
    tempTexts = tempTexts.concat(texts);
  }
  return { advquery: { texts: tempTexts } };
}

const filterHasEBArray = (filter) => {
  return filter && filter.eb && filter.eb.length > 0 && filter.eb[0].id;
}

// TODO single eb version; change to eb list.
// ebs is [{ id, name }]
const filterHasEB222 = (filter, ebs) => {
  // // is ebs in filter?
  // let allInEB = true;
  // if (filter && filter.eb) {
  //   for (const { id } of ebs) {

  //   }
  // } else {
  //   allInEB = false;
  // }

}

// TODO change to immer object.
// class QueryParam {
//   constructor() {

//     this.xxx = 123;
//   }

// }

const convertAggrsToStatistics = (aggrs, yearInterval) => {
  let PaperEveryYear = [],
    topAuthors = [],
    topVenues = [],
    topOrgs = [],
    topKeywords = [];
  aggrs.forEach(aggr => {
    switch (aggr.label) {
      case 'author_year': topAuthors = aggr.item; break;
      case 'venue': topVenues = aggr.item.slice(0, 10); break;
      case 'year': PaperEveryYear = aggr.item; break;
      case 'org': topOrgs = aggr.item.slice(0, 10); break;
      case 'keywords': topKeywords = aggr.item.slice(0, 10); break;
    }
  });
  const statistics = {
    topAuthors,
    topVenues,
    topOrgs,
    topKeywords,
    top5Authors: topAuthors.slice(0, 5),
    top5Venues: topVenues.slice(0, 5),
    paperOfYearsData: [],
    authorStackBarChartData: [],
    venueStackBarChartData: [],
  };
  const top5AuthorInYears = {},
    top5VenuesInYears = {};
  PaperEveryYear.forEach(paperInYear => {
    const year = `${paperInYear.value}-${Number(paperInYear.value) + yearInterval}`;
    statistics.paperOfYearsData.push({
      name: year,
      value: paperInYear.count,
    });
    top5AuthorInYears[year] = {};
    top5VenuesInYears[year] = {};
  });
  statistics.top5Authors.forEach((author, authorIndex) => {
    if (author.subAggs && author.subAggs.length && author.subAggs[0].item) {
      author.subAggs[0].item.forEach(authorInYear => {
        const year = `${authorInYear.value}-${Number(authorInYear.value) + yearInterval}`;
        top5AuthorInYears[year][`${author.label}${authorIndex}`] = authorInYear.count;
      });
    }
  });
  statistics.top5Venues.forEach((venue, venueIndex) => {
    if (venue.subAggs && venue.subAggs.length && venue.subAggs[0].item) {
      venue.subAggs[0].item.forEach(venueInYear => {
        const year = `${venueInYear.value}-${Number(venueInYear.value) + yearInterval}`;
        top5VenuesInYears[year][`${venue.label}${venueIndex}`] = venueInYear.count;
      });
    }
  });

  statistics.authorStackBarChartData = Object.keys(top5AuthorInYears).map(key => {
    const value = top5AuthorInYears[key];
    return {
      name: key,
      ...value,
    };
  });
  statistics.venueStackBarChartData = Object.keys(top5VenuesInYears).map(key => {
    const value = top5VenuesInYears[key];
    return {
      name: key,
      ...value,
    };
  });
  // 取最后 10 个 (时间上最近的 10 项)
  statistics.authorStackBarChartData = statistics.authorStackBarChartData.slice(-10);
  statistics.venueStackBarChartData = statistics.venueStackBarChartData.slice(-10);
  statistics.paperOfYearsData = statistics.paperOfYearsData.slice(-10);
  // 计算前 5 个作者的发表数量百分比
  const top5AuthorCount = statistics.top5Authors.reduce((pre, cur) => pre += cur.count, 0);
  statistics.top5AuthorsProportion = statistics.top5Authors.map(author => {
    return { 
      value: author.value, 
      count: author.count, 
      percent: ((author.count / top5AuthorCount)*100).toFixed(1),
    };
  })
  return statistics;
};

export default {
  constructQueryObject,
  mergeToNewFilter,
  filterHasEB, isQueryEmpty,
  makeAdvQuery,
  convertAggrsToStatistics,
};
