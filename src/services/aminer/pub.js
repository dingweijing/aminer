import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

const api = {
  pub: `${baseURL}/pub/summary/:id`,
  abstract: `${baseURL}/pub/abstract/:id`,
  citation: `${baseURL}/pub/citation/get/:id`,
  reference: `${baseURL}/pub/reference/get/:id`,
  addComment: `${baseURL}/pub/comment/add/:id`,
  listComment: `${baseURL}/pub/comment/list/:id`,
  removeComment: `${baseURL}/pub/comment/remove/:id`,
  saveRating: `${baseURL}/pub/rating/save/:id`,
  getRating: `${baseURL}/pub/rating/get/:id`,
  getUserRating: `${baseURL}/pub/rating/getu/:id`,
  recentCitesByPid: `${baseURL}/pub/cite/:id/rec/offset/:offset/size/:size`,
  refsByPid: `${baseURL}/pub/ref/:id/offset/:offset/size/:size`,
  similarPubsByPid: `${baseURL}/pub/sim/:id/offset/:offset/size/:size`,
  refsSimilarPubsByPid: `${baseURL}/pub/:type/:id/offset/:offset/size/:size`,
  createNewPubByMeta: `${baseURL}/pub/create/meta`,
  createNewPubByFile: `${baseURL}/pub/create/file`,
  createEsiPubFromFile: `${baseURL}/pub/create/esi/file`,
  addReadinglist: `${baseURL}/pub/readinglist/add/:id`,
  listReadinglist: `${baseURL}/pub/readinglist/list`,
  removeReadinglist: `${baseURL}/pub/readinglist/remove/:id`,
  pdf: `${baseURL}/pub/pdf/upload`,
  pdfsimple: `${baseURL}/pub/pdf/uploadSimple`,
  pdfmetaupdate: `${baseURL}/pub/pdf/confirm`,
  patent: `${baseURL}/patent/:name/:start/:size`,
  patentAbstract: `${baseURL}/patent/get/:id`,
  getRecentPatentList: `${baseURL}/person/patents/:id/all/year/:offset/:size`,
  getRecentProjectList: `${baseURL}/person/projects/:id/all/year/:offset/:size`,

  commentPub: `${baseURL}/comment/:type/:id`,
  deleteComment: `${baseURL}/comment/:type/cmid/:id`,
  pubLike: `${baseURL}/comment/:type/:id/like`,

  getPubTag: `${baseURL}/pub/tag/pid/:id/g/up/offset/:offset/size/:size`,
  getUserPubTag: `${baseURL}/pub/tag/pid/:id/u/up/offset/:offset/size/:size`,
  addTag: `${baseURL}/pub/tag/pid/:id/u/up/tag/:tag`,

  uploadFile: `${baseURL}/pub/pdf/uploadSimple`
}

export async function getSummary(params) {
  const { id } = params;
  return request(api.pub.replace(':id', id))
}

