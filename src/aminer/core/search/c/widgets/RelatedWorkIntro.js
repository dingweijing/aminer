// MustReadEdit.less
import React, { useMemo, useEffect, useState } from 'react'
import { page, connect, component } from 'acore';
import { InputNumber, Input, Button, Select, Switch, message, notification } from 'antd';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './RelatedWorkIntro.less';

const IntroModal = (props) => {
  const { closeModal } = props;
  return (
    <div className={styles.introModal}>
      <div className={styles.content}>
        <div className={styles.contentRow}><FM id='aminer.header.collector.relatedWork.intro' /></div>
        <div className={styles.contentRow}><FM id='aminer.header.collector.relatedWork.steps' /></div>
        <div className={styles.contentRow}><FM id='aminer.header.collector.relatedWork.steps1' /></div>
        <div className={styles.contentRow}><FM id='aminer.header.collector.relatedWork.steps2' /></div>
        <div className={styles.contentRow}><FM id='aminer.header.collector.relatedWork.steps3' /></div>
      </div>
      <div className={styles.btn}><Button onClick={closeModal}>{formatMessage({ id: 'aminer.search.filter.confirm', defaultMessage: '确认'})}</Button></div>
    </div>
  )
}

const RelatedWorkIntro = (props) => {
  const { dispatch } = props;

  const openIntroModal = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({id: 'aminer.paper.topic.paper.summarize'}),
        height: 'auto',
        width: '600px',
        content: <IntroModal closeModal={closeModal} />,
      },
    });
  }

  const closeModal = () => {
    dispatch({
      type: 'modal/close',
    });
  }

  return (
    <Button type='link' key="summarize" size="small" onClick={openIntroModal}>
      <FM id="aminer.paper.topic.paper.summarize" />
    </Button>
  )
}

export default page(
  connect()
)(RelatedWorkIntro);
