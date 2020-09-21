import { sysconfig } from 'systems';
import { api as sapi, baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { zhCN } from 'locales';
import { apiBuilder, Action, F, H } from 'utils/next-api-builder';

// get one jocnfs.
export async function get(payload) {
  const { ids, schema } = payload;

  const nextapi = apiBuilder.create('jconf.get', 'GetJConf')
    .param({
      ids,
      // searchType: F.searchType.all,
      // haves: { eb: expertBases },
    })
    .schema({ jconf: schema || [] });
  return nextAPI({ data: [nextapi.api] });
}


// list all jconfs
export async function list(payload) {
  const { ids, offsite, size, schema } = payload;

  const nextapi = apiBuilder.create('jconf.list', 'ListJConf')
    .param({
      offsite, size,
      // ids,
      // searchType: F.searchType.all,
      // haves: { eb: expertBases },
    })
    .schema({ jconf: schema || [] });
  return nextAPI({ data: [nextapi.api] });
}

// Update JConf
export async function update(payload) {
  const { id, fields } = payload;
  // const opts = [{
  //   operator: 'upsert',
  //   fields: H.createFieldsArray(fields),
  // }];
  const nextapi = apiBuilder.create('jconfedit.Update', 'UpdateJconf')
    .param({ id, fields: H.createFieldsArray(fields) });
  console.log("opts", nextapi.api)
  return nextAPI({ data: [nextapi.api] });
  // return null
}
