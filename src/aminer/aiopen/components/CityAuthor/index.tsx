import React, { Component, useState } from 'react';
import { FM } from 'locales';
import styles from './index.less'

const data = [
  {
    id: 1,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 2,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 3,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 4,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 5,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 6,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 7,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 8,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 9,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  },
  {
    id: 10,
    name: 'Wanhui Bao',
    desc: '助理研究员',
    src: 'https://fileserver.aminer.cn/data/aiopenindex/homeVedio1.png'
  }

]
interface IPropType { }

const CityAuthor: React.FC<IPropType> = ({id,name,job,img}) => {

  return (
          <div className={styles.wrapper}>
            <img className="authorSrc" src={img}/>
            <div className="authorName">{name}</div>
            <div className="authorDesc">{job}</div>
          </div>
        )
}

export default CityAuthor;
