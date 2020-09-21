import React, { useEffect, useMemo } from 'react';
import styles from './AdvanceFilter.less';
// import PropTypes from 'prop-types';
import { connect, FormCreate, withRouter, component } from 'acore';
import { Input, Button, Form, Radio } from 'antd';
import { splitStrByPlusSign } from 'utils/search-utils'
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import helper from 'helper';
import { isEqual } from 'lodash';

const AdvanceFilter = props => {
  const {
    form,
    onQueryChange,
    isAdvancedFilterMode,
    closeAdvanceFilter,
    queryValue,
    onSearch,
  } = props;


  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 10 },
  };

  const { searchIn = 'all', author = '', conference = '', keywords = '' } = helper.parseUrlParam(props, {}, [
    'searchIn',
    'author',
    'conference',
    'keywords',
  ]);

  const authorNames = useMemo(() => {
    const authors = splitStrByPlusSign(author);
    const authorNames = authors.map(name => name.split('@')[0]);
    return authorNames.join('+');
  }, [author])

  const onBoxClick = e => {
    e.stopPropagation();
  };

  const handleSubmit = (e, clearSearch) => {
    e.preventDefault();
    let queryObject = { query: queryValue };
    let advanceFilter = null;

    if (clearSearch === true) {
      advanceFilter = { author: '', conference: '', keywords: '' };
    } else if (clearSearch !== true) {
      advanceFilter = {
        searchIn: form.getFieldValue('searchIn'),
        author: splitStrByPlusSign(form.getFieldValue('author')).join('+'),
        conference: splitStrByPlusSign(form.getFieldValue('conference')).join('+'),
        keywords: splitStrByPlusSign(form.getFieldValue('keywords')).join('+'),
      }
    }
    if (onSearch) {
      onSearch({ queryObject, query: queryValue, advanceFilter }, false);
    }
    closeAdvanceFilter();
  }

  const clearAdvanceSearch = (e) => {
    handleSubmit(e, true);
  }

  if (!isAdvancedFilterMode) {
    return <></>;
  }

  return (
    <div className={styles.advanceSearch} onClick={onBoxClick}>
      <div className={styles.advanceSearchMask} onClick={closeAdvanceFilter}></div>
      {/* <Form.Item
        className={styles.advanceSearchItem}
        label={formatMessage({ id: 'aminer.search.advance.query', defaultMessage: 'Query' })}
        {...formItemLayout}
      >
        {getFieldDecorator('query', {
          rules: [
            { required: true, message: formatMessage({ id: 'com.KgSearchBox.placeholder' }) },
          ],
          initialValue: queryValue,
        })(
          <Input
            className={classnames(styles.advanceSearchInput)}
            onPressEnter={handleSubmit}
            placeholder={formatMessage({ id: 'com.KgSearchBox.placeholder' })}
          />,
        )}
      </Form.Item> */}
      <Form.Item
        className={styles.advanceSearchItem}
        label={formatMessage({ id: 'aminer.search.advance.searchIn', defaultMessage: 'Search in' })}
        {...formItemLayout}
      >
        {getFieldDecorator('searchIn', {
          initialValue: searchIn,
        })(
          <Radio.Group>
            <Radio value="all">{formatMessage({ id: 'aminer.search.advance.searchIn.all', defaultMessage: 'All' })}</Radio>
            <Radio value="title">{formatMessage({ id: 'aminer.search.advance.searchIn.title', defaultMessage: 'Title' })}</Radio>
          </Radio.Group>,
        )}
      </Form.Item>

      <Form.Item
        className={styles.advanceSearchItem}
        label={formatMessage({ id: 'aminer.search.advance.author', defaultMessage: 'Author' })}
        {...formItemLayout}
      >
        {getFieldDecorator('author', {
          initialValue: authorNames,
        })(
          <Input
            className={styles.advanceSearchInput}
            onPressEnter={handleSubmit}
            placeholder={formatMessage({id: 'aminer.search.advance.placeholder', defaultMessage: 'Search terms separated by commas' })}
          />,
        )}
      </Form.Item>

      <Form.Item
        className={styles.advanceSearchItem}
        label={formatMessage({ id: 'aminer.search.advance.conference', defaultMessage: 'Conference' })}
        {...formItemLayout}
      >
        {getFieldDecorator('conference', {
          initialValue: conference,
        })(
          <Input
            className={classnames(styles.advanceSearchInput)}
            onPressEnter={handleSubmit}
            placeholder={formatMessage({id: 'aminer.search.advance.placeholder', defaultMessage: 'Search terms separated by commas' })}
          />,
        )}
      </Form.Item>
      <Form.Item
        className={styles.advanceSearchItem}
        label={formatMessage({ id: 'aminer.search.advance.keywords', defaultMessage: 'Key words' })}
        {...formItemLayout}
      >
        {getFieldDecorator('keywords', {
          initialValue: keywords,
        })(
          <Input
            className={classnames(styles.advanceSearchInput)}
            onPressEnter={handleSubmit}
            placeholder={formatMessage({id: 'aminer.search.advance.placeholder', defaultMessage: 'Search terms separated by commas' })}
          />,
        )}
      </Form.Item>
      <div className={styles.advanceSearchBtns}>
        <Button
          onClick={clearAdvanceSearch}
          className={styles.advanceSearchBtn}
        >
          {formatMessage({ id: 'aminer.search.advance.clear', defaultMessage: 'Clear' })}
        </Button>
        <Button
          onClick={handleSubmit}
          className={styles.advanceSearchBtn}
          type="primary"
        >
          {formatMessage({ id: 'aminer.search.advance.search', defaultMessage: 'Search' })}
        </Button>
      </div>
    </div>
  );
};

export default component(FormCreate(), withRouter)(AdvanceFilter);
