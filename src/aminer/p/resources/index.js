import React, { Fragment, useMemo, useState } from 'react';
import { Link } from 'acore';
import { FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { Select } from 'antd';
import { classnames } from 'utils';
import styles from './index.less';

const { Option } = Select;

const tableHead = ['领域', '奖项名称', '级别', '创办时间', '评定机构', '简介']
const tableData = [{
  domain: '数学',
  list: [{
    href: 'https://baike.baidu.com/item/%E8%8F%B2%E5%B0%94%E5%85%B9%E5%A5%96/186887?fr=aladdin',
    data: ['菲尔茨奖', '国际', '1936年', '菲尔兹奖评委会', '每4年颁发一次，获奖者不超过4人']
  }, {
    href: 'https://blog.csdn.net/fnqtyr45/article/details/86587288',
    data: ['沃尔夫数学奖', '国际', '1978年', '沃尔夫基金会', '每年评选一次，一般3人以内获奖']
  }, {
    href: 'https://baike.baidu.com/item/%E9%98%BF%E8%B4%9D%E5%B0%94%E5%A5%96/188053?fr=aladdin',
    data: ['阿贝尔奖', '国际', '2003年', '阿贝尔奖委员吴', '每年评选一次，一般2人以内获奖']
  }]
}, {
  domain: '信息科学与系统科学',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Claude_E._Shannon_Award',
    data: ['香农奖', '国际', '1972年', 'IEEE信息理论学会', '每年评选一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Richard_W._Hamming_Medal',
    data: ['理查德·汉明奖章', '国际', '1988年', '美国电气与电子工程师学会', '每年评选一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Control_Systems_Award',
    data: ['IEEE控制系统奖', '国际', '1982年', '美国电气与电子工程师学会', '每年评选一次，1人获奖']
  }]
}, {
  domain: '力学',
  list: [{
    href: 'https://www.accademiadellescienze.it/attivita/premi-e-borse/premio-panetti-ferrari',
    data: ['帕内蒂奖', '国际', '1999年', '都灵科学院', '每2年或3年颁发一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Timoshenko_Medal',
    data: ['季莫申科奖', '国际', '1957年', '美国机械工程师协会', '每年评选一次，1人获奖']
  }, {
    href: 'https://www.asme.org/about-asme/honors-awards/achievement-awards/warner-t-koiter-medal',
    data: ['Warner T. Koiter Medal', '国际', '1997年', '美国机械工程师学会', '每年评选一次，1人获奖']
  }]
}, {
  domain: '物理学',
  list: [{
    href: 'https://baike.baidu.com/item/%E8%AF%BA%E8%B4%9D%E5%B0%94%E7%89%A9%E7%90%86%E5%AD%A6%E5%A5%96/211390?fr=aladdin',
    data: ['诺贝尔物理学奖', '国际', '1901年', '瑞典皇家科学院', '每年评选一次，一般不超过3人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Wolf_Prize_in_Physics',
    data: ['沃尔夫物理学奖', '国际', '1978年', '沃尔夫基金会', '每年评选一次，一般不超过3人获奖']
  }, {
    href: 'https://baike.baidu.com/item/%E7%8B%84%E6%8B%89%E5%85%8B%E5%A5%96%E7%AB%A0/1763156?fr=aladdin',
    data: ['狄拉克奖章', '国际', '1985年', '国际理论物理中心', '每年评选一次，奖励数额一般为2个']
  }]
}, {
  domain: '化学',
  list: [{
    href: 'https://baike.baidu.com/item/%E8%AF%BA%E8%B4%9D%E5%B0%94%E5%8C%96%E5%AD%A6%E5%A5%96/559567?fr=aladdin',
    data: ['诺贝尔化学奖', '国际', '1901年', '诺贝尔基金会', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://baike.baidu.com/item/%E6%B2%83%E5%B0%94%E5%A4%AB%E5%8C%96%E5%AD%A6%E5%A5%96/6380890?fr=aladdin',
    data: ['沃尔夫化学奖', '国际', '1978年', '沃尔夫基金会', '每年评选一次，不超过2人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Welch_Award_in_Chemistry',
    data: ['威尔齐化学奖', '国际', '1972年', '威尔齐基金会', '每年评定一次，不超过2人获奖']
  }]
}, {
  domain: '天文学',
  list: [{
    href: 'https://baike.baidu.com/item/%E5%8D%A1%E5%B0%94%C2%B7%E8%90%A8%E6%A0%B9%E5%A5%96/19667924?fr=aladdin',
    data: ['卡尔·萨根奖', '国际', '1998年', '美国天文学会', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Shaw_Prize',
    data: ['邵逸夫天文学奖', '国际', '2004年', '邵逸夫奖基金会', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Gruber_Prize_in_Cosmology',
    data: ['格鲁伯宇宙学奖', '国际', '2000年', '格鲁伯基金会', '每年评定一次，不超过4人获奖']
  }]
}, {
  domain: '地球科学',
  list: [{
    href: 'https://www.ldeo.columbia.edu/the-vetlesen-prize/past-recipients',
    data: ['维特勒森奖', '国际', '1959年', '哥伦比亚大学', '每2年评定一次，不超过3人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/William_Christian_Krumbein_Medal',
    data: ['克伦宾奖', '国际', '1976年', '国际数学地质协会', '每2年评定一次，1人获奖']
  }, {
    href: 'https://zh.wikipedia.org/wiki/%E5%85%8B%E6%8B%89%E7%A6%8F%E5%BE%B7%E5%A5%96',
    data: ['克拉福德奖', '国际', '1982年', '瑞典皇家科学院', '每年评定一次，地球科学不定期颁奖']
  }]
}, {
  domain: '生物学',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Darwin_Medal',
    data: ['达尔文奖', '国际', '1890年', '英国皇家学会', '每2年评定一次，1人获奖']
  }, {
    href: 'https://www.jsps.go.jp/english/e-biol/02_recipients.html',
    data: ['国际生物奖', '国际', '1985年', '日本科学振兴会', '每年评定一次，1人获奖']
  }, {
    href: 'https://zh.wikipedia.org/wiki/%E8%B7%AF%E6%98%93%E8%8E%8E%C2%B7%E6%A0%BC%E7%BD%97%E6%96%AF%C2%B7%E9%9C%8D%E7%BB%B4%E8%8C%A8%E5%A5%96',
    data: ['路易莎·格罗斯·霍维茨奖', '国际', '1967年', '哥伦比亚大学', '每年评定一次，不超过3人获奖']
  }]
}, {
  domain: '心理学',
  list: [{
    href: 'https://www.apa.org/about/awards/international-humanitarian?tab=4',
    data: ['APA国际人道主义奖', '国际', '1999年', '美国心理学会', '一般每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/APA_Award_for_Distinguished_Scientific_Contributions_to_Psychology',
    data: ['心理学杰出科学贡献奖', '美国', '1956年', '美国心理学会', '每年评定一次，人数不定']
  }, {
    href: 'https://en.wikipedia.org/wiki/E._L._Thorndike_Award',
    data: ['爱德华·李·桑代克奖', '美国', '1964年', '美国心理协会', '每年评定一次，1人获奖']
  }]
}, {
  domain: '农学',
  list: [{
    href: 'https://en.wikipedia.org/wiki/World_Food_Prize',
    data: ['世界粮食奖', '国际', '1987年', '世界粮食奖基金会', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Wolf_Prize_in_Agriculture',
    data: ['沃尔夫农业奖', '国际', '1978年', '沃尔夫基金会', '每年评定一次，不超过2人获奖']
  }, {
    href: 'https://baike.baidu.com/item/%E4%B8%96%E7%95%8C%E5%86%9C%E4%B8%9A%E5%A5%96/15652900?fr=aladdin#2',
    data: ['世界农业奖', '国际', '2012年', '全球农业与生命科学教育协会高等教育联盟', '每年评定一次，不超过2人获奖']
  }]
}, {
  domain: '林学',
  list: [{
    href: 'https://www.iufro.org/fileadmin/material/discover/honour-saa-recipients.pdf',
    data: ['国际林联科学成就奖（Scientific Achievement Award (SAA)）', '国际', '1971年', '国际林联（IUFRO）', '每5年评定一次，10人获奖']
  }, {
    href: 'https://www.iufro.org/fileadmin/material/discover/honour-odra-recipients.pdf',
    data: ['国际林联杰出博士研究奖（Outstanding Doctoral Research Award (ODRA)）', '国际', '2000年', '国际林联（IUFRO）', '每5年评定一次，人数不定']
  }, {
    href: 'https://www.iufro.org/fileadmin/material/discover/honour-host-recipients.pdf',
    data: ['国际林联大会主办国科学奖（IUFRO World Congress Host Scientific Award）', '国际', '2005年', '国际林联（IUFRO）', '每5年评定一次，人数不定']
  }]
}, {
  domain: '畜牧、兽医科学',
  list: [{
    href: 'http://www.worldvet.org/news.php?item=379',
    data: ['世界兽医协会动物福利奖', '国际', '2017年', '世界兽医协会（WVA）', '每年评定一次，人数不定']
  }, {
    href: 'https://www.wsava.org/About/Awards/Past-Awards',
    data: ['世界小动物兽医协会国际科学成就奖', '国际', '2011年', '世界小动物兽医协会（WSAVA）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.wsava.org/About/Awards/Past-Awards',
    data: ['世界小动物兽医协会总统奖', '国际', '2011年', '世界小动物兽医协会（WSAVA）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '水产学',
  list: [{
    href: 'https://wcfs.fisheries.org/international-fisheries-section-afs/',
    data: ['国际渔业科学奖', '国际', '2008年', '世界渔业大会', '每4年评定一次，1人获奖']
  }, {
    href: 'https://fisheries.org/about/awards-recognition/call-for-award-nominations/award-of-excellence/',
    data: ['美国渔业协会杰出奖', '美国', '1969年', '美国渔业协会', '每年评定一次，1人获奖']
  }, {
    href: 'http://www.csfish.org.cn/csf/ah5/showCls.asp?bigId=27&smlId=92',
    data: ['中国水产学会范蠡科学技术奖', '中国', '2012年', '中国水产学', '每2年评定一次，设一、二等奖，一等奖不超过10人，二等奖不超过7人']
  }]
}, {
  domain: '基础医学',
  list: [{
    href: 'https://baike.baidu.com/item/%E6%8B%89%E6%96%AF%E5%85%8B%E5%8C%BB%E5%AD%A6%E5%A5%96/4355244?fr=aladdin#8_1',
    data: ['拉斯克基础医学研究奖', '美国', '2005年', '拉斯克基金会', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://www.brandeis.edu/rosenstiel/gabbayaward/past.html',
    data: ['加贝奖', '美国', '1998年', '罗森斯蒂尔基础医学科学研究中心', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.apcprods.org/m-awards',
    data: ['病理学主席协会奖', '美国/加拿大', '1986年', '病理学主席协会(APC)', '每年评定一次，1人获奖']
  }]
}, {
  domain: '临床医学',
  list: [{
    href: 'https://baike.baidu.com/item/%E6%8B%89%E6%96%AF%E5%85%8B%E5%8C%BB%E5%AD%A6%E5%A5%96/4355244?fr=aladdin#8_1',
    data: ['拉斯克临床医学研究奖', '美国', '2005年', '拉斯克基金会', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://www.hopkinsmedicine.org/clinical-awards/past-awardees/',
    data: ['约翰霍普金斯医学临床奖', '美国', '2015年', '约翰霍普金斯医院', '每年评定一次，各子奖项7人获奖']
  }, {
    href: 'https://www.acponline.org/system/files/documents/about_acp/awards_masterships/awards.pdf',
    data: ['约翰·菲利普斯纪念奖', '国际', '1932年', '美国医师协会', '每年评定一次，1人获奖']
  }]
}, {
  domain: '预防医学与公共卫生学',
  list: [{
    href: 'https://baike.baidu.com/item/%E8%AF%BA%E8%B4%9D%E5%B0%94%E7%94%9F%E7%90%86%E5%AD%A6%E6%88%96%E5%8C%BB%E5%AD%A6%E5%A5%96/1310224?fr=aladdin',
    data: ['诺贝尔生理学或医学奖', '国际', '1901年', '卡罗林斯卡医学院', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://www.who.int/governance/awards/dogramaci/dogramaci_winners/en/',
    data: ['家庭健康基金会奖', '国际', '1980年', '世界卫生组织', '每2年评定一次，1人获奖']
  }, {
    href: 'https://www.who.int/governance/awards/arab_emirates/uae_winners/en/',
    data: ['阿联酋健康基金会奖', '国际', '1993年', '世界卫生组织', '每年评定一次，不超过2人获奖']
  }]
}, {
  domain: '军事医学与特种医学',
  list: [{
    href: 'https://www.hjfcp3.org/heroes-dinner/heroes-dinner-history/',
    data: ['军医英雄奖', '美国', '2011年', '亨利·m·杰克逊军事医学发展基金会', '每年评定一次，不超过5人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Order_of_Military_Medical_Merit',
    data: ['军事医疗荣誉勋章', '美国', '1982年', '美国陆军卫生服务司令部', '每2年评定一次，1人获奖']
  }]
}, {
  domain: '药学',
  list: [{
    href: 'https://www.fip.org/awards',
    data: ['Høst-Madsen奖章', '国际', '1955年', '国际药学联合会（FIP）', '每2年评定一次，1人获奖']
  }, {
    href: 'https://www.fip.org/awards',
    data: ['FIP杰出科学奖', '国际', '1994年', '国际药学联合会（FIP）', '每2年评定一次，1人获奖']
  }, {
    href: 'https://www.fip.org/awards',
    data: ['André Bédat奖', '国际', '1986年', '国际药学联合会（FIP）', '每2年评定一次，1人获奖']
  }]
}, {
  domain: '中医学与中药学',
  list: [{
    href: 'http://www.wfcms.org/menuCon/contdetail.jsp?id=9180',
    data: ['中医药国际贡献奖', '国际', '2005年', '世界中医药学会联合会', '1至2年评定一次，设一、二等奖']
  }, {
    href: 'http://www.wfcms.org/menuCon/contdetail.jsp?id=9175',
    data: ['中医药国际贡献奖（科技进步奖）', '中国', '2018年', '世界中医药学会联合会', '每年评定一次，设一、二等奖']
  }, {
    href: 'https://scm.hkbu.edu.hk/sc/cheung_on_tak_award/index.html',
    data: ['张安德中医药国际贡献奖', '中国', '2011年', '香港浸会大学中医药学院', '每2年评定一次，不超过2人获奖']
  }]
}, {
  domain: '工程与技术科学基础学科',
  list: [{
    href: 'https://www.siam.org/prizes-recognition/joint-prizes/detail/norbert-wiener-prize',
    data: ['Norbert Wiener奖', '国际', '1970年', '工业和应用数学学会（SIAM）', '每3年评定一次，不超过3人获奖']
  }, {
    href: 'https://www.apadivisions.org/division-21/awards/taylor?tab=3',
    data: ['富兰克林·v·泰勒奖', '国际', '1962年', '美国心理学会', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.aegweb.org/page/OEEGProjectAward',
    data: ['环境与工程地质学杰出奖', '国际', '1993年', '环境与工程地质学协会', '每年评定一次，1人获奖']
  }]
}, {
  domain: '信息与系统科学相关工程与技术',
  list: [{
    href: 'file:///C:/Users/AMiner/Downloads/Past_Award_Winners17_KAW.pdf',
    data: ['Giorgio Quazza奖章', '国际', '1981年', '国际自动控制联合会', '每3年评定一次，1人获奖']
  }, {
    href: 'https://scs.org/scs-awards-and-recognition/',
    data: ['SCS专业贡献奖', '国际', '1992年', '国际建模与仿真学会（SCS）', '每年评定一次，1人获奖']
  }, {
    href: 'https://levchinprize.com/5/',
    data: ['Levchin奖', '国际', '2016年', 'Affirm公司', '每年评定一次，人数不定']
  }]
}, {
  domain: '自然科学相关工程与技术',
  list: [{
    href: 'https://spie.org/about-spie/awards-programs/awards-listing/spie-gold-medal',
    data: ['SPIE金奖', '国际', '1977年', '国际光学与光子学学会（SPIE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.bmes.org/content.asp?admin=Y&contentid=597',
    data: ['BMES普利兹克奖', '美国', '2007年', '生物医学工程学会（BMES）', '每年评定一次，1人获奖']
  }, {
    href: 'http://www.eurageng.eu/meritaward',
    data: ['IagrE优秀奖', '英国', '2006年', '农业工程师协会（IAgrE）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '测绘科学技术',
  list: [{
    href: 'https://www.asce.org/templates/award-detail.aspx?id=634&all_recipients=1',
    data: ['ASCE测绘奖', '国际', '1970年', '美国土木工程师协会（ASCE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.cices.org/ices/awards/',
    data: ['理查德·卡特奖', '国际', '2002年', '土木工程测量师特许学会（CICES）', '每2年评定一次，1人获奖']
  }, {
    href: 'https://icaci.org/award-medals/',
    data: ['Carl Mannerfelt金奖', '国际', '1979年', '国际地图学协会（ICA）', '不定期评定']
  }]
}, {
  domain: '材料科学',
  list: [{
    href: 'https://mrs.org/vonhippel',
    data: ['冯希佩尔奖', '国际', '1976年', '材料研究协会（MRS）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.aiche.org/community/awards/winners/28875',
    data: ['Braskem卓越材料工程与科学奖', '国际', '1979年', '美国化学工程师学会（AIChE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://mrs.org/medal',
    data: ['MRS奖章', '国际', '1990年', '材料研究协会（MRS）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '矿山工程技术',
  list: [{
    href: 'https://www.smenet.org/coal-energy-distinguished-past-award',
    data: ['煤炭能源处杰出服务奖', '国际', '1989年', '采矿、冶金与勘探学会（SEC）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.smenet.org/membership/awards/sme-awards/robert-m-dreyer-award/robert-m-dreyer-past-award-winners',
    data: ['罗伯特·m·德雷尔奖', '国际', '2000年', '采矿、冶金与勘探学会（SEC）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.smenet.org/membership/awards/sme-aime-awards/charles-f-rand-memorial-gold-medal/charles-f-rand-memorial-gold-medal-past-award-winn',
    data: ['查尔斯·f·兰德纪念奖', '国际', '2011年', '美国采矿,冶金和石油工程师协会（AIME）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '冶金工程技术',
  list: [{
    href: 'https://www.mpif.org/Portals/1/Docs/About/2018-Distinguished-Service-Year.pdf',
    data: ['粉末冶金杰出贡献奖', '国际', '1968年', '金属粉末工业联合会（MPIF）', '一般每2年评定一次，获奖人数不定']
  }, {
    href: 'https://www.mpif.org/About/IndustryAwards/PowderMetallurgyPioneerAward.aspx',
    data: ['粉末冶金先锋奖', '国际', '1961年', '金属粉末工业联合会（MPIF）', '每4年评定一次，1人获奖']
  }, {
    href: 'https://www.mpif.org/About/IndustryAwards/KemptonHRollPMLifetimeAchievementAward.aspx',
    data: ['肯普顿·h·罗尔终身成就奖', '国际', '2008年', '金属粉末工业联合会（MPIF）', '每4年评定一次，1人获奖']
  }]
}, {
  domain: '机械工程',
  list: [{
    href: 'https://en.wikipedia.org/wiki/James_Watt_International_Gold_Medal',
    data: ['詹姆斯·瓦特奖章', '国际', '1937年', '英国机械工程师学会', '每2年评定一次，1人获奖']
  }, {
    href: 'https://www.asme.org/about-asme/honors-awards/achievement-awards/asme-medal',
    data: ['ASME奖章', '国际', '1921年', '美国机械工程师协会（ASME）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Drucker_Medal',
    data: ['德鲁克奖', '国际', '1998年', '美国机械工程师协会（ASME）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '动力与电气工程',
  list: [{
    href: 'https://en.wikipedia.org/wiki/IEEE_Edison_Medal',
    data: ['IEEE爱迪生奖章', '国际', '1909年', '电气和电子工程师协会（IEEE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.ieee-pes.org/ieee-pes-award-for-excellence-in-power-distribution-engineering',
    data: ['IEEE PES电力分配工程优等奖', '国际', '1989年', '电气和电子工程师协会动力与能源分会（IEEE PES）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Medal_in_Power_Engineering',
    data: ['IEEE电力工程奖章', '国际', '2010年', '电气和电子工程师协会（IEEE）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '能源科学技术',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Global_Energy_Prize',
    data: ['全球能源奖', '国际', '2003年', '全球能源协会', '每年评定一次，不超过3人获奖']
  }, {
    href: 'https://www.rsc.org/ScienceAndTechnology/Awards/SustainableEnergyAward/previouswinners.asp',
    data: ['可持续能源奖', '国际', '2009年', '英国皇家化学会', '每2年评定一次，1人获奖']
  }, {
    href: 'http://www.iahe.org/awards.asp',
    data: ['儒勒·凡尔纳奖', '国际', '1998年', '国际氢能协会', '每2年评定一次，1人获奖']
  }]
}, {
  domain: '核科学技术',
  list: [{
    href: 'https://www.iaea.org/publications/nuclear-fusion/award',
    data: ['核聚变奖', '国际', '2007年', '国际原子能机构', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.aps.org/programs/honors/prizes/bonner.cfm',
    data: ['汤姆·w·邦纳核物理奖', '国际', '1965年', '美国物理学会核物理学部', '每年评定一次，不超过2人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Niels_Bohr_International_Gold_Medal',
    data: ['尼尔斯·玻尔国际金奖', '国际', '1955年', '丹麦工程师协会', '一般每3年评定一次，1人获奖']
  }]
}, {
  domain: '电子与通信技术',
  list: [{
    href: 'https://en.wikipedia.org/wiki/IEEE_Robert_N._Noyce_Medal',
    data: ['IEEE罗伯特·诺伊斯奖章', '国际', '2000年', '电气和电子工程师协会（IEEE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Gustav_Robert_Kirchhoff_Award',
    data: ['IEEE古斯塔夫罗伯特基尔霍夫奖', '国际', '2005年', '电气和电子工程师协会（IEEE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Eric_E._Sumner_award',
    data: ['IEEE Eric E. Sumner奖', '国际', '1997年', '电气和电子工程师协会（IEEE）', '每年评定一次，不超过3人获奖']
  }]
}, {
  domain: '计算机科学技术',
  list: [{
    href: 'https://zh.wikipedia.org/wiki/%E5%9B%BE%E7%81%B5%E5%A5%96',
    data: ['图灵奖', '国际', '1966年', '美国计算机协会', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_John_von_Neumann_Medal',
    data: ['IEEE约翰·冯·诺伊曼奖章', '国际', '1992年', '电气和电子工程师协会（IEEE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/IEEE_Internet_Award',
    data: ['IEEE互联网奖', '国际', '2000年', '电气和电子工程师协会（IEEE）', '每年评定一次，不超过4人获奖']
  }]
}, {
  domain: '化学工程',
  list: [{
    href: 'https://www.aiche.org/community/awards/winners/176311',
    data: ['化学工程进步奖', '国际', '1948年', '美国化学工程学会（AIChE）', '每年评定一次，不超过2人获奖']
  }, {
    href: 'https://www.aiche.org/community/awards/winners/28877',
    data: ['Alpha Chi Sigma奖', '国际', '1966年', '美国化学工程学会（AIChE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.aiche.org/community/awards/winners/28871',
    data: ['化学工程杰出贡献奖', '国际', '1958年', '美国化学工程学会（AIChE）', '每年评定一次，不超过5人获奖']
  }]
}, {
  domain: '产品应用相关工程与技术',
  list: [{
    href: 'http://aspe.net/about-aspe/lifetime-achievement-awards/',
    data: ['美国精密仪器协会终身成就奖', '国际', '1986年', '美国精密仪器协会', '每年评定一次，不超过2人获奖']
  }, {
    href: 'https://afrlscholars.usra.edu/media/awards/',
    data: ['AFRL杰出学者奖', '美国', '2013年', '美国空军研究实验室（AFRL）', '每年评定一次，9人获奖']
  }]
}, {
  domain: '纺织科学技术',
  list: [{
    href: 'https://www.culturalheritage.org/membership/groups-and-networks/textile-specialty-group/achievement-award',
    data: ['纺织专业成就奖', '美国', '2010年', '美国自然保护学会（AIC）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.aatcc.org/abt/awards/olney/olney-medal-recipients/',
    data: ['奥尔尼奖章', '国际', '1944年', '美国纺织化学家和色彩师协会（AATCC）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Costume_Designers_Guild',
    data: ['服装设计师协会奖', '国际', '1999年', '服装设计师协会（CDG）', '每年评定一次，各子奖项1人获奖']
  }]
}, {
  domain: '食品科学技术',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Nicolas_Appert_Award',
    data: ['Nicolas Appert奖', '国际', '1942年', '美国食品工艺学家学会', '每年评定一次，各子奖项1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Babcock-Hart_Award',
    data: ['Babcock-Hart奖', '国际', '1948年', '北美国际生命科学研究所', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Bor_S._Luh_International_Award',
    data: ['Bor S. Luh国际奖', '国际', '1956年', '美国食品技术学会基金会', '每年评定一次，1人获奖']
  }]
}, {
  domain: '土木建筑工程',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Norman_Medal',
    data: ['诺曼奖章', '国际', '1874年', '美国土木工程师学会', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Walter_L._Huber_Civil_Engineering_Research_Prize',
    data: ['Huber土木工程研究奖', '国际', '1949年', '美国土木工程师学会', '每年评定一次，5人获奖']
  }, {
    href: 'https://baike.baidu.com/item/%E6%99%AE%E5%88%A9%E5%85%B9%E5%85%8B%E5%A5%96/6092239?fromtitle=%E6%99%AE%E5%88%A9%E5%85%B9%E5%85%8B%E5%BB%BA%E7%AD%91%E5%A5%96&fromid=7638579&fr=aladdin',
    data: ['普利兹克奖', '国际', '1979年', '凯悦基金会', '每年评定一次，1人获奖']
  }]
}, {
  domain: '水利工程',
  list: [{
    href: 'https://www.asce.org/templates/award-detail.aspx?id=6697&all_recipients=1',
    data: ['亨特·劳斯水利工程奖', '国际', '1980年', '环境与水资源研究所（EWRI）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.asce.org/templates/award-detail.aspx?id=344&all_recipients=1',
    data: ['干旱土地水利工程奖', '国际', '1988年', '环境与水资源研究所（EWRI）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.asce.org/templates/award-detail.aspx?id=614&all_recipients=1',
    data: ['KARL EMIL HILGARD水利奖', '国际', '1941年', '环境与水资源研究所（EWRI）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '交通运输工程',
  list: [{
    href: 'https://www.asce.org/templates/award-detail.aspx?id=362&all_recipients=1',
    data: ['Harland Bartholomew奖', '国际', '1969年', '交通与发展学会（T&DI）', '不定期评定，1人获奖']
  }, {
    href: 'https://www.ite.org/pub/?id=e1beddcd%2D2354%2Dd714%2D5125%2Df6d6080ed36e',
    data: ['西奥多·m·马松纪念奖', '国际', '1960年', '运输工程师学会（ITE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://www.ite.org/pub/?id=e1bef104%2D2354%2Dd714%2D51bb%2D3ebf67426070',
    data: ['威尔伯·史密斯杰出交通教育家奖', '国际', '1993年', '运输工程师学会（ITE）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '航空、航天科学技术',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Daniel_Guggenheim_Medal',
    data: ['丹尼尔·古根海姆奖章', '国际', '1929年', '美国航空航天研究学会（ITE）', '每年评定一次，1人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Wright_Brothers_Medal',
    data: ['莱特兄弟奖章', '国际', '1928年', '汽车工程师学会（SAE International）', '每年评定一次，人数不定']
  }, {
    href: 'https://en.wikipedia.org/wiki/Ludwig_Prandtl_Ring',
    data: ['路德维希·普朗特戒指', '国际', '1957年', '德国航空航天学会（DGLR）', '每年评定一次，1人获奖']
  }]
}, {
  domain: '环境科学技术及资源科学技术',
  list: [{
    href: 'https://en.wikipedia.org/wiki/Blue_Planet_Prize',
    data: ['蓝色星球奖', '国际', '1992年', '朝日玻璃基金会', '每年评定一次，2人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Goldman_Environmental_Prize',
    data: ['戈德曼环境奖', '国际', '1990年', '戈德曼环境奖评审团', '每年评定一次，6人获奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/Tyler_Prize_for_Environmental_Achievement',
    data: ['泰勒环境成就奖', '国际', '1974年', '南加州大学', '每年评定一次，不超过2人获奖']
  }]
}, {
  domain: '安全科学技术',
  list: [{
    href: 'https://www.iaem.org/National-Security-Awards',
    data: ['IAEM-USA国家安全奖', '美国', '1969年', '国际应急管理协会', '不定期评奖']
  }, {
    href: 'https://en.wikipedia.org/wiki/National_Security_Medal',
    data: ['国家安全勋章', '美国', '1953年', '美国国家安全委员会', '不定期评奖']
  }]
}]
const domains = ['全部'].concat(tableData.map(item => item.domain))

const Resource = props => {
  const [domainData, setDomainData] = useState(tableData);

  const onChange = value => {
    // setDomain(value);
    const data = value !== '全部' ? tableData.filter(item => item.domain === value) : tableData
    setDomainData(data);
  }

  const onSearch = val => {
    console.log('search:', val);
  }
  return (
    <Layout
      pageTitle="自然科学类奖项"
    >
      <article className={styles.resourcePage}>
        <div className="title">
          <h1>自然科学类奖项</h1>
          <div className="links">
            <Link to="/ranks/conf" className="desktop_device link">
              <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank"></FM>
            </Link>
            <Link to="/bestpaper" className="desktop_device link">
              <FM id="aminer.home.rankings.best" defaultMessage="Best Papers vs Top Cited Papers" />
            </Link>
          </div>
        </div>
        <section className="awards_container">
          <div className="select_line">
            <span>学科：</span>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择学科"
              optionFilterProp="children"
              defaultValue="全部"
              onChange={onChange}
              onSearch={onSearch}
              filterOption
            >
              {domains && domains.length > 0 && domains.map(domain => (
                <Option key={domain} value={domain}>{domain}</Option>
              ))}
            </Select>
          </div>
          <div className="awards_table_container">

            <table className="awards_table" >
              <thead>
                <tr>
                  {tableHead && tableHead.map(item => (
                    <th key={item}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {domainData && domainData.map(tableLine => {
                  return (
                    <Fragment key={tableLine.domain}>
                      {tableLine.list && tableLine.list.map((lineData, index) => (
                        <tr key={`${lineData.href}_${index}`}>
                          {index === 0 && (
                            <td rowSpan={tableLine.list.length}><span>{tableLine.domain}</span></td>
                          )}
                          {lineData.data && lineData.data.map((item, i) => (
                            <Fragment key={item}>
                              {i === 0 && (
                                <td>
                                  <a target='_blank' href={lineData.href}>{item}</a>
                                </td>
                              )}
                              {i !== 0 && (
                                <td>
                                  <span >{item}</span>
                                </td>
                              )}
                            </Fragment>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  )
                })}

              </tbody>
            </table>
          </div>
        </section>
      </article>
    </Layout>
  )
}

// Resource.getInitialProps = async ({ store, route, isServer }) => {
//   if (!isServer) { return; }
// };

export default Resource;
