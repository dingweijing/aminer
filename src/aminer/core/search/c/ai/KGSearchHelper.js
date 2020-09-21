/* eslint-disable react/destructuring-assignment,no-param-reassign,camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { Checkbox, Button, Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { zhCN, FM } from 'locales';
import classnames from 'classnames';

import styles from './KGSearchHelper.less';

// ---------------  SAMPLE LINE  ----------------------------
@connect((injection, { modelName }) => {
  // const modelName = `searchmodel${type || ''}`;
  const searchmodel = injection[modelName];
  const { assistantData, smartQuery } = searchmodel;
  return {
    modelName, assistantData, smartQuery,
  }
})
class KGSearchHelper extends Component {
  static propTypes = {
    query: PropTypes.any,
    // disableSmartSuggest: PropTypes.bool,
  };

  static defaultProps = {};

  state = {
    currentExpansionChecked: 0,
    currentTranslationChecked: 0,
    keywordTranslationChecked: 0, // 不是扩展的选择，而是单词翻译的状态.

    indeterminate: false,
    checkAll: false,
    checkedList: [],

    hyponymIsIntitalStatus: true, // 下位词初始状态

    // status control
    // kgLoading: false,
  };

  hypernymChecked = [];

  hyponymChecked = [];
  // ---------------  SAMPLE LINE  ----------------------------

  // TODO use new lifecircle
  componentWillReceiveProps(nextProps) {
    if (nextProps.query.query !== this.props.query.query) {
      this.setState({
        currentExpansionChecked: 0,
        currentTranslationChecked: 0,
        keywordTranslationChecked: 0,
      });
    }
    if (nextProps.assistantData !== this.props.assistantData) {
      // TODO 刷新一下kg.
      const { kgHypernym, kgHyponym } = nextProps.assistantData || [];
      const newCheckedList = [];
      this.dataIntegration(kgHypernym, newCheckedList, true);
      this.dataIntegration(kgHyponym, newCheckedList, true);
      this.setState({ kgLoading: false, checkedList: newCheckedList });
    }
  }

  componentWillUnmount() {
    // TODO clear meta; // TODO should be in other place.
    const { modelName, dispatch } = this.props;
    dispatch({ type: `${modelName}/clearAssistantDataMeta` });
  }

  onExpandedTermChange = index => {
    let tempExpansion;
    let tempTranslation;
    const { currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked } = this.state;

    if (index + 1 !== currentExpansionChecked) {
      tempExpansion = index + 1;
      tempTranslation = currentTranslationChecked === 0 ? 0 : index + 1;
    } else {
      tempExpansion = 0;
      tempTranslation = 0;
    }
    this.setState({
      currentExpansionChecked: tempExpansion,
      currentTranslationChecked: tempTranslation,
      kgLoading: true,
      checkedList: [],
      hyponymIsIntitalStatus: true,
    });
    this.callSearch(
      tempExpansion, tempTranslation, keywordTranslationChecked,
      [], true
    );
  };

  onTermTranslationChange = e => {
    this.setState({
      keywordTranslationChecked: e.target.checked ? 1 : 0,
    });
    this.callSearch(
      this.state.currentExpansionChecked,
      this.state.currentTranslationChecked,
      e.target.checked ? 1 : 0,
      this.state.checkedList,
      false
    );
  };

  onTranslationChange = index => {
    const { currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked, checkedList } = this.state;
    this.setState({
      currentTranslationChecked: currentTranslationChecked === index + 1 ? 0 : index + 1,
    });

    if (index + 1 !== currentExpansionChecked) {
      this.setState({
        currentExpansionChecked: index + 1,
        kgLoading: true,
        checkedList: [],
        hyponymIsIntitalStatus: true,
      });
    }
    this.callSearch(
      index + 1 !== currentExpansionChecked ? index + 1 : currentExpansionChecked,
      currentTranslationChecked === index + 1 ? 0 : index + 1,
      keywordTranslationChecked,
      checkedList, null
    );
  };

  onKGChange = (type, checkedList) => {
    const { assistantData } = this.props;
    const lenkgHyponym = assistantData.kgHyponym && assistantData.kgHyponym.length;
    const lenkgHypernym = assistantData.kgHypernym && assistantData.kgHypernym.length;
    const len = lenkgHyponym + lenkgHypernym;

    // const defaultValue = this.setDefaultCheckedList();
    this[`${type}Checked`] = checkedList;
    this.setState({
      checkedList: this.hypernymChecked.concat(this.hyponymChecked),
      indeterminate: !!checkedList.length && (checkedList.length < len),
      checkAll: checkedList.length === len,
      hyponymIsIntitalStatus: false,
    });
    this.callSearch(
      this.state.currentExpansionChecked,
      this.state.currentTranslationChecked,
      this.state.keywordTranslationChecked,
      this.hypernymChecked.concat(this.hyponymChecked),
      false
    );
  };

  onCheckAllChange = () => {
    const { kgHypernym, kgHyponym } = this.props.assistantData;
    const kgData = [];
    this.dataIntegration(kgHypernym, kgData);
    this.dataIntegration(kgHyponym, kgData);
    if (this.state.checkAll) {
      this.setState({ checkedList: [], indeterminate: false, checkAll: false });
    } else if (!this.state.checkAll) {
      const newCheckedList = kgData && kgData.map(term => term.word);
      this.setState({ checkedList: newCheckedList, indeterminate: false, checkAll: true });
    }
  };

  // setDefaultCheckedList = () => {
  //   const { assistantData } = this.props;
  //   const defaultValue = [];
  //   const defaultCheckedLength = assistantData.level && assistantData.level <= 1 ? 8 : 3;
  //   if (this.state.hyponymIsIntitalStatus) {
  //     if (assistantData.kgHyponym && assistantData.kgHyponym.length > 0) {
  //       for (let i = 0; i < assistantData.kgHyponym.length && i < defaultCheckedLength; i += 1) {
  //         if (i < defaultCheckedLength) {
  //           defaultValue.push(assistantData.kgHyponym[i].word);
  //         }
  //       }
  //     }
  //   }
  //   return defaultValue;
  // };

  getMoreKGWords = (data, type) => {
    const { assistantData, dispatch, modelName, query } = this.props;
    const { abbr, kgHyponym, kgHypernym } = assistantData;

    let kghypernymTotal = 0;
    let kghyponymTotal = 0;
    if (type === 'hypernym') {
      kghypernymTotal = data.length + 10;
    } else if (kgHypernym) {
      kghypernymTotal = kgHypernym.length;
    }
    if (type === 'hyponym') {
      kghyponymTotal = data.length + 10;
    } else if (kgHyponym) {
      kghyponymTotal = kgHyponym.length;
    }
    const typesTotals = {
      abbrTotal: abbr ? abbr.length : 0, kghypernymTotal, kghyponymTotal,
    };
    const {
      currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked,
      checkedList,
    } = this.state;

    this.callSearch(
      currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked,
      checkedList, false, typesTotals, { isGetMoreKG: true }
    );
  };

  // 渲染上下位次
  renderKGData = (data, type) => {
    // const defaultValue = [];
    let isShowMoreBtn = false;
    const { assistantData } = this.props;
    const { level } = assistantData;
    /*
     * defaultCheckedLength level<=1时默认选择8个下位词，否则选择3个下位词
     * 2019年1月7日 默认不选中
     * const defaultCheckedLength = 0;
     * */

    const hypernymFirstTotal = 3; // 第一次取的上位词个数
    const hyponymFirstTotal = 9; // 第一次取的下位词个数

    if (type === 'hyponym' && data) {
      // if (data.length > 0 && this.state.hyponymIsIntitalStatus) {
      //   for (let i = 0; i < data.length && i < defaultCheckedLength; i += 1) {
      //     if (i < defaultCheckedLength) {
      //       defaultValue.push(data[i].word);
      //     }
      //   }
      // }
      if (data.length >= hyponymFirstTotal && (data.length - hyponymFirstTotal) % 10 === 0) {
        isShowMoreBtn = true;
      }
    } else if (type === 'hypernym' && data) {
      if (data.length >= hypernymFirstTotal && (data.length - hypernymFirstTotal) % 10 === 0) {
        isShowMoreBtn = true;
      }
    }
    return (
      <Checkbox.Group
        onChange={this.onKGChange.bind(this, type)}
      // value={this.state.checkedList}
      >
        {data && data.map((term, index) => {
          const key = `${term.word}_${index}`;
          const isRandomWord = type === 'hyponym' && data.length === 8 && index === 7 ||
            type === 'hypernym' && data.length === 3 && index === 2;
          const checkbox = (
            <Checkbox key={key} value={term.word} checked={this.state.checkAll}>
              {isRandomWord && (
                <Tooltip placement="top" title="随机词" key="随机词">
                  <i className={classnames('fa', 'fa-random', styles.randomIconColor)} />&nbsp;
                </Tooltip>
              )}
              <span className={classnames(styles[type], { [styles.randomWord]: isRandomWord })}>
                {term.word}
              </span>
            </Checkbox>
          );
          return (term.word_zh && sysconfig.Locale === zhCN) ?
            (
              <Tooltip placement="top" title={term.word_zh} key={key}>
                {checkbox}
              </Tooltip>
            ) : checkbox;
        })}

        {isShowMoreBtn && (
          <Button className={styles.clearBtnStyle}
            onClick={this.getMoreKGWords.bind(this, data, type)}>
            ...More
          </Button>
        )}

      </Checkbox.Group>
    );
  };

  dataIntegration = (kgHypernym, data, isFound) => {
    if (kgHypernym && kgHypernym.length > 0) {
      for (const term of kgHypernym) {
        if (isFound) {
          const found = this.state.checkedList.find(checked => checked === term.word);
          if (found && found.length > 0) {
            data.push(term.word);
          }
        } else {
          data.push(term);
        }
      }
    }
  };

  // intelligenceSuggests
  callSearch = (currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked, checkedList,
    isNotAffactedByAssistant, typesTotals, params) => {
    const { assistantData, onAssistantChanged, modelName, query, dispatch } = this.props;

    // construct 'texts' used in call api.
    // const changeType = 'nothing'; // [nothing|expansion|kg]
    const texts = [];
    if (assistantData) {
      const { abbr, kgHypernym, kgHyponym, transText, transLang } = assistantData;

      let hasExpand = false;
      // 添加扩展词
      if (currentExpansionChecked > 0 && abbr && abbr.length >= currentExpansionChecked) {
        const exp = abbr[currentExpansionChecked - 1];
        if (exp) {
          texts.push({ text: exp.word, source: 'abbr' });
          hasExpand = true;
        }
      }

      // 添加扩展词翻译
      if (currentTranslationChecked > 0 && abbr && abbr.length >= currentTranslationChecked) {
        const exp = abbr[currentTranslationChecked - 1];
        if (exp && exp.word_zh) {
          texts.push({ text: exp.word_zh, source: 'translated' });
        }
      }
      // 添加搜索词翻译
      if (!hasExpand && keywordTranslationChecked > 0 && transText) {
        texts.push({ text: transText, source: 'translated' });
      }
      // 添加KG
      if (checkedList && checkedList.length > 0) {
        for (const kg of checkedList) {
          if (kgHypernym) {
            const found = kgHypernym.find(word => word.word === kg);
            if (found) {
              texts.push({ text: found.word, source: 'kgHypernym', id: '0' });
            }
          }
          if (kgHyponym) {
            const found = kgHyponym.find(word => word.word === kg);
            if (found) {
              texts.push({ text: found.word, source: 'kgHyponym', id: '0' });
            }
          }
        }
      }
    }

    if (params && params.isGetMoreKG) {
      dispatch({
        type: `${modelName}/getMoreKG`,
        payload: { query: query.query, typesTotals, texts }
      })
    } else {
      // call parent on change event.
      if (onAssistantChanged) {
        onAssistantChanged(texts, isNotAffactedByAssistant, typesTotals);
      }
    }
  };

  render() {
    const { currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked } = this.state;
    // const assistantLoading = this.props.loading.effects['search/searchPerson'];
    // when is new api.
    const { assistantData, query } = this.props;
    if (!assistantData) {
      return false;
    }
    // console.error('扩展词state-----', currentExpansionChecked);
    const { abbr, transText, transLang, kgHypernym, kgHyponym, level } = assistantData;
    // if has value.
    const hasExpansion = abbr && abbr.length > 0;
    const hasTranslation = abbr && abbr.filter(item => item.word_zh).length > 0;
    const hasTermTranslation = Boolean(transText);
    // const { hasKG, kgData } = this.combineKG();
    const hasKG = (kgHypernym && kgHypernym.length > 0) || (kgHyponym && kgHyponym.length > 0);

    const { checkAll, indeterminate, kgLoading } = this.state;

    if (!hasExpansion && !hasTranslation && !hasKG) {
      return false;
    }

    return (
      <div className={styles.searchAssistant}>

        {/* <Spinner loading={assistantLoading} type="dark" /> */}

        <div className={styles.legend}>
          <FM defaultMessage="Knowledge Graph"
            id="com.searchTypeWidget.label.KnowledgeGraph" />
        </div>
        <div className={styles.rowBox}>
          <div className={styles.columnBox}>
            {hasExpansion && (
              <FM defaultMessage="We automatically expanded it to"
                id="com.search.searchAssistant.hintInfo.expansion" />
            )}
            {hasTranslation && (
              <FM defaultMessage="We also search for"
                id="com.search.searchAssistant.hintInfo.translation" />
            )}
          </div>

          {/* 扩展词 */}
          <div className={styles.leftBox}>
            {hasExpansion && abbr.map((item, index) => {
              const key = `${item}_${index}`;
              return (
                <div key={key}>
                  <div>
                    {/* <span className={styles.rightbox}> */}
                    <Checkbox
                      checked={currentExpansionChecked === index + 1}
                      onChange={this.onExpandedTermChange.bind(this, index)}
                    >{item.word}
                    </Checkbox>
                    {/* </span> */}
                  </div>
                  {hasTranslation && item.word_zh && (
                    <div>
                      {/* <span className={styles.rightbox}> */}
                      <Checkbox
                        checked={currentTranslationChecked === index + 1 ? index + 1 : 0}
                        onChange={this.onTranslationChange.bind(this, index)}
                      >{item.word_zh}
                      </Checkbox>
                      {/* </span> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* // TODO temp disable more button. */}
          {hasExpansion && false && (
            <div onClick={this.onToggleClick} className={styles.paddingLeftButton}>
              <Button type="primary" size="small">More</Button>
            </div>
          )}

        </div>

        {/* {!abbr && hasTermTranslation && (
          <div className={styles.rowBox}>
            {hasTermTranslation && (
              <div>
                <FM defaultMessage="We also search for"
                  id="com.search.searchAssistant.hintInfo.translation" />
              </div>
            )}
            <div className={styles.leftBox}>
              <Checkbox
                checked={keywordTranslationChecked === 1}
                onChange={this.onTermTranslationChange.bind(this)}
              >
                {transText}
              </Checkbox>
            </div>
          </div>
        )} */}

        {(hasExpansion) && (hasKG || kgLoading) &&
          <div className={styles.spliter} />
        }

        {/* {!kgLoading && <div> not Loading </div>} */}
        {(hasKG || kgLoading) && (
          <div>
            {kgLoading && (
              <div style={{ marginLeft: 8 }}>
                <FM defaultMessage="Loading..."
                  id="com.search.searchAssistant.hintInfo.loading" />
              </div>
            )}
            {hasKG && !kgLoading && (
              <div className={styles.columnBox}>
                {/* 分行展示上下位词 */}
                <div className={styles.kgBlock}>
                  <span style={{ fontWeight: 'bold' }}>
                    <FM
                      defaultMessage='We found "{query}" is too broad and thus automatically expand it using knowledge graph.'
                      id="com.search.searchAssistant.hintInfo.desc"
                      values={{ query }}
                    />
                  </span>
                </div>
                <div className={styles.kgBlock}>
                  <div
                    className={classnames({
                      [styles.ww]: true,
                      [styles.zh]: sysconfig.Locale === zhCN,
                    })}>
                    {kgHypernym && kgHypernym.length > 0 && (
                      <span className={styles.paddingRight}>
                        <FM defaultMessage="Hypernym expanded by knowledge graph"
                          id="com.search.searchAssistant.hintInfo.hypernymKG" />
                      </span>
                    )}
                  </div>
                  {this.renderKGData(kgHypernym, 'hypernym')}
                </div>
                <div className={classnames(styles.kgBlock)}>
                  <div
                    className={classnames({
                      [styles.ww]: true,
                      [styles.zh]: sysconfig.Locale === zhCN,
                    })}>
                    {kgHyponym && kgHyponym.length > 0 && (
                      <span className={styles.paddingRight}>
                        <FM defaultMessage="Hyponym expanded by knowledge graph"
                          id="com.search.searchAssistant.hintInfo.hyponymKG" />
                      </span>
                    )}
                  </div>
                  <div>
                    {this.renderKGData(kgHyponym, 'hyponym')}
                  </div>
                </div>


                {/* <div className={styles.boxButton}> */}
                {/* <Button size="small" onClick={this.callSearch}> */}
                {/* <FM defaultMessage="Search with Knowledge Graph" */}
                {/* id="com.search.searchAssistant.hintInfo.KGButton" /> */}
                {/* </Button> */}
                {/* </div> */}
              </div>
            )}
          </div>
        )}

      </div>
    );
  }
}

export default KGSearchHelper;


// ------------------------------------------------------------------------
// Others
// ------------------------------------------------------------------------

const smartClear = ({ prevTexts, texts, dispatch, assistantData }) => {
  if (!assistantData) {
    console.error('Error! assistantData Can not be null.');
    return;
  }
  if (!prevTexts) {
    // can't be null.
  }
  if (!texts || texts.length <= 0) {
    // TODO no results?
  }
  const expandWordItem = texts && texts.find(term => term.source === 'abbr');
  const expandWord = expandWordItem && expandWordItem.text;
  if (expandWord) {
    let prevExpandWord;
    const prevExpandWordItem = prevTexts && prevTexts.find(term => term.source === 'abbr');
    if (!prevExpandWordItem) {
      prevExpandWord = assistantData.abbr && assistantData.abbr.length > 0
        && assistantData.abbr[0].word;
    } else {
      prevExpandWord = prevExpandWordItem && prevExpandWordItem.text;
    }
    if (expandWord !== prevExpandWord) {
      // here we clear kg data.
      if (dispatch) {
        // const { modelName, dispatch } = this.props;
        // TODO don;t call this. just hide.
        // dispatch({ type: `${modelName}/clearAssistantDataMeta` });
        dispatch({ type: 'search/clearSearchAssistantKG' });
      }
    }
  }
};

export const AssistantUtils = { smartClear };
