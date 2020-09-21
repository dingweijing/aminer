const localeId_topic_map = {
  '药物＆疫苗': 'timeline.topic.Vaccines',
  '药物&疫苗': 'timeline.topic.Vaccines',
  药物疫苗: 'timeline.topic.Vaccines',
  检测诊断: 'timeline.topic.Diagnosis',
  检验检测: 'timeline.topic.Diagnosis',
  病毒溯源: 'timeline.topic.Virus',
  感染传播: 'timeline.topic.Transmission',
  疫情防控: 'timeline.topic.Epidemic',
  流行预测: 'timeline.topic.Prevalence',
  机理研究: 'timeline.topic.Mechanistic',
  临床诊治: 'timeline.topic.Care',
  临床救治: 'timeline.topic.Care',
  心理舆情: 'timeline.topic.Psychological',
  科研专项: 'timeline.topic.Projects',
  其他: 'timeline.topic.Other',
  成果类型: 'timeline.checkbox.name1',
  研究主题: 'timeline.checkbox.name2',
  必读100篇: 'timeline.type.read100',
  专家: 'timeline.type.master',
  其他论文: 'timeline.type.other',
  论点: 'timeline.type.point',
  专家论点: 'timeline.type.point',
  事件: 'timeline.type.event',
  学术事件: 'timeline.type.event',
  学者论文: 'timeline.paper.Scholarly',
  必读论文: 'timeline.paper.Essay',
}


const typeOptions = [
  { label: '必读100篇', value: '必读论文', isNew: true, id: 'timeline.type.read100' },
  { label: '专家', value: '专家', isNew: true, id: 'timeline.type.master' },
  { label: '论点', value: '专家论点', id: 'timeline.type.point' },
  { label: '其他论文', value: '学者论文', id: 'timeline.type.other' },
  { label: '事件', value: '学术事件', id: 'timeline.type.event' },
];
const topicOptions = [
  { label: '药物疫苗', value: '药物疫苗', id: 'timeline.topic.Vaccines' },
  { label: '检测诊断', value: '检测诊断', id: 'timeline.topic.Diagnosis' },
  { label: '病毒溯源', value: '病毒溯源', id: 'timeline.topic.Virus' },
  { label: '感染传播', value: '感染传播', id: 'timeline.topic.Transmission' },
  { label: '疫情防控', value: '疫情防控', id: 'timeline.topic.Epidemic' },
  { label: '流行预测', value: '流行预测', id: 'timeline.topic.Prevalence' },
  { label: '机理研究', value: '机理研究', id: 'timeline.topic.Mechanistic' },
  { label: '临床救治', value: '临床救治', id: 'timeline.topic.Care' },
  { label: '心理舆情', value: '心理舆情', id: 'timeline.topic.Psychological' },
  { label: '科研专项', value: '科研专项', id: 'timeline.topic.Projects' },
  { label: '其他', value: '其他', id: 'timeline.topic.Other' },
];

const specialistOptions = [
  /* { label: '全部', value: '全部' }, */
  { label: '钟南山', value: '钟南山' },
  { label: '李兰娟', value: '李兰娟' },
  { label: '石正丽', value: '石正丽' },
  { label: '张文宏', value: '张文宏' },
  /*   { label: '陈薇', value: '陈薇' },
  { label: '管秩', value: '管秩' }, */
  { label: '张伯礼', value: '张伯礼' },
  { label: '王辰', value: '王辰' },
  { label: '王福生', value: '王福生' },
  { label: 'Walter Ian Lipkin', value: 'Walter Ian Lipkin' },
  { label: 'Roberto Burioni', value: 'Roberto Burioni' },
  { label: 'Anthony S. Fauci', value: 'Anthony S. Fauci' },
  { label: 'Rolf Hilgenfeld', value: 'Rolf Hilgenfeld' },
  // { label: 'Antonio Lanzavecchia', value: 'Antonio Lanzavecchia' },
  { label: 'Bruce Aylward', value: 'Bruce Aylward' },
  // { label: 'Natalie M Linton', value: 'Natalie M Linton' },
];


export {
  localeId_topic_map,
  typeOptions,
  topicOptions,
  specialistOptions
}
