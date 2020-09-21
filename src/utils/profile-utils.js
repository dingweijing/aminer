import { api } from 'consts/api';
import { sysconfig } from 'systems';
import { zhCN } from 'locales';
import fetch from 'umi-request';
import { personAvatar } from './display';
import { wget } from 'utils/request';


const getAvatar = (src, profileId, size) => personAvatar(src, profileId, size);

/**
 * Get the last affiliation to display in page.
 * @params: pos: must be 'pos' node from profile api;
 * @returns: string - position string.
 */
const displayPosition = pos => {
  let position;
  if (sysconfig.Locale === zhCN) {
    position = pos && pos[pos.length - 1] && pos[pos.length - 1].n_zh ? pos[pos.length - 1].n_zh : '';
  }
  if (!position) {
    position = pos && pos[pos.length - 1] && pos[pos.length - 1].n ? pos[pos.length - 1].n : '';
  }
  return position;
};

const displayCitation = acmCitation => {
  const citation = acmCitation && acmCitation[acmCitation.length - 1] && acmCitation[acmCitation.length - 1].citation ? acmCitation[acmCitation.length - 1].citation : '';
  return citation;
};

const displayCountry = acmCitation => {
  const country = acmCitation && acmCitation[acmCitation.length - 1] && acmCitation[acmCitation.length - 1].country ? acmCitation[acmCitation.length - 1].country : '';
  return country;
};

const displayYear = acmCitation => {
  const year = acmCitation && acmCitation[acmCitation.length - 1] && acmCitation[acmCitation.length - 1].year ? acmCitation[acmCitation.length - 1].year : '';
  return year;
};

// deprecated
// const displayPositionFirst = (pos) => {
//   return pos && pos.length > 0 && pos[0].n;
// };

const displayNameCNFirst = (name, nameCN) => {
  const cs = [];
  if (nameCN) {
    cs.push(nameCN);
    if (name) {
      cs.push(' (');
      cs.push(name);
      cs.push(')');
    }
  } else {
    cs.push(name);
  }
  return cs.join('');
};

/**
 * Get profile's affiliation string
 * @param
 */
function displayAff(profile) {
  if (profile.contact) {
    if (profile.contact.affiliation !== '' && profile.contact.affiliation !== undefined) {
      return profile.contact.affiliation;
    } if (profile.aff) {
      if (profile.aff.desc) {
        return profile.aff.desc;
      }
      if (profile.aff.desc_zh) {
        return profile.aff.desc_zh;
      }
      if (profile.aff) {
        if (profile.aff.desc) {
          return profile.aff.desc;
        } if (profile.aff.desc_zh) {
          return profile.aff.desc_zh;
        }
      }
    }
  }
}

/**
 *
 * @param profile - profile json returned from person api.
 * @returns Email address' image src.
 */
function displayEmailSrc(profile) {
  if (!profile.contact) {
    return '';
  }
  return displayEmailSrc2(profile.id, profile.contact.has_email, profile.contact.has_email_cr);
}

function displayEmailSrc2(personId, hasEmail, hasEmailCR) {
  if (hasEmail) {
    return `${api.personEmailImg + personId}?v=${new Date().getTime()}`;
  }
  if (hasEmailCR) {
    return `${api.getEmailCrImage + personId}?v=${new Date().getTime()}`;
  }
}

function findTopNTags(person, n) {
  let tags = [];
  if (sysconfig.Locale === zhCN) {
    tags = person.tags_zh ? person.tags_zh.slice(0, n) : null;
  } else {
    tags = person.tags ? person.tags.slice(0, n) : null;
  }
  if (!tags || tags.length === 0) {
    tags = person.tags ? person.tags.slice(0, n) : [];
  }
  return tags;
}

