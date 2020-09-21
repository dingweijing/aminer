import React, { useEffect, useState } from 'react';
import { connect, FormCreate, component } from 'acore';
import { formatMessage } from 'locales';
import { isLogin } from 'utils/auth';
import { Panel } from 'aminer/ui/panel';
import { classnames } from 'utils';
import { Input, Form, message } from 'antd';
import styles from './PanelTags.less';

const getPubTagData = async ({ dispatch, pid }) => {
  const data = await dispatch({
    type: 'pub/getPubTag',
    payload: {
      id: pid, offset: 0, size: 20
    }
  })
  return data || {};
}

const getUserPubTagData = async ({ dispatch, pid }) => {
  const data = await dispatch({
    type: 'pub/getUserPubTag',
    payload: {
      id: pid, offset: 0, size: 10
    }
  })
  return data || {};
}

const PanelTags = props => {
  const { pid, user, dispatch, withPanel, form: {
    getFieldDecorator, validateFields, resetFields }, } = props;
  const [tags, setTags] = useState(null);
  const [userTags, setUserTags] = useState(null);
  let unmounted = false;

  useEffect(() => {
    pid && getTags();
    return () => { unmounted = true }
  }, [pid])

  const getTags = () => {
    getPubTagData({ pid, dispatch })
      .then(({ tags }) => {
        if (tags && !unmounted) {
          setTags(tags);
        }
      });
    if (isLogin(user)) {
      getUserPubTagData({ pid, dispatch })
        .then(({ data, status }) => {
          if (status && !unmounted) {
            setUserTags(data.tags)
          }
        })
    }
  }

  const deleteTag = tag => {
    dispatch({
      type: 'pub/deleteTag',
      payload: {
        id: pid, tag
      }
    }).then(({ status }) => {
      if (status) {
        getTags();
      }
    })
  }

  const addTag = tag => {
    if (isLogin(user)) {
      dispatch({
        type: 'pub/addTag',
        payload: {
          id: pid, tag, body: { pid, op: 'up', tag }
        }
      }).then(({ status }) => {
        if (status) {
          getTags();
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const inputTag = () => {
    validateFields((err, values) => {
      const { tag } = values;
      if (tag && tag.trim()) {
        addTag(tag.trim());
        resetFields();
      }
      else {
        message.warning('can not be empty');
      }
    });
  }

  const content = () => (
    <div className={styles.content}>
      <div className={styles.tags}>
        {tags && tags.length > 0 && tags.map(tag => {
          const { c, i } = tag;
          const isUser = userTags && userTags.map(item => item.id).includes(i.id);
          const text = i.label || i.label_zh;
          if (!text) { return null }
          return (
            <span key={i.id} className={classnames(styles.tag, { [styles.user]: isUser })}>
              <span className={styles.count}>{c}</span>
              <span className={styles.label}>{text}</span>
              <span className={styles.opr}>
                {isUser && (
                  <i className="fa fa-minus" onClick={deleteTag.bind(this, text)} />
                )}
                {!isUser && (
                  <i className="fa fa-plus" onClick={addTag.bind(this, text)} />
                )}
              </span>
            </span>
          )
        })}
      </div>
      <Form>
        <Form.Item>
          {getFieldDecorator('tag', {
            rules: [{
              required: true,
              message: formatMessage({
                id: 'aminer.paper.tag.empty', defaultMessage: 'Please enter a comment'
              })
            }]
          })(
            <Input
              placeholder={formatMessage({ id: 'aminer.paper.addtag', defaultMessage: 'Add a tag' })}
              onPressEnter={inputTag}
            />
          )}
        </Form.Item>
      </Form>

    </div>
  )

  if (withPanel) {
    return (
      <Panel
        title={formatMessage({ id: 'aminer.paper.tags', defaultMessage: 'Tags' })}
        subContent={content}
      />
    );
  }
  return content();
}

export default component(connect(({ auth }) => ({
  user: auth.user
})),
  FormCreate()
)(PanelTags)
