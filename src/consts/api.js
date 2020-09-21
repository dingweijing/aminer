/* eslint-disable no-unused-vars */

// API config for AMiner 2B 2C systems.

//
// * nextAPI go后端的API配置。兼容ccf和aminer系统。
//
// const nextAPIURLOnlineProduction = 'https://apiv2.aminer.cn';
const nextAPIURLOnlineProduction = 'http://192.168.11.216:4005';

let nextAPIURL; // eslint-disable-line
let GlobalEnableAPIDebug = false;

try {
  const { nextAPIURL: api, GlobalEnableAPIDebug: apidebug } = require('../config/.apiconfig'); // eslint-disable-line
  nextAPIURL = api;
  GlobalEnableAPIDebug = apidebug;
  // nextAPIURL = require('../../config/.apiconfig').nextAPIURL; // eslint-disable-line
} catch (error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('.config/apiconfig.js not found, use default setting;');
  }
}


if (!nextAPIURL) {
  //
  // * 基础设置 !
  // ! 禁止直接修改此处来修改API，请按下面方式操作：
  // !   1. 需要创建文件 temp/.apiconfig.js
  // !   2. 将下面代码复制到上述文件中，并随意修改。此文件不会提交到代码仓库。
  // !   2. 文件最后需要 export { nextAPIURL }
  //
  const nextAPIURLLocalhost = 'http://localhost:4005';
  const nextAPIURLOnlineBeta = 'https://apiv2-beta.aminer.cn';
  const nextAPIURLZw = 'https://apikjb.aminer.cn';
  nextAPIURL = process.env.NODE_ENV !== 'production'
    ? // ! 开发模式配置
    // nextAPIURLOnlineBeta
    // nextAPIURLLocalhost
    // nextAPIURLZw
    nextAPIURLOnlineProduction

    : // ! 线上模式配置
    // nextAPIURLOnlineBeta;
    nextAPIURLOnlineProduction;
  // nextAPIURLZw;
}


const strict = false; // 如果是strict模式，所有向下兼容的东西都会报错。
const openPages = ['/auth/login'];
const JSONP = [];
const CORS = [
  // nextAPIURL,
  // 'https://dc_api.aminer.org',
  // 'https://cross1.aminer.org',
];
const YQL = [];
const name = ''; // TODO 想干掉
const prefix = ''; // TODO 想干掉

//
// * 非Next的老后端。
//
const baseURL = 'https://api.aminer.cn/api';
const yutaoURL = 'http://166.111.5.228:5000';
const nodeURLOnline = 'https://nodeapi.aminer.cn';
const nodeURLLocal = 'http://localhost:8443';
const jconfUrl = 'http://192.168.6.222:8080';
const patentEsUrl = 'http://devel.aminer.cn:9200';
const nodeBaseURL = process.env.NODE_ENV !== 'production'
  ? // ! 开发模式配置
  // nextAPIURLOnlineBeta
  // nodeURLLocal
  nodeURLOnline

  : // ! 线上模式配置
  // nextAPIURLOnlineBeta;
  nodeURLOnline;


// 非nextAPI的api地址设置。用于老后端，和ccf后端等。

const param = (key, type, description) => ({ key, type, description });

