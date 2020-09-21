import React, { useState } from 'react';
import { classnames } from 'utils';
import styles from './style.less'


const RadioTab = ({ options, handleSubmit = () => { } }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleClick = idx => {
    setActiveIndex(idx)
    handleSubmit(options[idx])
  }

  return (
    <div className={styles.radioTabwrapper} >
      {options && options.length && options.map((opt, idx) => (<div
        className={classnames('radioTab', { radioTabActive: idx === activeIndex })}
        onClick={() => handleClick(idx)} >{opt}</div>))
      }
    </div >
  )
}

export default RadioTab;
