import React, { useRef, useState } from 'react';
import { component } from 'acore';
import { Hole } from 'components/core';
import { Modal } from 'antd';
import { classnames } from 'utils';
import styles from './PopDelay.less';

interface IPropTypes {
  content: JSX.Element;
  visible: boolean;
}

const OpenModalWithAntd: React.FC<IPropTypes> = props => {
  const { content, visible: v, ...modalParams } = props;
  const [visible, setVisible] = useState<boolean>(v);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void = e => {
    setVisible(false);
  };

  const handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void = e => {
    setVisible(false);
  };

  return (
    <div className={classnames(styles.openModalWithAntd)}>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        {...modalParams}
      >
        {content}
      </Modal>
      <div onClick={showModal}>{props.children}</div>
    </div>
  );
};

export default component()(OpenModalWithAntd);