export async function getSimilarPubsByPid(params) {
  const { id, offset, size } = params;
  return request(api.similarPubsByPid.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function getRefsByPid(params) {
  const { id, offset, size } = params;
  return request(api.refsByPid.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function getRecentCitesByPidTopN(params) {
  const { id, ...rest } = params;
  const nextapi = apiBuilder.create('publication.CitedByPidTopN', 'getCited')
    .param({ ids: [id], ...rest });
  return nextAPI({ data: [nextapi.api] });
  // return request(api.recentCitesByPid.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function getRecentCitesByPid(params) {
  const { id, ...rest } = params;
  const nextapi = apiBuilder.create('publication.CitedByPid', 'getCited')
    .param({ ids: [id], ...rest });
  return nextAPI({ data: [nextapi.api] });
  // return request(api.recentCitesByPid.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function setMarkErrorPicture({ id }) {
  const nextapi = apiBuilder.create('publication.MarkErrorPicture', 'MarkErrorPicture')
    .param({ pids: id, });
  return nextAPI({ data: [nextapi.api] });
}

export async function RemoveWrongImage({ id, urls }) {
  const nextapi = apiBuilder.create('publication.RemoveWrongImage', 'RemoveWrongImage')
    .param({ id: id, urls, });
  return nextAPI({ data: [nextapi.api] });
}

export async function commentPub(params) {
  const { id, type, body } = params;
  return request(api.commentPub.replace(':id', id).replace(':type', type), {
    method: 'POST',
    data: body
  })
}

export async function deleteComment(params) {
  const { id, type } = params;
  return request(api.deleteComment.replace(':type', type).replace(':id', id), {
    method: 'DELETE'
  })
}

export async function getRating({ id }) {
  return request(api.getRating.replace(':id', id))
}

export async function getUserRating({ id }) {
  return request(api.getUserRating.replace(':id', id))
}

export async function saveRating(params) {
  const { id, body } = params;
  return request(api.saveRating.replace(':id', id), {
    method: 'POST',
    data: body
  })
}

export async function getPubTag(params) {
  const { id, offset, size } = params;
  return request(api.getPubTag.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function getUserPubTag(params) {
  const { id, offset, size } = params;
  return request(api.getUserPubTag.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

export async function addTag(params) {
  const { id, tag, body } = params;
  return request(api.addTag.replace(':id', id).replace(':tag', tag), {
    method: 'POST',
    data: body
  })
}

export async function deleteTag(params) {
  const { id, tag } = params;
  return request(api.addTag.replace(':id', id).replace(':tag', tag), {
    method: 'DELETE'
  })
}

export async function pubLike(params) {
  const { id, body, type } = params;
  return request(api.pubLike.replace(':type', type).replace(':id', id), {
    method: 'POST',
    data: body
  })
}

export async function pubUnlike(params) {
  const { id, type } = params;
  return request(api.pubLike.replace(':type', type).replace(':id', id), {
    method: 'DELETE'
  })
}

export async function uploadFile(params) {
  const { body } = params;
  return request(api.uploadFile, {
    method: 'POST',
    data: body
  })
}

// no use
// export async function getBestPaper(params) {
//   const { ids } = params;
//   const nextapi = apiBuilder.create(Action.publication.bestpaper, 'getBestPaper')
//     .param({ ids });

//   return nextAPI({ data: [nextapi.api] });
// }

export async function getProfile(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.publication.GetProfile, 'getProfile')
    .param({ ids: [id] });
  return nextAPI({ data: [nextapi.api] });
}

export async function getPaperPageData(payload) {
  const nextapi = apiBuilder.create('pub.GetPageData', 'getPaperData')
    .param(payload)
    .schema({ publication: F.fields.paper.full });
  return nextAPI({ data: [nextapi.api] });
}

// export async function getPaperPdf({ schema, ...params }) {
//   const nextapi = apiBuilder.create('pub.GetPageData', 'getPaperPdf')
//     .param(params)
//     .schema(schema);
//   return nextAPI({ data: [nextapi.api] });
// }


export async function getPersonPubNum({ schema, ...params }) {
  const nextapi = apiBuilder.create('publication7.SearchPubsCommon', 'getPersonPubNum')
    .param(params)
    .schema(schema);
  return nextAPI({ data: [nextapi.api] });
}

export async function getPDFInfoByPIDs(payload) {
  const nextapi = apiBuilder.create('publication.GetPDFInfoByPIDs', 'GetPDFInfoByPIDs')
    .param(payload)
    .schema({ publication_pdf_info: F.fields.paper.pdfInfo });
  return nextAPI({ data: [nextapi.api] });
}

export async function getTopicCited(payload) {
  const nextapi = apiBuilder.create('topic.GetTopicCited', 'getTopicCited')
    .param(payload)
  return nextAPI({ data: [nextapi.api] });
}

export async function updateResources({ type, ...params }) {
  const nextapi = apiBuilder.create(`pub.UpdateResources${type}`, 'updateResources')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function getScholarScite({ query }) {
  return request(`https://api.scholarcy.com/scite_tallies?query=${query}`)
}

export async function getScholarFunding({ query }) {
  return request(`https://api.scholarcy.com/query_findings?query=${query}`)
}


export async function getPaperVersion(params) {
  const nextapi = apiBuilder.create('Publication.ListPubVersion', 'getPaperVersion')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdatePubByVersion(params) {
  const nextapi = apiBuilder.create('Publication.UpdatePubByVersion', 'UpdatePubByVersion')
    .addParam(params);
  return nextAPI({ data: [nextapi.api] });
}
