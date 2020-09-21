import { nodeBaseURL, baseURL } from 'consts/api';
import { request } from 'utils';

const api = {
  getReportList: `${nodeBaseURL}/api/article/list/pagination`,
  // getReportList: `${nodeBaseURL}/api/article/list`,
  getReport: `${nodeBaseURL}/api/article/:id`,
  getRosterAward: `${baseURL}/roster/award/:id/offset/0/size/100`,
  // getDailyNews: 'http://192.168.6.188:8443/api/article/autoreco/:size'
  getDailyNews: `${nodeBaseURL}/api/article/autoreco/:size`,
  addViewById: `${nodeBaseURL}/api/article/view/:id`,
  getKeywords: `${nodeBaseURL}/api/article/aggr/:size`,
  getReportRank: `${nodeBaseURL}/api/article/getRank`,
  getReportListByKey: `${nodeBaseURL}/api/article/search`,
  getAds: `${nodeBaseURL}/api/data/aminer_article_ads`,
  setUserLiked: `${nodeBaseURL}/api/article/like/:id`,
};

export async function getReportList(params) {
  return request(api.getReportList, {
    method: 'POST',
    body: params,
  });
}

export async function getReport(params) {
  const { id } = params;
  return request(api.getReport.replace(':id', id));
}

export async function getRosterAward(params) {
  const { id } = params;
  return request(api.getRosterAward.replace(':id', id));
}

export async function getDailyNews(params) {
  const { size = 4 } = params;
  return request(api.getDailyNews.replace(':size', size));
}

export async function addViewById(params) {
  const { id } = params;
  return request(api.addViewById.replace(':id', id));
}

export async function getReportRank(params) {
  return request(api.getReportRank, {
    method: 'POST',
    body: params,
  });
}

export async function getKeywords({size}) {
  return request(api.getKeywords.replace(':size', size));
}

export async function getReportListByKey(params) {
  return request(api.getReportListByKey, {
    method: 'POST',
    body: params,
  });
}

export async function getAds() {
  return request(api.getAds);
}

export async function setUserLiked({ id }) {
  return request(api.setUserLiked.replace(':id', id));
}
