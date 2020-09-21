/**
 *  Created by BoGao on 2019-05-17;
 */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { component, connect, FormCreate } from 'acore';
import { formatMessage, FD, FT, FR } from 'locales';
import { Fieldset, defineSchema, FromTags } from 'amg/ui/form';
import { Hole } from 'components/core';
import authutil from 'utils/auth';
import { theme } from 'themes';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  Checkbox, Switch, Input, DatePicker, TimePicker,
  Select, Cascader, InputNumber, Button, Icon, message,
} from 'antd';
import { classnames } from 'utils';
import display from 'utils/display';
// import { PersonIndices, PersonTags, ViewExpertInfo } from 'components/person/widgets';
import styles from './PersonBasicEditor.less';
import { Debug } from './Debug';


// ----------------------------------------------------------------------------------
// resources
// ----------------------------------------------------------------------------------

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const displayRoles = (canAnnotate, canSeeHiddenThings) => {
  if (canSeeHiddenThings) {
    return '超级用户';
  }
  if (canAnnotate) {
    return '标注用户';
  }
  return '无权限用户';
};

// fields config的例子 // TODO i18n
const person_editconfig = {
  fields: [
    {
      key: 'name',
      type: 'string', // 对应编辑器的类型
      label: formatMessage({ id: 'aminer.profile.label.name' }),
      fieldname: 'name', // fieldnamed对应data中field,也可以是org.namv这样的结构(暂时用value的func来实现), 可以省略, 默认是key.
      editorparam: { // 对应编辑器Component的参数
        placeholders: 'abc',
      },
      help: '中文姓名和英文姓名至少填一项！', // form元素对应的help文字。
      value: data => (data.name),
    },
    {
      key: 'name_zh',
      label: formatMessage({ id: 'aminer.profile.label.name_zh' }),
      type: 'string',
      value: 'name_zh',
    },
    {
      key: 'title',
      label: formatMessage({ id: 'aminer.profile.label.title' }),
      type: 'string',
      value: 'title',
    },

    { // 工作单位，带职位
      key: 'affs',
      label: formatMessage({ id: 'aminer.profile.label.affs' }),
      type: 'string',
      render: () => (<div>TODO</div>),
      value: 'todo',
    },

    { key: 'position', type: 'string', render: () => (<div>TODO</div>), value: 'todo' },
    { key: 'affiliation', type: 'string', render: () => (<div>TODO</div>), value: 'todo' },

    {
      key: 'email',
      label: formatMessage({ id: 'aminer.profile.label.email' }),
      type: 'string',
      value: 'email',
    },
    {
      key: 'phone',
      label: formatMessage({ id: 'aminer.profile.label.phone' }),
      type: 'string',
      value: 'phone',
    },
    {
      key: 'fax',
      label: formatMessage({ id: 'aminer.profile.label.fax' }),
      type: 'string',
      value: 'fax',
    },

    { key: 'address', type: 'string', render: () => (<div>TODO</div>), value: 'todo' },

    {
      key: 'homepage',
      label: formatMessage({ id: 'aminer.profile.label.homepage' }),
      type: 'string',
      value: data => (data.profile.homepage),
    },
  ],
};

// ----------------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------------