const api = {
  // user system
  // currentUser: `${baseURL}/user/me`,
  userLogin: `${baseURL}/auth/signin`,
  userLogout: `${baseURL}/auth/signout`,
  signup: `${baseURL}/auth/signup`,
  checkEmail: `${baseURL}/user/check/src/:src/email/:email`,
  checkAminerEmail: `${baseURL}/user/check/:email`,
  updateProfile: `${baseURL}/user/:id`,
  updatePassword: `${baseURL}/auth/update/passwd`,
  forgot: `${baseURL}/auth/update/forgot`,
  // 重置密码
  retrieve: `${baseURL}/auth/update/token`,
  // 给user添加label {uid:'`,label:''}
  invoke: `${baseURL}/user/role/invoke`,
  // 删除user的label
  revoke: `${baseURL}/user/role/revoke`,
  listUsersByRole: `${baseURL}/user/role/list/:role/offset/:offset/size/:size`,
  // 创建邮件模板
  emailTemplate: `${baseURL}/user/mail/template/:src/:type`,
  getTemplate: `${baseURL}/user/mail/template/:src/:type`,

  // search
  searchPerson: `${baseURL}/search/person`, // pin=1 huawei mode.
  searchPersonAgg: `${baseURL}/search/person/agg`,
  searchPersonAdvanced: `${baseURL}/search/person/advanced`,
  searchPersonAdvancedAgg: `${baseURL}/search/person/advanced/agg`,
  searchPersonInBase: `${baseURL}/search/roster/:ebid/experts/advanced`,
  searchPersonInBaseAgg: `${baseURL}/search/roster/:ebid/experts/advanced/agg`,
  allPersonInBase: `${baseURL}/roster/:ebid/offset/:offset/size/:size`,
  allPersonInBaseWithSort: `${baseURL}/roster/:ebid/order-by/:sort/offset/:offset/size/:size`,
  allPersonInBaseAgg: `${baseURL}/roster/:ebid/agg?offset=&order=h_index&size=20`,
  // TODO agg

  searchVenue: `${baseURL}/search/venue`,

  searchMap: `${baseURL}/search/person/geo`, // ?query=:search
  searchExpertBaseMap: `${baseURL}/roster/:id/geo/offset/:offset/size/:size`,
  searchExpertNetWithDSL: `${baseURL}/person/ego/:id`,

  searchPubs: `${baseURL}/search/pub`, // ?query=xxx&size=20&sort=relevance`,

  // search suggest
  searchSuggest: `${baseURL}/search/suggest/gen/:query`,
  searchNameSuggest: `${baseURL}/search/suggest/person/:query`,

  // misc services
  translateTerm: `${baseURL}/abbreviation/mapping/:term`,

  // export roster
  rosterExportSimple: `${baseURL}/roster/:id/export/s/offset/:offset/size/:size/:name`,

  // seminar
  getSeminars: `${baseURL}/activity/list/offset/:offset/size/:size`, // src aid uid organizer type category stype
  getActivityById: `${baseURL}/activity/:id`,
  postActivity: `${baseURL}/activity/post_activity`,
  updateActivity: `${baseURL}/activity/update`,
  speakerSuggest: `${baseURL}/activity/speaker/suggest`,
  uploadActivityPosterImgFile: `${baseURL}/activity/img`,
  searchActivity: `${baseURL}/search/activity`,
  deleteActivity: `${baseURL}/activity/delete/:id`,
  getCommentFromActivity: `${baseURL}/comment/activity/:id/offset/:offset/size/:size`,
  addCommentToActivity: `${baseURL}/comment/activity/:id`,
  deleteCommentFromActivity: `${baseURL}/comment/activity/cmid/:id`,
  // score
  updateOrSaveActivityScore: `${baseURL}/activity/score/me/:src/:actid/:aid/:key/:score/:lvtime`,
  // 不知 key, 列出相关的 key 和 scores.
  listActivityScores: `${baseURL}/activity/score-list/:uid/:src/:actid`,
  // 已知 key 获取 一个 score
  getActivityScore: `${baseURL}/activity/score/:uid/:src/:actid/:aid/:key`,
  getStatsOfCcfActivities: `${baseURL}/activity/admin/stats`,
  keywordExtraction: 'http://nlp.newsminer.net/rest/nlp/keywords',
  getTopMentionedTags: `${baseURL}/activity/tags/:src/:num`,

  /* person */
  personProfile: `${baseURL}/person/summary/:id`,
  personEmailImg: `${baseURL}/person/email/i/`,
  personEmailStr: `${baseURL}/person/email/s/:id`,
  getEmailCrImage: `${baseURL}/person/email-cr/i/`,
  listPersonByIds: `${baseURL}/person/batch-list`,
  getActivityAvgScoresByPersonId: `${baseURL}/person/activity/:id/indices`,
  batchGetActivityCompareScoresByPersonId: `${baseURL}/person/activity/:ids/batch/indices`,
  getContributionRecalculatedByPersonId: `${baseURL}/person/activity/:id/indices?update=1`,

  // merge
  tryToDoMerge: `${baseURL}/bifrost/person/merge/:mid`,

  // interests vis data
  interests: `${baseURL}/person/interests/:id`, // 这个是vis图中单独调用的。和人下面的可能不一样.

  /* publications */
  pubList: `${baseURL}/person/pubs/:id/all/year/:offset/:size`,
  pubListByCitation: `${baseURL}/person/pubs/:id/all/citation/:offset/:size`,
  pubListInfo: `${baseURL}/person/pubs/:id/stats`,
  pubListByYear: `${baseURL}/person/pubs/:id/range/year/:year/:offset/:size`,
  pubListLimited: `${baseURL}/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size`,
  pubById: `${baseURL}/pub/summary/:id`,

  // System config
  ucListByCategory: `${baseURL}/2b/config/:source/list?category=:category`,
  ucSetByKey: `${baseURL}/2b/config/:source/:category/:key`,
  ucDeleteByKey: `${baseURL}/2b/config/:source/:category/:key`,
  ucUpdateByKey: `${baseURL}/2b/config/:source/:category/rename/:key/:newKey`,
  getCategoriesHint: `${baseURL}/2b/config/:source/category/suggest/:category`,
  listConfigsByCategoryList: `${baseURL}/2b/config/:source/by-category`,

  // topic
  getTopicByMention: `${baseURL}/topic/summary/m/:mention`,
  getTopicOnSkills: `${baseURL}/topic/person/topics/up/:id/toffset/:toffset/tsize/:tsize/uoffset/:uoffset/usize/:usize`,
  getTopicOfModal: `${baseURL}/topic/person/voter/up/:id/id/:tid/offset/:offset/size/:usize`,

  // vote
  votePersonInSomeTopicById: `${baseURL}/topic/person/vote/:oper/:aid/id/:tid`,
  unvotePersonInSomeTopicById: `${baseURL}/topic/person/vote/:aid/id/:tid`,

  // Recommendation APIs
  getAllOrgs: `${baseURL}/reviewer/orgs/get/all/:offset/:size`,
  // getOrgById: `${baseURL}/reviewer/org/get/:id`,

  // cross heat
  getDiscipline: 'https://cross1.aminer.org/topics?area=:area&k=:k&depth=:depth&context=',
  delDiscipline: 'https://cross1.aminer.org/feedback?parents=:parents&children=:children&postive=:postive',
  createDiscipline: `${baseURL}/cross-domain/query`,
  getTaskList: `${baseURL}/cross-domain/query/offset/:offset/size/:size`,
  getCrossTree: `${baseURL}/cross-domain/query/:id`,

  getDomainInfo: `${baseURL}/cross-domain/records/:beginYear/:endYear/:pubSkip/:pubLimit/:authorSkip/:authorLimit`,
  getCrossModalInfo: `${baseURL}/cross-domain/record/:domain1/:domain2/:beginYear/:endYear/:summary/:pubSkip/:pubLimit/:authorSkip/:authorLimit`,
  getExpertByIds: `${baseURL}/person/batch-list`,
  getPubByIds: `${baseURL}/pub/batch-list`,
  getSuggest: `${baseURL}/search/suggest/gen/:query`,
  getCrossPredict: `${baseURL}/cross-domain/predict`,

  addCrossField: `${baseURL}/crossing-field/query`,
  getCrossFieldById: `${baseURL}/crossing-field/query/:id`,
  getCrossFieldList: `${baseURL}/crossing-field/queries/:offset/:size`,
  delTaskList: `${baseURL}/crossing-field/query/:id`,

  getAggregate: `${baseURL}/crossing-field/aggregate/:method`,
  getACMDiscipline: `${baseURL}/knowledge-graph/:entry?rich=:rich&dp=:dp&dc=:dc&ns=:ns&nc=:nc`,
  // getExportCrossInfo: `${baseURL}/crossing-field/batch/aggregate`,


  // getProjects: API_BASE+"reviewer/projects/get/:offset/:size"
  // addProject: API_BASE+"reviewer/project/add"
  // getProjectById: API_BASE+"reviewer/project/get/:id"

  // getTaskById: API_BASE+"reviewer/task/get/:id"
  // recommend: API_BASE+"reviewer/recommend"
  // addExpertIDtoTask: API_BASE+"reviewer/addExpertIDtoTask"
  // getExpertsOfTask: API_BASE+"reviewer/getExpertsOfTask"
  //
  // listOrgs: API_BASE+"reviewer/orgs/get/:offset/:size"
  // addOrg: API_BASE+"reviewer/org/add"
  // getAllOrgs: API_BASE+"reviewer/orgs/get/all/:offset/:size"
  // removeOrgById: API_BASE+"reviewer/org/remove/:id"
  // addUserToOrg: API_BASE+"reviewer/user/add"npmn
  // SearchUserByEmail:API_BASE+"reviewer/user/get/:email"
  //
  // onlineSearch:API_BASE+"search/person"
  //
  // searchReviewer: "https://api.aminer.org/api/"+"reviewer/search"
  // searchRosterAdvc: API_BASE+"search/roster/:id/experts/advanced"
  //
  // removeTaskById: API_BASE+"reviewer/task/remove/:id"
  // removeProjectById: API_BASE+"reviewer/project/remove/:id"
  //
  // addTaskToProject: API_BASE+"reviewer/task/add/:pid"
  // saveTask: API_BASE+"reviewer/task/save/:tid"
  // # Protected
  // addInstAsProtectedByIid: API_BASE + "aff/person/protected/:iid"


  // userInfo: `${baseURL}/userInfo`,
  // users: `${baseURL}/users`,
  // dashboard: `${baseURL}/dashboard`,
  // expert info
  getExpertInfo: `${baseURL}/2b/profile/:src/offset/:offset/size/:size`,
  deleteItemByKey: `${baseURL}/2b/profile/:src/:id`,
  editItemByKey: `${baseURL}/2b/profile/:src/:id`,
  addExpertInfoApi: `${baseURL}/2b/profile/:src`,
  updateItemById: `${baseURL}/2b/profile/:src/:id`,
  searchItemByName: `${baseURL}/2b/profile/:src/offset/:offset/size/:size`,
  getToBProfileByAid: `${baseURL}/2b/profile/:src/aid/:id`,
  updateToBProfileExtra: `${baseURL}/2b/profile/:src/:id/extra`,

  getExpertBase: `${baseURL}/roster/list/:type/offset/:offset/size/:size`,
  addExpertBaseApi: `${baseURL}/roster`,
  addExpertToEB: `${baseURL}/roster/:ebid/a`,
  deleteExpertBaseApi: `${baseURL}/roster/:rid`,
  getExpertDetailList: `${baseURL}/roster/:ebid/order-by/h_index/offset/:offset/size/:size`,
  invokeRoster: `${baseURL}/roster/:id/members/u`,
  removeExpertsFromEBByPid: `${baseURL}/roster/:rid/d/:pid`,
  // getToBProfile: `${baseURL}/api/2b/profile/:src/:id`,
  getTrajectoryInfo: `${baseURL}/person/geo/trajectory/:id/year/:lo/:hi`,
  getHeatInfo: `${baseURL}/person/geo/trajectory/roster/:rid/year/:lo/:hi/size/:size`,
  getHeatByQuery: `${baseURL}/search/person/advanced/trajectory?name=:name&offset=:offset&org=:org&term=:term&size=:size`,

  // tools compare pubs
  getInfoForGraph: `${baseURL}/kit/cp_pub/getInfoForGraph/:name`,

  // Knowledge Graph
  kgFind: {
    api: `${baseURL}/knowledge-graph/:entry`,
    param: [ // means param in path.
      param('entry', 'string', 'query that matches name, name_zh, alias, in kgNode.'),
    ],
    query: {
      rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
      dp: param('dp', 'int', 'depth of parents'),
      dc: param('dc', 'int', 'depth of children'),
      ns: param('ns', 'int', 'number of sibling'),
      nc: param('nc', 'int', 'number of children'),
    },
  },
  kgGetByIds: {
    api: `${baseURL}/knowledge-graph/:id_chain`,
    param: [
      param('id_chain', 'string', 'e.g.: id1.id2.id3'),
    ],
    query: {
      rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
      dp: param('dp', 'int', 'depth of parents'),
      dc: param('dc', 'int', 'depth of children'),
      ns: param('ns', 'int', 'number of sibling'),
      nc: param('nc', 'int', 'number of children'),
    },
  },
  // CMS 部分
  // upload: `${nodeBaseURL}/api/upload`,
  // uploads: `${nodeBaseURL}/api/uploads`,
  // saveArticle: `${nodeBaseURL}/api/article/create`,
  // updateArticle: `${nodeBaseURL}/api/article/update`,
  // getList: `${nodeBaseURL}/api/article/list`,
  // getByIdForAdmin: `${nodeBaseURL}/api/articleadmin/`,
  // getById: `${nodeBaseURL}/api/article/`,
  // deleteById: `${nodeBaseURL}/api/article/`,

};


export {
  baseURL, nextAPIURL, nodeBaseURL, jconfUrl,
  nextAPIURLOnlineProduction,
  strict,
  openPages,
  JSONP,
  CORS,
  YQL,
  name,
  prefix,
  // AMiner restful API.
  api,

  GlobalEnableAPIDebug,
};
