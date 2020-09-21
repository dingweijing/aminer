import React, { Component } from 'react';
import { Icon } from 'antd';
import { FM, formatMessage } from 'locales';
import { ZoomingImage as ZoomingImageModal } from 'aminer/components/widgets';
import styles from './style.less';

// { citation, person, country, followed = false }
const Img = () => (
  <div className="btn"><FM id="aiopen.peopleInfo.certificate"></FM> <Icon type="trophy" /></div>
)
const PeopleInfoComponent = params => {
  const { award_path, citation, country, person, doAttention = () => { }, followedMap, viewsMap } = params
  const { id, avatar, name, profile = {}, tags = [], indices = {} } = person
  return params && person && followedMap.size && viewsMap.size ? (
    <div className={styles.PeopleInfoComponent}>
      <div className="left">
        <img src={avatar} alt="" className="avatar" />
      </div>
      <div className="mid">
        <p className="name">{name}</p>
        <p className="desc">
          <span>{profile.position}</span>
          <span>{profile.affiliation}</span>
          <span>{country}</span>
        </p>
        <p className="tags">
          {tags &&
            tags.map((t, index) => index < 5 && <span key={index}>{t}</span>)}
        </p>
        <p className="quoteNum">
          {formatMessage({
            id: 'aiopen.peopleInfo.quoteTotal',
            defaultMessage: 'Total citations of selected papers：',
          })}
          <span className="num">{citation}</span>
        </p>
      </div>
      <div className="right">
        <div className="lleft">
          <p>
            <FM id="aiopen.peopleInfo.Views"></FM>{' '}
            <span className="num">{viewsMap.get(id)}</span>{' '}
          </p>
          <p>
            H-index：<span className="num">{indices.hindex}</span>
          </p>
          <p>
            <FM id="aiopen.peopleInfo.paperNum"></FM>
            <span className="num">{indices.pubs}</span>
          </p>
          <p>
            <FM id="aiopen.peopleInfo.quoteNum"></FM>
            <span className="num">{indices.citations}</span>
          </p>
        </div>
        <div className="rright">
          <div className="btn" onClick={() => { doAttention(id, followedMap.get(id)) }}>
            <FM id="aiopen.peopleInfo.follow" ></FM>
            <Icon type="heart" theme={followedMap.get(id) ? 'filled' : 'outlined'} />
          </div>
          <ZoomingImageModal
            modalInnerImage={award_path}
            WrapperComponent={Img}
          />
          {/* <Img /> */}
        </div>
      </div>
    </div>
  ) : null
}
export default PeopleInfoComponent