// PersonBasicEditor
const PersonBasicEditor = props => {
  const { dispatch, className, roles } = props;
  const canAnnotate = authutil.canAnnotate(roles);
  const canSeeHiddenThings = authutil.canSeeHiddenThings(roles);

  const [person, setPerson] = useState({});
  const fromRef = useRef();
  const [showHidden, setShowHidden] = useState(canSeeHiddenThings);

  const yourRole = displayRoles(canAnnotate, canSeeHiddenThings);

  // console.log('DEBUGING: >>>>>>>>>>> PersonBasic Editor render.', roles);

  // loading person effect.
  useEffect(() => {
    dispatch({
      type: 'person/getPerson',
      payload: { id: props.personId, pure: true, mode: canSeeHiddenThings ? 'super' : 'annotation' },
    }).then(data => {
      const { name, name_zh, title } = data || {};
      setPerson(data);
      const { setValues } = fromRef.current;
      setValues && setValues({ name, name_zh, title });
    }).catch(err => {
      console.log('...some error occured, ', err);
    });
  }, [canSeeHiddenThings, dispatch, props.personId]);

  const DeepCoreInfoBlock = React.memo(p => (
    <Hole
      name="PersonBasicEditor.DeepDataZone"
      fill={theme.PersonBasicEditor_DeepDataZone}
      // defaults={this.defaultZones.contentRightZone}
      param={{ person }}
    // config={{ containerClass: styles.contentRight }}
    />
  ));

  // console.log('?????', canAnnotate, canSeeHiddenThings);

  // some exits.
  if (!canAnnotate) {
    return [];
  }

  if (!person) {
    return [];
  }

  const handleSubmit = values => {
    dispatch({
      type: 'person-edit/updatePersonBasic',
      payload: { fields: values, id: person.id },
    }).then(data => {
      if (data) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    });
  };

  const onSwitchChange = checked => {
    setShowHidden(checked);
  };

  const { form } = props;
  const { getFieldDecorator } = form;
  const values = form.getFieldsValue();

  const commonParams = { getFieldDecorator };

  const validation = useMemo(() => defineSchema([
    { name: 'name', type: 'text', required: true },
    { name: 'name_zh', type: 'text' },
    { name: 'title', type: 'tags', required: true }
  ]), [person]);

  return (
    <div className={classnames(styles.personEditor, 'person-editor', className)}>
      {/* <EditTable config={person_editconfig} data={person} /> */}

      <div className="header">

        <div className="left">
          <span>专家基本信息标注</span>
        </div>

        <div className="right">
          模式：
          <Switch
            defaultChecked={showHidden} onChange={onSwitchChange}
            checkedChildren="高级" unCheckedChildren="普通"
          />
        </div>
      </div>

      {showHidden && (
        <div className="toolbox">

          <div className="left">
            <span>您的权限：{yourRole}; </span>
          </div>

          <div className="right">
            <span>最后修改：who? {person.updated_time && <><FD value={person.updated_time} /> <FT value={person.updated_time} /></>}</span>
          </div>

        </div>
      )}

      <div >
        <Formik
          initialValues={{
            name: '',
            name_zh: '',
            title: [],
          }}
          onSubmit={(values, actions) => {
            handleSubmit(values);
          }}
          validationSchema={validation}
          render={({
            isSubmitting, handleReset, values, setValues,
            setFieldValue, errors, touched, ...rest }) => {
            if (!fromRef.current) {
              fromRef.current = { setValues, values };
            }
            // handleReset 这里有问题 没写initialValues的话先重置再输入会报错
            return (
              <Form>
                <Fieldset required {...formItemLayout} name="name" type="text" label={formatMessage({ id: 'aminer.profile.label.name' })} />

                <Fieldset {...formItemLayout} name="name_zh" type="text" label={formatMessage({ id: 'aminer.profile.label.name_zh' })} />

                {/* <Fieldset {...formItemLayout} name="title" type="text" label={formatMessage({ id: 'aminer.profile.label.title' })} /> */}

                <FromTags
                  allowClear
                  name="title"
                  value={values.title}
                  onChange={setFieldValue}
                  onBlur={setFieldValue}
                  {...formItemLayout}
                  error={errors.title}
                  label={formatMessage({ id: 'aminer.profile.label.title' })}
                />
                {showHidden && <DeepCoreInfoBlock />}

                <Button htmlType="reset" disabled={isSubmitting} className={styles.subBtn} >
                  Reset
                </Button>

                <Button disabled={isSubmitting} type="primary" htmlType="submit">Submit</Button>

                <Debug />
              </Form>
            )
          }}
        />

        {/* <Form {...formItemLayout} onSubmit={handleSubmit}>

          <FormItemInput {...commonParams}
            field="name"
            label=
            initialValue={person.name}
            help="中文姓名和英文姓名至少填一项！" // TODO i18n
            rules={[{ required: true, message: 'Please input name!' }]}
            value={values.name}
          />

          <FormItemInput {...commonParams}
            field="name_zh"
            label={formatMessage({ id:  })}
            initialValue={person.name_zh}
            value={values.name_zh}
          />

          <FormItemInput {...commonParams}
            field="title"
            label={formatMessage({ id: 'aminer.profile.label.title' })}
            initialValue={person.title}
            value={values.title}
          />

          {showHidden && <DeepCoreInfoBlock />}

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <div>Message</div>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </Form.Item>

        </Form> */}

        <hr />

        <hr />
      </div>
    </div>
  );
};

export default component(
  connect(({ auth }) => ({ roles: auth.roles })),
  FormCreate(),
)(PersonBasicEditor);

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
