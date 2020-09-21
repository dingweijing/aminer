/*
 * @Author: your name
 * @Date: 2019-11-01 15:10:50
 * @LastEditTime: 2020-07-17 09:48:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/aminer/core/search/c/control/SearchBox.js
 */
/* eslint-disable react/destructuring-assignment */
// Author: Elivoa, 2018-10-12
// refactor by Bo Gao, 2018-12-15 v2.0 - Replacement of KgSearchBox;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect, FormCreate, withRouter } from 'acore';
import { Input, Button, Form, Icon, Radio } from 'antd';
import { suggest } from 'services/search/search-suggest';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import helper from 'helper';
import { anyNE, deepNE } from 'utils/compare';
import queryhelper from 'helper/queryhelper';
import Autosuggest from 'react-autosuggest';
import { kgService } from 'services/kg';
import { isEqual } from 'lodash';
import styles from './SearchBox.less';
import * as res from './SearchBoxResource';
import AdvanceFilter from './AdvanceFilter';

// 根据传入的queryObject类型自动判断是高级搜索框还是普通搜索框；

@FormCreate() @withRouter
@connect(({ searchmodel }) => ({ // here is main model.
  isAdvancedSearch: searchmodel.isAdvancedSearch,
}))
class SearchBox extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.any,
    queryObject: PropTypes.any,

    fixAdvancedSearch: PropTypes.bool,
    disableAdvancedSearch: PropTypes.bool,
    disableSearchPid: PropTypes.bool,
  };

  static defaultProps = {
    fixAdvancedSearch: false,
    disableAdvancedSearch: false,
    disableSearchPid: true, // 高级搜索模式下 不能直接搜人的id
  };

  constructor(props) {
    super(props);
    this.lastRequestId = null; // 记录最后一次请求的ID，其余的都清除掉。
    this.latestT = 1;
    this.formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 10 },
    };
  }

  // Auto suggest is a controlled component.
  // This means that you need to provide an input value
  // and an onChange handler that updates this value (see below).
  // Suggestions also need to be provided to the Autosuggest,
  // and they are initially empty because the Autosuggest is closed.
  state = {
    value: '', // current query, or term in advanced.
    suggestions: [],
    isAdvancedMode: null,
    isAdvancedFilterMode: false,
    isSearchByAdvanceFilter: false,

    // readonly things
    query: null, // readonly query object, used to monitor changes.
    fixAdvancedSearch: false,
    disableAdvancedSearch: false,
    isAdvancedSearch: null,
  };

  // -------------------------------------
  // Very Big & Complicated Sync Methods.
  // -------------------------------------
  static getDerivedStateFromProps(props, state) {
    const changes = {} // final changes will made.
    const { queryObject } = props;
    const { advanced, query } = queryObject || {}

    // * step1: determin mode.
    let mode = state.isAdvancedMode; // can be null(initial), true or false.
    if (mode === null || anyNE(props, state, 'fixAdvancedSearch', 'isAdvancedSearch', 'disableAdvancedSearch')) {
      const { fixAdvancedSearch, disableAdvancedSearch, isAdvancedSearch } = props;
      // * step 1.1: remember to state.
      changes.fixAdvancedSearch = !!fixAdvancedSearch;
      changes.disableAdvancedSearch = !!disableAdvancedSearch;
      changes.isAdvancedSearch = isAdvancedSearch; // true, false or null

      // * step 1.2 judge mode.
      mode = res.getRealAdvancedSearchStatus({ fixAdvancedSearch, disableAdvancedSearch, isAdvancedSearch, queryObject })
      changes.isAdvancedMode = mode;

      // * step 1.3 切换转换; 变成高级模式或者变成普通模式；
      if (mode && !state.isAdvancedMode) {
        // console.log("change to advanced mode", mode);
      } else if (!mode && state.isAdvancedMode) {
        // console.log("change to simple mode", mode);
      }
    }

    // * step 2: monitor query change
    if (!isEqual(queryObject, state.query)) {
      changes.query = queryObject
      if (mode) {
        // * 2.1 advanced mode & advanced query changed.
        if (!queryhelper.isAdvEquals(advanced, state.query && state.query.advanced) && advanced && advanced.term) {
          // advanced query changed, override value;
          changes.value = advanced && advanced.term;
        }
      } else {
        // * 2.2 simple mode & advanced query changed.
        const equals = queryhelper.isSimpleQueryEquals(query, state.query);
        if (!equals) {
          const newQuery = !query || query === '-' ? '' : query;
          changes.value = newQuery;
        }
      }
    }

    const { searchIn, author, conference, keywords } = helper.parseUrlParam(props, {}, [
      'searchIn', 'author', 'conference', 'keywords'
    ]);
    if ((searchIn && searchIn !== 'all') || author || conference || keywords) {
      changes.isSearchByAdvanceFilter = true;
    } else {
      changes.isSearchByAdvanceFilter = false;
    }
    // console.log("changed:", changes)
    return Object.keys(changes).length > 0 ? changes : null;
  }

  componentDidMount() {
    const { isAdvancedMode, query } = this.state;
    const { form } = this.props;
    if (isAdvancedMode) {
      const { name, org } = (query && query.advanced) || {};
      console.log('name, org', name, org)
      form.setFieldsValue({ name: name || '', org: org || '' });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { form } = this.props;
    const { query, isAdvancedMode, isAdvancedFilterMode } = this.state;
    const queryChanged = deepNE(prevState, this.state, 'query')
    const modeChanged = prevState.isAdvancedMode !== isAdvancedMode;
    const filterModeChanged = prevState.isAdvancedFilterMode !== isAdvancedFilterMode;
    if (queryChanged || modeChanged) {
      if (isAdvancedMode) {
        const { name, org } = (query && query.advanced) || {};
        form.setFieldsValue({ name: name || '', org: org || '' });
      }
    }
  }

  componentWillUnmount = () => {
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
  };

  // onInputClick = () => {
  //   const { isAdvancedFilterMode, isSearchByAdvanceFilter } = this.state;
  //   if (window.location && window.location.pathname === '/search/pub' && !isAdvancedFilterMode && isSearchByAdvanceFilter) {
  //     this.setState({ isAdvancedFilterMode: true, isAdvancedMode: false })
  //   }
  // }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value, reason }) => {
    const { dispatch } = this.props;
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    // 延时200毫秒再去请求服务器。
    this.lastRequestId = setTimeout(() => {
      const newMethod = true; // use new method to do suggest.
      if (newMethod) {
        // TODO How to abort a promise outside? Or use saga to do this.
        // TODO first call suggest search function.
        const t = new Date().getTime();
        this.latestT = t;
        const suggestPromise = suggest(value);
        suggestPromise.then(
          newdata => {
            const data = newdata;
            if (this.latestT && t >= this.latestT) {
              if (data.data && data.data.topic && data.data.topic.length > 0) {
                this.makeSuggestion(data.data.topic);
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
              this.makeSuggestion(data.data.topic);
            }
          });
      }
    }, 200);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    // console.log('onSuggestionsClearRequested');
    this.setState({ suggestions: [] });
  };

  // TODO sort parents and childs.
  kgDataTransferToSuggest = kgData => {
    const kgindex = kgService.indexingKGData(kgData);
    const kgFetcher = kgService.kgFetcher(kgData, kgindex);
    // console.log('kg', kgindex, kgFetcher);

    const suggestion = [];
    if (kgData) {
      // console.log(kgData);
      if (kgData.hits) {
        const childs = [];
        let maxParent = 3;
        kgData.hits.map(hit => {
          if (maxParent > 0) {
            this.pushToSuggestion(suggestion, kgFetcher.getNode(hit.parent), 'parent');
            maxParent -= 1;
          }
          if (hit.child_nodes && hit.child_nodes) {
            childs.push(...hit.child_nodes);
          }
          return null;
        });

        childs.slice(0, 5).map(childId => this.pushToSuggestion(suggestion, kgFetcher.getNode(childId), 'child'));
      }
    }
    return suggestion;
  };

  // kgDataTransferToSuggest2 = kgData => {
  //   const suggestion = [];
  //   if (kgData) {
  //     // console.log(kgData);
  //     if (kgData.name !== '_root') {
  //       this.pushToSuggestion(suggestion, kgData);
  //     }
  //     if (kgData.children && kgData.children.length > 0) {
  //       kgData.children.map(node => this.pushToSuggestion(suggestion, node));
  //       // level 3
  //       kgData.children.map(node => {
  //         if (node.children && node.children.length > 0) {
  //           node.children.map(node3 => this.pushToSuggestion(suggestion, node3));
  //         }
  //         return null;
  //       });
  //     }
  //   }
  //   return suggestion;
  // };

  pushToSuggestion = (suggestion, node, type) => {
    if (!node) {
      return null;
    }
    suggestion.push({
      name: node.name,
      zh: node.name_zh,
      type,
    });
  };

  makeSuggestion = (topics, selectedTopic) => {
    // console.log('suggest find data: ', topics);
    if (!topics && topics.length <= 0) {
      return false;
    }

    const querySuggests = [];
    topics.map(topic => querySuggests.push({
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
      const suggestion = this.kgDataTransferToSuggest(topicGraph.graph);

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

      this.setState({ suggestions });
    }
  };

  /**
   * Handle Submit
   * @param event
   */
  handleSubmit = event => {
    event.preventDefault();

    // pin query
    const { form, onSearch, dispatch } = this.props;
    const { value, isAdvancedMode } = this.state;

    let pid = form.getFieldValue('pid');
    pid = pid && pid.length ? pid.split(/[, ， ； ;]/) : [];

    let queryObject;
    if (isAdvancedMode) {
      const name = form.getFieldValue('name');
      const org = form.getFieldValue('org');
      queryObject = { advanced: { name, org, term: value } }
    } else {
      queryObject = { query: value || '-' }
    }
    if (onSearch) {
      onSearch({ queryObject, query: value, extra_ids: pid });
    }

    // 阻止搜索后再弹出窗口。
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }
    this.latestT = 0;
  };

  switchAdvanced = () => {
    this.props.dispatch({ type: 'searchmodel/toggleAdvancedSearch', payload: this.state.isAdvancedMode });
  };

  switchAdvanceFilter = (e) => {
    this.setState({
      isAdvancedFilterMode: !this.state.isAdvancedFilterMode,
    });
  }
  render() {
    const { value, suggestions, isAdvancedMode, isAdvancedFilterMode, isSearchByAdvanceFilter } = this.state;
    const { form } = this.props;
    const { size, className, style, btnText, searchPlaceholder, searchBtnStyle, showSearchIcon, onSearch } = this.props;
    const { getFieldDecorator } = form;
    const { fixAdvancedSearch, disableAdvancedSearch, showAdvanceFilterIcon, disableSearchPid } = this.props;
    const shouldShowSiwtchBtn = !fixAdvancedSearch && !disableAdvancedSearch;
    // const { isAdvancedSearch } = this.props; // from app model.
    // fixAdvancedSearch ? true : isAdvancedSearch;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: searchPlaceholder || (
        isAdvancedMode
          ? formatMessage(res.messages.placeholderTerm)
          : formatMessage(res.messages.placeholder)
      ),
      value, // : query || '',
      onChange: this.onChange,
      // onClick: this.onInputClick,
    };
    const btnSize = size === 'huge' ? 'large' : size;
    // Finally, render it!
    return (
      <Form
        className={classnames(
          styles.searchBox,
          styles[className],
          styles[size],
          isAdvancedMode ? styles.adv : '',
        )}
        onSubmit={this.handleSubmit}>

        <Input.Group
          compact size={btnSize} style={style}
          className={classnames(styles.search, 'kgsuggest', suggestions && suggestions.length > 0 && styles.changeStyle)}
        >
          <Autosuggest
            id="kgsuggest"
            suggestions={suggestions}
            multiSection
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={res.getSuggestionValue}
            renderSuggestion={res.renderSuggestion}
            renderSectionTitle={res.renderSectionTitle}
            getSectionSuggestions={res.getSectionSuggestions}
            inputProps={inputProps}
            size={btnSize}
          />
          {showAdvanceFilterIcon && (
            <Button
              id='advanceSearchIcon'
              className={classnames(styles.advanceSearchIconWrap, isAdvancedFilterMode && styles.iconPositionRight)}
              type='link'
              onClick={this.switchAdvanceFilter}
            >
              <svg className={styles.advanceSearchIcon} aria-hidden="true" style={{ fill: isSearchByAdvanceFilter ? 'red' : '#a9a9a9' }}>
                <use xlinkHref="#icon-filter" />
              </svg>
            </Button>
          )}
          {isAdvancedMode && (
            <>
              <Form.Item className={styles.nameFormItem}>
                {getFieldDecorator('name', {
                  // rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input autoComplete="off" className={classnames(styles.inputBox, styles.name)}
                    placeholder={formatMessage(res.messages.placeholderName)}
                  />
                )}
              </Form.Item>
              <Form.Item className={styles.orgFormItem}>
                {getFieldDecorator('org', {
                  // rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input className={classnames(styles.inputBox, styles.org)}
                    placeholder={formatMessage(res.messages.placeholderOrg)}
                  />
                )}
              </Form.Item>
              {!disableSearchPid && (
                <Form.Item className={styles.orgFormItem}>
                  {getFieldDecorator('pid', {
                  })(
                    <Input className={classnames(styles.inputBox, styles.org)}
                      placeholder="ID" />
                  )}
                </Form.Item>
              )}
            </>
          )}

          <Button
            htmlType="submit"
            className={classnames(styles.searchBtn, { [styles.searchBtnDisable]: isAdvancedFilterMode })} style={searchBtnStyle}
            type="primary" size={btnSize}
          // onClick={this.handleSubmit}
          >
            {showSearchIcon ?
              (
                <>
                  {className === 'home' && (
                    <span><Icon type="search" style={{ color: '#020444' }} /></span>
                  )}
                  {className !== 'home' && (
                    <span><Icon type="search" /></span>
                  )}
                </>
              ) :
              (
                <span>
                  <span className={styles.searchBtnText}>{btnText || formatMessage(res.messages.searchBtn)}</span>
                  <span className={styles.searchBtnIcon}><Icon type="search" /></span>
                </span>
              )}
          </Button>

          {shouldShowSiwtchBtn && className === 'home' && (
            <div className={styles.switchText}>
              <span className={styles.text} onClick={this.switchAdvanced}>
                {isAdvancedMode ?
                  (<FM id="aminer.search.btn.general" defaultMessage="General" />) :
                  (<FM id="aminer.search.btn.advanced" defaultMessage="Advanced" />)
                }
              </span>
              {/* <span className={styles.arrow}></span> */}
            </div>
          )}

          {shouldShowSiwtchBtn && className !== 'home' && (
            <Button
              className={styles.switchBtn} style={searchBtnStyle}
              type="primary" size={btnSize}
              onClick={this.switchAdvanced}
              aria-label="switch_advanced"
            >
              <i className="fa fa-fw fa-retweet fa-md" />
            </Button>
          )}
          <AdvanceFilter
            isAdvancedFilterMode={isAdvancedFilterMode}
            closeAdvanceFilter={this.switchAdvanceFilter}
            queryValue={value}
            onSearch={onSearch}
          />
        </Input.Group>

      </Form>
    );
  }
}

export default SearchBox;
