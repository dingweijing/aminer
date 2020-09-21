import React, { useMemo, useEffect } from 'react';
import { connect, history, component, withRouter } from 'acore';
import { formatMessage } from 'locales';
import styles from './Modal.less';
import { classnames } from '@/utils';


const AModal = props => {
  const { modal, dispatch, location } = props;
  const { visible, maskClosable, className } = modal;
  const { title, content, extraArticleStyle } = modal;
  const { onOk, onCancel, showHeader, showFooter } = modal;
  const { width, height } = modal;
  const { left, right, top, bottom } = modal;
  const { afterClose } = modal;

  const { children, isLinkLogin } = modal;

  const onShowForget = () => {
    dispatch({ type: 'modal/forget' });
  };

  const onCloseModal = () => {
    if (afterClose) {
      afterClose()
    }
    dispatch({ type: 'modal/close' });
  };

  const nothing = () => { console.log('nothing'); };

  const modalSize = useMemo(() => {
    const obj = {};
    if (width) {
      obj.width = width;
    }
    if (height) {
      obj.height = height;
    }
    return obj;
  }, [width, height]);


  const modalPosition = useMemo(() => {
    const obj = {};
    if (left) {
      obj.left = left;
    }
    if (right) {
      obj.right = right;
    }
    if (top) {
      obj.top = top;
    }
    if (bottom) {
      obj.bottom = bottom;
    }
    return obj;
  }, [left, right, top, bottom]);

  useEffect(() => {
    const aminerModal = window && window.document && window.document.getElementById('aminer_modal')
    const aminerModalContent = window && window.document && window.document.getElementById('aminer_modal_content')
    if (visible && aminerModal && aminerModalContent) {
      const bodyWidth = document.body.clientWidth;
      const bodyHeight = document.body.clientHeight;
      // console.log(bodyWidth, bodyHeight)

      if (isLinkLogin && bodyWidth < 600) {
        history.push(
          `/login?callback=${encodeURIComponent(location.pathname.substr(1))}${encodeURIComponent(location.search)}`
        )
        return;
      }

      // const contentWidth = `${width}px` || '600px';
      // const contentHeight = `${height}px` || 'auto';

      const contentLeft = left || ((bodyWidth - aminerModalContent.clientWidth) / 2);
      const conetntTop = top || (bodyHeight - aminerModalContent.clientHeight) / 3;

      // aminerModalContent.style.width = `${aminerModalContent.clientWidth}px`
      // aminerModalContent.style.height = `${contentHeight}px`

      aminerModalContent.style.left = `${contentLeft}px`
      aminerModalContent.style.top = `${conetntTop}px`

      aminerModal.style.visibility = 'visible';
    }
    if (!visible && aminerModal) {
      aminerModal.style.visibility = 'hidden';
    }
  }, [visible])

  return (
    <section id="aminer_modal" style={{ visibility: 'hidden' }}>
      <div className={classnames(styles.modalBox, 'aminer_common_modal')}>
        <div className={styles.masker} onClick={maskClosable ? onCloseModal : nothing} />
        <div id="aminer_modal_content" className={classnames(styles.modal, styles[className])}>
          {!showHeader && (
            <span className={styles.contentClose} onClick={onCloseModal}>
              <svg className={classnames('icon', styles.closeSvg)} aria-hidden="true">
                <use xlinkHref="#icon-close" />
              </svg>
            </span>
          )}
          <div className={styles.modalContainer}
            style={{ ...modalSize, ...modalPosition }}
          >
            {showHeader && (
              <header>
                <span>{title}</span>
                <span className={styles.close} onClick={onCloseModal}>

                  <svg className={classnames('icon', styles.closeSvg)} aria-hidden="true">
                    <use xlinkHref="#icon-modal_close" />
                  </svg>
                </span>
              </header>
            )}

            <article style={extraArticleStyle}>
              {content}
            </article>

            {showFooter && (
              <footer>
                <div className={styleMedia.footerLeft} />
                <div className={styles.btns}>
                  <button type="button"
                    className={styles.cancelBtn}
                    onClick={onCloseModal}
                  >
                    {`${formatMessage({ id: 'aminer.common.cancel', defaultMessage: 'Cancel' })}`}
                  </button>
                  <button type="button"
                    className={styles.confirmBtn}
                    onClick={onOk}
                  >
                    {`${formatMessage({ id: 'aminer.common.ok', defaultMessage: 'Confirm' })}`}
                  </button>
                </div>
              </footer>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default component(withRouter, connect(({ auth, modal }) => ({ user: auth.user, modal })))(AModal);
