import React, { useState, useEffect, Fragment, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import { FM, formatMessage } from 'locales';
import { isEqual } from 'lodash';
import { Input, Button, Form, Icon, Radio, Menu, Dropdown, Checkbox } from 'antd';
import { kgService } from 'services/kg';
import { Hole } from 'components/core';
import { component, connect, FormCreate, withRouter } from 'acore';
import helper from 'helper';
import { suggest } from 'services/search/search-suggest';
import { classnames } from 'utils';
import { splitStrByPlusSign } from 'utils/search-utils'
// import { domainsTreeData } from '../../searchconfigs';
import { DomainsDropdown } from '../widgets';

import * as res from './SearchBoxResource';
import styles from './AdvanceSearchBox.less';


const defaultDomainsTreeData = [{ "title": '143', "key": '143' }, { "title": '122', "key": '122' }, { "title": '102', "key": '102' }, { "title": '103', "key": '103' }, { "title": '137', "key": '137' }, { "title": '119', "key": '119' }, { "title": '117', "key": '117' }, { "title": '113', "key": '113' }, { "title": '129', "key": '129' }, { "title": '114', "key": '114' }, { "title": '116', "key": '116' }, { "title": '115', "key": '115' }, { "title": '124', "key": '124' }, { "title": '125', "key": '125' }, { "title": '126', "key": '126' }, { "title": '128', "key": '128' }, { "title": '105', "key": '105' }, { "title": '127', "key": '127' }, { "title": '104', "key": '104' }, { "title": '106', "key": '106' }, { "title": '107', "key": '107' }, { "title": '108', "key": '108' }, { "title": '138', "key": '138' }, { "title": '139', "key": '139' }, { "title": '140', "key": '140' }, { "title": '134', "key": '134' }, { "title": '120', "key": '120' }, { "title": '121', "key": '121' }, { "title": '123', "key": '123' }, { "title": '130', "key": '130' }, { "title": '131', "key": '131' }, { "title": '132', "key": '132' }, { "title": '133', "key": '133' }, { "title": '135', "key": '135' }, { "title": '109', "key": '109' }, { "title": '136', "key": '136' }, { "title": '110', "key": '110' }, { "title": '111', "key": '111' }, { "title": '112', "key": '112' }, { "title": '118', "key": '118' }]


let lastRequestId = null;
let lastTime = 1;
const AdvanceSearchBox = (props) => {
  const {
    form,
    size = 'default', className, style, btnText, searchPlaceholder, searchBtnStyle, showSearchIcon, searchOnDomainDropdownBlur = false,
    onSearchSubmit, onSearchClear, // 搜索
    domainsTreeData = defaultDomainsTreeData,
    advanceSearchZone, searchBoxLeftZone, advanceSearchBtn,  // Hole fill
    initialValue = '', advancedMode = true, // 是否使用高级搜索
    advanceSearchItems,  // 高级搜索的搜索项
    disableSearchPid = true, // for标注工具
    searchType, query, initialParams = {}, defaultInitialValues = {},
  } = props;

  const { getFieldDecorator } = form;

  const [value, setValue] = useState(query || ''); // 搜索框 value
  // const [isAdvancedMode, setIsAdvancedMode] = useState(false); // 是否使用高级模式
  const [advancedBoxVisible, setAdvancedBoxVisible] = useState(false); // 高级搜索框是否展开
  const [advancedActive, setAdvancedActive] = useState(false); // 高级搜索是否使用中，使用中则 icon 变红
  const [suggestions, setSuggestions] = useState([]);  // 搜索建议
  const [selectedDomains, setSelectedDomains] = useState([]);
  const inputBoxRef = useRef();


  const btnSize = size === 'huge' ? 'large' : size;

  const onValueChange = (e, { newValue }) => {
    setValue(newValue);
  }

  // Auto suggest will pass through all these props to the input.
  const inputProps = {
    placeholder: searchPlaceholder || (
      advancedMode
        ? formatMessage(res.messages.placeholderTerm)
        : formatMessage(res.messages.placeholder)
    ),
    value, // : query || '',
    onChange: onValueChange,
    // onClick: this.onInputClick,
  };

  useEffect(() => {
    if (initialParams && initialParams.domain) {
      setSelectedDomains(initialParams.domain.split('+'))
    }
    return () => {
      clearTimeout(lastRequestId);
    }
  }, [])

  const onClear = e => {
    e.preventDefault();

    if (onSearchClear) {
      onSearchClear({ fieldsValue: form.getFieldsValue(), selectedDomains, query: value });
    }
    // form.resetFields();
    form.setFieldsValue(defaultInitialValues)
  }

  const onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (onSearchSubmit) {
      onSearchSubmit({ advancedMode, fieldsValue: form.getFieldsValue(), selectedDomains, query: value })
    }

    // 阻止搜索后再弹出窗口。
    if (lastRequestId !== null) {
      clearTimeout(lastRequestId);
    }
    lastTime = 0;
  }

  const pushToSuggestion = (suggestion, node, type) => {
    if (!node) {
      return null;
    }
    suggestion.push({
      name: node.name,
      zh: node.name_zh,
      type,
    });
  };

  const kgDataToSuggestion = kgData => {
    const suggestion = [];
    if (!kgData) return suggestion;

    const kgindex = kgService.indexingKGData(kgData);
    const kgFetcher = kgService.kgFetcher(kgData, kgindex);
    // console.log(kgData);
    if (kgData.hits) {
      const childs = [];
      let maxParent = 3;
      kgData.hits.forEach(hit => {
        if (maxParent > 0) {
          pushToSuggestion(suggestion, kgFetcher.getNode(hit.parent), 'parent');
          maxParent -= 1;
        }
        if (hit.child_nodes && hit.child_nodes) {
          childs.push(...hit.child_nodes);
        }
        return null;
      });

      childs.slice(0, 5).forEach(childId => pushToSuggestion(suggestion, kgFetcher.getNode(childId), 'child'));
    }
    return suggestion;
  }

  const getSuggestion = (topics) => {
    // console.log('suggest find data: ', topics);
    if (!topics && topics.length <= 0) {
      return false;
    }

    const querySuggests = topics.map(topic => ({
      name: topic.text,
      zh: topic.text,
      type: 'suggest',
    }));

    const topicGraph = topics[0];
    if (topicGraph && topicGraph.graph && topicGraph.graph.hits) {
      //   const parents = [];
      //   topicGraph.graph.hits.map((hit) => {
      //     parents.push(hit.parent);
      //     if (hit.child_nodes && hit.child_nodes) {
      //       childs.push(...hit.child_nodes);
      //     }
      //     return false;
      //   });
      //
      //   console.log(parents, childs);
      // TODO generate kg suggestions json.
      const suggestion = kgDataToSuggestion(topicGraph.graph);

      // Finally generate suggest json.
      const suggestions = [
        {
          title: 'Related Topics:',
          suggestions: querySuggests,
        },
      ];
      suggestion && suggestion.length > 0 && suggestions.push({
        title: 'Knowledge Graph Suggestions:',
        suggestions: suggestion,
      })
      setSuggestions(suggestions)
    }
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    // Cancel the previous request
    if (lastRequestId !== null) {
      clearTimeout(lastRequestId);
    }

    lastRequestId = setTimeout(() => {
      const newMethod = true; // use new method to do suggest.
      if (newMethod) {
        // TODO How to abort a promise outside? Or use saga to do this.
        // TODO first call suggest search function.
        const t = new Date().getTime();
        lastTime = t;
        const suggestPromise = suggest(value);
        suggestPromise.then(
          newdata => {
            const data = newdata;
            if (lastTime && t >= lastTime) {
              if (data.data && data.data.topic && data.data.topic.length > 0) {
                getSuggestion(data.data.topic);
              }
            }
          },
          err => {
            console.log('Request failed:', err);
          },
        ).catch(error => {
          console.error(error);
        });
      } else {
        // replace with takeLatest effect.
        dispatch({ type: 'searchSuggest/suggest', payload: { query: value } })
          .then(data => { // 页面跳转到 热力图页面
            if (data.data && data.data.topic && data.data.topic.length > 0) {
              getSuggestion(data.data.topic);
            }
          });
      }
    }, 200);
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    // console.log('onSuggestionsClearRequested');
    setSuggestions([])
  };

  const toogleAdvancedBoxVisible = () => {
    setAdvancedBoxVisible(!advancedBoxVisible);
  }

  return (
    <Form
      className={classnames(
        styles.advanceSearchBox,
        styles[className],
        styles[size],
        advancedMode && styles.adv,
        advancedBoxVisible && styles.searchBoxOnAdvanceBoxVisible,
      )}

    >
      <div className='advanceSearchBoxWrap'>
        <Input.Group
          size={btnSize} style={style}
          className={classnames('search', 'kgsuggest', (suggestions && suggestions.length > 0 && styles.changeStyle))}
        >
          <Hole
            name='advanceSearchBox.searchBoxLeftZone'
            fill={searchBoxLeftZone}
            defaults={defaultZone.searchBoxLeftZone}
            param={{ domainsTreeData, setSelectedDomains, selectedDomains, onSubmit, searchOnDomainDropdownBlur, className, advancedBoxVisible, inputBoxRef }}
          />
          <Autosuggest
            id="kgsuggest"
            suggestions={suggestions}
            multiSection
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={res.getSuggestionValue}
            renderSuggestion={res.renderSuggestion}
            renderSectionTitle={res.renderSectionTitle}
            getSectionSuggestions={res.getSectionSuggestions}
            inputProps={inputProps}
            size={btnSize}
            ref={inputBoxRef}
          />
          {advancedMode && (
            <Hole
              name='advanceSearchBox.advanceSearchBtn'
              fill={advanceSearchBtn}
              defaults={defaultZone.advanceSearchBtn}
              param={{ advancedBoxVisible, toogleAdvancedBoxVisible, advancedActive }}
            />
          )}
          <Button
            htmlType="submit"
            className={classnames('searchBtn')} style={searchBtnStyle}
            size={btnSize}
            onClick={onSubmit}
          >
            {showSearchIcon ?
              (
                <>
                  {className === 'home' && (
                    <span style={{ color: '#020444' }}>
                      {/* <Icon type="search" style={{ color: '#020444' }} /> */}
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-search2" />
                      </svg>
                    </span>
                  )}
                  {className !== 'home' && (
                    <span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-search2" />
                      </svg>
                    </span>
                  )}
                </>
              ) :
              (
                <span>
                  <span className={'searchBtnText'}>{btnText || formatMessage(res.messages.searchBtn)}</span>
                  <span className={'searchBtnIcon'}>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-search2" />
                    </svg>
                  </span>
                </span>
              )}
          </Button>
        </Input.Group>
      </div>
      {advancedMode && (
        <Hole
          name='advanceSearchBox.advanceSearchZone'
          fill={advanceSearchZone}
          defaults={defaultZone.advanceSearchZone}
          param={{ advancedBoxVisible, advanceSearchItems, form, onClear, onSubmit, query: value, selectedDomains }}
        />
      )}
    </Form>
  )
}

