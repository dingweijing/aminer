import React, { useEffect, useState, useRef } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { Form, Input, Button } from 'antd';
import { formatMessage } from 'locales';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { IFollow } from 'aminer/p/user/notification_types';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IUserInfo } from 'aminer/components/common_types';
import styles from './SearchPerson.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  onSearch: (params: ISearchItem) => void;
  userinfo: IUserInfo;
}

interface ISearchItem {
  [field: string]: any;
}

function hasErrors(fieldsError: Record<string, string[] | undefined>) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const SearchPerson: React.FC<IPropTypes> = props => {
  const { form, userinfo, onSearch } = props;
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    setFieldsValue,
    isFieldTouched,
    validateFields,
  } = form;
  const nameError = isFieldTouched('name') && getFieldError('name');
  const affiliationError = isFieldTouched('affiliation') && getFieldError('affiliation');
  const keywordError = isFieldTouched('keyword') && getFieldError('keyword');

  useEffect(() => {
    const { name = '', fname = '', lname = '' } = userinfo;
    const name_label = name || `${fname} ${lname}`;
    if (name_label) {
      setFieldsValue({ name: name_label });
      // setFieldsValue({ name: 'Philip S. Yu' });
      // const params = getFieldsValue();
      if (onSearch) {
        onSearch({ reset: true });
      }
    }
  }, []);
  // useEffect(() => {
  //   console.log({ params });
  // }, [params]);

  const Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { name, affiliation, keyword } = values;
        if (!name && !affiliation && !keyword) {
          return;
        }
        if (onSearch) {
          onSearch({ reset: true });
        }
      }
    });
  };

  return (
    <div className={classnames(styles.searchPerson, 'search-person')}>
      <Form layout="inline" onSubmit={Submit}>
        <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
          {getFieldDecorator('name', {
            // rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              // prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear
              placeholder={formatMessage({ id: 'aminer.search.placeholder.name' })}
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={affiliationError ? 'error' : ''} help={affiliationError || ''}>
          {getFieldDecorator('affiliation', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear
              placeholder={formatMessage({ id: 'aminer.search.placeholder.affiliation' })}
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={keywordError ? 'error' : ''} help={keywordError || ''}>
          {getFieldDecorator('keyword', {
            // rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear
              placeholder={formatMessage({ id: 'aminer.search.placeholder.keywords' })}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
            icon="search"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default component(
  connect(({ auth, expertSearch }) => ({
    results: expertSearch.results,
    pagination: expertSearch.pagination,
    query: expertSearch.query,
  })),
)(SearchPerson);
