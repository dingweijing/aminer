import React, { Component,useState } from 'react';
import { FM } from 'locales';
import {classnames} from 'utils'
import styles from './ranktab.less'

type tabs={title:string}

interface IPropType{
  tabs:Array<tabs>,
  onSelect:Function,
  activeIndex?:number,
}

const RankTab: React.FC<IPropType> = ({tabs,onSelect=()=>{},activeIndex=0}) => {

  return (
  <div className={styles.wrapper} >
    {tabs?.map((t,idx)=><div className={classnames("tab",{active:activeIndex===idx})}
      onClick={onSelect.bind(null,idx)} key={t.title}>{t.title}</div>)}
</div>)
}

export default RankTab;
