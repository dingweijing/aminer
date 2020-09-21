import React from 'react';
import { component, connect } from 'acore';
import { sysconfig } from 'systems';
import { FM, zhCN, formatMessage } from 'locales';
import { getSearchPathname } from 'utils/search-utils';
import { ProfileInfo, IframeSpecialType } from 'aminer/components/person/person_type';

const Tags = (props: {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  person: ProfileInfo;
  target: string;
  special: IframeSpecialType;
}) => {
  const { person, special, dispatch, target = '_blank' } = props;
  const { onSearchQuery } = props;
  const { source, stpye } = special || {};

  const handleSearchQuery = (query: string) => {
    if (onSearchQuery) {
      onSearchQuery(query);
      return;
    }
    if (source === 'sogou' || source === 'true') {
      let url = '';
      if (stpye == 'wap') {
        url = `http://scholar.sogou.com/xueshu?keyword=${query}&TabMode=2`;
      } else {
        url = `http://scholar.sogou.com/xueshu?ie=utf-8&keyword=${query}&TabMode=2`;
      }
      window.open(url, '_top');
      return;
    }
    dispatch({ type: 'searchperson/toggleAdvancedSearch', payload: true });
    window.open(getSearchPathname(query), target);
  };

  let { tags, tags_zh } = person;
  if (sysconfig.Locale === zhCN) {
    [tags, tags_zh] = [tags_zh, tags];
  }
  tags = tags && tags.length ? tags : tags_zh;
  tags = tags && tags.slice(0, 8);
  return (
    <>
      {tags && tags.length !== 0 && (
        <p className="tags">
          {tags.map((tag, index) => {
            if (!tag) {
              return null;
            }
            return (
              <button type="button" className="tag" key={`${tag}_${index}`}>
                <span onClick={handleSearchQuery.bind(null, tag)}>{tag}</span>
              </button>
            );
          })}
        </p>
      )}
    </>
  );
};

export default component(connect())(Tags);
