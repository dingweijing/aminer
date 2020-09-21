const genPubTitle = pub => {
  if (!pub || !pub.id) {
    return '';
  }
  const { id, title, query } = pub;
  const words =
    title &&
    title
      .toLowerCase()
      .replace(/[^a-z ]+/g, ' ')
      .trim()
      .split(/\s+/g);
  const t = words && words.slice(0, 12).join('-');

  let queryStr = '?';
  if (query) {
    const queryArr = Object.entries(query);
    queryArr.map(([key, value], index) => {
      queryStr += `${key}=${value}${index !== queryArr.length - 1 ? '&' : ''}`;
      return queryStr;
    });
  }

  if (t) {
    return `/pub/${id}/${t}${queryStr !== '?' ? queryStr : ''}`;
  }
  return `/pub/${id}${queryStr !== '?' ? queryStr : ''}`;
};

const genPubTitleAnchor = pub => {
  if (!pub || !pub.id) {
    return '';
  }
  const { id, title, anchor } = pub;
  const words =
    title &&
    title
      .toLowerCase()
      .replace(/[^a-z ]+/g, ' ')
      .trim()
      .split(/\s+/g);
  const t = words && words.slice(0, 12).join('-');
  if (t) {
    return `/pub/${id}/${t}?anchor=${anchor}`;
  }
  return `/pub/${id}?anchor=${anchor}`;
};

const getPaperAbstract = paper => {
  if (!paper) {
    return '';
  }
  let { abstract, abstract_zh } = paper;
  if (paper.lang === 'zh') {
    [abstract, abstract_zh] = [abstract_zh, abstract];
  }
  return abstract || abstract_zh || '';
};

// ! --------------------------------- display it -----------------------------------

const getDisplayVenueName = venue => {
  let venueName = '';
  if (venue && venue.info) {
    if (venue.info.name_s) {
      venueName = venue.info.name_s;
    } else if (venue.info.name) {
      venueName = venue.info.name;
    } else if (venue.info.name_zh) {
      venueName = venue.info.name_zh;
    }
  } else if (venue && venue.name) {
    venueName = venue.name;
  }
  if (venueName.length > 100) {
    venueName = venueName.slice(0, 100);
    venueName += '...';
  }
  return venueName;
};

// return two section.
const getDisplayVenue = (venue, pages, year) => {
  const venueName = getDisplayVenueName(venue);
  // TODO performance issue.
  let str = '';
  if (venue) {
    if (venue.volume) {
      if (venue.issue) {
        str += `no. ${venue.issue}`;
      }
      if (year > 0) {
        str += ` (${year})`;
      }
      if (pages && pages.start && pages.end) {
        str += `: ${pages.start}-${pages.end}`;
      } else if (pages && pages.start && !pages.end) {
        str += `: ${pages.start}`;
      } else if (pages && !pages.start && pages.end) {
        str += `: ${pages.end}`;
      }
    } else {
      if (pages && (pages.end || pages.start)) {
        str += 'pp.';
        if (pages.start && pages.end) {
          str += `${pages.start}-${pages.end}`;
        } else if (pages.start && !pages.end) {
          str += `${pages.start}`;
        } else if (!pages.start && pages.end) {
          str += `${pages.end}`;
        }
      }
      if (year > 0) {
        if (str && venueName) {
          str += ', ';
        }
        str += ` (${year})`;
      }
    }
    if (venueName && str) {
      str = `, ${str}`;
    }
  }
  return { venueName, venueNameAfter: str };
};

// TODO Refactor
function getPubUrl(urls) {
  let url = '';
  let i = 0;
  while (i < urls && urls.length) {
    if (urls[i].indexOf('dx.doi.org') >= 0) {
      url = urls[i];
    }
    i += 1;
  }
  if (url === '' && urls && urls.length) {
    url = urls[urls.length - 1];
  }
  if (url && url.startsWith('db/')) {
    url = `https://dblp.uni-trier.de/${url}`;
  }
  return url;
}

const getPubImg = paper => {
  const { img, id } = paper;
  const arr = (img && img.split('/')) || [];
  if (!arr[arr.length - 1]) {
    return '';
  }
  return `https://lfs.aminer.cn/upload/pdf_image/${id.substring(0, 4)}/${id.substring(5, 8)}/${id}${
    arr[arr.length - 1]
    }`;
};

const PaperHasStar = items => {
  if (items && items.length > 0) {
    return items.some(n => n.star)
  };
  return false;
};

const cleanTitle = title => {
  // return title
  return title && title.replace(/[!?.]$/g, '');
};

// ----  exprot  ----------------------

export default {
  genPubTitle,
  genPubTitleAnchor,

  getDisplayVenue, // combined.
  getDisplayVenueName,
  getPubUrl,
  getPaperAbstract,
  getPubImg,
  cleanTitle,
  PaperHasStar
};
