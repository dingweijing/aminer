/*  eslint-disable import/no-mutable-exports */
import locales from '../../.startup/locales/en-US';

let l = locales;
if (process.env.NODE_ENV !== 'production') {
  l = {
    ...locales,

    'com.additional.locales.place.here-move.it.later': 'iiiiiiiiiiiiiiiiiiiiiiii。',
    // * Add things here...

    // Layout::Header
    'header.label.help': 'HELP',
    'header.login': 'Login',
    'header.exit_login': 'Exit Login',

    // login
    'login.header': 'Login',
    'login.loginBtn': 'Login',
    'login.forgetPw': 'Forget Password?',
    'login.newUserApplication': 'New User Application',

    // Index
    'index.title': 'Expert Search',
    'search.translateSearchMessage.1': 'We also search "{enQuery}" for you.',
    'search.translateSearchMessage.2': 'Search "{cnQuery}" only.',
    'search.translateSearchMessage.reverse': 'You can also search with both "{enQuery}" and "{cnQuery}".',

    'casic.index.news': 'News',
    'casic.index.projects': 'Projects',

    // Components


    'com.PersonList.label.views': 'views',
    'com.PersonList.label.homepage': 'Homepage',
    'com.PersonList.label.sendEmail': 'Send Email',
    'com.PersonList.label.qrcode': 'QR Code',
    'com.PersonList.label.cooperationFeedback': '合作需求反馈',
    'com.PersonList.message.noResults': 'No Results',

    'com.expertMap.headerLine.label.field': 'Field:',
    'com.expertMap.headerLine.label.selectField': 'Choose the field',
    'com.expertMap.headerLine.label.baiduMap': 'Baidu Map',
    'com.expertMap.headerLine.label.googleMap': 'Google Map',
    'com.expertMap.headerLine.label.level': 'Level：',
    'com.expertMap.headerLine.label.tipMessage': 'No keywords typed, domain selected or nothing found!',
    'com.expertMap.headerLine.label.statistic': 'Statistic & Analysis',
    'com.expertMap.headerLine.label.play': 'Play Animation',
    'com.expertMap.headerLine.label.setting': 'Setting',
    'com.expertMap.headerLine.label.modify': 'Modify Trajectory',
    'com.expertMap.headerLine.label.download': 'Export Excel',
    'com.expertMap.headerLine.label.ok': 'OK',
    'com.expertMap.headerLine.label.close': 'close',
    'com.expertMap.headerLine.label.save': 'save',
    'com.expertMap.headerLine.label.overview': 'Back To OverView',
    'com.expertMap.headerLine.label.goback': 'Go Back',
    'com.expertMap.headerLine.label.prediction': 'Prediction',
    'com.expertMap.headerLine.label.reasons': 'Change Reasons',
    'com.expertMap.headerLine.label.showTraj': 'Show Trajectory',

    'com.expertMap.explanation.legend': 'Legend',
    'com.expertMap.explanation.legend.expert': 'Expert',
    'com.expertMap.explanation.legend.experts': 'A Group Of Experts',
    'com.expertMap.explanation.legend.quantity': 'Quantity',
    'com.expertMap.explanation.legend.small': 'Small',
    'com.expertMap.explanation.legend.large': 'Large',
    'com.expertMap.explanation.legend.h-indexDistribution': 'H-index Distribution',
    'com.expertMap.explanation.legend.average': 'Average',
    'com.expertMap.explanation.legend.ethnicChinese': 'Ethnic Chinese',

    'com.expertMap.scalelevel.label.0': 'Default',
    'com.expertMap.scalelevel.label.1': 'Region',
    'com.expertMap.scalelevel.label.2': 'Country',
    'com.expertMap.scalelevel.label.4': 'City',
    'com.expertMap.scalelevel.label.5': 'Institute',

    'com.relationGraph.statistics.expert': '{statistics} experts, ',
    'com.relationGraph.statistics.relation': '{statistics} relations',
    'com.relationGraph.header.action': 'Related Operations',
    'com.relationGraph.header.action.pauseAdjustment': 'Pause Adjustment',
    'com.relationGraph.header.action.two-pointPath': 'Two-point Path',
    'com.relationGraph.header.action.one-pointExtension': 'One-point Extension',
    'com.relationGraph.header.h-index': 'H-index',

    'com.searchConf.header.category': 'category: ',
    'com.searchConf.header.selectConfList': 'selected conferences',
    'com.searchConf.header.allConfList': 'all conferences',
    'com.searchConf.header.startYear': 'start year: ',
    'com.searchConf.header.endYear': 'end year: ',
    'com.searchConf.header.search': 'search',

    'com.expertTrajectory.theme.label.MapBox.Basic': 'Basic',
    'com.expertTrajectory.theme.label.MapBox.Streets': 'Streets',
    'com.expertTrajectory.theme.label.MapBox.Bright': 'Bright',
    'com.expertTrajectory.theme.label.MapBox.Light': 'Light',
    'com.expertTrajectory.theme.label.MapBox.Dark': 'Dark',
    'com.expertTrajectory.theme.label.MapBox.Satellite': 'Satellite',
    'com.expertTrajectory.theme.label.Echarts.Contrast': 'Contrast',
    'com.expertTrajectory.theme.label.Echarts.Star': 'Star',
    'com.expertTrajectory.theme.label.Echarts.Dark': 'Dark',
    'com.expertTrajectory.theme.label.Echarts.Forgive': 'Forgive',
    'com.expertTrajectory.theme.label.Echarts.Plateau': 'Plateau',
    'com.expertTrajectory.theme.label.Echarts.Voyage': 'Voyage',
    'com.expertTrajectory.theme.label.Echarts.Calm': 'Calm',
    'com.expertTrajectory.theme.label.1': 'Star',
    'com.expertTrajectory.theme.label.2': 'Dark',
    'com.expertTrajectory.theme.label.3': 'Forgive',
    'com.expertTrajectory.theme.label.4': 'Plateau',
    'com.expertTrajectory.theme.label.5': 'Voyage',
    'com.expertTrajectory.theme.label.6': 'Calm',

    'com.expertTrajectory.operate.queryResult': 'Query Result',
    'com.expertTrajectory.operate.all': 'All',
    'com.expertTrajectory.operate.loop': 'Loop Playback',
    'com.expertTrajectory.operate.showby': 'Show By Annual Interval ',
    'com.expertTrajectory.operate.speed': 'Playback speed',
    'com.expertTrajectory.operate.withmap': 'With Map',
    'com.expertTrajectory.operate.timeDis': 'Time Distribution',
    'com.expertTrajectory.operate.areaDis': 'Areas Distribution',
    'com.expertTrajectory.operate.history': 'Migrate History',
    'com.expertTrajectory.operate.paperDis': 'Paper Distribution',
    'com.expertTrajectory.operate.inout': 'Deficit/Surplus',
    'com.expertTrajectory.operate.egoDis': 'Ego Persons',
    'com.expertTrajectory.operate.back': 'Back',

    'com.ExpertBase.Button.Add': '添加',
    'com.ExpertBase.Button.Remove': '删除',

    // bole avatar
    'com.bole.ExpertPhoto': 'No Avatar',
    'com.bole.PersonComment': 'Comments',
    'com.bole.Remove': 'Remove',
    'com.bole.AddButton': 'Add',

    // search venue
    'com.SearchVenue.title': 'Conference Rank',

    // Expert Base
    'page.ExpertBaseExpertsPage.MyExperts': 'My Experts',
    'page.ExpertBaseExpertsPage.SeeAllExperts': 'See All',

    // ExportExperts
    'com.exportExpert.label.export': 'Export',
    'com.exportExpert.label.exportCurrentPage': 'Export Current Page',
    'com.exportExpert.label.exportEB': 'Export All Experts',
    'com.exportExpert.modal.exportExperts': 'Export Experts',
    'com.exportExpert.modal.exportNumber': 'Export Number:',
    'com.exportExpert.modal.exportFields': 'Fields:',
    'com.exportExpert.modal.export': 'Export',

    // ExportExperts::Fields
    'com.exportExpert.fields.name': 'Name',
    'com.exportExpert.fields.email': 'Email',
    'com.exportExpert.fields.gender': 'Gender',
    'com.exportExpert.fields.pos': 'Position',
    'com.exportExpert.fields.aff': 'Affiliation',
    'com.exportExpert.fields.homepage': 'Homepage',
    'com.exportExpert.fields.nationality': 'Nationality',
    'com.exportExpert.fields.h_index': 'h-index',
    'com.exportExpert.fields.activity': 'Activity',
    'com.exportExpert.fields.new_star': 'New Star',
    'com.exportExpert.fields.num_citation': 'Citation',
    'com.exportExpert.fields.num_pubs': 'Publications',
    'com.exportExpert.fields.male': 'Male',
    'com.exportExpert.fields.female': 'Female',
    'com.exportExpert.fields.translate': 'Translate',
    'com.exportExpert.fields.interest': 'Research Interest',
    'com.exportExpert.fields.classification': 'Classification',

    // feedback
    'com.feedback.ok.account_created': 'Success',
    'com.feedback.ok.check_your_mailbox': 'Success, please check email',
    'com.feedback.user.exists': 'User already exists',

    // ACMForecast
    'com.ACMForecast.highCitedPaper': 'High Cited Papers:',

    // Follow
    'com.follow.hotField': 'Hot Fields:',
    'com.follow.trendingCrowd': 'Trending Crowd:',

    // Recommendation
    'rcd.home.pageTitle': 'Organization List',
    'rcd.projectTable.header.projectName': 'Project Name',
    'rcd.projectTable.header.taskCount': 'Task Count',
    'rcd.projectTable.header.progress': 'Progress',
    'rcd.projectTable.header.status': 'Status',
    'rcd.projectTable.header.createTime': 'Create Time',
    'rcd.projectTable.header.updateTime': 'Update Time',
    'rcd.projectTable.header.actions': 'Actions',

    'rcd.taskTable.header.taskName': 'Task Name',
    'rcd.taskTable.header.createTime': 'Create Time',
    'rcd.taskTable.header.updateTime': 'Update Time',
    'rcd.taskTable.header.progress': 'Progress',
    'rcd.taskTable.header.status': 'Status',
    'rcd.taskTable.header.actions': 'Actions',

    // Merge
    'com.profileMerge.label.pending': 'In pending',

    'sys.ali.index.centerZone.forecast': 'ACM Fellow Forecast',
  };
}

export default l;
