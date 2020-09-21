import React, { Fragment } from 'react';
import { component, connect, Link } from 'acore';
import { sysconfig } from 'systems';
import { Tooltip } from 'antd';
import helper from 'helper';
import { classnames } from 'utils';
import { FM, zhCN, formatMessage } from 'locales';
import { getSearchPathname } from 'utils/search-utils';
import { ProfileInfo, IframeSpecialType } from 'aminer/components/person/person_type';
import styles from './Tags.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  person: ProfileInfo;
  target: string;
  special: IframeSpecialType;
  isTagClick: boolean;
  onTagClick: (query: string) => void;
}

interface ITagRelcation {
  default_tag: string;
  tip_tag: string;
}

const getTagRelation: (tags: string[], tags_zh: string[]) => ITagRelcation[] = (
  tags = [],
  tags_zh = [],
) => {
  return tags?.map((item, index) => {
    const tag = item || '';
    const tag_zh = tags_zh[index] || '';
    // if (sysconfig.Locale === zhCN && tag_zh) {
    //   [tag, tag_zh] = [tag_zh, tag];
    // }
    return {
      default_tag: tag,
      tip_tag: sysconfig.Locale === zhCN ? tag_zh : '',
    };
  });
};

const Tags: React.FC<IPropTypes> = props => {
  const { person } = props;
  const { onTagClick, isTagClick = true, target = '_blank' } = props;

  const { tags = [], tags_zh, tags_translated_zh } = person || {};
  const zh = tags_zh || tags_translated_zh || [];
  const relation_tags = getTagRelation(tags, zh).slice(0, 8);

  if (!relation_tags.length) {
    return <></>;
  }

  return (
    <div className={classnames(styles.tags, 'tags')}>
      {relation_tags?.map(item => {
        const { default_tag, tip_tag } = item;
        // const tip_tag = sysconfig.Locale === zhCN ? sub_tag : '';
        return (
          <Fragment key={default_tag}>
            {default_tag && (
              <Tooltip title={tip_tag} placement="topLeft">
                {/* {(!isTagClick || onTagClick) && <span className="tag un">{default_tag}</span>} */}
                {!onTagClick && isTagClick && (
                  <Link to={`${getSearchPathname(default_tag)}`} className="tag" target={target}>
                    {default_tag}
                  </Link>
                )}
                {!onTagClick && !isTagClick && <span className="tag un">{default_tag}</span>}
                {onTagClick && (
                  <span
                    className="tag"
                    onClick={() => {
                      onTagClick(default_tag);
                    }}
                  >
                    {default_tag}
                  </span>
                )}
              </Tooltip>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default component(connect())(Tags);
