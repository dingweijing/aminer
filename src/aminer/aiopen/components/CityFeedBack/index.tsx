import React, { Component, useState,useEffect } from 'react';
import { FM } from 'locales';
import { classnames } from 'utils/';
import { displayCitation } from 'utils/profile-utils';
import { Smile, Angry, ThumbUp, Confused, Baffled, Fire } from './Emoji'
import EmojiWrapper from './EmojiWrapper'
import styles from './style.less'

interface IPropType { }

const CityFeedBack: React.FC<IPropType> = (props = {}, children) => {
  const { up = 0, down = 0,detail={} } = props
  const {id,rank,name_zh,mypoll}=detail
  const [disable, setDisable] = useState(mypoll?(mypoll>0?'red':'green'):'')
  const [ratio, setRatio] = useState(up / (up + down))
  const idx=rank-1

  const onClick = (v) => {
    if (!disable) {
      setDisable(v > 0 ? 'red' : 'green')
      props.onClick(id,v,idx)
    }
  }

  useEffect(()=>{
    setDisable(mypoll?(mypoll>0?'red':'green'):'')
  },[id,mypoll])

  return (
    <div className={styles.wrapper} >
      <div className="description">
        您是否看好{name_zh}呢？？
      </div>
      <div className="vsbar-wrapper">
        <div className={`iicon ${disable === 'red' ? 'red' : ''}`} onClick={()=>onClick(1)}><ThumbUp /></div>
        <div className="bar" style={{ background: `linear-gradient(to right, red ${ratio}%, green ${ratio}%)` }} />
        <div className={`iicon  ${disable === 'green' ? 'green' : ''}`} onClick={onClick.bind(null, -1)}><Confused /></div>
      {/*   <button className={'buttonOne'}>scholar</button>
        <button className={'buttonTwo'}>Author</button> */}

      </div>
    </div>
  )
}

export default CityFeedBack;
