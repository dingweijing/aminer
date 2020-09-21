// Subscribe
import React, { useMemo, useEffect, useState } from 'react'
import { page, connect, component } from 'acore';
import { InputNumber, Input, Button, Select, Switch, message } from 'antd';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './Subscribe.less';

const options = {
  suggest: {
    buttonTitle: 'aminer.search.results.suggest',
    buttonDefault: 'Suggest',
    inputTips: 'aminer.search.results.suggest.tip',
    inputDefault: 'Input email to subscribe to the latest paper',
    alt: 'aminer.paper.topic.subscribe.alt',
    inputLabel: 'aminer.search.results.suggest',
    inputLabelDefault: 'Suggest',
  },
  subscribe: {
    buttonTitle: 'aminer.search.results.subscribe',
    buttonDefault: 'Subscribe',
    inputTips: 'aminer.search.results.subscribe.tip',
    inputDefault: 'Provide new Topic to us',
    alt: 'aminer.paper.topic.subscribe.alt',
    inputLabel: 'aminer.paper.topic.subscibe.email',
    inputLabelDefault: 'email',
  }
}

const SubscribeForm = props => {
  const { onSubmit, onCancel, type } = props;
  const changes = {};
  const curOpts = options[type]
  const { alt, buttonTitle, buttonDefault, inputTips, inputLabel, inputLabelDefault } = curOpts

  return (
    <div className={styles.form}>
      <div className={styles.formItem}>
        <FM id={inputLabel} defaultMessage={inputLabelDefault} />
        <Input onChange={e => changes.email = e.target.value}
          placeholder={formatMessage({ id: inputTips })} onPressEnter={() => onSubmit(changes)}/>
      </div>
      <div className={styles.btnLine}>
        <div className={styles.submitBtn}>
          <Button onClick={onCancel}>
            <FM id="aminer.search.filter.cancel" defaultMessage="Cancel" />
          </Button>
        </div>
        <div className={styles.submitBtn}>
          <Button onClick={() => onSubmit(changes)}>
            <FM id="aminer.search.filter.confirm" defaultMessage="Confirm" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const Subscribe = props => {
  const { dispatch, query, type = 'subscribe', mustLogin, isUserLogin, icon } = props;

  const onSubmit = changes => {
    if (changes && changes.email) {
      if (type === 'subscribe') {
        if (changes.email) {
          dispatch({
            type: 'searchpaper/Subscribe',
            payload: {
              keysords: (query && query.query) || '',
              email: changes.email,
            }
          }).then(data => {
            if (data) {
              message.success('订阅成功');
            }
          })
        }
      } else if (type === 'suggest') { // suggest为提议
        if (changes.email) {
          dispatch({
            type: 'searchpaper/Suggest',
            payload: {
              topicName: encodeURIComponent(changes.email)
            }
          }).then(data => {
            if (data) {
              message.success('提交成功');
            }
          })
        }
      }
    }
    closeModal();
  }


  const curOpts = options[type]
  const { alt, buttonTitle, buttonDefault } = curOpts

  const openAddModal = () => {
    if (mustLogin) {
      if (!isUserLogin) {
        dispatch({ type: 'modal/login' });
        return ;
      }
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: buttonTitle, defaultMessage: buttonDefault }),
        height: 'auto',
        width: '600px',
        content: <SubscribeForm onSubmit={onSubmit} onCancel={closeModal} type={type}/>,
      },
    });
  }

  const closeModal = () => {
    dispatch({
      type: 'modal/close',
    });
  }

  return (
    <div className={styles.subscribe} key="subscribeForm">
      <Button
        size="small" alt={formatMessage({ id: alt })}
        className={styles.subscribeBtn}
        onClick={openAddModal}
      >
        {icon && (
          <svg className="icon" aria-hidden="true" >
            <use xlinkHref={`#icon-${icon}`} />
          </svg>
        )}
        <FM id={buttonTitle} defaultMessage={buttonDefault} />
      </Button>
    </div>
  )
}

export default page(
  connect(({ searchpaper, auth }) => ({
    topic: searchpaper.topic,
    user: auth.user,
    isUserLogin: auth.isUserLogin,
  }))
)(Subscribe);
