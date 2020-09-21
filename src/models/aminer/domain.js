import { sysconfig } from 'systems';
import { buildEsSearchCondition } from 'utils/search-utils';
import { domainService, paperSearchService } from 'services/aminer';
import moment from 'moment';

const Domain_Keyword_Trend_Show_Percent = 0.8;
const Domain_Keyword_Trend_Early_Year = 1850;
const Domain_Keyword_Trend_Latest_Year = 2025;
const Domain_Keyword_Trend_Show_Num = 5;
const Domain_Hot_Topics_Show_Num = 50;

export default {
  namespace: 'domain', // TODO change to pub model.

  state: {
    domains: null, // channel listF
    domainInfo: null, // 当前channel详情
    keywordTrend: null,
    paperTrend: null,
    hotTopics: null,
    topRank: null,
    topPaper: null,
    topAuthor: null,
    jconfMatched: null,
  },

  subscriptions: {},

  effects: {
    *getAllDomains({ payload }, { call, put }) {
      const { data } = yield call(domainService.getAllDomains, payload);
      console.log({ domain: data });
      if (data && data.succeed) {
        yield put({
          type: 'getAllDomainsSucceed',
          payload: data.data,
        });
      }
    },

    *getDomainInfoAndKeywordTrend({ payload }, { call, put }) {
      const { data } = yield call(domainService.getDomainInfoAndKeywordTrend, payload);
      if (data && data.succeed && data.data && data.data.length) {
        const domain = data.data[0];
        const update = {};

        if (domain) {
          update.domainInfo = domain;
          if (domain.stats) {
            if (domain.stats.keyword_trend) {
              const keyword_trend = domain.stats.keyword_trend.slice(
                0,
                Domain_Keyword_Trend_Show_Num,
              );
              update.keywordTrend = calcKeywordTrendData(keyword_trend);
            }
          }
        }
        yield put({
          type: 'update',
          payload: update,
        });
      }
    },

    *getDomainPaperTrend({ payload }, { call, put }) {
      const { data } = yield call(domainService.getDomainPaperTrend, payload);
      console.log('CHANNEL GetDomainPaperTrend data', data);
      if (data && data.succeed && data.data) {
        const paperTrend = data.data;
        // const update = { paperTrend };
        yield put({
          type: 'update',
          payload: { paperTrend },
        });
      }
    },

    *getDomainHotTopicAndTopRank({ payload }, { call, put }) {
      const { data } = yield call(domainService.getDomainHotTopicAndTopRank, payload);
      console.log('CHANNEL getDomainHotTopicAndTopRank data', data);
      if (data && data.succeed && data.data) {
        const { hotTopics, top: topRank } = data.data;
        // // const update = { paperTrend };
        yield put({
          type: 'update',
          payload: { hotTopics, topRank },
        });
      }
    },

    *getTopAuthorsOfDomain({ payload }, { call, put }) {
      const { data } = yield call(domainService.getTopAuthorsOfDomain, payload);
      if (data && data.succeed && data.data) {
        yield put({
          type: 'update',
          payload: { topAuthor: data.data },
        });
      }
    },

    *PersonDomainsDistrebution({ payload }, { call, put }) {
      const { data } = yield call(domainService.PersonDomainsDistrebution, payload);
      return data && data.data;
      // if (data && data.succeed && data.data) {
      //   yield put({
      //     type: 'update',
      //     payload: { topAuthor: data.data },
      //   })
      // }
    },

    *getDomainTopPaper({ payload }, { call, put }) {
      const { domain, time } = payload;
      const esSearchCondition = buildEsSearchCondition({ domain, time });
      const params = {
        query: '',
        pagination: {
          current: 1,
          pageSize: 20,
        },
        searchType: 'all',
        switches: ['lang_zh'],
        esSearchCondition,
      };
      const { data } = yield call(paperSearchService.search, params);
      if (data && data.succeed && data.items) {
        yield put({
          type: 'update',
          payload: { topPaper: data.items },
        });
      }
    },
  },

  reducers: {
    getAllDomainsSucceed(state, { payload }) {
      state.domains = payload;
    },

    update(state, { payload }) {
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
    },

    reset(state) {
      state.domains = null;
      state.domainInfo = null;
      state.keywordTrend = null;
      state.paperTrend = null;
      state.hotTopics = null;
      state.topRank = null;
      state.jconfMatched = null;
    },
  },
};

const checkOriginalDataLength = data => {
  if (!data || !data[0] || data[0].length === 0) {
    return false;
  }
  const year_length = data[0].length;
  for (let i = 1; i < data.length; i += 1) {
    if (data[i].length !== year_length) {
      return false;
    }
  }
  return true;
};

