/**
 * Created by bo gao on 2019-06-12
 * Refactor: Use Hooks.
 */
import React, { useState, useEffect } from 'react';
import { connect, component, FormCreate } from 'acore';
import { formatMessage, FD, FT, FR } from 'locales';

import { FormItemInput } from 'amg/ui/form';
import { Form, Switch, Input, DatePicker, TimePicker, Select, Cascader, InputNumber, Button, Icon } from "antd";

import styles from './JConfView.less';

const JConfEdit = (props) => {
  const { roles, dispatch, id, form } = props;
  const { onUpdate, onCancel } = props;
  const [jconf, setJconf] = useState()

  // loading person effect.
  useEffect(() => {
    dispatch({ type: "jconf/get", payload: { id, pure: true, mode: '' } })
      .then((data) => { initData(data) })
      .catch((err) => { console.log('...some error occured, ', err); })
  }, [id]);
  // TODO when update.

  const initData = (data) => {
    setJconf(data)
    form.resetFields()
  }

  console.log(">>> ", id, jconf);

  // form submit
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: "jconf/updateJconf",
          payload: { fields: values, id: jconf.id }
        }).then((data) => {
          // console.log('save success !!!!! ', props.personId, data);

          // ! Nested call, 这里有个疑问，修改后马上调用查询，mongo难道没有延时么？
          dispatch({ type: "jconf/get", payload: { id, pure: true, mode: '' } })
            .then((newValue) => {
              if (onUpdate) {
                onUpdate({ changes: values, oldValue: jconf, newValue })
              }
            })
            .catch((error) => { console.log('...some error occured, ', error); })


        }).catch((error) => {
          console.error(error);
          // TODO  ....
        });
      }
    });
  };

  const { getFieldDecorator } = form;
  const commonParams = { getFieldDecorator }
  const values = form.getFieldsValue()

  // empty placeholder.
  if (!jconf) {
    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    )
  }

  // render func
  return (
    <div className={styles.container}>

      <div>
        Last Update:
        {jconf.updated_time && (
          <>
            <FD value={jconf.updated_time} />&nbsp;
            <FT value={jconf.updated_time} />
          </>
        )}
      </div>

      <div className="form">

        <Form {...formItemLayout} onSubmit={handleSubmit}>

          <FormItemInput {...commonParams}
            field="name"
            label={formatMessage({ id: 'core.jconf.editform.label.name' })}
            initialValue={jconf.name}
            // help='中文姓名和英文姓名至少填一项！' // TODO i18n
            // rules={[{ required: true, message: 'Please input name!' }]}
            value={values.name}
          />

          <FormItemInput {...commonParams}
            field="abbr"
            label={formatMessage({ id: 'core.jconf.editform.label.abbr' })}
            initialValue={jconf.abbr}
            value={values.abbr}
          />

          <FormItemInput {...commonParams}
            field="short_name"
            label={formatMessage({ id: 'core.jconf.editform.label.short_name' })}
            initialValue={jconf.title}
            value={values.short_name}
          />

          <FormItemInput {...commonParams}
            field="type"
            label={formatMessage({ id: 'core.jconf.editform.label.type' })}
            initialValue={jconf.type}
            value={values.type}
          />

          {/* {showHidden && <DeepCoreInfoBlock />} */}

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <div>Message TODO</div>

            <Button htmlType="button" className="login-form-button" onClick={onCancel}>
              Cancel TODO
            </Button>

            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </Form.Item>


        </Form>

      </div>



    </div>
  )
}

// ----------------------------------------------------------------------------------
// -- resources
// ----------------------------------------------------------------------------------

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


// -------------------------------------
// -- export
// -------------------------------------
export default component(
  connect(({ auth }) => ({ roles: auth.roles })),
  FormCreate(),
  // Auth,
)(JConfEdit)
