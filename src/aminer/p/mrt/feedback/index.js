import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { connect, component, withRouter } from 'acore';
import { Button, Input, Modal, notification } from 'antd';
import { FM, formatMessage, getLocale } from 'locales';

const FeedbackComponent = props => {
  const { dispatch } = props;
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  const submitFeedback = () => {
    if (feedbackContent.trim().length === 0) {
      setFeedbackVisible(false)
      return
    }
    setFeedbackSubmitting(true)
    dispatch({
      type: 'mrt/Track',
      payload: {
        type: 'mrt/feedback',
        payload: feedbackContent
      }
    }).then(() => {
      notification.open({
        message: formatMessage({ id: 'aminer.paper.mrt.feedback.message' }),
        description: formatMessage({ id: 'aminer.paper.mrt.feedback.description' })
      });
      setFeedbackSubmitting(false)
      setFeedbackVisible(false)
    })
  }

  return <div className={styles.feedbackBtn} key={getLocale()}>
    <Button shape='round' onClick={() => setFeedbackVisible(true)} size='large' loading={feedbackSubmitting}>
      <svg className="icon" aria-hidden="true" style={{ marginRight: 5 }}>
        <use xlinkHref={`#icon-feedback`} />
      </svg>
      {formatMessage({ id: 'aminer.paper.mrt.feedback' })}
    </Button>
    <Modal title={formatMessage({ id: 'aminer.paper.mrt.feedback' })} visible={feedbackVisible} onOk={submitFeedback} onCancel={() => setFeedbackVisible(false)} okButtonProps={{ disabled: feedbackSubmitting }}>
      <Input.TextArea value={feedbackContent} onChange={({ target: { value } }) => setFeedbackContent(value)} placeholder={formatMessage({ id: 'aminer.paper.mrt.feedback.placeholder' })} autoSize={{ minRows: 3, maxRows: 5 }} />
    </Modal>
  </div>
}

export default component(
  connect(() => ({})),
  withRouter
)(FeedbackComponent);
