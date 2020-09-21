import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, component, withRouter } from 'acore';
import styles from './ImgViewer.less';

const AImg = props => {
  const { imgViewer, dispatch } = props;
  const { visible, maskClosable, afterClose, src, intro } = imgViewer;

  const onCloseModal = () => {
    if (afterClose) {
      afterClose()
    }
    dispatch({ type: 'imgViewer/close' });
  };

  const onMaskClick = () => {
    if (maskClosable) {
      onCloseModal();
    }
  }

  useEffect(() => {
    const aminerImgViewer = window && window.document && window.document.getElementById('aminer_img_viewer')
    if (visible && aminerImgViewer) {
      // const bodyWidth = document.body.clientWidth;
      // const bodyHeight = document.body.clientHeight;
      aminerImgViewer.style.visibility = 'visible';
    } 
    if (!visible && aminerImgViewer) {
      aminerImgViewer.style.visibility = 'hidden';
    }
  }, [visible])

  return (
    <section id='aminer_img_viewer' style={{ visibility: 'hidden' }}>
      {/* 一个带透明度的遮罩层 */}
      <div className={styles.imgViewerMask} />
      {/* 图片容器 */}
      <div className={styles.contentWrap}>
        <div className={styles.imgWrap}  onClick={onMaskClick}>
          {/* {src && <img src={src} alt={intro || ''} className={styles.img} draggable='true' onDrop={onImgDrop}/>} */}
          {src && (
            <img src={src} alt={intro || ''} className={styles.img} draggable='true'/>
          )}
        </div>
        <div className={styles.close} onClick={onMaskClick}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-close" />
          </svg>
        </div>
        {intro && <div className={styles.introWrap}>{intro}</div>}
      </div>
    </section>
  )
}

AImg.propTypes = {

}

export default component(withRouter, connect(({ imgViewer }) => ({ imgViewer })))(AImg);
