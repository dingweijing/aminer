import React, { Dispatch } from 'react';
import { FormCreate, component, connect } from 'acore';
import { classnames } from 'utils';
import { Input, Button, Form, message } from 'antd';
import { formatMessage, FM } from 'locales';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IUserInfo } from 'aminer/components/common_types';
import styles from './SubscribeInput.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  pid: string;
  cid: string;
  loading: boolean;
  setVisible: Dispatch<boolean>;
  // updatePubComment: (pid: string, comment: string) => void;
}

const SubscribeInput: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo, form, pid, cid, setVisible, updatePubComment, loading } = props;

  const { getFieldDecorator, resetFields } = form;
  const { sub_email, id: uid } = userinfo || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'social/UpdateUser',
          payload: {
            id: uid,
            ...values,
          },
        }).then(res => {
          if (res) {
            message.success(formatMessage({ id: 'aminer.common.success' }));
            cancelPop();
            // const new_info = {
            //   ...userinfo,
            //   ...values,
            // };
            // dispatch({
            //   type: 'social/setUserInfo',
            //   payload: {
            //     userinfo: new_info,
            //   },
            // });
          }
        });
      }
    });
  };

  const cancelPop = () => {
    if (setVisible) {
      resetFields();
      setVisible(false);
    }
  };

  return (
    <div className={classnames(styles.subscribeInput, 'subscribe-input')}>
      {/* <div className="tips">
        <FM id="aminer.subscribe.email.send" />
      </div> */}
      <Form onSubmit={handleSubmit}>
        <Form.Item
          // labelCol={{ span: 3, offset: 3 }}
          // wrapperCol={{ span: 8 }}
          className="form_item"
        >
          {getFieldDecorator('sub_email', {
            initialValue: sub_email,
            rules: [
              {
                type: 'email',
                message: formatMessage({ id: 'aminer.regiest.email.right' }),
              },
              {
                required: true,
                message: formatMessage({ id: 'aminer.login.email.require' }),
              },
            ],
          })(
            <Input
              autoFocus
              className="default-input-style"
              placeholder={formatMessage({
                id: 'aminer.subscribe.email.place',
                defaultMessage: 'Input your receiver Email',
              })}
            />,
          )}
        </Form.Item>

        <Form.Item className="btns">
          <Button size="small" className="cancel_btn" onClick={cancelPop}>
            <FM id="aminer.common.cancel"></FM>
          </Button>
          <Button size="small" className="confirm_btn" htmlType="submit" loading={loading}>
            <FM id="aminer.common.ok"></FM>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default component(
  FormCreate(),
  connect(({ loading }) => ({
    loading: loading.effects['social/UpdateUser'],
  })),
)(SubscribeInput);
