/**
 *  Created by BoGao on 2017-10-25;
 */
import React, { PureComponent } from 'react';
import { component, Link } from 'acore';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { zhCN } from 'locales';
import * as personService from 'services/person/person';
import { classnames } from 'utils';
import styles from './PersonTags.less';

const PersonTags = props => {
  const { tags, tagsTranslated, tagsLinkFuncs, hideBorder } = props;
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={classnames(styles.personTags, { [styles.hideBorder]: hideBorder })}>
      <h4><i className="fa fa-area-chart fa-fw" /> 研究兴趣:</h4>
      <div className={styles.tagWrap}>
        {tags.slice(0, 8).map((item, idx) => {
          if (item === null || item === 'Null') {
            return false;
          }
          const key = `${item}_${idx}`;
          let tooltipTag = '';
          if (sysconfig.Locale === zhCN) { // need translate.
            if (tagsTranslated && tagsTranslated.length > idx) {
              tooltipTag = tagsTranslated[idx];
            } else {
              // const translatedTag = personService.returnKeyByLanguage(interestsI18n, item);
              const translatedTag = item// 'translatedTag';
              tooltipTag = translatedTag.zh || item;
            }
          }

          return (
            <Tooltip key={key} placement="top" title={tooltipTag}>
              <Tag className={styles.tag}>
                {/* {tagsLinkFuncs ?
                  <a href="" onClick={tagsLinkFuncs.bind(this, { query: item })}>{item}</a>
                  : (
                    <Link
                      to={`/${sysconfig.SearchPagePrefix}/${item}`}>
                      {item}
                    </Link>
                  )} */}
                {item}
              </Tag>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default component()(PersonTags);


// // TODO 临时措施，国际化Interest应该从server端入手。
// let interestsI18n;
// personService.getInterestsI18N((result) => {
//   interestsI18n = result;
// });

// class PersonTagsrstrs {
//   static propTypes = {
//     // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     className: PropTypes.string, // NOTE: 一般来说每个稍微复杂点的Component都应该有一个className.
//     tags: PropTypes.array,
//     tagsTranslated: PropTypes.array,
//     tagsLinkFuncs: PropTypes.func,
//     hideBorder: PropTypes.bool,
//   };
// }
