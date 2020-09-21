import { api } from 'consts/api';
import { sysconfig } from 'systems';
import { zhCN } from 'locales';

// const cdnDomain = 'avatarcdn.aminer.cn';
const cdnDomain = 'avatarcdn.aminer.cn';
const DefaultAvatar = '//static.aminer.org/default/default.jpg'

const personName = (name, nameZh, lang) => {
  if (lang === zhCN) {
    return personDisplayName(nameZh, name);
  } else {
    return personDisplayName(name, nameZh);
  }
};

const localValue = (lang, en, zh) => {
  return (lang === zh)
    ? zh || en
    : en || zh;
};

const personDisplayName = (name1, name2) => {
  const cs = [];
  if (name1) {
    cs.push(name1);
    if (name2) {
      cs.push(' (');
      cs.push(name2);
      cs.push(')');
    }
  } else {
    cs.push(name2);
  }
  return cs.join('');
};

// person new model return right aff field.
// TODO 策略其实有问题。根据环境显示，以及到底哪个才是最正确的？
// No use, 后端已经处理了这种情况了，只限从search.search返回内容。显然这个地方不用再这样选择了。
const personDisplayAff = (person) => {
  if (person && person.profile) {
    const { affiliation, affiliation_zh } = person.profile;
    if (affiliation || affiliation_zh) {
      if (sysconfig.Locale === zhCN) {
        return affiliation_zh || affiliation;
      } else {
        return affiliation || affiliation_zh;
      }
    }

    const { org, org_zh } = person.profile;
    if (org || org_zh) {
      if (sysconfig.Locale === zhCN) {
        return org_zh || org;
      } else {
        return org || org_zh;
      }
    }

    if (person.profile.orgs) {
      console.log("!! match orgs: ", person.profile.orgs);
    }

  }
  return "";


  // if (person.contact) {
  //   if (profile.contact.affiliation !== '' && profile.contact.affiliation !== undefined) {
  //     return profile.contact.affiliation;
  //   } if (profile.aff) {
  //     if (profile.aff.desc) {
  //       return profile.aff.desc;
  //     }
  //     if (profile.aff.desc_zh) {
  //       return profile.aff.desc_zh;
  //     }
  //     if (profile.aff) {
  //       if (profile.aff.desc) {
  //         return profile.aff.desc;
  //       } if (profile.aff.desc_zh) {
  //         return profile.aff.desc_zh;
  //       }
  //     }
  //   }
  // }

}

const personAvatar = (src, profileId, size) => {
  const imgSize = size || 160;
  const imgSrc = src || '//static.aminer.org/default/default.jpg';

  if (sysconfig.Use_CDN) {
    // const scopeSessionId = Math.random(); // 'todo-replace-scope-session-id';
    if (imgSrc.search(/static\.aminer\.(org|cn)/g) >= 0) {
      // 其他域名下CDN图片读取不出来。
      let newUrl = `${imgSrc.replace(/static\.aminer\.(org|cn)/g, cdnDomain)}!${imgSize}`;
      if (process.env.NODE_ENV !== 'production' && newUrl.indexOf("http") !== 0) {
        newUrl = `https:${newUrl}`;
      }
      return newUrl
      // ?ran=${scopeSessionId}`;
      // return `${imgSrc}?ran=${scopeSessionId}`;
    } else {
      return imgSrc;
    }
  }
  return imgSrc;
};

function personEmailUrl(personId, hasEmail, hasEmailCR) {
  if (hasEmail) {
    return `${api.personEmailImg + personId}?v=${new Date().getTime()}`;
  } else if (hasEmailCR) {
    return `${api.getEmailCrImage + personId}?v=${new Date().getTime()}`;
  }
}

function returnFirstNonNil(persons) {
  for (let i = 0; i < persons.length; i += 1) {
    if (persons[i]) {
      return persons[i];
    }
  }
  return '';
}

// ----------------------------------------
// Expert Base Related
// ----------------------------------------
// all nodes that has name and name_zh
const getEBDisplayName = (item) => {
  // const lang = sysconfig.Locale;
  // const { name, name_zh } = item;
  // let displayName = lang === zhCN ? name_zh : name;
  // if (!displayName) {
  //   displayName = lang === zhCN ? name : name_zh;
  // }
  // return displayName;
  const { name, name_zh } = item;
  return sysconfig.Locale === zhCN
    ? name_zh || name
    : name || name_zh;
};

// ----------------------------------------
// Exports
// ----------------------------------------
export default {
  getEBDisplayName,
  personName,
  personAvatar, DefaultAvatar,
  personEmailUrl,
  localValue,
  personDisplayAff,
}

export {
  personName,
  personAvatar,
  personEmailUrl,
  localValue,

};
