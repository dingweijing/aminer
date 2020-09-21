import React, { Component, useState, useEffect } from 'react';
import { FM } from 'locales';
import { classnames } from 'utils'
import { getLangLabel } from 'helper'
import styles from './style.less'

const SelectionModal = ({ visible, setVisible, title, selections = [], getResult = () => { }, children }) => {
  const [selectedKey, setKey] = useState(null)
  const [extendPanel, setExtendPanel] = useState(false)

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setExtendPanel(visible)
      }, 200)
    } else {
      setExtendPanel(false)
    }
  }, [visible])

  const onSelect = (key, e) => {
    setKey(key)
    e.stopPropagation()
  }
  const onClose = e => {
    e.preventDefault()
    setVisible(false)
    getResult(selectedKey)
    e.stopPropagation()
  }

  return (<div
    className={classnames(styles.SelectionModal, { visibleClass: visible })}
    onClick={onClose}
  >
    <div className={classnames('selectionWrapper', { extendScroll: extendPanel })} >
      <div className="mytitle">
        <span>{title}</span>
        <div className="close" onClick={onClose} >x</div>
      </div>
      {children ? (
        React.Children.map(children, i => i)
      )
        : (<ul className={classnames('scroll')}>{
          selections.map((selection, idx) => (<li
            onClick={e => onSelect(selection.value, e)}
            className={classnames({ active: selectedKey ? selection.value === selectedKey : idx === 0 })}
            key={selection.value}>{getLangLabel(selection.name, selection.name_cn)}</li>))
        }</ul>)}
    </div>
  </div >)
}


const SelectionMobile = ({ name = '', selections = [], getResult = () => { }, children }) => {
  const [visible, setVisible] = useState(false)
  const [result, setResult] = useState(null)
  const onOpen = (status = false) => {
    // 创建摸态框
    // setItem()
    setVisible(status)
  }


  return (
    <div className={styles.SelectionMobile} >
      <span className="mytitle">{name}</span>
      <span className="selection" onClick={() => onOpen(true)}>{result}
        <span>{'>'}</span>
      </span>
      <SelectionModal
        title={name}
        selections={selections}
        onOpen={() => { onOpen(false) }}
        setVisible={setVisible}
        getResult={res => setResult(res)}
        visible={visible}
      >{children}</SelectionModal>
    </div>
  )
}

export default SelectionMobile;
