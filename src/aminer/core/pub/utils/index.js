/* eslint-disable no-restricted-syntax */
import pubHelper from 'helper/pub';

// After paper title, EI...
const getPubLabels = pub => {
  if (!pub) {
    return null;
  }
  const labels = []
  if (pub.labels) {
    for (const v of pub.labels) {
      if (v.toLowerCase() === 'ei' || v.toLowerCase() === 'wos' || v.toLowerCase() === 'scopus') {
        labels.push(v.toUpperCase())
      }
      if (v === 'esi_hot') {
        labels.push('Hot Paper')
      }
      if (v === 'esi_highlycited') {
        labels.push('Highly Cited Paper')
      }
    }
  }
  if (labels.length <= 0) {
    if (pub.versions) {
      for (const v of pub.versions) {
        if (!(v.src === 'mag' || v.src === 'msra')) {
          if (v.src === 'dblp' || v.src === 'ei' || v.src === 'acm' || v.src === 'ieee') {
            labels.push('EI')
          }
          if (v.src === 'pubmed' || v.src === 'ieee' || v.src === 'sci' || v.src === 'nature' || v.src === 'science' || v.src === 'pnas' || v.src === 'scopus') {
            labels.push('WOS')
          }
          if (v.src === 'science' || v.src === 'nature' || v.src === 'scopus') {
            labels.push(v.src.toUpperCase())
          }
        }
      }
    }
  }
  return [...new Set(labels)];
}

// const setPubStyle1 = (doc) => {
//   let str = ''
//   if (doc) {
//     // if (doc.lang === 'en') {
//     //   str += doc.title + ". ";
//     // } else {
//     //   str += doc.title_zh + ". ";
//     // }
//     if (doc.venue.id) {
//       str += doc.venue.info.name + ", ";
//     }
//     if (doc.venue.type === 2 || doc.venue.type === 10 || doc.venue.type === 0) {
//       if (doc.pages && doc.pages.start && doc.pages.start.indexOf('Article') < 0) {
//         str += "pp. " + doc.pages.start;
//       } else if (doc.pages && doc.pages.start.indexOf('Article') >= 0) {
//         str += doc.pages.start + ", ";
//       }
//       if (doc.pages && doc.pages.end && doc.pages.start.indexOf('Article') < 0) {
//         str += "-" + doc.pages.end + ", ";
//       }
//       if (doc.year > 0) {
//         str += doc.year + ".";
//       }
//     } else if (doc.venue.type === 1 || doc.venue.type === 11) {
//       if (doc.venue.volume) {
//         str += "Volume " + doc.venue.volume;
//       }
//       if (doc.venue.issue) {
//         str += ", Issue " + doc.venue.issue + ", ";
//       }
//       if (doc.year > 0) {
//         str += doc.year + ", ";
//       }
//       if (doc.pages && doc.pages.start && doc.pages.start.indexOf('Article') < 0) {
//         str += "Pages " + doc.pages.start;
//       } else if (doc.pages && doc.pages.start.indexOf('Article') >= 0) {
//         str += doc.pages.start + ".";
//       }
//       if (doc.pages && doc.pages.end && doc.pages.start.indexOf('Article') < 0) {
//         str += "-" + doc.pages.end + ".";
//       }
//     } else if (doc.venue.type === 3) {
//       if (doc.year > 0) {
//         str += doc.year + ".";
//       }
//     } else if (doc.venue.type === 7) {
//       if (doc.venue.volume) {
//         str += "Volume " + doc.venue.volume;
//       }
//       if (doc.venue.issue) {
//         str += " Issue " + doc.venue.issue;
//       }
//       if (doc.year > 0) {
//         str += ", " + doc.year;
//       }
//     } else if (doc.venue.type === 8) {
//       if (doc.year > 0) {
//         str += ", " + doc.year;
//       }
//       if (doc.venue.volume) {
//         str += doc.venue.volume;
//       }
//       if (doc.venue.issue) {
//         str += "(" + doc.venue.issue + ")";
//       }
//       if (doc.venue.pages.start) {
//         str += "," + doc.venue.pages.start;
//       }
//       if (doc.venue.pages.end) {
//         str += "-" + doc.venue.pages.end;
//       }
//       str += ".";
//     } else if (doc.venue.type === 13) {
//       if (doc.year > 0) {
//         str += " (WWW'" + doc.year.Substring(doc.year.length - 2, 2) + "), ";
//       }
//       if (doc.pages && doc.pages.start && doc.pages.start.indexOf('Article') < 0) {
//         str += "pp. " + doc.pages.start;
//       } else if (doc.pages && doc.pages.start.indexOf('Article') >= 0) {
//         str += doc.pages.start + ".";
//       }
//       if (doc.pages && doc.pages.end && doc.pages.start.indexOf('Article') < 0) {
//         str += "-" + doc.pages.end + ".";
//       }
//     } else {
//       if (doc.pages && doc.pages.start && doc.pages.start.indexOf('Article') < 0) {
//         str += "pp. " + doc.pages.start;
//       } else if (doc.pages && doc.pages.start.indexOf('Article') >= 0) {
//         str += ", " + doc.pages.start + ", ";
//       }
//       if (doc.pages && doc.pages.end && doc.pages.start.indexOf('Article') < 0) {
//         str += "-" + doc.pages.end + ", ";
//       }
//       if (doc.year > 0) {
//         str += doc.year + ".";
//       }
//     }
//     return str;
//   }
//   return ''
// }

