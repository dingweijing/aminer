/**
 * 鼠标点击图片以弹出层放大
 */

import React, { useState } from 'react';
import { Modal } from 'antd';
import styles from './ZoomingImage.less';

const ZoomingImage = props => {
  const { imgUrl, className, renderDescriptor, data, modalInnerImage } = props;
  const [visible, setVisible] = useState(false);

  if (!imgUrl) return null;
  return (
    <>
      <img
        src={imgUrl}
        className={className}
        alt=""
        onClick={() => {
          setVisible(true);
        }}
        style={{ cursor: 'zoom-in' }}
      />
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
        width="900px"
      >
        <div className={styles.zoomModalWrapper}>
          <img src={modalInnerImage} alt="" className={styles.modalImage} />
          {renderDescriptor && renderDescriptor(data)}
        </div>
      </Modal>
    </>
  );
};

export default ZoomingImage;
