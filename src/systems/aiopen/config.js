import { zhCN, enUS } from 'locales';
import consts from 'consts';

export default {

  // * Framework settings.
  SSR: true,
  EnableLocale: true, // 是否开启Locale支持。【Framework Settings】
  Locale: zhCN, // enUS, zhCN, "auto" - 自动判断语言，根据浏览器的语言环境。
  EnableLocalLocale: true, // 是否将Locale存储到localStorage.

  // * others

  AuthSuit: '2bauthsuit',

  GLOBAL_ENABLE_FEEDBACK: true,

  Auth_AllowAnonymousAccess: true,
  AuthSupportAMinerCookie: true,
  PageTitle: 'AMiner',
  PageDesc: 'AMiner利用数据挖掘和社会网络分析与挖掘技术，提供研究者语义信息抽取、面向话题的专家搜索、权威机构搜索、话题发现和趋势分析、基于话题的社会影响力分析、研究者社会网络关系识别等众多功能。',


  // basic configs
  Pub_SimilarPaper_Pagesize: 30,
  Pub_ReferencePaper_Pagesize: 30,
  Pub_CitedPaper_Pagesize: 30,

  Pub_Comment_PageSize: 100,

  Pub_Abstract_Chop_Num: 340,

  Pub_Authors_FirstShow: 5, // 论文作者列表第一次显示的人数
  Pub_Authors_TinyShow: 5, // 论文作者列表简略模式显示的人数
  Pub_Authors_ShowMore: 20, // 论文作业列表最多显示的人数

  PubList_Show_Authors_Max: 12,

  Profile_List_Length: 100,
  AuthLogoutReload: true,

  Layout_HasSideBar: true,

  AI2000_Latest_Year: 2019,
  AI2000_Default_Year: 2019,

  PlaceImagePath: `${consts.ResourcePath}/sys/aminer/placeholder.png`,
  // ICONFONT_LINK: `${consts.ResourcePath}/sys/aminer/iconfont.js`,
  ICONFONT_LINK: '//at.alicdn.com/t/font_1190641_we1axgasq9e.js',

  Auth_LoginPage: '/login', // change to next

  AuthPages: {
    Login: '/login',
    Signup: '/signup',
    ForgetPassword: '/forgotpassword', // name?
  },

  Search_EnableSmartSuggest: true,

  googleAnalytics: 'UA-1156684-2',

  UserAuthSystem: 'aminer',
};
