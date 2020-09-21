import React, { Component, useEffect } from 'react';
import { FM } from 'locales';
import { connect } from 'acore';
import { isMobile } from 'utils'
import { Modal } from '../../components/widgets'
import RankComponent from '../components/RankComponent'
import SeminarComponent from '../components/SeminarComponent'
import styles from './indexPage.less'
import { VIEW_ID, COLLABORATIONS } from './options'

const Index = props => {
  const { dispatch, ai2000rank, modal } = props
  const { list } = ai2000rank
  const { scholar = [], pubs = [], seminar = [] } = list
  const isMobileState = isMobile() || document.body.clientWidth < 768
  const fetchList = () => {
    dispatch({
      type: 'ai2000rank/getList',
      payload: {}
    })
  }


  useEffect(() => {
    fetchList()
    dispatch({
      type: 'openIndexSetting/setViewsStatics',
      payload: { id: VIEW_ID },
    });
  }, [])

  return (
    <div className={styles.IndexPage}>
      {/*       <div className="head">
        <h2>
          <FM id="aiopen.index.title1"></FM>
        </h2>
        <a href="https://www.aminer.cn/ranks/home" target="_blank" rel="noopener noreferrer">
          <FM id="aiopen.index.title2"></FM>
        </a>
      </div> */}
      <div className="rankList">
        {scholar && scholar.map((s, idx) => (<RankComponent className={idx === 0 ? 'seminarComponent' : ''} key={s.title}
          {...s} vertical={isMobileState || idx !== 0} />))}
      </div>
      <div className="pubs">
        {pubs && pubs.map((s, idx) => (<RankComponent className={isMobileState ? '' : 'pubComponent'} key={s.title} {...s}
          vertical={isMobileState || idx !== 0} />))}
      </div>
      <div className="seminar">
        {/* <h2>AI TIME 研讨会</h2> */}
        {/* eslint-disable  react/no-unescaped-entities */}
        {/* <span>了解更多 > </span> */}
        {seminar && seminar.map((s, idx) => (<RankComponent className="seminarComponent" key={s.title} {...s} vertical={isMobileState || idx !== 0} />))}
      </div>
      <h2 className="head">
        <FM id="aiopen.index.title4" defaultMessage="Collaborations"></FM>
      </h2>
      <div className="collaboration">

        {COLLABORATIONS.IMGS.map(src => <div className="colchild"><img alt="" key={src} src={typeof src === 'string' ? src : `${COLLABORATIONS.BASE_URL}${src}.png`} /></div>)}
      </div>
      <Modal {...modal}></Modal>
    </div>
  )
}
export default connect(({ ai2000rank, modal }) => ({ ai2000rank, modal }))(Index);
