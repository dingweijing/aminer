/* eslint-disable react/destructuring-assignment */
// Author: Elivoa, 2018-12-12

import React from 'react';
import { defineMessages, } from 'react-intl';
import { zhCN } from 'locales';
import { sysconfig } from 'systems';

// i18n resources.
export const messages = defineMessages({
  placeholder: {
    id: 'com.KgSearchBox.placeholder',
    defaultMessage: 'Input expert name or query',
  },
  placeholderTerm: {
    id: 'com.KgSearchBox.placeholderTerm',
    defaultMessage: 'Term',
  },
  placeholderName: {
    id: 'com.KgSearchBox.placeholderName',
    defaultMessage: 'Name',
  },
  placeholderOrg: {
    id: 'com.KgSearchBox.placeholderOrg',
    defaultMessage: 'Org',
  },
  searchBtn: {
    id: 'com.KgSearchBox.searchBtn',
    defaultMessage: 'Search',
  },
});

// ------------------------------------------------------
// utils
// ------------------------------------------------------

// 根据一些参数判定是应该显示高级模式还是普通模式；
export const getRealAdvancedSearchStatus = (props) => {
  const { fixAdvancedSearch, disableAdvancedSearch, isAdvancedSearch, queryObject } = props;
  if (disableAdvancedSearch) {
    return false;
  }
  if (fixAdvancedSearch) {
    return true;
  }
  // 使用修改过的model中的值。
  if (isAdvancedSearch != null) {
    return isAdvancedSearch;
  }
  // 如果没有设置上述值，那么使用从query中判断出来的值；
  if (queryObject && queryObject.advanced) {
    return true
  }
  return false;
};


// ------------------------------------------------------
// Suggest Related
// ------------------------------------------------------

// Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = (value) => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//
//   return inputLength === 0 ? [] : languages.filter(lang =>
//   lang.name.toLowerCase().slice(0, inputLength) === inputValue);
// };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
export const getSuggestionValue = (suggestion) => {
  const value = sysconfig.Locale === zhCN ? suggestion.zh : suggestion.name;
  return value.replace('/', ', ');
};

// Use your imagination to render suggestions.
export const renderSuggestion = (suggestion) => {
  const cn = sysconfig.Locale === zhCN;
  return (
    <div>
      {suggestion.type === 'parent' && <span className="label">上位词: </span>}
      {suggestion.type === 'sibling' && <span className="label">推荐词: </span>}
      {suggestion.type === 'child' && <span className="label">下位词: </span>}
      {cn ? suggestion.zh : suggestion.name}
    </div>
  );
};

export const renderSectionTitle = (section) => {
  return (
    <div className="title">{section.title}</div>
  );
};

export const getSectionSuggestions = (section) => {
  return section.suggestions;
};
