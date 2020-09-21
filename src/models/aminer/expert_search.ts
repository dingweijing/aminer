/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import { sysconfig } from 'systems';
import { personSearchService } from 'services/aminer/search';
// import { translateService } from 'services/misc';
// import { topicService } from 'services/topic';
import searchHelper from 'helper/search';
import { PaginationProps } from 'antd/lib/pagination';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { isEqual } from 'lodash';

interface TagsinAPI {
  tags: string[];
  trans: string[];
}

interface AggregationItemType {
  count: number;
  value?: string;
  label: string;
}
interface AggregationType {
  item: AggregationItemType[];
  label: string;
  type: string;
}
interface SearchPersonAPI {
  aggregation?: AggregationType[];
  intellResults?: {};
  meta: {};
  pager?: { total: number };
  persons: ProfileInfo[];
  succeed: boolean;
  tags: TagsinAPI;
  topics?: [];
}
const handleIntellResults = intellResults => {
  const map = {
    Level: 'level',
    TranslatedText: 'transText',
    TranslatedLanguage: 'transLang',
    KnowledgeGraphHyponym: 'kgHyponym',
    KnowledgeGraphHypernym: 'kgHypernym',
  };

  const newJson = {};

  for (const key in map) {
    if (intellResults[key]) {
      let result = intellResults[key];
      if (key === 'KnowledgeGraphHypernym' || key === 'KnowledgeGraphHyponym') {
        result = result.map(item => ({
          word: item.Word,
          word_zh: item.WordZh,
          is_random: item.IsRandom,
        }));
      }
      newJson[map[key]] = result;
    }
  }

  return newJson;
};

const handleAggregation = (aggregation: AggregationType[]) => {
  const arrMap = {
    type: 'name',
    item: 'items',
  };
  const jsonMap = {
    nationality: 'nation',
    language: 'lang',
  };
  const newArr = [];

  for (const agg of aggregation) {
    const newJson = {};
    for (const key in arrMap) {
      if (agg[key]) {
        let result: string | AggregationItemType[] | Array<{ count: number; term: string }> = agg[key];
        if (jsonMap[result as string]) {
          result = jsonMap[result as string];
        }
        if (key === 'item') {
          result = (result as AggregationItemType[]).map(item => ({
            count: item.count,
            term: item.label,
          }));
        }

        newJson[arrMap[key]] = result;
      }
    }
    newArr.push(newJson);
  }
  return newArr;
};

const handlePersonTags = (data: SearchPersonAPI) => {
  const { persons, tags: all_tags } = data || {};
  const { tags, trans } = all_tags;
  persons.forEach(person => {
    const { ctags } = person;
    const person_tags = ctags && ctags.map(tag_num => tags[tag_num]);
    const person_tags_trans = ctags && ctags.map(tag_num => trans[tag_num]);
    person.tags = person_tags;
    person.tags_zh = person_tags_trans;
  });
  return persons;
};

// ---------------------------------------------------------------------------------------------
//
// ---------------------------------------------------------------------------------------------

export interface QueryType {
  query: string;
  advanced?: object | null;
}

export interface SortType {
  key: string;
}

export interface ExpertSearchType {
  query?: QueryType;
  filter?: object;
  sort?: SortType;
  pager?: object;
  tags?: object;
  smartQuery?: { texts: object[]; isNotAffactedByAssistant: boolean; typesTotals: boolean };
  pagination?: PaginationProps;
  isAdvancledSearch?: boolean;
  notTranslate?: boolean;
  results?: ProfileInfo[] | null;
  translate?: string | null;
  topics?: Array<{ i: string; k: string }>;
  aggregation?: Array<{ name: string; items: Array<{ term: string; count: string }> }>;
  domain?: string | null;
}