const calcInterestsData = ({ transpose_data, years, min_year, max_year }) => {
  const years_data = [...transpose_data];
  if (!years.includes(min_year)) {
    years_data.unshift(Array(transpose_data[0].length).fill([min_year, 0]));
  }
  years_data.push(Array(transpose_data[0].length).fill([max_year, 0]));

  return years_data[0].map((item, index) => years_data.map(t => t[index]));
};

const getPrecentYear = ({ years, years_map, total, pre }) => {
  let cur_year = years[0];
  let cur_total = 0;
  const fiducial = total * (1 - pre);

  for (let i = 0; i < years.length; i += 1) {
    cur_total += years_map[years[i]];
    if (cur_total > fiducial) {
      break;
    }
    cur_year = years[i];
  }
  return cur_year;
};

const calcKeywordTrendData = data => {
  // 找出数据中的最小有效年份和最大年份
  let minY = moment().year(),
    maxY = 0;
  data.forEach(keyword => {
    if (keyword.trend) {
      if (keyword.trend[keyword.trend.length - 1].y > maxY) {
        maxY = keyword.trend[keyword.trend.length - 1].y;
      }
      if (keyword.trend[0].y === -1) {
        if (keyword.trend.length > 1 && keyword.trend[1].y < minY) {
          minY = keyword.trend[1].y;
        }
      } else if (keyword.trend[0].y < minY) {
        minY = keyword.trend[0].y;
      }
    }
  });
  minY = Math.max(minY, Domain_Keyword_Trend_Early_Year);
  maxY = Math.min(maxY, Domain_Keyword_Trend_Latest_Year);
  // 数据的年份补齐
  const valuableKeywords = []; // 带有效年份的 keyword
  const fullYearData = []; // 补齐年份的数据
  data.forEach(keyword => {
    if (keyword.trend && keyword.trend.length && keyword.trend[0].y !== -1) {
      valuableKeywords.push(keyword.term);
      const values = [];
      for (let i = minY; i <= maxY; i++) {
        values.push([i, 0]);
      }
      keyword.trend.forEach(trend => {
        const index = trend.y - minY;
        values[index] = [trend.y, trend.c];
      });
      fullYearData.push({ key: keyword.term, values });
    }
  });

  // console.log('data', data)
  // write('./fullyearData.json', JSON.stringify(fullYearData));

  let maxLength = Domain_Keyword_Trend_Latest_Year - Domain_Keyword_Trend_Early_Year;
  // console.log('maxLength', maxLength)
  let possibleYears = [...Array(maxLength)].map(
    (item, index) => Domain_Keyword_Trend_Early_Year + index,
  );
  // console.log('possibleYears', possibleYears)

  let year_temp = fullYearData.map(item => {
    if (item.values) return item.values;
    return possibleYears.map(i => [i, 0]);
  });

  if (!checkOriginalDataLength(year_temp)) {
    return null;
  }
  if (!year_temp || year_temp.length === 0) {
    return null;
  }
  let year_data_transpose = year_temp[0].map((item, index) => year_temp.map(t => t[index]));

  let interest_total = 0;
  const years = year_data_transpose.map(item => item[0][0]);
  const years_map = year_data_transpose.reduce((res, cur) => {
    const year = cur[0][0];
    const sum = cur.reduce((total, cur_num) => total + cur_num[1], 0);
    interest_total += sum;
    res[year] = sum;
    return res;
  }, {});

  const now_year = new Date().getFullYear();
  const latest_year = years[years.length - 1];
  const max_year = Math.min(now_year - 1, latest_year + 2);

  let calc_early_year = years[0];
  const year_interval = years[years.length - 1] - years[0];
  if (year_interval > 10) {
    calc_early_year = getPrecentYear({
      years,
      years_map,
      total: interest_total,
      pre: Domain_Keyword_Trend_Show_Percent,
    });
  }

  let min_year = Math.max(years[0] - 3, calc_early_year - 3);

  let calc_slice_year_index;
  if (years.includes(min_year)) {
    calc_slice_year_index = years.indexOf(min_year);
  } else {
    calc_slice_year_index = years.indexOf(calc_early_year);
  }

  while (years.includes(min_year)) {
    min_year -= 1;
  }

  year_data_transpose = year_data_transpose.slice(calc_slice_year_index);

  const calc_data = calcInterestsData({
    transpose_data: year_data_transpose,
    years,
    min_year,
    max_year,
  });
  const result = valuableKeywords.map((item, index) => ({ key: item, values: calc_data[index] }));

  // console.log('result', result)
  // write('./outputData.json', JSON.stringify(result));
  return result;
};

const calcHotKeyword = data => {
  let keywordCount = data.map(keyword => ({
    key: keyword.term,
    value: keyword.trend.reduce((prev, cur) => (prev += cur.c), 0),
  }));
  keywordCount.sort((a, b) => b.value - a.value);
  return keywordCount;
};
