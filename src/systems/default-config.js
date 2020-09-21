/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { enUS, zhCN } from 'locales';
import defaults from 'acore/hole';
import { TopExpertBase } from 'consts/expert-base';
import pubHelper from 'helper/pub';
import { CommonQuickSearchList } from './system-common';

// TODO Refactor: move to something.

// 默认配置
export default (system, source) => ({
  SYSTEM: system,
  SOURCE: source,

  //
  // Systems Preference
  //
  Locale: enUS, // en, zh
  EnableLocalLocale: false, // 将Locale存储到localStorage
  GLOBAL_ENABLE_HOC: true, // 是否启用权限验证HOC.
  Use_CDN: true, // 头像是否使用CDN，还是直接使用static.aminer.org
  GLOBAL_ENABLE_FEEDBACK: false, // 是否显示feedback
  Is2C: false, // 是否是2C系统。默认false为2B系统。

  // Login system. // TODO change to Use AuthSuit.
  AuthSuit: '2bauthsuit',
  Auth_AllowAnonymousAccess: false,
  Auth_LoginPage: '/login',
  AuthLoginUsingThird: false, // 使用第三方登录界面，目前只有tencent在用
  AuthLoginUsingThirdPage: null,

  // google analysis
  googleAnalytics: 'UA-1156684-2', // default aminer code

  MainListSize: 20,

  DefaultUrlAfterLogin: '/',

  /**
   * Layout related
   */
  PageTitle: 'Aminer',
  Layout_HasSideBar: false, // 是否显示左侧菜单
  Layout_HasNavigator: true,
  Layout_ShowHeader: true, // 是否显示header

  // header
  Header_UserPageURL: defaults.IN_COMPONENT_DEFAULT, // 用户头像点击之后去的页面.
  ShowHelpDoc: false, // 显示帮助文档
  Header_UserNameBlock: defaults.IN_COMPONENT_DEFAULT, // 显示登录用户名

  /**
   * functionality
   */

  // user login system
  ShowRegisteredRole: true, // 注册页面是否显示角色配置
  Signup_Password: false, // 注册页面password
  UserInfo_Batch_Signup: false, // 批量创建用户 目前只有huawei在用
  ShowIndependentRegister: false, // 是否显示自主注册

  // export
  Enable_Export: false,
  Enable_Export_EB_IF_EXIST: false,
  Enable_Export_size: 500,

  /**
   * > Search/
   */
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  ExpertBases: [], // must override.
  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: '全球专家',

  // Search Page
  SearchPagePrefix: 'search', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false, // TODO bad：Huawei PIN
  Search_EnableCCFPin: false, // TODO bad：CCF PIN

  // AI search helper translation/expand/kg
  Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;/
  Search_DefaultTranslateSearch: true, // 默认使用翻译搜索;
  Search_EnableSmartSuggest: false, // 启用智能提示;  启用后，禁用translateSearch
  Search_SmartSuggest_EnableExpand: false, // TODO
  Search_SmartSuggest_EnableTranslate: false, // TODO
  Search_SmartSuggest_EnableKG: false, // TODO

  Search_EnableKnowledgeGraphHelper: true,
  Search_FixedExpertBase: null,


  Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: false,
  // Search_DisableSearchKnowledge: false,

  Search_SortOptions: defaults.IN_COMPONENT_DEFAULT,

  // > Search related
  HeaderSearch_TextNavi: defaults.IN_COMPONENT_DEFAULT, // use default settings in component.
  HeaderSearch_DropDown: false, // 默认没有下拉选择
  SearchFilterExclude: '', // 'Gender',
  UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  UserAuthSystem: system, // aminer 或者是 system.config; TODO 不要用system，用aminer或者2b.
  UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

  CommentChannel: 'pub', // 添加删除XXX评论

  /**
   * Page specified config.
   */

  /**
   * PersonList
   */
  PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}?token=bianyigetoken`,
  PersonList_PersonLink_NewTab: true,
  PersonList_DidMountHooks: defaults.EMPTY_ZONE_FUNC,
  PersonList_UpdateHooks: defaults.EMPTY_ZONE_FUNC,
  Search_CheckEB: false,
  PaperLink: (paperId, paperTitle) => pubHelper.genPubTitle({ id: paperId, title: paperTitle }),

  /**
   * IndexPage
   */
  // IndexPage_Redirect: '', // 如果不为空，重定向到给定页面. // deprecated by gb 2018-08-29;
  IndexPage_QuickSearchList: CommonQuickSearchList,

  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  // Topic Trend
  TopicTrend_HotTopics_old: [
    'Artificial Intelligence', 'Autopilot', 'Big Data', 'BlockChain',
    'Computer Vision', 'Data Mining', 'Data Modeling', 'Deep Learning', 'Graph Databases',
    'Internet of Things', 'Machine Learning', 'Robotics', 'Networks',
    'Natural Language Processing', 'Neural Network',
  ],

  TopicTrend_HotTopics: [
    { enUS: 'Artificial Intelligence', zhCN: '人工智能' },
    { enUS: 'Autopilot', zhCN: '自动驾驶' },
    { enUS: 'Big Data', zhCN: '大数据' },
    { enUS: 'BlockChain', zhCN: '区块链' },
    { enUS: 'Computer Vision', zhCN: '计算机视觉' },
    { enUS: 'Data Mining', zhCN: '数据挖掘' },
    { enUS: 'Data Modeling', zhCN: '数据建模' },
    { enUS: 'Deep Learning', zhCN: '深度学习' },
    { enUS: 'Graph Databases', zhCN: '图数据库' },
    { enUS: 'Internet of Things', zhCN: '物联网' },
    { enUS: 'Machine Learning', zhCN: '机器学习' },
    { enUS: 'Robotics', zhCN: '机器人' },
    { enUS: 'Networks', zhCN: '网络' },
    { enUS: 'Natural Language Processing', zhCN: '自然语言处理' },
    { enUS: 'Neural Network', zhCN: '神经网络' },
  ],

  // Map Related,2 is recommended!
  Map_Preload: 0, // 0的时候不缓存，1的时候缓存信息，2的时候缓存信息和90头像，3的时候缓存信息和90、160头像
  CentralPosition: { lat: 37.09024, lng: -95.712891 },
  Map_HotDomains: TopExpertBase.RandomTop100InDomainAminer, // 地图领域
  Map_HotDomainsLabel: 'Most Influential Scholars:', // 地图领域的描述
  HotDomains_Type: 'filter', // filter or selector
  Map_FilterRange: true, // 地图range默认显示
  Map_ShowTrajectory: false, // 地图上是否显示迁徙地图

  Charts_Type: 'bmap', // bmap or geo

  /**
   * Replace Hooks.
   */
  Register_AddPrivilegesToExpertBaseIDs: [],

  // > Admin Users
  Admin_Users_ShowAdmin: true,
  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO

  // 临时属性，过度属性
  USE_NEXT_EXPERT_BASE_SEARCH: false, // 是否使用新的后端来搜索新的结果。

  //
  // Expertbase Related.
  //

  // by @Elivoa: 这种不应该在default里面。
  // EB_LayoutSkin: 'expertbase-in-demo', // 智库在Layout上的skin名字，用于适配各种环境；

  // 测试修改活动是否使用新的编辑
  SeminarNewEditor: false,
  // ccf activity 专家评分是否显示
  ShowRating: false,
  // 卖智库的系统，是否显示价格
  ShowPrice: false,
  // 默认订阅智库，添加到个人，但是有的系统需要添加到整个系统,默认添加到系统，只有expertbase(toC)系统添加到个人
  Add_ShareEB_To_Person: false,
  // 是否展示个人所在分类，默认不显示
  ShowClassification: false,
  // 是否展示topic页面的领域关联tab，目前华为不显示
  ShowDomainAssociation: true,
  // 是否显示右上角智库专家收藏悬浮按钮
  ShowBufferBasket: false,
  // 是否显示智库专家更新naton（重算信息）按钮
  ShowUpdateNation: false,
  show_UserSelf_Signup: false, // 登录页 是否展示自主注册的按钮， 目前只有新reco在用

  // temp configs
  TEMP_NEW_HEADER_SEARCH: false,
  disableExpertBaseFilter: true
});