export default {
  namespace: 'expertSearch',

  state: {
    query: {},
    filter: {},
    sort: {}, // { key, d }
    keyValues: {},
    results: null, // search result.
    aggregation: null,
    pagination: {
      total: null,
    },

    devinfo: {},

    // 暂时保留，以后准备用其他方式替代
    isAdvancledSearch: null, // null 表示未设置

    // Intelligence search assistants. TODO change to assistantMeta, assistantData
    // assistantDataMeta: {}, // {advquery: texts: [...]} assistant控件传递来的参数
    smartQuery: {
      // rename from assistantDataMeta { texts, isNotAffactedByAssistant, typesTotals<扩展词或者上下位次的个数> }
      isNotAffactedByAssistant: true,
    },

    assistantData: null, // api返回的结果

    translate: null,
    notTranslate: false,

    domain: null,  // 搜索框前面的 domain

    // isNotAffactedByAssistant: true, // 标记没有点过翻译。点了就变成false了。碰过就不能用intell_expand了。
    // isSearchAbbr: true, // 默认搜索扩展词，当扩展词为空变为false
  },

  reducers: {
    // TODO 动态
    update(state: any, { payload }: { payload: any }) {
      // console.log('[Reducer::update] payload is - ', payload);
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
    },

    reset(state) {
      // reset parameters without query;
      state.filter = {};
      state.sort = {};
      state.results = null;
      state.aggregation = null;
      state.pagination = { total: null };
      state.translate = null;
      state.notTranslate = false;
    },

    clearAssistantDataMeta(state) {
      // TODO
      state.smartQuery = { isNotAffactedByAssistant: true };
    },

    toggleAdvancedSearch(state, { payload }) {
      state.isAdvancedSearch = !payload;
    },

  },

  effects: {
    search: [
      function* f({ payload }, { call, put, select }) {
        // const modeldata = yield select(state => state[namespace]); // TODO bug, searchmodelB
        const modeldata = yield select(state => {
          const { query, filter, sort, pagination, smartQuery, notTranslate, domain } = state.expertSearch;
          return {
            query,
            filter,
            sort,
            pagination,
            smartQuery,
            notTranslate,
            domain,
          };
        });

        let {
          query,
          filter,
          sort,
          pagination,
          smartQuery,
          assistantData,
          notTranslate,
          domain,
        } = modeldata; // almost all data get back;
        //
        const oldParam = { query, filter, sort, pagination, smartQuery, assistantQuery: '', domain };
        console.log('^^^Old Param is: ', oldParam);

        // switch configs passed to service.search.
        const config = {
          useAggregation: false, // need to recalculate aggregation.
          // hasQuery: true, // has query or advanced query.
          resetPagination: false,
          // hasNewPagination: false,
          resetFilter: false,
          resetNotTranslate: false,
        };

        // values need to update in reducer;
        const updates: ExpertSearchType = {};

        let newPagination: PaginationProps;
        let newFilter = null;

        // * pre-process changes; payload is changes.
        if (payload.reset) {
          filter = {};
        }

        Object.keys(payload).forEach(key => {
          const value = payload[key];
          switch (key) {
            // 如果进入了didmount，也就是换了一个SearchComponent，那么重置agg，分页等；
            case 'reset':
              if (value) {
                config.useAggregation = true;
                config.resetNotTranslate = true;
                // 但是如果传入的有pagination，也就是changes里面有paginiation，不要重置
                if (!payload.pagination) {
                  config.resetPagination = true;
                }
                // config.resetFilter = true;
              }
              break;

            case 'query':
              query = value;
              updates.query = value;
              config.useAggregation = true;
              config.resetNotTranslate = true;
              // 本来是如果query变了，那么重置分页；现在加一个条件，如果query变了同时传入了pagination，那么使用传入的分页；
              if (!payload.pagination) {
                config.resetPagination = true;
              }
              break;

            case 'domain':
              domain = value;
              updates.domain = value;
              config.useAggregation = true;
              config.resetNotTranslate = true;
              if (!payload.pagination) {
                config.resetPagination = true;
              }
              break;

            case 'pagination':
              // process pagination later;
              break;

            case 'sort':
              // 先假设一下sort是默认全排序的；
              sort = value;
              updates.sort = sort;
              config.resetPagination = true;
              break;

            case 'filterChange':
              newFilter = Object.assign({}, filter);
              newFilter = searchHelper.mergeToNewFilter(filter, value);
              filter = newFilter;
              updates.filter = filter;
              config.useAggregation = true;
              config.resetPagination = true;
              break;

            case 'smartQuery':
              smartQuery = value;
              updates.smartQuery = value;

              if (value.texts) {
                const newQuery = { ...query, advanced: { texts: value.texts } };
                query = newQuery;
                updates.query = newQuery;
              }
              config.resetPagination = true;

              break;

            case 'notTranslate':
              notTranslate = value;
              updates.notTranslate = value;
              config.resetPagination = true;
              break;
            default:
              break;
          }
        });

        // * pager
        const pchange = payload.pagination;
        // need update pager?
        if (
          pchange ||
          config.resetPagination ||
          !pagination ||
          !pagination.current ||
          !pagination.pageSize
        ) {
          newPagination = {
            // current: config.resetPagination ? 1 : (pchange && pchange.current ** zero bug** || pagination.current || 1,
            pageSize:
              (pchange && pchange.pageSize) || pagination.pageSize || sysconfig.MainListSize,
          };
          // 处理重置
          if (config.resetPagination) {
            newPagination.current = 1;
          } else {
            if (pchange && Object.prototype.hasOwnProperty.call(pchange, 'current')) {
              // and is number?
              newPagination.current = Math.max(pchange.current, 1); // make sure current >= 1
            } else {
              newPagination.current = pagination.current;
            }
          }
          pagination = newPagination;
          updates.pagination = pagination;
        }

        if (config.resetNotTranslate) {
          updates.notTranslate = false;
          notTranslate = false;
        }

        const defalutSortInSearch = sysconfig.defalutSortInSearch || 'relevance';

        if (!(sort && sort.key)) {
          updates.sort = { key: defalutSortInSearch };
        }

        const { schema, extra_ids, include, ebId } = payload;
        const params = {
          query,
          filter,
          sort,
          pagination, // basic search params
          smartQuery,
          assistantQuery: '', // intelligence search params
          schema,
          notTranslate,
          extra_ids,
          include,
          domain,
          ebId
        };

        if (payload.pageSize) {
          params.pagination.pageSize = payload.pageSize;
        }

        console.log('SEARCH: ', params);
        console.log('SEARCH ME ????  : ', isEqual(params, oldParam));

        console.log('SEARCH config is : ', config);
        console.log('SEARCH updates: ', updates);

        // * Call search
        const data = yield call(personSearchService[ebId ? 'searchEbPerson' : 'new_search'], params, config);
        // return

        if (data && data.success) {
          let result = data.data || {};
          if (ebId) {
            console.log('searchEbPerson11', data);
            result = {
              persons: data.data && data.data.items || [],
              pager: { total: data.data && data.data.total || 0 },
              aggregation: data.data && data.data.aggregation
            }
          }
          Object.keys(result).forEach(key => {
            const value = result[key];
            switch (key) {
              case 'aggregation':
                // updates[key] = value;
                updates.aggregation = ebId ? value : handleAggregation(value);
                // updates.aggregation = value;
                break;

              case 'intellResults':
                // updates.assistantData = handleIntellResults(value);
                updates.assistantData = value;
                updates.translate = !notTranslate && value && value.transText;
                break;

              case 'topics':
                updates.topics = value;
                break;

              case 'persons':
                // items 是强制的，如果返回结果没有items，那么也要强制置空；
                break;

              case 'pager':
                if (updates.pagination) {
                  updates.pagination.total = value.total;
                } else {
                  updates.pagination = {
                    total: value.total,
                  };
                }
                break;
              case 'tags':
                updates.persons = handlePersonTags(result);
                break;

              // case 'duration':
              //   updates.devinfo = {
              //     time: value,
              //   };
              //   break;
              default:
                break;
            }
          });

          // 强制设置返回值；
          updates.results = result.persons || [];

          yield put({ type: 'update', payload: updates });
        }
      },
      { type: 'takeLatest' },
    ],

    *getMoreKG({ payload }, { call, put }) {
      const { data } = yield call(personSearchService.create_dm_intellwords_expand, payload);
      yield put({ type: 'update', payload: { assistantData: data.items && data.items[0] } });
    },
  },
};
