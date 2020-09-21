import React, { Component } from 'react';
import { FM } from 'locales';
import {classnames} from 'utils'
import styles from './RankItem.less'

interface IPropType{
  order:number,
  img:string,
  name:string,
  active?:boolean,
  onClick?:Function
}

const RankItem: React.FC<IPropType> = ({order,img,name_zh,name,active=false,onClick=()=>{}}) => (
  <div className={classnames(styles.wrapper,{active}) } key={name_zh} onClick={onClick}>
    <span className="order">{order}</span>
    <img src={img} className="img" alt=""/>
    <div className="index">
    <span className="title">{name_zh||name}</span>
    <span className="apply">应用研究创新指数:18</span>
    <span className="base">基础研究创新指数:18</span>
    <svg t="1600308394543" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10206" width="48" height="48"><path d="M512 0C343.296 0 206.592 143.2064 206.592 320 206.592 625.6128 512 1024 512 1024s305.408-398.4128 305.408-704C817.408 143.2064 680.704 0 512 0z m0 475.2128c-79.872 0-144.384-67.7376-144.384-151.2192 0-83.456 64.768-151.4496 144.384-151.4496 79.872 0 144.384 67.712 144.384 151.4496 0 83.456-64.512 151.1936-144.384 151.1936z" p-id="10207" fill="#e6e6e6" /></svg>
    </div>

{/*     <div className="info">
       
        <p>
          <span>指数1:1</span>
          <span>指数1:1</span>
          <span>指数1:1</span>
        </p>
    </div> */}
  </div>
)

export default RankItem;
