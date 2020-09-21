import React, { useRef, useEffect, useState } from 'react'
import { Input } from 'antd';

const NumberInputBox = (props) => {
  const { className, placeholder, value, setValue, onPressEnter, maxLength } = props;

  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^([1-9][0-9]*)?$/;
      if (reg.test(value)) {
      setValue(value);
    }
  }

  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onPressEnter={onPressEnter}
      maxLength={maxLength}
    />
  )
}

export default NumberInputBox;
