/**
 *  Created by BoGao on 2019-05-17;
 */
import React, { useEffect, useState, useMemo } from 'react';
import { component, connect, FormCreate } from 'acore';
import { formatMessage, FD, FT, FR } from 'locales';
import { FormItemInput } from 'amg/ui/form';
import { Hole } from 'components/core';
import authutil from 'utils/auth';
import { theme } from 'themes';
import { Checkbox, Form, Switch, Input, DatePicker, TimePicker, Select, Cascader, InputNumber, Button, Icon } from 'antd';
import { sysconfig } from 'systems';
import consts from 'consts';
import { classnames } from 'utils';
import { NE } from 'utils/compare';
import display from 'utils/display';
import { PersonIndices, PersonTags, ViewExpertInfo } from 'components/person/widgets';
// import { theme } from 'themes';
import helper from 'helper';
import styles from './PersonBasicEditor.less';


// ----------------------------------------------------------------------------------
// resources
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
  const [showHidden, setShowHidden] = useState(canSeeHiddenThings);

  const yourRole = displayRoles(canAnnotate, canSeeHiddenThings);

  console.log('DEBUGING: >>>>>>>>>>> PersonBasic Editor render.', roles);

  console.log('vlue is : ', person);

  // loading person effect.
  useEffect(() => {
    dispatch({
      type: 'person/getPerson',
      payload: { id: props.personId, pure: true, mode: canSeeHiddenThings ? 'super' : 'annotation' },
    }).then(data => {
      console.log('...get person', props.personId, data);
      setPerson(data);
    }).catch(err => {
      console.log('...some error occured, ', err);
    });
  }, [canSeeHiddenThings, dispatch, props.personId]);

  // const DeepCoreInfoBlock = useMemo(() => (
  //   <Hole
  //     name="PersonBasicEditor.DeepDataZone"
  //     fill={theme.PersonBasicEditor_DeepDataZone}
  //     // defaults={this.defaultZones.contentRightZone}
  //     param={{ person }}
  //   // config={{ containerClass: styles.contentRight }}
  //   />
  // ), [person]);


  const DeepCoreInfoBlock = React.memo(props => (
    <Hole
      name="PersonBasicEditor.DeepDataZone"
      fill={theme.PersonBasicEditor_DeepDataZone}
      // defaults={this.defaultZones.contentRightZone}
      param={{ person }}
    // config={{ containerClass: styles.contentRight }}
    />
  ));

  console.log('?????', canAnnotate, canSeeHiddenThings);

  // some exits.
  if (!canAnnotate) {
    return [];
  }

  if (!person) {
    return [];
  }

  // form submit
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // process transform
        const { title, ...unchanged } = values;
        const changed = unchanged;
        if (title !== undefined) {
          changed.title = [title]; // change to array.
        }


        dispatch({
          type: 'person-edit/updatePersonBasic',
          payload: { fields: changed, id: person.id },
        }).then(data => {
          console.log('save success !!!!! ', props.personId, data);
        });
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

      <div className="form">

        <Form {...formItemLayout} onSubmit={handleSubmit}>

          <FormItemInput {...commonParams}
            field="name"
            label={formatMessage({ id: 'aminer.profile.label.name' })}
            initialValue={person.name}
            help="中文姓名和英文姓名至少填一项！" // TODO i18n
            rules={[{ required: true, message: 'Please input name!' }]}
            value={values.name}
          />

          <FormItemInput {...commonParams}
            field="name_zh"
            label={formatMessage({ id: 'aminer.profile.label.name_zh' })}
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

          {/* <Form.Item
            label={formatMessage({ id: 'aminer.profile.label.name' })}
            help='中                                                                                      文姓名和英文姓名至少填一项！'
          >
            {getFieldDecorator('name', {
              initialValue: person.name,
              rules: [{ required: true, message: 'Please input name!' }],
            })(<Input autoComplete="off" />)}
          </Form.Item> */}

          {/* <Form.Item
            label={formatMessage({ id: 'aminer.profile.label.name_zh' })}
          >
            {getFieldDecorator('name_zh', {
              initialValue: person.name,
              rules: [{ required: true, message: 'Please input name_zh!' }],
            })(<Input />)}
          </Form.Item> */}

          <hr />

          {/* <Form.Item label="Warning" validateStatus="warning">
            <Input placeholder="Warning" id="warning" />
          </Form.Item>

          <Form.Item
            label="Validating"
            hasFeedback
            validateStatus="validating"
            help="The information is being validated..."
          >
            <Input placeholder="I'm the content is being validated" id="validating" />
          </Form.Item>

          <Form.Item label="Success" hasFeedback validateStatus="success">
            <Input placeholder="I'm the content" id="success" />
          </Form.Item>

          <Form.Item label="Warning" hasFeedback validateStatus="warning">
            <Input placeholder="Warning" id="warning2" />
          </Form.Item>

          <Form.Item
            label="Fail"
            hasFeedback
            validateStatus="error"
            help="Should be combination of numbers & alphabets"
          >
            <Input placeholder="unavailable choice" id="error2" />
          </Form.Item>

          <Form.Item label="Success" hasFeedback validateStatus="success">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Warning" hasFeedback validateStatus="warning">
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Error" hasFeedback validateStatus="error">
            <Select defaultValue="1">
              <Select.Option value="1">Option 1</Select.Option>
              <Select.Option value="2">Option 2</Select.Option>
              <Select.Option value="3">Option 3</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Validating"
            hasFeedback
            validateStatus="validating"
            help="The information is being validated..."
          >
            <Cascader defaultValue={['1']} options={[]} />
          </Form.Item>

          <Form.Item label="inline" style={{ marginBottom: 0 }}>
            <Form.Item
              validateStatus="error"
              help="Please select the correct date"
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              <DatePicker />
            </Form.Item>
            <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
              <DatePicker />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Success" hasFeedback validateStatus="success">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item> */}


        </Form>

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
