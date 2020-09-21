/**
 * Create By Shaozhou
 */
import { nextAPI, request } from 'utils';
import { apiBuilder } from 'utils/next-api-builder';
import { api } from 'consts/api';

export async function searchPubById(query) {
  return request(api.pubById.replace(':id', query));
}

// export async function searchTrendByTerm(term) { //最开始的方式来计算趋势
//   const url = 'https://dc_api.aminer.cn/trend/:term';//和使用Aminer API的保持一样
//   return request(url.replace(':term', term));
// }
// export async function searchTrendByTerm({ term, advquery }) {
//   console.log('===================hit=======================');
//   const nextapi = apiBuilder.create('trend2.GenTrend', 'getTrend')
//     .param({ query: term, size: 11, searchType: "all", advquery })
//     .schema({ person: ["id", "name", "profile.org"] });
//   return nextAPI({ data: [nextapi.api] });
// }

// export async function searchTrendByTerm2({ term, advquery }) {
//   const nextapi = apiBuilder.create('trend2.GenTrend', 'getTrend')
//     .param({ query: term, size: 11, searchType: "all", advquery })
//     .schema({ person: ["id", "name", "profile.org"] });
//   return nextAPI({ data: [nextapi.api] });
// }


export async function searchPubByKeyword(keyword, beginYear, endYear) {
  // console.log(keyword,beginYear,endYear);
  const nextapi = apiBuilder.create('trend2.PubSearch', 'getPub')
    .param({
      query: keyword,
      size: 100,
      searchType: 'all',
      offset: 0,
      filters: {
        ranges: {
          year: [beginYear, endYear]
        }
      }
    })
    .schema({
      publication: [
        "id",
        "title",
        "authors",
        "year",
        "n_citation",
        "authors._id",
        "authors.name",
        "abstract"
      ]
    });
  
  var res = nextAPI({ data: [nextapi.api] });
  // res.then(
  //   (data)=>{
  //     console.log('newapi',data);
  //   }
  // )

  return res;
}

// export async function searchTrendByConfs(term) { //新增加的根据期刊会议来生成trend
//   const url = 'https://dc_api.aminer.cn/trend/confs_trend';
//   request(url, { method: 'post', data: term });
// }
