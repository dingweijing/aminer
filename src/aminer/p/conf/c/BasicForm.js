import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { Form, Input, Radio, Select, Button, DatePicker } from 'antd';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import NumericInput from './NumericInput';
import styles from './BasicForm.less';

// TODO: 缺少Order，logo_url background_url的编辑
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const CreateOrUpdateConf = props => {
  const { form, dispatch, handleSubmit, type = 'create' } = props;
  const { getFieldDecorator, getFieldsValue } = form;

  const onChangePublic = type => {};
  const handleChangeYear = value => {
    form.setFieldsValue({ year: value });
  };

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  const tailFormItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  return (
    <div className={styles.basicForm}>
      {/* {...formItemLayout}  */}
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Logo">
          {getFieldDecorator('logo', {
            // rules: [
            //   {
            //     required: true,
            //     message: 'Please input your E-mail!',
            //   },
            // ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.basicForm.short_name',
            defaultMessage: 'Track Name',
          })}
        >
          {getFieldDecorator('short_name', {
            rules: [
              {
                required: true,
                message: 'Please input track name!',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.basicForm.full_name',
            defaultMessage: 'Full Name',
          })}
        >
          {getFieldDecorator('full_name', {
            rules: [
              {
                required: true,
                message: 'Please input full name!',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.basicForm.address', defaultMessage: 'Address' })}
        >
          {getFieldDecorator('address', {})(<Input />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.basicForm.year', defaultMessage: 'Year' })}
        >
          {getFieldDecorator(
            'year',
            {},
          )(<NumericInput style={{ width: '100%' }} onChange={handleChangeYear} />)}
        </Form.Item>
        <Form.Item label="URL">{getFieldDecorator('url', {})(<Input />)}</Form.Item>

        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.basicForm.rangePicker',
            defaultMessage: 'RangePicker',
          })}
        >
          {getFieldDecorator('date', rangeConfig)(<RangePicker style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.basicForm.introduce',
            defaultMessage: 'Introduce',
          })}
        >
          {getFieldDecorator('introduce', {})(<TextArea autoSize={{ minRows: 3, maxRows: 5 }} />)}
        </Form.Item>
        {/* <Form.Item label="Background">
            {getFieldDecorator('background_url', {
              // rules: [
              //   {
              //     required: true,
              //     message: 'Please input address',
              //   },
              // ],
            })(<Input />)}
          </Form.Item> */}
        <Form.Item
          label={formatMessage({ id: 'aminer.conf.basicForm.papers', defaultMessage: 'Papers' })}
        >
          {getFieldDecorator('paper_count', {
            // rules: [
            //   {
            //     required: true,
            //     message: 'Please input address',
            //   },
            // ],
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'aminer.conf.basicForm.config',
            defaultMessage: 'Config',
          })}
        >
          {getFieldDecorator('config', {})(<TextArea autoSize={{ minRows: 3, maxRows: 5 }} />)}
        </Form.Item>
        {flags.map(flag => {
          return (
            <Form.Item
              {...tailFormItemLayout}
              key={flag}
              label={formatMessage({
                id: `aminer.conf.basicForm.${flag.split('_')[1]}`,
                defaultMessage: `${flag.split('_')[1]}`,
              })}
            >
              {getFieldDecorator(`${flag}`, {
                // rules: [
                //   {
                //     required: true,
                //     message: 'Please input address',
                //   },
                // ],
              })(
                <Radio.Group>
                  <Radio
                    value={true}
                    className={classnames({ [styles.active]: getFieldsValue()[`${flag}`] })}
                  >
                    <FM id="conf.yes" defaultMessage="Yes" />
                  </Radio>
                  <Radio
                    value={false}
                    className={classnames({ [styles.active]: !getFieldsValue()[`${flag}`] })}
                  >
                    <FM id="conf.no" defaultMessage="No" />
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          );
        })}
        {/* <Form.Item
            label={
              <span>
                Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(<Input />)}
          </Form.Item> */}

        {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: 'Please input the captcha you got!' }],<
              })(<Input />)}
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item> */}
        {/* <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>,
            )}
          </Form.Item> */}
        {/* {...tailFormItemLayout} */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <FM id={`aminer.conf.basicForm.${type}`} defaultMessage="Create" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default page(connect())(CreateOrUpdateConf);
const flags = ['is_public'];
// "enable_xiaomai", "enable_mrt", "enable_knowledge_atlas", "enable_relation", "enable_report", "enable_statistics"
