/* eslint-disable no-restricted-syntax, no-param-reassign */
import consts from 'consts';

function refreshPageIfUrlTransfer(pathname, search) {
  if (typeof document !== 'object') {
    // console.warn('****** USE Document *********');
    return false;
  }

  // exit when SSR render. // TODO Support???
  if (consts.IsServerRender()) {
    return false;
  }

  let { referrer } = document;
  const origin = (window && window.location && window.location.origin) || '';
  // const hash = (window && window.location && window.location.hash) || '';
  if (referrer && referrer.startsWith(origin)) {
    referrer = referrer.slice(origin.length, referrer.length);
  }
  const { absUrl, refUrl } = getRefUrl(pathname + search, referrer);

  // console.log('--------------------------------------------')
  // console.log('* From (referrer):', refUrl)
  // console.log('* To (CurrentUrl):', absUrl)
  // console.log('* Result is:', isNewFrontEnd(refUrl), isNewFrontEnd(absUrl))
  // console.log('--------------------------------------------')

  // paper is singed.
  if (isNewFrontEnd(refUrl) && !isNewFrontEnd(absUrl)) {
    console.log('****** Cross Domain Jump *********');
    // TODO 如何阻止继续渲染component？这样可以避免闪屏。
    window.location.reload();
    return true;
  }
  return false;
}

const newpageList = [
  '/pub/', '/archive/', '/search', '/ai', '/dashboard/annotation', '/tkde_reviewer_candidates',
  '/ranks/experts', '/ranks/conf', '/conference', '/bestpaper', '/profile', '/mrt', '/ranks/home', '/topic',
  '/set-url', '/p/', '/research_report/articlelist', '/ncp-pubs', '/2019-ncov-pubs-timeline', '/women-in-ai', '/conf',
  '/channel', '/user',
];

function isNewFrontEnd(url) {
  const lurl = url && url.trim().toLowerCase();
  if (!lurl) {
    return false;
  }

  if (lurl === '/' || lurl === '') {
    return true;
  }

  for (const u of newpageList) {
    if (lurl.startsWith(u)) {
      return true;
    }
  }

  return false;
}

// 因为单页面应用的特殊性，需要手动计算 refurl
function getRefUrl(absUrl, refUrl) {
  let tempAbsUrl = sessionStorage.getItem('absUrl');
  let tempRefUrl = sessionStorage.getItem('refUrl');

  if (refUrl || refUrl === '') {
    tempRefUrl = refUrl;
  }

  if (tempAbsUrl === null && tempRefUrl === null) {
    // 首次进入系统
    // 存入本地存储
    tempAbsUrl = absUrl;
    sessionStorage.setItem('absUrl', absUrl);
    tempRefUrl = refUrl;
    sessionStorage.setItem('refUrl', refUrl);
  } else if (absUrl !== tempAbsUrl) {
    // 当前页面不等于缓存的页面，说明已切换页面。替换缓存中的refurl
    sessionStorage.setItem('refUrl', tempAbsUrl);
    tempRefUrl = tempAbsUrl;
    sessionStorage.setItem('absUrl', absUrl);
    tempAbsUrl = absUrl;
  }

  return { absUrl: tempAbsUrl, refUrl: tempRefUrl };
}


function decodeLocation(location) {
  if (location) {
    for (const l of Object.keys(location)) {
      // console.log('}}}}', l);
      const v = location[l];
      if (typeof v === 'string') {
        location[l] = decodeURI(v);
      }

      if (l === 'query') {
        for (const qname of Object.keys(v)) {
          // console.log('}}}}', qname, v);
          const qv = v[qname];
          if (typeof qv === 'string') {
            location.query[qname] = decodeURI(qv);
          }
        }
      }
    }
  }
  return location;
}

export {
  refreshPageIfUrlTransfer,
  decodeLocation,
};
