// getSchedule

import React, { useEffect, useState, useMemo } from 'react';
import { page, connect, history } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import { Button } from 'antd';
import { formatMessage, FM } from 'locales';
import styles from './ConfirmModal.less';

const ConfirmModal = props => {
  const { dispatch, title, confirmModal, } = props;
  const { visible, onConfirm, onCancel, okText, cancelText } = confirmModal
  const { width, height, opacity } = confirmModal;
  const [curVisible, setVisible] = useState(visible)

  useEffect(() => {
    setVisible(visible);
  }, [visible])
  useEffect(() => {
    const aminerModal = window && window.document && window.document.getElementById('confirm_modal')
    if (curVisible) {
      aminerModal.style.visibility = 'visible';
    } else {
      aminerModal.style.visibility = 'hidden';
    }
  }, [curVisible])

  const modalSize = useMemo(() => {
    const obj = {};
    if (width) {
      obj.width = width;
    }
    if (height) {
      obj.height = height;
      obj.top = `calc(50% - ${height} / 2)`
    }
    if (opacity) {
      obj.opacity = opacity;
    }
    return obj;
  }, [width, height, opacity]);

  const empty = () => {
    dispatch({ type: 'confirmModal/close' });
  }

  return (
    <div className={styles.confirmModal} style={{ ...modalSize, visibility: 'hidden' }} id="confirm_modal">
      {visible && <div className={styles.content} >
        <div className={styles.title}>{title ? title : " 你确定要删除会议吗"}</div>
        <div className={styles.action}>
          <Button onClick={onConfirm ? onConfirm : empty}>{okText || "确定"}</Button>
          <Button onClick={onCancel ? onCancel : empty}>{cancelText || "取消"}</Button>
        </div>
      </div>}
    </div>
  );
};

export default page(connect(({ confirmModal }) => ({ confirmModal })))(ConfirmModal);
