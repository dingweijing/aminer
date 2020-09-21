import React, { Component, ReactComponentElement } from 'react';
import { FM } from 'locales';
import {classnames} from 'utils'
import styles from './style.less'

interface IPropType{
  Top:any,
  Bottom:any,
  onClick:Function,
  active:boolean,
}

const RankTab: React.FC<IPropType> = ({Top,Bottom,onClick,active}) => (
  <a className={classnames(styles.wrapper,{ranktabActive:active})} onClick={onClick} >
    <div className="top">
    {Top}
    </div>
    <div className="bottom">
   {Bottom}
    </div>
  </a>
)

export default RankTab;