// type === 8
// if (venue && venue.pages && venue.pages.start) {
//   str_arr.push(`,${venue.pages.start}`);
// }
// if (venue && venue.pages && venue.pages.end) {
//   str_arr.push(`-${venue.pages.end}`);
// }

const setPubStyle = doc => {
  if (!doc) { return '' };
  const { venue, pages = {}, year } = doc || {};
  const { type, info, volume, issue } = venue || {};
  const start = pages.start || pages.s;
  const end = pages.end || pages.e;
  const str_arr = [];
  if (venue) {
    info && info.name && str_arr.push(`${info.name}, `);
  } else { return '' };
  switch (type) {
    case 2:
    case 10:
    case 0:
      if (start && start.indexOf('Article') < 0) {
        str_arr.push(`pp. ${start}`);
      } else if (start && start.indexOf('Article') >= 0) {
        str_arr.push(`${start}, `);
      }
      if (end && start && start.indexOf('Article') < 0) {
        str_arr.push(`-${end}, `);
      }
      year > 0 && str_arr.push(`${year}.`);
      break;
    case 1:
    case 11:
      volume && str_arr.push(`Volume ${volume}, `);
      issue && str_arr.push(`Issue ${issue}, `);
      year > 0 && str_arr.push(`${year}`);
      year > 0 && (start || end) && str_arr.push(', ');
      if (!start && !end) { str_arr.push(`.`); }
      if (start && start.indexOf('Article') < 0) {
        str_arr.push(`Pages ${start}`);
      } else if (start && start.indexOf('Article') >= 0) {
        str_arr.push(`${start}.`);
      }
      if (end && start && start.indexOf('Article') < 0) {
        str_arr.push(`-${end}.`);
      }
      break;
    case 3:
      year > 0 && str_arr.push(`${year}.`);
      break;
    case 7:
      volume && str_arr.push(`Volume ${volume}`);
      issue && str_arr.push(` Issue ${issue}`);
      year > 0 && str_arr.push(`, ${year}`);
      break;
    case 8:
      year > 0 && str_arr.push(`, ${year}`);
      volume && str_arr.push(volume);
      issue && str_arr.push(`(${issue})`);
      start && str_arr.push(`,${start}`);
      end && str_arr.push(`-${end}`);
      str_arr.push('.');
      break;
    case 13:
      year > 0 && str_arr.push(` (WWW'${year.Substring(year.length - 2, 2)}), `);
      if (start && start.indexOf('Article') < 0) {
        str_arr.push(`pp. ${start}`);
      } else if (start && start.indexOf('Article') >= 0) {
        str_arr.push(`${start}.`);
      }
      if (end && start.indexOf('Article') < 0) {
        str_arr.push(`-${end}.`);
      }
      break;
    default:
      if (start && start.indexOf('Article') < 0) {
        str_arr.push(`pp. ${start}`);
      } else if (start && start.indexOf('Article') >= 0) {
        str_arr.push(`, ${start}, `);
      }
      if (end && start && start.indexOf('Article') < 0) {
        str_arr.push(`-${end}, `);
      }
      year > 0 && str_arr.push(`${year}.`);
  }
  return str_arr.join('');
}

const getArchiveUrlByPub = pub => {
  let title = '-';
  if (pub.lang === 'zh' && pub.title_zh) {
    title = pub.title_zh;
  } else if (pub.title && pub.title.toLowerCase().match(/[a-zA-Z]+/g)) {
    title = pub.title.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  return pubHelper.genPubTitle({ id: pub.id, title });
}

const authorInitialCap = author => {
  const hasCapReg = /[\u4E00-\u9FA5A-Z]/g;
  if (author && !hasCapReg.test(author)) {
    return author.replace(/( |^)[a-z]/g, L => L.toUpperCase());
  }
  return author;
}

export {
  getPubLabels, setPubStyle, getArchiveUrlByPub, authorInitialCap
}
