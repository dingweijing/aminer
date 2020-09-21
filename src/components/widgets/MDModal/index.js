import React, { Component, useEffect, useRef } from 'react';
import { FM } from 'locales';
import { Modal } from 'antd'
import marked from 'marked'
import styles from './style.less'

const MdModal = ({ mdStr = '', visible = false }) => {
  const innerEl = useRef(null);

  useEffect(() => {
    if (innerEl) {
      const htmlStr = marked(mdStr)
      const el = document.querySelector('#mdModal')

      el.innerHTML = htmlStr
      // innerEl.current.innerHTML = htmlStr
    }
  }, [mdStr, visible])
  return (
    <div className={styles.wrapper} id="mdModal" ref={innerEl}>
    </div>
  )
}

export default MdModal;
