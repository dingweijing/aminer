/* eslint-disable no-unused-vars */

//
// * 非Next的老后端，或者CCF这样的restfulAPI配置。
//

const baseURL = process.env.NODE_ENV !== 'production'
  ? // ! 开发模式配置
  'https://api_node_beta.aminer.org' // URLOnlineBeta
  // 'http://localhost:7001' // nextAPIURLLocalhost

  : // ! 线上模式配置
  'https://api_node_beta.aminer.org' // URLOnlineBeta
  // 'online production' // URLOnlineProduction;
  ;

// 非nextAPI的api地址设置。用于老后端，和ccf后端等。
const api = {
  // user system
  userLogin: `${baseURL}/api/user/access/login`,
  userLogout: `${baseURL}/auth/signout`,
  currentUser: `${baseURL}/api/user/access/current`,
  signup: `${baseURL}/auth/signup`,
  // org
  createOrg: `${baseURL}/api/org/create`,
  deleteOrg: `${baseURL}/api/org/delete`,
  updateOrg: `${baseURL}/api/org/update`,
  hiddenOrg: `${baseURL}/api/org/hidden`,
  findOrgById: `${baseURL}/api/org/findOrgById`,
  findOrgByClientId: `${baseURL}/api/org/findOrgByClientId`,
  getConfig: `${baseURL}/api/config/get_config_by_client`,
  updateConfig: `${baseURL}/api/config/update_config`,
  newBanner: `${baseURL}/api/config/add_banner_src`,
  deleteConfig: `${baseURL}/api/config/detele_header_type`,
  getInterestArea: `${baseURL}/api/get_all_interesting_domain`,
  updateInterestArea: `${baseURL}/api/update_interesting_domain`,
  // source
  createSource: `${baseURL}/api/source/create`,
  getSource: `${baseURL}/api/source/:key`,
  deleteSource: `${baseURL}/api/source/:id`,
  // roles
  getRoles: `${baseURL}/api/role`,
  newRole: `${baseURL}/api/role`,
  deleteRole: `${baseURL}/api/role/:id`,
  // user
  getUserList: `${baseURL}/api/userlist/:user_id`,
  createUser: `${baseURL}/api/user/signup`,
  changePsw: `${baseURL}/api/user/changepwd`,
  deleteUserById: `${baseURL}/api/user/destroy/id/:id`,
  // resource
  searchSource: `${baseURL}/api/search/es`,
  viewDetails: `${baseURL}/api/view/details`,
  pushTask: `${baseURL}/api/message/add`,
  // push
  searchPush: `${baseURL}/api/reco/search`,
  shieldTask: `${baseURL}/api/message/delete`,
  // source count
  getAllCount: `${baseURL}/api/statis/get_all_reco_count/:client_id`,
  getPushingCount: `${baseURL}/api/statis/get_pushing_reco_count/:client_id`,
  getPushedCount: `${baseURL}/api/statis/get_pushed_reco_count/:client_id`,
  getTodayPush: `${baseURL}/api/statis/get_today_reco_count/:client_id`,
  // sourceStat
  getNewsList: `${baseURL}/api/source/user/:id?source=news`,
};

export { baseURL, api };
