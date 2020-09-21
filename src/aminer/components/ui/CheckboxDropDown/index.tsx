import React, { Component, useState, useEffect } from 'react';
import { FM } from 'locales';
import { Form, Checkbox, Button, message } from 'antd'
import { getLangLabel } from 'helper/';
import { IProps, IOpts } from './interface'
import styles from './style.less'

const PlusSvg = () => (
  <div className={styles.PlusSvg}>
    <svg t="1596595558562" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6243" width="48" height="48"><path d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32" p-id="6244"></path></svg>
  </div>
)
let result = []

const CheckboxDropDown = (props:IProps) => {
  const { options, isOpen, setOpenState, isMobile = false, onChange, value = [], openCallback = () => {}, } = props

  useEffect(() => {
    result = value
  }, [value.join('')])

  const handleToggle = () => {
    if (isOpen === false && isMobile) {
      openCallback()
    }
    setOpenState(!isOpen)
  }

  const onCheckBoxChange = v => {
    // 按照options保持列的顺序
    result = v
  }

  const onConfirm = () => {
    if (result && result.length < 3) {
      message.warn(getLangLabel('3 columns at least', '至少选择3行'))
      return;
    }
    // 让最终数组重的元素顺序与options一致
    const res = []
   options.forEach(opt => {
      const { value } = opt
      const isExsit = result.includes(value)
      if (isExsit) {
        res.push(value)
      }
    })
    onChange(res)
    setOpenState(false)
  }

  const onCancel = () => {
    setOpenState(false)
  }


  return (
  <div className={styles.CheckboxDropDown} >
    <div className="handler-wrapper" onClick={handleToggle}>
    <PlusSvg/>
    </div>

    {isOpen && <div className="options">
    <Checkbox.Group style={{ width: '100%' }} defaultValue={value} onChange={onCheckBoxChange}>
      {options.map(opt => (
        <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
      ))}
      </Checkbox.Group>
      <div>
        <div className="btn-wrapper">
      <Button size="small" type="primary" onClick={onConfirm} ><FM id="aminer.common.ok"/></Button>
        <Button size="small" onClick={onCancel} ><FM id="aminer.common.cancel"/></Button>
        </div>
      </div>
    </div>}

  </div>
)
}

export default CheckboxDropDown;
