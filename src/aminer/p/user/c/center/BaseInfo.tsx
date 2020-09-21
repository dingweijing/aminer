import React, { useEffect, useState } from 'react';
import { component, connect, FormCreate } from 'acore';
import { Popconfirm, Button, Row, Form, Input, Col, Select, message, Radio } from 'antd';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import * as profileUtils from 'utils/profile-utils';
import styles from './BaseInfo.less';

const { TextArea } = Input;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
}

const BaseInfo: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo, form } = props;

  const { getFieldDecorator } = form;

  const { id: uid, name, lname, fname, title, addr, gender, org } = userinfo || {};

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = { ...values };
        // const org_field = params.org.replace(/\n/g, '');
        params.gender = values.gender - 0;
        // params.org = org_field;

        // if (!err && values.name) {
        dispatch({
          type: 'social/UpdateUser',
          payload: {
            id: uid,
            ...params,
          },
        }).then(res => {
          if (res) {
            message.success(formatMessage({ id: 'aminer.common.success' }));
            const new_info = {
              ...userinfo,
              ...values,
            };
            dispatch({
              type: 'social/setUserInfo',
              payload: {
                userinfo: new_info,
              },
            });
          }
        });
      }
    });
  };

  return (
    <div className={classnames(styles.baseInfo, 'base-info')}>
      <div className="form_content">
        <Form layout="vertical" onSubmit={handleSubmit} autoComplete="off">
          <Row>
            <Col span={11} offset={0}>
              <Form.Item
                // labelCol={{ span: 3, offset: 3 }}
                // wrapperCol={{ span: 8 }}
                className="form_item"
                label={formatMessage({
                  id: 'aminer.regiest.firstname',
                  defaultMessage: 'First Name',
                })}
              >
                {getFieldDecorator('fname', {
                  initialValue: fname,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'aminer.login.firstname.require' }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                className="form_item"
                label={formatMessage({
                  id: 'aminer.regiest.lastname',
                  defaultMessage: 'Last Name',
                })}
              >
                {getFieldDecorator('lname', {
                  initialValue: lname,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: formatMessage({ id: 'aminer.login.lastname.require' }),
                  //   },
                  // ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Form.Item
              className="form_item"
              label={formatMessage({
                id: 'aminer.regiest.displayame',
                defaultMessage: 'Display Name',
              })}
            >
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input />)}
            </Form.Item>
          </Row>

          <Row>
            <Form.Item
              className="form_item"
              label={formatMessage({
                id: 'aminer.regiest.gender',
                defaultMessage: 'Gender',
              })}
            >
              {getFieldDecorator('gender', {
                initialValue: `${gender}`,
              })(
                <Radio.Group>
                  <Radio value="1">
                    {formatMessage({ id: 'aminer.regiest.gender.male', defaultMessage: 'Male' })}
                  </Radio>
                  <Radio value="2">
                    {formatMessage({
                      id: 'aminer.regiest.gender.female',
                      defaultMessage: 'Female',
                    })}
                  </Radio>
                  <Radio value="0">
                    {formatMessage({
                      id: 'aminer.regiest.gender.notanswer',
                      defaultMessage: 'Prefer not to answer',
                    })}
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Row>

          <Row>
            <Form.Item
              className="form_item"
              label={formatMessage({
                id: 'aminer.regiest.position',
                defaultMessage: 'position',
              })}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'aminer.regiest.position.require' }),
                  },
                ],
                initialValue: title,
              })(
                <Select style={{ width: '100%' }} dropdownClassName="userpage-edit-baseinfo">
                  <Select.Option value="position" disabled>
                    {formatMessage({ id: 'aminer.regiest.position', defaultMessage: 'Position' })}
                  </Select.Option>
                  <Select.Option value="professor">
                    {formatMessage({
                      id: 'aminer.regiest.position.professor',
                      defaultMessage: 'Professor',
                    })}
                  </Select.Option>
                  <Select.Option value="associate">
                    {formatMessage({
                      id: 'aminer.regiest.position.associate',
                      defaultMessage: 'Associate Professor',
                    })}
                  </Select.Option>
                  <Select.Option value="assistant professor">
                    {formatMessage({
                      id: 'aminer.regiest.position.assistant',
                      defaultMessage: 'Assistant Professor',
                    })}
                  </Select.Option>
                  <Select.Option value="researcher">
                    {formatMessage({
                      id: 'aminer.regiest.position.researcher',
                      defaultMessage: 'Researcher',
                    })}
                  </Select.Option>
                  <Select.Option value="postdoc">
                    {formatMessage({
                      id: 'aminer.regiest.position.postdoc',
                      defaultMessage: 'PostDoc',
                    })}
                  </Select.Option>
                  <Select.Option value="phd student">
                    {formatMessage({
                      id: 'aminer.regiest.position.phd',
                      defaultMessage: 'Phd Student',
                    })}
                  </Select.Option>
                  <Select.Option value="master student">
                    {formatMessage({
                      id: 'aminer.regiest.position.master',
                      defaultMessage: 'Master Student',
                    })}
                  </Select.Option>
                  <Select.Option value="other">
                    {formatMessage({
                      id: 'aminer.regiest.position.other',
                      defaultMessage: 'Other',
                    })}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Row>

          <Row>
            <Form.Item
              label={formatMessage({
                id: 'aminer.user.affiliation',
                defaultMessage: 'Affiliation',
              })}
            >
              {getFieldDecorator('org', {
                initialValue: org,
              })(<TextArea autoSize />)}
            </Form.Item>
          </Row>
          {/* <Row>
            <Form.Item
              label={formatMessage({
                id: 'aminer.user.affiliation',
                defaultMessage: 'Affiliation',
              })}
            >
              <TextArea autoSize />
            </Form.Item>
          </Row> */}

          {/* <Row>
            <Form.Item
              className="form_item"
              label={formatMessage({
                id: 'aminer.person.address',
                defaultMessage: 'Address',
              })}
            >
              {getFieldDecorator('addr', {
                initialValue: addr,
              })(<TextArea autoSize={{ minRows: 2 }} />)}
            </Form.Item>
          </Row> */}

          {/* <div className={styles.marginGap} /> */}
          <Row>
            <Form.Item className="form_item submit_btn">
              <Button
                className={classnames(styles.loginBtn, { [styles.ready]: true })}
                htmlType="submit"
              >
                {formatMessage({ id: 'aminer.common.save', defaultMessage: 'Save' })}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default component(FormCreate(), connect())(BaseInfo);
