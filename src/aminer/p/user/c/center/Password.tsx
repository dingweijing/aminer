import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link, FormCreate } from 'acore';
import { Popconfirm, Button, Row, Form, Input, Col, Select, message } from 'antd';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import { ModifyPwd } from './index';
import styles from './Password.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
}

const Password: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo, form, className } = props;

  const [edit, setEdit] = useState(false);

  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = { ...values };
      }
    });
  };

  return (
    <div className={classnames(styles.password, className, { edit })}>
      <div className="left">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-password" />
        </svg>
        <div className="content">
          {!edit && (
            <div className="intro">
              <span className="t">
                <FM id="aminer.user.account.password" />
              </span>
              <span className="d">
                <FM id="aminer.user.password.label" />
              </span>
            </div>
          )}
          {edit && <ModifyPwd setEdit={setEdit} userinfo={userinfo} />}
        </div>
      </div>
      <Button
        className="to_reset_btn"
        onClick={() => {
          setEdit(!edit);
        }}
      >
        {!edit && <FM id="aminer.user.password.change" />}
        {edit && <FM id="aminer.common.cancel" />}
      </Button>
    </div>
  );
};

export default component(FormCreate(), connect())(Password);
