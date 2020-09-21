import React from 'react';
import { page, connect, FormCreate } from 'acore';
import { Form, Input, Select, Button, DatePicker, TimePicker } from 'antd';
// import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import styles from './SessionForm.less';

// const { TextArea } = Input;
const { Option } = Select;
// const { MonthPicker, RangePicker } = DatePicker;
const CreateOrUpdateSession = props => {
  // const { confInfo } = props;
  const { form, handleSubmit, type = 'create' } = props;
  const { getFieldDecorator } = form;

  // const onChangePublic = type => {};
  // const handleChangeYear = value => {
  //   form.setFieldsValue({ year: value });
  // };

  // const rangeConfig = {
  //   rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  // };
  // const formItemLayout = {
  //   labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 24 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 24 },
  //   },
  // };

  // const tailFormItemLayout = {
  //   labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 4 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 20 },
  //   },
  // };

  return (
    <div className={styles.session}>
      <Form onSubmit={handleSubmit.bind(this, form)}>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.title', defaultMessage: 'Title' })}
        >
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please input session title!',
              },
            ],
          })(<Input />)}
        </Form.Item>

        {/* Select */}
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.type', defaultMessage: 'Type' })}
        >
          {getFieldDecorator('type', {
            initialValue: 'session',
            rules: [
              {
                message: 'Please select a type!',
              },
            ],
          })(
            <Select>
              <Option value="session">Session</Option>
              <Option value="keynotes">Keynote</Option>
              <Option value="poster">Poster</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.date', defaultMessage: 'Date' })}
        >
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: 'Please select a date!',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.session.begin_time',
            defaultMessage: 'Begin time',
          })}
        >
          {getFieldDecorator(
            'begin_time',
            {},
          )(<TimePicker style={{ width: '100%' }} format="HH:mm" />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.end_time', defaultMessage: 'End time' })}
        >
          {getFieldDecorator(
            'end_time',
            {},
          )(<TimePicker style={{ width: '100%' }} format="HH:mm" />)}
        </Form.Item>
        {/* TODO: 编辑时不显示 */}
        {/* <Form.Item help={"请用逗号分隔，"}
          label={formatMessage({ id: 'aminer.conf.session.pubs', defaultMessage: 'pubs' })}>
          {getFieldDecorator('pubs', {
          })(<Input.TextArea />)}
        </Form.Item> */}
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.chair', defaultMessage: 'Chair' })}
        >
          {getFieldDecorator('chair', {})(<Input />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.session.place', defaultMessage: 'Place' })}
        >
          {getFieldDecorator('place', {})(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <FM id={`aminer.conf.session.${type}`} defaultMessage="Create" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default page(connect(), FormCreate())(CreateOrUpdateSession);
