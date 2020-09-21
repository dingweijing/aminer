
/*  eslint-disable import/no-mutable-exports */
import locales from '../../.startup/locales/zh-CN';

let l = locales;
if (process.env.NODE_ENV !== 'production') {
  l = {
    ...locales,

    'com.additional.locales.place.here-move.it.later': '这里可以动态加载调试，然后再一移动到其他地方。',
    // * Add things here...


    // Layout::Header
    'header.label.help': '帮助文档',
    'header.login': '登录',
    'header.exit_login': '退出登录',

    // login
    // 'login.header': '登录1d',
    // 'login.loginBtn': '登录',
    // 'login.forgetPw': '忘记密码?',
    // 'login.newUserApplication': '新用户申请',

    // Index
    'index.title': '专家搜索',
    'search.translateSearchMessage.1': '同时搜索了 "{enQuery}"。',
    'search.translateSearchMessage.2': '您也可以只搜索 "{cnQuery}"。',
    'search.translateSearchMessage.reverse': '您可以同时搜索 "{enQuery}" 和 "{cnQuery}"。',

    'casic.index.news': '新闻',
    'casic.index.projects': '项目搜索 TODO',

    // Components


    'com.PersonList.label.views': '次查看',
    'com.PersonList.label.homepage': '个人主页',
    'com.PersonList.label.sendEmail': '发送邮件',
    'com.PersonList.label.qrcode': '二维码',
    'com.PersonList.label.cooperationFeedback': '合作需求反馈',
    'com.PersonList.message.noResults': '没有结果',

    'com.expertMap.headerLine.label.field': '领域：',
    'com.expertMap.headerLine.label.selectField': '选择领域',
    'com.expertMap.headerLine.label.baiduMap': '百度地图',
    'com.expertMap.headerLine.label.googleMap': '谷歌地图',
    'com.expertMap.headerLine.label.level': '层级：',
    'com.expertMap.headerLine.label.tipMessage': '没有键入正确的关键词、选择领域或者系统没有搜索到结果！',
    'com.expertMap.headerLine.label.statistic': '统计分析报告',
    'com.expertMap.headerLine.label.play': '播放迁徙动画',
    'com.expertMap.headerLine.label.setting': '设置',
    'com.expertMap.headerLine.label.modify': '修改迁徙',
    'com.expertMap.headerLine.label.download': '导出Excel表',
    'com.expertMap.headerLine.label.ok': '确定',
    'com.expertMap.headerLine.label.close': '关闭',
    'com.expertMap.headerLine.label.save': '保存',
    'com.expertMap.headerLine.label.overview': '返回全局总览',
    'com.expertMap.headerLine.label.goback': '点击返回',
    'com.expertMap.headerLine.label.prediction': '预测',
    'com.expertMap.headerLine.label.reasons': '变化原因',
    'com.expertMap.headerLine.label.showTraj': '迁徙路线',

    'com.expertMap.explanation.legend': '图例',
    'com.expertMap.explanation.legend.expert': '专家',
    'com.expertMap.explanation.legend.experts': '一组专家',
    'com.expertMap.explanation.legend.quantity': '人数',
    'com.expertMap.explanation.legend.small': '少',
    'com.expertMap.explanation.legend.large': '多',
    'com.expertMap.explanation.legend.h-indexDistribution': 'H-index 分布',
    'com.expertMap.explanation.legend.average': '平均值',
    'com.expertMap.explanation.legend.ethnicChinese': '华人',

    'com.expertMap.scalelevel.label.0': '自动',
    'com.expertMap.scalelevel.label.1': '大区',
    'com.expertMap.scalelevel.label.2': '国家',
    'com.expertMap.scalelevel.label.4': '城市',
    'com.expertMap.scalelevel.label.5': '机构',

    'com.relationGraph.statistics.expert': '共{statistics}位人物',
    'com.relationGraph.statistics.relation': '{statistics}个关系',
    'com.relationGraph.header.action': '相关操作',
    'com.relationGraph.header.action.pauseAdjustment': '暂停调整',
    'com.relationGraph.header.action.two-pointPath': '两点路径',
    'com.relationGraph.header.action.one-pointExtension': '单点扩展',
    'com.relationGraph.header.h-index': 'H-指数',

    'com.searchConf.header.category': '期刊类型：',
    'com.searchConf.header.selectConfList': '已选择期刊',
    'com.searchConf.header.allConfList': '全部期刊',
    'com.searchConf.header.startYear': '开始时间：',
    'com.searchConf.header.endYear': '结束时间：',
    'com.searchConf.header.search': '搜索',

    'com.expertTrajectory.theme.label.MapBox.Basic': '基本',
    'com.expertTrajectory.theme.label.MapBox.Streets': '街道',
    'com.expertTrajectory.theme.label.MapBox.Bright': '明亮',
    'com.expertTrajectory.theme.label.MapBox.Light': '浅灰',
    'com.expertTrajectory.theme.label.MapBox.Dark': '黑暗',
    'com.expertTrajectory.theme.label.MapBox.Satellite': '卫星',
    'com.expertTrajectory.theme.label.Echarts.Contrast': '撞色',
    'com.expertTrajectory.theme.label.Echarts.Star': '星空',
    'com.expertTrajectory.theme.label.Echarts.Dark': '黑夜',
    'com.expertTrajectory.theme.label.Echarts.Forgive': '原谅',
    'com.expertTrajectory.theme.label.Echarts.Plateau': '高原',
    'com.expertTrajectory.theme.label.Echarts.Voyage': '航海',
    'com.expertTrajectory.theme.label.Echarts.Calm': '冷淡',
    'com.expertTrajectory.theme.label.1': '星空',
    'com.expertTrajectory.theme.label.2': '黑夜',
    'com.expertTrajectory.theme.label.3': '原谅',
    'com.expertTrajectory.theme.label.4': '高原',
    'com.expertTrajectory.theme.label.5': '航海',
    'com.expertTrajectory.theme.label.6': '冷淡',

    'com.expertTrajectory.operate.queryResult': '查询结果',
    'com.expertTrajectory.operate.all': '全部',
    'com.expertTrajectory.operate.loop': '循环播放',
    'com.expertTrajectory.operate.showby': '按年度区间显示',
    'com.expertTrajectory.operate.speed': '播放速度',
    'com.expertTrajectory.operate.withmap': '带地图',
    'com.expertTrajectory.operate.timeDis': '时间分布',
    'com.expertTrajectory.operate.areaDis': '地区分布',
    'com.expertTrajectory.operate.history': '迁徙历史',
    'com.expertTrajectory.operate.paperDis': '论文分布',
    'com.expertTrajectory.operate.inout': '流入流出',
    'com.expertTrajectory.operate.egoDis': '相关人员',
    'com.expertTrajectory.operate.back': '返回',

    'com.ExpertBase.Button.Add': '添加',
    'com.ExpertBase.Button.Remove': '删除',

    // bole avatar
    'com.bole.ExpertPhoto': '暂无头像',
    'com.bole.PersonComment': '添加评论',
    'com.bole.Remove': '删除',
    'com.bole.AddButton': '添加',

    // search venue
    'com.SearchVenue.title': '期刊(会议)排名',

    // Expert Base
    'page.ExpertBaseExpertsPage.MyExperts': '我的专家库',
    'page.ExpertBaseExpertsPage.SeeAllExperts': '查看全部专家',

    // ExportExperts
    'com.exportExpert.label.export': '导出',
    'com.exportExpert.label.exportCurrentPage': '导出当前结果',
    'com.exportExpert.label.exportEB': '导出专家库',
    'com.exportExpert.modal.exportExperts': '导出专家列表',
    'com.exportExpert.modal.exportNumber': '导出条数:',
    'com.exportExpert.modal.exportFields': '导出字段:',
    'com.exportExpert.modal.export': '导出',

    // ExportExperts::Fields
    'com.exportExpert.fields.name': '姓名',
    'com.exportExpert.fields.gender': '性别',
    'com.exportExpert.fields.pos': '职称',
    'com.exportExpert.fields.aff': '单位',
    'com.exportExpert.fields.homepage': '主页',
    'com.exportExpert.fields.email': '邮箱',
    'com.exportExpert.fields.nationality': '国籍',
    'com.exportExpert.fields.h_index': 'h指数',
    'com.exportExpert.fields.activity': '学术活跃度',
    'com.exportExpert.fields.new_star': '领域新星',
    'com.exportExpert.fields.num_citation': '引用数',
    'com.exportExpert.fields.num_pubs': '论文数',
    'com.exportExpert.fields.male': '男',
    'com.exportExpert.fields.female': '女',
    'com.exportExpert.fields.translate': '翻译',
    'com.exportExpert.fields.interest': '研究兴趣',
    'com.exportExpert.fields.classification': '所在分类',

    // feedback
    'com.feedback.ok.account_created': '成功',
    'com.feedback.user.exists': '用户已经存在',
    'com.feedback.ok.check_your_mailbox': '创建成功，请查收邮件',

    // ACMForecast
    'com.ACMForecast.highCitedPaper': '高引用论文:',

    // Follow
    'com.follow.hotField': '热门领域:',
    'com.follow.trendingCrowd': '热搜人群:',

    // Recommendation
    'rcd.home.pageTitle': '机构列表',
    'rcd.projectTable.header.projectName': '项目名称',
    'rcd.projectTable.header.taskCount': '任务数',
    'rcd.projectTable.header.progress': '完成进度',
    'rcd.projectTable.header.status': '当前状态',
    'rcd.projectTable.header.createTime': '创建时间',
    'rcd.projectTable.header.updateTime': '更新时间',
    'rcd.projectTable.header.actions': '操作',

    'rcd.taskTable.header.taskName': '项目任务',
    'rcd.taskTable.header.createTime': '创建时间',
    'rcd.taskTable.header.updateTime': '更新时间',
    'rcd.taskTable.header.progress': '完成进度',
    'rcd.taskTable.header.status': '状态',
    'rcd.taskTable.header.actions': '操作',

    // Merge
    'com.profileMerge.label.pending': '正在等待',

    'sys.ali.index.centerZone.forecast': 'ACM Fellow 预测',

  };
}

export default l;
