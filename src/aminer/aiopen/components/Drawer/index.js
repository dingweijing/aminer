import React, { Component, useState } from 'react';
import { FM } from 'locales';
import { classnames } from 'utils'
import styles from './style.less'

// openInOuter: 是否在最外层触发点击事件
const Drawer = props => {
  const { renderTop, renderHider, data, hiderData, openInOuter = true } = props
  const [isOpen, setOpen] = useState(false)

  const onOpen = () => {
    if (!hiderData) return;
    setOpen(!isOpen)
  }


  if (renderTop && renderHider) {
    return (
      <div className={styles.Drawer} >
        <div className={classnames('top')} onClick={openInOuter ? onOpen : () => { }} >
          {renderTop({ ...data, active: isOpen }, onOpen)}
        </div>
        {hiderData ? <div className={classnames('hider', { active: isOpen })}>
          {renderHider(hiderData, onOpen)}
        </div> : null}
      </div>
    )
  }
  return null
}

export default Drawer;
