/**
 * Created by bo gao on 2019-06-10
 */
import React, { useState } from 'react';
import { connect, component } from 'acore';
import { Modal } from 'antd';
import { JConfEdit } from 'modules/core/jconf/components';
import styles from './EditModal.less';

const EditModal = (props) => {
  const { onUpdate, onCancel } = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  const open = () => {
    setVisible(true);
  }

  const updateAndOpen = (currentData) => {
    setData(currentData);
    setVisible(true);
  }

  const close = () => {
    setVisible(false);
  }

  const handleOk = () => {
    console.log("|||| on OK")
    // if (onUpdate) {
    //   onUpdate() // TODO  ....
    // }
  }

  const { register } = props;
  if (register) {
    register.current = { open, close, updateAndOpen }
  }

  return (
    <>
      <Modal
        title="Edit Journel / Conference"
        visible={visible}
        className={styles.modal}
        onOk={handleOk}
        onCancel={close}
        footer={null}
      // okButtonProps={{ children: 'Update' }}
      // cancelButtonProps={{ disabled: true }}
      // maskClosable
      >
        {!data && <div className="loading">Loading...</div>}
        {data && (
          <JConfEdit
            id={data.id}
            onUpdate={onUpdate}
            onCancel={onCancel}
          />
        )}

      </Modal>
    </>
  )
}

export default component(connect())(EditModal)
