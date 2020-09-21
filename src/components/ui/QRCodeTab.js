// 二维码切换
import React, { Component, useState } from 'react';
import { Icon } from 'antd'
import { classnames } from 'utils'
import styles from './QRCodeTab.less'

// data=[{icon:'',img:'',onClick:'',desc:''}]

const TabComponent = ({ icon, img, onClick, desc, active, onHover, link, hover, middle }) => {
  const handleClick = e => {
    // 处理跳转逻辑：如果有link则不切换
    if (link) {
      return;
    }
    e.preventDefault()
    onClick()
  }

  return (
    <div className={styles.TabComponent} >
      <a className="icon-wrapper" href={link || '#'} target={link ? '_blank' : ''}
        onClick={e => handleClick(e)}
        style={{ backgroundColor: active || hover ? '#474EE3' : '#fff' }}>
        <Icon component={icon} className="tabIcon"
          style={{ color: active || hover ? '#fff' : '#2A282C' }}></Icon>
      </a>
      <div className={classnames('tab-bottom', { tab1: middle })}>
        {active && img && <div className={classnames('arrow', { midArrow: middle })}></div>}
        <div className="img-wrapper" style={{ visibility: active && img ? 'visible' : 'hidden' }}>
          <img src={img} alt="qrcode" />
          <p className="desc">{desc}</p>
        </div>
      </div>
    </div>
  )
}


const QRCodeTab = ({ data = [], clickEvent = () => { } }) => {
  const [currenIdx, setIdx] = useState(0)
  const [currenHoverIdx, setHoverIdx] = useState(null)
  const handleClick = idx => {
    setIdx(idx)
    clickEvent(idx)
  }

  const handleHover = idx => {
    setHoverIdx(idx)
  }
  return (
    <div className={styles.QRCodeTab}>
      {
        data.map((d, idx) => <TabComponent
          active={currenIdx === idx}
          hover={currenHoverIdx === idx}
          middle={idx === 1}
          {...d} key={d.icon}
          onHover={() => handleHover(idx)}
          onClick={() => handleClick(idx)} />)
      }

    </div>
  )
}

export default QRCodeTab;
