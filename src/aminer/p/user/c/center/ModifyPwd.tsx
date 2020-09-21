import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link, FormCreate, history } from 'acore';
import { Popconfirm, Button, Row, Form, Input, Col, Select, message } from 'antd';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import styles from './ModifyPwd.less';

const { TextArea } = Input;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
}

const ModifyPwd: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo, form } = props;

  const { getFieldDecorator, getFieldValue } = form;

  const { email } = userinfo || {};

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { old_pwd, new_pwd } = values;
        const params = {
          identifier: email,
          token: old_pwd,
          password: new_pwd,
          src: 'aminer',
        };
        dispatch({
          type: 'auth/updatePw',
          payload: params,
        }).then(res => {
          if (res?.status) {
            dispatch({
              type: 'auth/logout',
            });
            history.push('/login');
          } else {
            message.error(
              formatMessage({
                id: 'aminer.user.password.valid',
                defaultMessage: 'You must provide a valid current password',
              }),
            );
          }
        });
      }
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('new_pwd')) {
      callback(
        formatMessage({
          id: 'aminer.user.password.unequal',
          defaultMessage: 'Two passwords that you enter is inconsistent!',
        }),
      );
    } else {
      callback();
    }
  };

  const passwordCheck = (rule, value, callback) => {
    const new_pwd = getFieldValue('new_pwd');
    if (new_pwd && new_pwd.includes(' ')) {
      callback(
        formatMessage({
          id: 'aminer.login.password.check',
          defaultMessage: 'Password cannot contain whitespace',
        }),
      );
    } else {
      callback();
    }
  };

  return (
    <div className={classnames(styles.modifyPwd, 'modify-password')}>
      <div className="form_content">
        <Form
          layout="vertical"
          onSubmit={handleSubmit}
          autoComplete="off"
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            className="form_item"
            label={formatMessage({
              id: 'aminer.user.password.current',
              defaultMessage: 'Current Password',
            })}
          >
            {getFieldDecorator('old_pwd', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'aminer.user.password.require' }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item
            className="form_item"
            label={formatMessage({
              id: 'aminer.user.password.new',
              defaultMessage: 'New Password',
            })}
          >
            {getFieldDecorator('new_pwd', {
              rules: [
                {
                  required: true,
                  // whitespace: true,
                  message: formatMessage({ id: 'aminer.user.password.require' }),
                },
                {
                  validator: passwordCheck,
                  // message: formatMessage({
                  //   id: 'aminer.login.password.check',
                  //   defaultMessage: 'Password cannot contain whitespace',
                  // }),
                },
                {
                  min: 6,
                  max: 16,
                  message: formatMessage({
                    id: 'aminer.login.password.checkLength',
                    defaultMessage: 'Password length should be 6-16 characters',
                  }),
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>

          <Form.Item
            className="form_item"
            label={formatMessage({
              id: 'aminer.user.password.confirm',
              defaultMessage: 'Confirm your password',
            })}
          >
            {getFieldDecorator('confirm_pwd', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'aminer.user.password.require' }),
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(<Input type="password" />)}
          </Form.Item>
          <Form.Item className="form_item reset_btn">
            <Link to="/forgotpassword" target="_blank">
              <FM id="aminer.login.password.forgot" defaultMessage="Forgot Password" />
            </Link>
          </Form.Item>

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

export default component(FormCreate(), connect())(ModifyPwd);
