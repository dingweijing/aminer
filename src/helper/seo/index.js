// elvoa @ 2019-08-23

const seoPubPageTitle = paper => {
  if (!paper) {
    return '';
  }
  return (paper.lang === 'zh') ? paper.title_zh : paper.title && paper.title.replace(/\.$/, '')
}

const seoPaperAbstract = paper => {
  if (!paper) {
    return '';
  }
  let { abstract, abstract_zh, venue } = paper;
  if (paper.lang === 'zh') {
    [abstract, abstract_zh] = [abstract_zh, abstract]
  }
  return abstract || abstract_zh || (venue && venue.info && venue.info.name) || '';
}

const seoPaperKeywords = paper => {
  if (!paper) {
    return '';
  }
  const { keywords = [], authors = [] } = paper;
  const aut = [...authors];
  const keys = keywords || aut && aut.splice(0, 2).map(item => item.name) || [];
  return keys.join(',');
}



export default { seoPubPageTitle, seoPaperAbstract, seoPaperKeywords }
