/**
 * Created by yangyanmei on 17/8/31.
 */
import { request, nextAPI } from 'utils';
// import { api } from 'consts/api';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

export async function DeleteTopic({ id }) {
  const nextapi = apiBuilder.create(Action.mustreading.DeleteTopic, 'DeleteTopic').param({
    id,
  });
  return nextAPI({ data: [nextapi.api] });
}

export async function getTopicByMention(mention) {
  // return request(api.getTopicByMention.replace(':mention', mention), { method: 'GET' });
  const nextapi = apiBuilder.create(Action.entity.GetFreqInfo, 'SEARCH').param({
    // must have types;
    name: mention,
  });

  // * debug print
  //
  //

  // * call nextAPI search.
  return nextAPI({ data: [nextapi.api] });
}

export async function getTopicById(payload) {
  const {
    pagination,
    searchType = 'all',
    topic_sort = 'year',
    topic_id,
    sort = 'must_reading',
    query = '',
  } = payload;
  const esSearchCondition = {
    include_and: {
      conditions: [
        {
          search_type: 'query_string',
          fields_raw: ['keywords'],
          to_score: false,
          query: `(${query})`,
        },
      ],
    },
  };

  const nextapi = apiBuilder
    .create(Action.search.SearchPubsCommon, 'SEARCH')
    .param({
      offset: (pagination && (pagination.current - 1) * pagination.pageSize) || 0,
      size: (pagination && pagination.pageSize) || 20,
      searchType: searchType || F.searchType.all,
      switches: ['lang_zh'],
      aggregation: ['keywords', 'author'],
      search_tab: 'topic',
      topic_sort,
      topic_ids: [topic_id],
      sorts: [sort],
      agg_terms_field: {
        author: ['name_zh', 'avatar'],
      },
    })
    .addParam({ es_search_condition: esSearchCondition }, { when: query && query !== '' })
    .schema({ publication: F.fields.paper.forSearch });
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