export default component(
  FormCreate(),
  connect(),
)(AdvanceSearchBox);

const defaultZone = {
  searchBoxLeftZone: [
    ({ setSelectedDomains, domainsTreeData, selectedDomains, onSubmit, searchOnDomainDropdownBlur, className, advancedBoxVisible, inputBoxRef }) => (
      <DomainsDropdown
        className={className}
        key="domainsDropdown"
        setSelectedDomains={setSelectedDomains}
        domainsTreeData={domainsTreeData}
        selectedDomains={selectedDomains}
        onSubmit={onSubmit}
        searchOnDomainDropdownBlur={searchOnDomainDropdownBlur}
        advancedBoxVisible={advancedBoxVisible}
        inputBoxRef={inputBoxRef}
      />
    )
  ],
  advanceSearchBtn: [
    ({ advancedBoxVisible, toogleAdvancedBoxVisible, advancedActive }) => (
      <Button
        key='advanceSearchBtn'
        id='advanceSearchBtn'
        className={classnames('advanceSearchBtnWrap', advancedBoxVisible && 'advanceSearchBtnOnAdvance')}
        type='link'
        onClick={toogleAdvancedBoxVisible}
      >
        <svg className='advanceSearchBtn' aria-hidden="true" style={{ fill: advancedActive ? 'red' : '#a9a9a9' }}>
          <use xlinkHref="#icon-filter" />
        </svg>
      </Button>
    )
  ],
  advanceSearchZone: [
    ({ advancedBoxVisible, advanceSearchItems, form, onClear, onSubmit, query, selectedDomains }) => advancedBoxVisible && (
      <div className='advanceSearchBoxBottomZone' key='advanceSearchZone'>
        {renderAdvanceSearchItem(advanceSearchItems, form, onClear, onSubmit, query, selectedDomains)}
      </div>
    )
  ]
}

