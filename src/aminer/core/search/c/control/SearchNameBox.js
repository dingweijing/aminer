/* eslint-disable react/destructuring-assignment */
// Author: Elivoa, 2018-10-12
// refactor by Bo Gao, 2018-12-15 v2.0 - Replacement of KgSearchBox;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect, FormCreate, Link } from 'acore';
import { Input, Button, Form, Icon } from 'antd';
import { suggest, nameSuggest } from 'services/search/search-suggest';
import { classnames } from 'utils';
import Autosuggest from 'react-autosuggest';
import display from 'utils/display';
import * as res from './SearchBoxResource';
import { formatMessage } from '@/locales';
import styles from './SearchNameBox.less';

@FormCreate()
@connect()
class SearchNameBox extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.any,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.lastRequestId = null; // 记录最后一次请求的ID，其余的都清除掉。
    this.latestT = 1;
  }

  state = {
    value: '', // current query, or term in advanced.
    suggestions: [],
    select_suggestion: '',
    // readonly things
    query: null, // readonly query object, used to monitor changes.
  };

  componentWillUnmount = () => {
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }
  };

  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
  };

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
        const suggestPromise = nameSuggest(value);
        suggestPromise
          .then(
            newdata => {
              const data = newdata;
              if (this.latestT && t >= this.latestT) {
                if (data.data && data.data.length > 0) {
                  this.makeSuggestion(data.data);
                }
              }
            },
            err => {
              console.log('Request failed:', err);
            },
          )
          .catch(error => {
            console.error(error);
          });
      } else {
        // replace with takeLatest effect.
        dispatch({ type: 'searchSuggest/suggest', payload: { query: value } }).then(data => {
          //页面跳转到 热力图页面
          if (data.data && data.data.topic && data.data.topic.length > 0) {
            this.makeSuggestion(data.data.topic);
          }
        });
      }
    }, 200);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

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

  makeSuggestion = persons => {
    console.log('suggest find data: ', persons);

    if (!persons && persons.length <= 0) {
      return false;
    }
    const suggestions = persons.slice(0, 8);
    this.setState({ suggestions });
  };

  // getSectionSuggestions = (section) => {
  //   console.log('section', section)
  //   return section.suggestions;
  // };
  getSuggestionValue = suggestion => {
    const { payload, text } = suggestion;
    this.setState({
      select_suggestion: suggestion,
    });
    // const value = sysconfig.Locale === zhCN ? suggestion.zh : suggestion.name;
    // searchProfileAward(payload.id, { id: payload.id, name: text })
    // dispatch({
    //   type: 'aminerSearch/getListAwardsByAid',
    //   payload: {
    //     aid: suggestion.payload.id, year: 2018
    //   }
    // })
    return text;
  };

  renderNameSuggestion = suggestion => {
    // const cn = sysconfig.Locale === zhCN;

    const avatar = display.personAvatar(suggestion.img, 0, 30);
    return (
      <div
        className={styles.nameSuggest}
        onClick={() => {
          this.clickSuggestion(suggestion);
        }}
      >
        <div className="profile_avatar">
          <img className="avatar" src={avatar} alt="" />
        </div>
        <div className="profile_info">
          <p>{suggestion.text}</p>
          {suggestion.payload && <p>{suggestion.payload.aff || suggestion.payload.aff_zh || ''}</p>}
        </div>
        <div className="profile_hindex">
          {suggestion.payload && (
            <span className="hindex">{`#-hindex: ${suggestion.payload.h_index}`}</span>
          )}
        </div>
      </div>
    );
  };

  clickSuggestion = suggestion => {
    const { searchProfileAward } = this.props;
    const { payload, text } = suggestion || {};
    setTimeout(() => {
      this.setState({ value: '', select_suggestion: null });
    }, 0);
    searchProfileAward(payload.id, { id: payload.id, name: text });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { searchProfileAward } = this.props;
    const { select_suggestion } = this.state;
    const { payload, text } = select_suggestion || {};
    if (!payload || !payload.id) {
      return;
    }
    // console.log('value', value, select_suggestion)
    searchProfileAward(payload.id, { id: payload.id, name: text });
    this.setState({ value: '', select_suggestion: null });
  };

  render() {
    const { value, suggestions } = this.state;
    const { form } = this.props;
    const { size, className, style, icon, placeholder } = this.props;
    const { getFieldDecorator } = form;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: formatMessage({
        id: (placeholder && placeholder.id) || 'ai10.field.search.placeholder',
        defaultMessage: (placeholder && placeholder.defaultMessage) || "Input name to check one's position",
      }),
      value,
      onChange: this.onChange,
    };
    const btnSize = size === 'huge' ? 'large' : size;

    return (
      <Form
        className={classnames(styles.searchBox, styles[className], styles[size])}
        onSubmit={this.handleSubmit}
      >
        <Input.Group
          compact
          size={btnSize}
          style={style}
          className={classnames(styles.search, 'kgsuggest', {hasIcon: !!icon})}
        >
          <Autosuggest
            id="kgnamesuggest"
            suggestions={suggestions}
            // multiSection
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderNameSuggestion}
            renderSectionTitle={res.renderSectionTitle}
            // getSectionSuggestions={res.getSectionSuggestions}
            inputProps={inputProps}
            size={btnSize}
          />
          <div className={classnames(styles.searchIcon)}><svg className="icon" aria-hidden="true">
            <use xlinkHref={`#icon-${icon}`} />
          </svg></div>
        </Input.Group>
      </Form>
    );
  }
}

export default SearchNameBox;
