/**
 * AMiner system config
 */

// import React from 'react';
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
  PageDesc:
    'AMiner利用数据挖掘和社会网络分析与挖掘技术，提供研究者语义信息抽取、面向话题的专家搜索、权威机构搜索、话题发现和趋势分析、基于话题的社会影响力分析、研究者社会网络关系识别等众多功能。',

  // basic configs
  Pub_SimilarPaper_Pagesize: 30,
  Pub_ReferencePaper_Pagesize: 30,
  Pub_CitedPaper_Pagesize: 30,

  Show_Questionnaire: true,
  Questionnaire_Start_Date: '2020-04-30 00:00:00',
  Questionnaire_End_Date: '2020-06-01 00:00:00',

  REQUIRE_TOPICS_LENGTH: 100,
  REQUIRE_RECOMMEND_NUM: 6,

  CATEGORY_COLORS_DEFAULT: ['#0095FF', '#FF9348', '#FFBD00', '#6B5AFF', '#E4484F', '#00936b'],

  // TODO ... use in API;
  Topic_Open_Ids: [ // 开放的 topic
    '5e7d9a78ea0348b7e22eddb2', // 新冠肺炎
    '5e7d9a78ea0348b7e22edd9a', // 认知图谱
    '5e7d9a78ea0348b7e22edd90', // 对话系统和聊天机器人
    '5e7ef61ac1b7e55a5aea64d1', // 知识图谱
    '5e7ed98a3357bd9befb4ae15', // 数据挖掘
    '5e7ed98a3357bd9befb4ae1a', // 操作系统
    '5e7ed98a3357bd9befb4ae1e', // 模式识别
    '5e7ef61ac1b7e55a5aea64ce', // 对抗学习
    '5e7d9a78ea0348b7e22edd74', // 数据库
    '5e7d9a78ea0348b7e22edd78', // 人机交互
    '5e7d9a78ea0348b7e22edd7c', // 主题模型
    '5e7d9a78ea0348b7e22edd84', // 连接分析
    '5e7d9a78ea0348b7e22edd85', // 马尔可夫网络
    '5e7d9a78ea0348b7e22edd87', // 多任务学习
    '5e7d9a78ea0348b7e22edd89', // 神经网络
    '5e7d9a78ea0348b7e22edd93', // 机器学习
    '5e7d9a78ea0348b7e22edd94', // 物体识别
    '5e7d9a78ea0348b7e22edd96', // 计算机视觉
    '5e7d9a78ea0348b7e22edd97', // 深度学习
    '5e7d9a78ea0348b7e22eddab', // 信息提取
    '5e7d9a78ea0348b7e22eddac', // 自然语言生成
    '5e7eec9847fc9111a8514ae6', // 排序学习
    '5e7ef61ac1b7e55a5aea64dc', // 时间序列分析
    '5e7d9a78ea0348b7e22edd7d', // 信息检索与推荐
    '5e7d9a78ea0348b7e22eddb5', // 文本分类
    '5e7d9a78ea0348b7e22edd80', // 机器翻译
    '5e7ed98a3357bd9befb4ae17', // 软件工程
    '5e7ef61ac1b7e55a5aea64d6', // 视频内容分析
    '5e7d9a78ea0348b7e22edd99', // 图神经网络
    '5e7f3d0bb3b8848a5b778a03', // 自动机器学习
    '5e7ef61ac1b7e55a5aea64cf', // 卷积神经网络
    '5e7d9a78ea0348b7e22edd6f', // 语音识别
    '5e7ef61ac1b7e55a5aea64d0', // 迁移学习
    '5e7d9a78ea0348b7e22edd71', // 云计算
    '5e7ed98a3357bd9befb4ae19', // 理论计算机科学
    '5e7d9a78ea0348b7e22edd77', // 图挖掘
    '5e80bc21e52b9645c1f7b19f', // 网络和信息安全
    '5e7d9a78ea0348b7e22edd7a', // 语义网
    '5e7ef61ac1b7e55a5aea64d4', // 网页挖掘
    '5e7ef61ac1b7e55a5aea64c6', // 半监督学习
    '5e7d9a78ea0348b7e22edd88', // 自然语言处理
    '5e7ef61ac1b7e55a5aea64d5', // 虚拟现实
    '5e7ef61ac1b7e55a5aea64d2', // 知识表示学习
    '5e7ed98a3357bd9befb4ae18', // 人工智能
    '5e7d9a78ea0348b7e22edd86', // 蒙特卡罗方法
    '5e7d9a78ea0348b7e22edd9f', // 区块链
    '5e7ef61ac1b7e55a5aea64cd', // 主动学习
    '5e7d9a78ea0348b7e22edd8b', // 异常值检测
    '5e7d9a78ea0348b7e22edd9e', // 大数据
    '5e7ef61ac1b7e55a5aea64ca', // 关联分析
    '5e7d9a78ea0348b7e22edd75', // 深度信念网络
    '5e7ef61ac1b7e55a5aea64c8', // 社会科学
    '5e7d9a78ea0348b7e22eddb4', // 深度强化学习
    '5e7d9a78ea0348b7e22edd9d', // 贝叶斯网络
    '5e7d9a78ea0348b7e22edd8a', // 在线机器学习
    '5e7d9a78ea0348b7e22edd73', // 协同过滤
    '5e7d9a78ea0348b7e22edd9c', // 自动驾驶
    '5e7d9a78ea0348b7e22edd95', // 强化学习
    '5e80bc21e52b9645c1f7b198', // 自动编码器
    '5e7d9a78ea0348b7e22edda6', // 循环神经网络
    '5e7d9a78ea0348b7e22eddb1', // 文本表征学习
    '5e7d9a78ea0348b7e22edda5', // 问答系统
    '5e7d9a78ea0348b7e22eddaa', // 特征提取
    '5e7d9a78ea0348b7e22edda2', // 计算复杂度
    '5e7d9a78ea0348b7e22edd79', // 可解释机器学习
    '5e7ef61ac1b7e55a5aea64d3', // 网络表示学习
    '5e7d9a78ea0348b7e22edd70', // 观点挖掘
    '5e7ef61ac1b7e55a5aea64d7', // 用户行为建模
    '5e7d9a78ea0348b7e22edd7e', // 情感计算
    '5e7ef61ac1b7e55a5aea64c7', // 社会网络分析
    '5e7d9a78ea0348b7e22edd81', // 计算机图形学
    '5e7d9a78ea0348b7e22edd76', // 进化算法
    '5e7d9a78ea0348b7e22eddb0', // 词嵌入
    '5e7d9a78ea0348b7e22eddb6', // 序列到序列模型
    '5e7d9a78ea0348b7e22edda3', // 数据隐私和安全
    '5e7ef61ac1b7e55a5aea64d8', // 普适计算
    '5e7ef61ac1b7e55a5aea64c9', // 空间数据库
    '5e7d9a78ea0348b7e22edd72', // 聚类分析
    '5e7d9a78ea0348b7e22edd8c', // 概率图模型
    '5e7d9a78ea0348b7e22edda0', // 因果推理
    '5e7d9a78ea0348b7e22edd92', // 图像处理
    '5e7d9a78ea0348b7e22edd7b', // 文本挖掘
    '5e7ef61ac1b7e55a5aea64de', // 知识管理
    '5e7d9a78ea0348b7e22edda1', // 认知科学
    '5e7d9a78ea0348b7e22edd8f', // 机器人学
    '5ea142b5a7058c6e355a700f', // 异构网络表示学习
    '5eb64b8192c7f9be21d5ea76', // 量子计算
    '5ebb579b92c7f9be21c07ffb', // 云机器人
    '5ebb57c192c7f9be21c0972e', // 生成式对抗网络
    '5ebb578692c7f9be21c07307', // 对抗攻击
    '5eb64b8192c7f9be21d5ea76', // 量子计算
    '5eb61cc592c7f9be21795938', // 伦理安全与治理
    '5eb61cd092c7f9be217975cb', // 认知神经基础
    '5eb61cd692c7f9be217984af', // 机器感知
    '5eb61cdc92c7f9be217993df', // 决策智能
    '5eb61ce292c7f9be2179a099', // AI医疗
    '5eb61ce892c7f9be2179aee5', // AI政务
    '5eb61ced92c7f9be2179b9df', // AI交通
  ],

  Topis_Img_Ids: [ // 开放且有必读表格图片的 topic
    '5e7d9a78ea0348b7e22eddb2', // 新冠肺炎
    '5e7d9a78ea0348b7e22edd9a', // 认知图谱
    '5e7d9a78ea0348b7e22edd90', // 对话系统和聊天机器人
    '5e7ef61ac1b7e55a5aea64d1', // 知识图谱
  ],

  Domain_Open_DomainIds: [
    "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "144", "145", "146",
  ],

  phone_area: [
    { value: '+86', zh: '中国大陆', en: 'Mainland China' },
    { value: '+852', zh: '中国香港', en: 'Hong Kong, China' },
    { value: '+853', zh: '中国澳门', en: 'Macao, China' },
    { value: '+886', zh: '中国台湾', en: 'Taiwan, China' },
    { value: '+1', zh: '美国、加拿大', en: 'United States / Canada' },
    { value: '+7', zh: '俄罗斯', en: 'Russia' },
    { value: '+33', zh: '法国', en: 'France' },
    { value: '+34', zh: '西班牙', en: 'Spain' },
    { value: '+39', zh: '意大利', en: 'Italy' },
    { value: '+41', zh: '瑞士', en: 'Switzerland' },
    { value: '+43', zh: '奥地利', en: 'Austria' },
    { value: '+44', zh: '英国', en: 'United Kingdom' },
    { value: '+46', zh: '瑞典', en: 'Sweden' },
    { value: '+49', zh: '德国', en: 'Germany' },
    { value: '+81', zh: '日本', en: 'Japan' },
    { value: '+82', zh: '韩国', en: 'Korea' },
    { value: '+60', zh: '马来西亚', en: 'Malaysia' },
    { value: '+61', zh: '澳大利亚', en: 'Australia' },
    { value: '+62', zh: '印度尼西亚', en: 'Indonesia' },
    { value: '+63', zh: '菲律宾', en: 'Philippines' },
    { value: '+64', zh: '新加坡', en: 'Singapore' },
    { value: '+65', zh: '新西兰', en: 'new Zealand' },
    { value: '+66', zh: '泰国', en: 'Thailand' },
    { value: '+84', zh: '越南', en: 'Vietnam' },
    { value: '+91', zh: '印度', en: 'India' },
  ],

  SSO_System: [
    '633f54ecece685d271657c778e639eef', // md5(aminer,32)
  ],

  Pub_Comment_PageSize: 100,

  Pub_Abstract_Chop_Num: 340,

  Pub_Authors_FirstShow: 5, // 论文作者列表第一次显示的人数
  Pub_Authors_TinyShow: 5, // 论文作者列表简略模式显示的人数
  Pub_Authors_ShowMore: 20, // 论文作业列表最多显示的人数

  PubList_Show_Authors_Max: 12,

  Profile_List_Length: 20,
  AuthLogoutReload: true,

  AI2000_Latest_Year: 2019,
  AI2000_Default_Year: 2019,
  AI2000_Vote_ID: '5e0b0d9fb9722cc1310351ac',

  Profile_Interests_Show_Percent: 0.95,
  Profile_Interests_Earliest_Year: 1850,
  Profile_Interests_Latest_Year: new Date().getFullYear() + 5,

  PlaceImagePath: `${consts.ResourcePath}/sys/aminer/placeholder.png`,
  // ICONFONT_LINK: `${consts.ResourcePath}/sys/aminer/iconfont.js`,
  ICONFONT_LINK: '//at.alicdn.com/t/font_1190641_lgnj4fp1hms.js',

  Auth_LoginPage: '/login', // change to next

  AuthPages: {
    Login: '/login',
    Signup: '/signup',
    ForgetPassword: '/forgotpassword', // name?
  },

  Cur_Conf_Link: 'kdd2020',
  Cur_Conf_Name: 'KDD 2020',

  Search_EnableSmartSuggest: true,

  googleAnalytics: 'UA-1156684-2',
};