const renderAdvanceSearchItem = (items, form, onClear, onSubmit, query, selectedDomains) => {
  if (!items || !items.length) return null;
  const { getFieldDecorator } = form;
  return (
    <div className={styles.advanceSearchItems}>
      {items.map(item => {
        const { Component, ComponentChildren, ComponentProps, label, fieldName, fieldOptions, itemClassName, onComponentPressEnter } = item;
        if (onComponentPressEnter) {
          ComponentProps.onPressEnter = (e) => onComponentPressEnter(e, form.getFieldsValue(), query, selectedDomains);
        }
        return (
          <Form.Item
            className='advanceSearchItem'
            label={label}
            labelAlign='right'
            layout="horizontal"
            key={`advanceSearchItem${label}`}
          >
            {ComponentChildren ? getFieldDecorator(fieldName, fieldOptions)(
              <Component {...ComponentProps}>{ComponentChildren}</Component>
            ) : getFieldDecorator(fieldName, fieldOptions)(
              <Component {...ComponentProps}></Component>
            )}
          </Form.Item>
        )
      })}
      <div className='advanceSearchBoxBtns'>
        <Button type='link' onClick={onClear} className='advanceSearchBoxBtnClear'>{formatMessage({ id: 'aminer.search.advance.clear', defaultMessage: 'Clear' })}</Button>
        <Button onClick={onSubmit} className='advanceSearchBoxBtn'>{formatMessage({ id: 'aminer.search.advance.search', defaultMessage: 'Search' })}</Button>
      </div>
    </div>
  )
}
