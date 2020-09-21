import React, { Component } from 'react';
import { FM } from 'locales';
import { Row, Col, Icon } from 'antd'
import { Modal, ZoomingImage as ZoomingImageModal } from 'aminer/components/widgets';
import { isMobile } from 'utils'
import styles from './style.less'

const formatDate = time => {
  if (time && time.includes('T')) return time.split('T')[0]
  return time
}

const { host } = window.location

const CompanyInfo = (props = {}) => {
  const { handleDrawerToggle, type = 'normal', name_zh, name, active = false,
    url, keywords_zh, id, go, provice, award, industry, keywords, start_time, logo, members, finance_rounds } = props
  const tags = keywords_zh || keywords

  const isGiant = type === 'giant'
  return (
    <div className={styles.CompanyInfo}>
      <div className="left">
        <Icon className="iicon" onClick={handleDrawerToggle} type={active ? 'down' : 'right'}></Icon>
        <div className="info-right">
          {/* <a className="ttitle" target="_blank" href={`${host}/aiCompanyDetail?com_id=5ed717dc79eca126a7494b19`}>{name_zh || name}</a> */}
          <div>
            {url ? (<>
              <a className="ttitle companyName" href={url} rel="noopener noreferrer" target="_blank">{name_zh || name}</a>
              {award && <ZoomingImageModal className="badge"
                modalInnerImage={award}
                imgUrl="https://originalfileserver.aminer.cn/data/ai_company/award.png" />}
            </>) :
              <>
                <p className="ttitle companyName" onClick={(e) => { e.preventDefault(); go.bind(null, id, url) }}>{name_zh || name}
                </p>
                {award && <ZoomingImageModal className="badge"
                  modalInnerImage={award}
                  imgUrl="https://originalfileserver.aminer.cn/data/ai_company/award.png" />}
              </>}

            {/* <img src="https://originalfileserver.aminer.cn/data/ai_company/award.png" alt="" className="badge" /> */}
          </div>
          {industry && <div className="star-wrapper">
            {!isGiant && <Icon type="star" theme="filled" style={{ color: '#FB6D15' }} />}
            {!isGiant && <span>{provice}  |</span>}
            <span>{industry}</span>
          </div>}
        </div>
      </div>
      <div className="mid">
        <div className="lleft">
          <div className="tags-group">
            {tags && tags.map(item => (<div className="tags" key={item}>{item}</div>))}

          </div>
          {members && members.length && <div className="member-group" onClick={handleDrawerToggle}>
            {isGiant ? '技术带头人' : '团队：'}
            {members && members.map(item => (<span className="member" key={item.name}>{item.name_zh || item.name}</span>))}
          </div>}
          {!isGiant && start_time && <p className="createTime">
            成立时间：<span>{formatDate(start_time)}</span>
          </p>}
          {/* <div className="member-group">
            团队：
        {members && members.map(item => (<span className="member" key={item.name}>{item. name}</span>))}
          </div> */}
        </div>

        {false && !isGiant ? <div className="rright">
          <div>
            <p>
              <Icon type="clock-circle" />
              成立时间：<span>{formatDate(start_time)}</span>
            </p>
            {/*   <p>
              <Icon type="dollar" />
              融资轮次：<span>{finance_rounds}</span>
            </p> */}
          </div>
        </div>
          : null}
      </div>
      <div className="right">
        <img src={logo} alt="" />
      </div>
    </div>
  )
}

export default CompanyInfo;
