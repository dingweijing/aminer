import React, { Component, useState, useRef } from 'react';
import { Icon } from 'antd'
import { FM } from 'locales';
import { classnames } from 'utils'
import styles from './style2.less'

const NormalComponent = ({ id, pos, introduction, venue, journal }) => (
  <div className="detail" key={id}>
    <p className="ttitle">{pos}</p>
    {introduction && introduction.split('|').map(intro => (
      <p className="ttitle">{intro}</p>
    ))}
  </div>
)

const GiantComponent = props => {
  const { pubs = [] } = props
  const ps = pubs.slice(0, 10)
  return ps && ps.length && ps.map(({ _id, venue,
    authors, n_citation, title }) => (
      <div className="detail" key={_id}>
        <a className="ttitle" target="_blank" href={`https://www.aminer.cn/pub/${_id}`}>{title}</a>
        <p className="authors">{authors.map((a, idx) => (<a key={a._id} href={`https://www.aminer.cn/profile/${a._id}`} target="_blank" ><span>{a.name}</span>{idx === authors.length - 1 ? '' : '，'}</a>))}</p>
        {venue && venue.name && <span className="journal">{venue.name}</span>}
        <p className="refer_num">被引用   {n_citation}</p>
      </div>))
}

const CompanyPerson = (props = {}) => {
  const { data = [], type } = props
  const isGiant = type === 'giant'
  if (!data) return null;
  const names = data.map(m => ({ name: (m.name_zh || m.name), id: m.id }))
  const [activeIndex, setActive] = useState(0)
  const myRef = useRef(null);

  const onChangeTab = idx => {
    setActive(idx)
    // 每次切换时滚动条置顶
    const el = myRef.current
    el.scrollTop = 0
  }

  const currentData = data[activeIndex]
  return (
    <div className={styles.CompanyPerson}>
      <div className="left">
        {names.map((obj, idx) => (
          <span key={obj.name} onClick={onChangeTab.bind(null, idx)}
            className={activeIndex === idx ? 'active' : ''}>{obj.name}
            {obj.id && <a className="IconIcon" target="_blank" rel="noopener noreferrer" href={`https://www.aminer.cn/profile/${obj.id}`}>
              <Icon type="link" />
            </a>}
          </span>
        ))}
      </div>
      <div className={classnames('right', isGiant ? 'giantDetail' : '')} ref={myRef}>
        {
          isGiant ?
            <GiantComponent {...currentData} key={currentData.id} />
            : <NormalComponent {...currentData} key={currentData.id} />
        }
      </div>
      {/* <a className="footer" >查看详情</a> */}
    </div>
  )
}

export default CompanyPerson;
