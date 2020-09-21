/*
 * @Author: your name
 * @Date: 2019-12-02 18:19:41
 * @LastEditTime: 2020-02-24 17:09:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/pages/conf/create.js
 */
import React, { Fragment, useEffect } from 'react';
import { connect, Link, history, FormCreate, component } from 'acore';
import { classnames } from 'utils';
import { loadECharts4 } from 'utils/requirejs';
import { Form, Input, Button, message, Select } from 'antd';
import styles from './CreateConf.less';

const { Option } = Select;
/**
 * Refactor by BoGao 2019-06-10
 * AMiner Homepage
 *   2019-06-10 - to hooks
 */
const CreateConf = props => {
  const { dispatch, match } = props;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        values.conf_id = match.params.id;
        console.log(values);
        dispatch({ type: 'conference/InsertArticle', payload: { ...values } }).then(result => {
          if (result) {
            message.success('添加成功');
            
            window.top.postMessage('addReportTrue', '*');
          } else {
            message.error('添加失败');
          }
        });
      }
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };

  const { getFieldDecorator } = props.form;

  return (
    <div className={styles.confStats}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="类别">
          {getFieldDecorator('type', {
            initialValue: 'paper',
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Select>
              <Option value="paper">Paper</Option>
              <Option value="conference">Conference</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="标题">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题名称!' }],
          })(<Input placeholder="标题" id="title" />)}
        </Form.Item>
        <Form.Item label="简介">
          {getFieldDecorator('desc', {
            rules: [],
          })(<Input placeholder="简介" id="desc" />)}
        </Form.Item>
        <Form.Item label="报告链接">
          {getFieldDecorator('article_url', {
            rules: [{ required: true, message: '请输入报告链接!' }],
          })(<Input placeholder="报告链接" id="desc" />)}
        </Form.Item>
        <Form.Item label="logo链接">
          {getFieldDecorator('logo_url', {
            rules: [],
          })(<Input placeholder="logo链接" id="logo_url" />)}
        </Form.Item>
        <Form.Item label="来源">
          {getFieldDecorator('source', {
            rules: [],
          })(<Input placeholder="来源" id="source" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default component(connect(), FormCreate())(CreateConf);
