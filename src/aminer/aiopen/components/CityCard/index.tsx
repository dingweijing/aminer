import React, { Component } from 'react';
import { FM } from 'locales';
import { Button, Icon } from 'antd'
import styles from './index.less'

type detail = {
  img: string,
  cityName: string,
  countryName: string,
  description: string,
  rank: number,
}

interface IPropType {
  detail: detail,
  onToggle: Function,
  isStar?: boolean,

}

const CityCard: React.FC<IPropType> = ({ detail = {}, isStar = false, onToggle }) => {
  const { img, name,name_zh, countryName, description, rank,country } = detail
  const onClick = () => onToggle(detail)
  return (
    <div className={styles.wrapper}>
      <Icon type="close" className="myclose" />
      <div className="banner" style={{ backgroundImage: `url(${img})` }} />
      <div className="cardText">
       {/*  <div className="rank">{rank}</div> */}

        <div className="title">{name_zh||name}</div>
        <div className="country">{country}</div>
        <span className="basisIndex">基础指数：24343</span>
        <span className="useIndex">应用指数：807655</span>
        <div className="description">{description}</div>
      </div>
      <div className="cardActions">
        {isStar ?
          <Button onClick={onClick}>移出我的城市</Button> :
          <Button type="primary" onClick={onClick} className="cardButton">加入我的城市</Button>
        }

      </div>
    </div>
  )
}

export default CityCard;
