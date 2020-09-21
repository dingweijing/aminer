// TopicEdit.js
import React, { useMemo, useEffect, useState } from 'react'
import { page, connect, component } from 'acore';
import { Form, Input, Button, Select, message } from 'antd';
import { FM, formatMessage } from 'locales';
import styles from './TopicEdit.less';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const TopicForm = (props) => {
  const { editField, onSubmit } = props;

  return (
    <div className={styles.form} >
      {editField && editField.map(field => {
        const { fieldName, Component, params, key } = field;
        return (
          <div className={styles.formItem} key={key}>
            <div>{field.fieldName}</div>
            {Component && <Component {...params} />}
          </div>
        )
      })}
      <div className={styles.submitBtn}><Button onClick={onSubmit}>确认</Button></div>
    </div>
  )
}

const TopicEdit = (props) => {
  const { dispatch, topic = {}, editType } = props;

  let { name, name_zh, def, def_zh, alias, id } = topic;
  let changes = {};

  const onSubmit = () => {
    if (editType === 'create' && (changes.name || changes.name_zh)) {
      dispatch({
        type: 'searchpaper/CreatePubTopic',
        payload: {
          ...changes
        }
      }).then(data => {
        if (data) {
          message.success((
            <span>
              操作成功
            </span>
          ), 5);
        }
      })
    } else if (editType === 'update' && Object.keys(changes).length) {
      dispatch({
        type: 'searchpaper/updateTopic',
        payload: {
          id, ...changes
        }
      }).then(data => {
        if (data) {
          message.success('操作成功');
        }
      })
    }
    
    closeModal();
  }

  const openEditModal = () => {
    let editField = null;
    const tip = {};
    if (editType === 'create') {
      tip.key = 'createTip';
      tip.fieldName = `创建 Topic`;
    } else if (editType === 'update') {
      tip.key = 'updateTip';
      tip.fieldName = `编辑 Topic 详情`;
    }
    editField = [
      {...tip},
      {
        key: 'name',
        fieldName: '英文名称: ',
        Component: Input,
        params: {
          onChange: (e) => changes['name'] = e.target.value,
          defaultValue: editType === 'update' ? name || null : null,
        }
      },
      {
        key: 'name_zh',
        fieldName: '中文名称: ',
        Component: Input,
        params: {
          onChange: (e) => changes['name_zh'] = e.target.value,
          defaultValue: editType === 'update' ? name_zh || null : null,
        }
      },
      {
        key: 'def',
        fieldName: '英文描述:',
        Component: Input.TextArea,
        params: {
          autoSize: { minRows: 2 },
          onChange: (e) => changes['def'] = e.target.value,
          defaultValue: editType === 'update' ? def || null : null,
        }
      },
      {
        key: 'def_zh',
        fieldName: '中文描述:',
        Component: Input.TextArea,
        params: {
          autoSize: { minRows: 2 },
          onChange: (e) => changes['def_zh'] = e.target.value,
          defaultValue: editType === 'update' ? def_zh || null : null,
        }
      },
      {
        key: 'alias',
        fieldName: `别名（搜索别名时也会出现 Topic ）`,
        Component: Select,
        params: {
          mode: 'tags',
          style: { width: '100%' },
          dropdownRender: () => <></>,
          onChange: (v) => changes['alias'] = v,
          defaultValue: editType === 'update' ? alias || [] : [],
        }
      },
    ]

    dispatch({
      type: 'modal/open',
      payload: {
        title: editType === 'create' ? '创建' : '编辑',
        height: 'auto',
        width: '600px',
        content: <TopicForm onSubmit={onSubmit} editField={editField}/>,
      },
    });
  }

  const closeModal = () => {
    dispatch({
      type: 'modal/close',
    });
    changes = {};
  }

  if (editType === 'update') {
    return (
      <div className={styles.topicEdit} onClick={openEditModal}>
        修改 Topic
      </div>
    )
  } else if (editType === 'create') {
    return (
      <div className={styles.topicEdit} onClick={openEditModal}>
        创建 Topic
      </div>
    )
  }
  return <></>;
}

export default page(
  connect()
)(TopicEdit);
