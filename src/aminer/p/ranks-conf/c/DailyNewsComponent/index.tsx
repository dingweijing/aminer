import React, { Component } from 'react';
import { FM } from 'locales';
import styles from './style.less'

type ListItem={
  image:string,
  title:string,
  _id:string
}

interface IProps{
  list:Array<ListItem>
}

const LINK_PREFIX = 'https://www.aminer.cn/research_report/'
const LINK_AFFDON = '?download=false'

/* eslint-disable no-underscore-dangle */
const DailyNews = (props:IProps) => {
  const { list = [] } = props
return (
      <div className={styles.DailyNews}>
        {list && list.map(item => (
            <a key={item._id} href={LINK_PREFIX + item._id + LINK_AFFDON} target="_blank" rel="noopener noreferrer"> {item.title}</a>
        ))}
      </div>
)
}

export default DailyNews;
