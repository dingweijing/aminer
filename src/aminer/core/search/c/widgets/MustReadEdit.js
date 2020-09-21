// MustReadEdit.less
import React, { useMemo, useEffect, useState } from 'react';
import { page, connect, component } from 'acore';
import { InputNumber, Input, Button, Select, Switch, message, notification } from 'antd';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './MustReadEdit.less';

const EditForm = props => {
  const { editField, onSubmit } = props;
  return (
    <div className={styles.form}>
      {editField &&
        editField.map(field => {
          const { fieldName, Component, params, key } = field;
          return (
            <div className={styles.formItem} key={key}>
              {field.fieldName}
              {Component && <Component {...params} />}
            </div>
          );
        })}
      <div className={styles.submitBtn}>
        <Button onClick={onSubmit}>确认</Button>
      </div>
    </div>
  );
};
// (isRoster(user) || isPeekannotationlog(user) || isTempAnno(user))
// 普通用户可以添加必读论文，只填 title
// 管理员添加必读论文，填 全部字段
// 管理员编辑必读论文，必填 pid
const MustReadEdit = props => {
  const { dispatch, topic = {}, editType, user, paper = {}, fmId, topicInfo } = props;
  if (!topic && !topicInfo) return <></>;
  const { name, name_zh, id } = topicInfo || topic;
  let changes = {};

  const onSubmit = () => {
    if (changes && changes.pid) {
      if (!/^[0-9a-fA-F]{24}$/.test(changes.pid)) {
        message.error('请检查论文 id');
        return;
      }
    }
    if (Object.keys(changes).length) {
      dispatch({
        type: 'searchpaper/UpdateMustReadingPub',
        payload: {
          topicId: id,
          pid: paper.id || '',
          tmp_id: paper.tmp_id || '',
          ...changes,
        },
      }).then(data => {
        if (data) {
          notification.success({
            message: formatMessage({ id: 'aminer.paper.topic.paper.addSuccess' }),
            description: formatMessage({ id: 'aminer.paper.topic.paper.addSuccessTip' }),
            duration: 8,
          });
        }
      });
    }
    closeModal();
  };

  const openAddModal = () => {
    if (user) {
      let editField = null;
      if (isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) {
        const tip = {};
        if (editType === 'create') {
          tip.key = 'createTip';
          tip.fieldName = `添加必读论文到 Topic: ${name || name_zh}`;
        } else if (editType === 'update') {
          tip.key = 'updateTip';
          tip.fieldName = `编辑必读论文（Topic: ${name || name_zh}）`;
        }
        editField = [
          { ...tip },
          {
            key: 'pid',
            fieldName: '(必填)论文 ID: ',
            Component: Input,
            params: {
              onChange: e => (changes['pid'] = e.target.value),
              defaultValue: paper.id || null,
            },
          },
          {
            key: 'reason',
            fieldName: '必读理由:',
            Component: Input.TextArea,
            params: {
              autoSize: { minRows: 2 },
              onChange: e => (changes['reason'] = e.target.value),
              defaultValue: paper.headline || null,
            },
          },
          {
            key: 'method',
            fieldName: '方法:',
            Component: Input,
            params: {
              onChange: e => (changes['method'] = e.target.value),
              defaultValue: paper.method || null,
            },
          },
          {
            key: 'img',
            fieldName: '图片链接:',
            Component: Input,
            params: {
              onChange: e => (changes['img'] = e.target.value),
              defaultValue: paper.img || null,
            },
          },
          {
            key: 'order',
            fieldName: '必读顺序:',
            Component: InputNumber,
            params: {
              onChange: v => (changes['order'] = v),
              defaultValue: paper.order || null,
            },
          },
          {
            key: 'selected',
            fieldName: '是否精选:',
            Component: Switch,
            params: {
              checkedChildren: '是',
              unCheckedChildren: '否',
              onChange: v => (changes['selected'] = v),
              defaultChecked: paper.selected || false,
            },
          },
        ];
      } else {
        editField = [
          {
            key: 'mustreadTip',
            fieldName: formatMessage({ id: 'aminer.paper.topic.mustread.tip' }),
          },
          {
            key: 'createTip',
            fieldName: `${formatMessage({
              id: 'aminer.paper.topic.mustread.addto',
            })} Topic: ${name || name_zh}`,
          },
          {
            key: 'title',
            fieldName: formatMessage({ id: 'aminer.paper.topic.mustread.title' }),
            Component: Input.TextArea,
            params: {
              autoSize: { minRows: 2 },
              onChange: e => {
                changes['title'] = e.target.value;
              },
            },
          },
          {
            key: 'reason',
            fieldName: formatMessage({ id: 'aminer.paper.topic.mustread.reason' }),
            Component: Input.TextArea,
            params: {
              autoSize: { minRows: 2 },
              onChange: e => (changes['reason'] = e.target.value),
            },
          },
        ];
      }
      dispatch({
        type: 'modal/open',
        payload: {
          title:
            editType === 'create'
              ? formatMessage({ id: 'aminer.paper.topic.mustread.add' })
              : '编辑',
          height: 'auto',
          width: '600px',
          content: <EditForm editField={editField} onSubmit={onSubmit} />,
        },
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const closeModal = () => {
    dispatch({
      type: 'modal/close',
    });
    changes = {};
  };

  if (editType === 'create') {
    if (fmId) {
      return (
        <div className={styles.mustReadEdit} onClick={openAddModal}>
          <Button size="small" alt={formatMessage({ id: 'aminer.paper.topic.mustread.alt' })}>
            <FM id={fmId} defaultMessage="提交自己的论文" />
          </Button>
        </div>
      );
    }
    return (
      <span className={styles.recoTip} onClick={openAddModal}>
        添加必读论文
      </span>
    );
  } else if (editType === 'update') {
    return (
      <span className={styles.recoTip} onClick={openAddModal}>
        编辑
      </span>
    );
  }

  return <></>;
};

export default page(
  connect(({ searchpaper, auth }) => ({
    topic: searchpaper && searchpaper.topic,
    user: auth.user,
  })),
)(MustReadEdit);