const getProfileUrl = (name, id) => {
  let str = '-';
  if (name && name.toLowerCase().match(/[a-zA-Z]+/g)) {
    str = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  return `/profile/${str}/${id}`;
}

// const getImageType222 = extEndUrl => {
//   const url = require('url')
//   // const http = require('http')
//   const sizeOf = require('image-size')

//   // 图片 宽高比为 7/8  1:横图 2.竖图
//   return new Promise((resolve, reject) => {
//     fetch(url.parse(extEndUrl))
//       .then(response => {
//         console.log('[]]][][][]]', response)
//         const chunks = [];
//         response.on('data', chunk => {
//           chunks.push(chunk);
//         }).on('end', () => {
//           const buffer = Buffer.concat(chunks);
//           const size = sizeOf(buffer);
//           const shape = size.width / size.height >= 7 / 8 ? 1 : 0;
//           resolve(shape);
//         });
//       })
//       .catch(e => {
//         console.error('e', e);
//         reject(e);
//         // if (typeof document !== 'undefined' && !window.USE_PRERENDER) {
//         //   message.error('请求错误');
//         // }
//       })

//     // http.get(url.parse(extEndUrl), .on('error', (error) => {
//     //   reject(error);
//     // });
//   });
// }

// TODO require issue. TODO change to another package.....
const getImageType = (extEndUrl, scale = (7 / 8)) => {
  if (extEndUrl.includes('default.jpg')) {
    return scale < 1 ? 1 : 0;
  }
  // const url = require('url')
  // const http = require('http')
  const sizeOf = require('image-size')
  let shape = scale < 1 ? 1 : 0;
  // fetch.get(extEndUrl, { responseType: 'arrayBuffer' })
  //   .then(data => {
  //     if (data) {
  //       const size = sizeOf(Buffer.from(data));
  //       shape = size.width / size.height >= scale ? 1 : 0;
  //     }
  //     return shape;
  //   })
  //   .catch((err) => {
  //     return shape;
  //   })

  return new Promise((resolve, reject) => {
    fetch.get(extEndUrl, { responseType: 'arrayBuffer' })
      .then(data => {
        if (data) {
          const size = sizeOf(Buffer.from(data));
          shape = size && (size.width / size.height >= scale ? 1 : 0);
        }
        resolve(shape);
      })
      .catch((err) => {
        resolve(scale < 1 ? 1 : 0);
      })
  })
  // 图片 宽高比为 7/8  1:横图 2.竖图

  // const aaa = new Promise((resolve, reject) => {
  //   http.get(url.parse(extEndUrl), response => {
  //     const chunks = [];
  //     response.on('data', chunk => {
  //       chunks.push(chunk);
  //       console.log('--------chunk', Buffer.isBuffer(chunk), Buffer.isBuffer(chunks));
  //     }).on('end', () => {
  //       const buffer = Buffer.concat(chunks);
  //       let size
  //       try {
  //         size = sizeOf(buffer);
  //       } catch (error) {
  //         size = null
  //       }
  //       const shape = size && size.width / size && size.height >= scale ? 1 : 0;
  //       resolve(shape);
  //     });
  //   }).on('error', error => {
  //     console.log('-------------error', error);
  //     reject(error);
  //   });
  // });
  // console.log('-------------------------aaa', aaa);
  // return aaa
}

const cutUrl = (url = '') => {
  let cut_url = url;
  if (cut_url && cut_url.length > 60) {
    const center = cut_url.slice(41, cut_url.length - 18);
    cut_url = cut_url.replace(center, '...');
  }
  return cut_url;
}
/*
 ----------------------------- exports -------------------------
 */
export {
  getAvatar,
  displayNameCNFirst,
  displayPosition,
  // displayPositionFirst,
  displayAff,
  displayEmailSrc,
  displayEmailSrc2,
  findTopNTags,
  displayCitation,
  displayCountry,
  displayYear,
  getProfileUrl,
  getImageType,
  cutUrl
};

export default {
  getAvatar,
  displayNameCNFirst,
  displayPosition,
  // displayPositionFirst,
  displayAff,
  displayEmailSrc,
  displayEmailSrc2,
  findTopNTags,
  displayCitation,
  displayCountry,
  displayYear,
  getProfileUrl,
  getImageType,
  cutUrl
};
