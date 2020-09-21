import React, { useState, useEffect } from 'react';
import { connect, Link, component, withRouter, history  } from 'acore';
import { Layout } from 'aminer/layouts';
import { FM, formatMessage,getLocale } from 'locales';
import { Tooltip, Button, Spin, Typography, message, Pagination, Card, Col, Row, Avatar } from 'antd';
import helper from 'helper';
import styles from './index.less';
import { SearchSorts } from 'aminer/core/search/c/control';
import { classnames } from 'utils';
import PaperMRTList from './c/PaperMRTList';
import Typist from 'react-typist';
import FeedbackComponent from './feedback/index';
import ExampleList from './example-list.json';
import _ from 'lodash';

const MRTIndex = props => {
  const { dispatch, loading, mrtList, total } = props;
  const { sort = 'popularity', page = 1, tags } = helper.parseUrlParam(props, {}, ['sort', 'page', 'tags']);
  const [exampleOffset, setExampleOffset] = useState(0);

  const getMrts = (sortKey = 'popularity', current = 1, tags, pageSize = 20) => {
    const sorts = sortKey === 'popularity' ? ['-click_num'] : ['-created_time'];
    tags = (tags || '').split(',').filter(tag => tag && tag.length > 0)
    const filters = tags.length === 0 ? undefined : {'tags': {'$in': tags}}
    dispatch({
      type: 'mrt/getMrts',
      payload: {
        pagination: {
          current, pageSize,
        },
        sorts,
        filters,
        fields: [{ 'tree_data.root': 0, 'tree_data.branches': 0 }],
      }
    })
    if ((tags || []).indexOf('NeurIPS2019') >= 0) {
      dispatch({
        type: 'mrt/Track',
        payload: {
          type: 'nips2019',
          target_type: 'mrt-index'
        }
      })
    }
  }

  const gotoNextExampleBatch = () => {
    setExampleOffset(exampleOffset+6)
    const el = document.getElementById('example-section')
    if (el !== undefined) el.scrollIntoView()
  }

  const onSortChange = (sortKey) => {
    if (sortKey !== 'NeurIPS2019')
      history.push(`/mrt?sort=${sortKey}&page=${1}#gallery`);
    else
      history.push(`/mrt?sort=${'popularity'}&page=${1}&tags=${'NeurIPS2019'}#gallery`);
  }

  const onPageChange = (current, pageSize) => {
    history.push(`/mrt?sort=${sort}&page=${current}#gallery`);
  }

  const resetMRT = () => {
    dispatch({
      type: 'mrt/reset',
    })
  }

  useEffect(() => {
    getMrts(sort, Number(page), tags);
  }, [page, sort, tags])

  useEffect(() => {
    return resetMRT();
  }, [])

  useEffect(() => {
    if (window.location.hash == '#gallery') {
      const el = document.getElementById('gallery')
      if (el !== undefined) el.scrollIntoView()
    }
  })

  const searchSortKey = (tags || []).indexOf('NeurIPS2019') >= 0 ? 'NeurIPS2019' : sort

  const MRTCard = (props) => <Col sm={12} md={12} lg={8}>
    <div className={styles.mrtCard} onClick={() => history.push(`/mrt/${props.id}`)} style={{height: '100%'}}>
      <img alt={props.title} src={`http://webplus-cn-zhangjiakou-s-5d3021e74130ed2505537ee6.oss-cn-zhangjiakou.aliyuncs.com/aminer/mrt/${props.id}.png`}/>
      <h3>{props.title}</h3>
      <h4>{props.description}</h4>
    </div>
  </Col>

  const FeatureCard = (props) => <Col sm={12} md={12} lg={6}>
    <div className={styles.mrtFeatureCard} style={{background: props.background}}>
      <div className={styles.featureIcon}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref={`#${props.icon}`} />
        </svg>
      </div>
      <h3>{props.title}</h3>
      <h4>{props.description}</h4>
    </div>
  </Col>

  const examplesList = _.range(0, 6).map(idx => ExampleList[(idx + exampleOffset) % ExampleList.length])

  const lang = getLocale()
  return (
    <Layout>
      <article className={styles.mrtIndex}>
        <div className={styles.mrtTitle}>
          <h1 key={lang}>{formatMessage({id: 'aminer.paper.mrt'})}</h1>
          <h3><Typist key={lang} cursor={{ show: true, blink: true, element: '|', hideWhenDone: true, hideWhenDoneDelay: 500 }} startDelay={250}>
              {formatMessage({id: 'aminer.paper.mrt-subtitle'})}
          </Typist></h3>
        </div>


        <div className={styles.mrtFeatureIntroduction}>
          <h2 className={styles.mrtSectionTitle}><FM id="aminer.paper.mrt.introduction"/></h2>
          {/* <div className={styles.mrtIntroduction}>
            <p><FM id="aminer.mrt.introduction"/></p>
            <p><FM id="aminer.mrt.create"/></p>
            <a href="https://www.aminer.cn/conf/nips2019"><FM id="aminer.mrt.direct2nips2019"/></a>
          </div> */}
          <div className={styles.subTitle}><FM id="aminer.paper.mrt.introduction.whatis.q"/></div>
          <div className={styles.content}><FM id="aminer.paper.mrt.introduction.whatis.ans"/></div>
          <div className={styles.subTitle}><FM id="aminer.paper.mrt.introduction.howto.q"/></div>
          <div className={styles.content}><FM id="aminer.paper.mrt.introduction.howto.ans"/></div>
          <div className={styles.subTitle}><FM id="aminer.paper.mrt.introduction.howworks.q"/></div>
          <div className={styles.content}><FM id="aminer.paper.mrt.introduction.howworks.ans"/></div>
          <Row>
            <FeatureCard
              title={formatMessage({id: 'aminer.paper.mrt.introduction.feature.retrieving'})}
              description={formatMessage({id: 'aminer.paper.mrt.introduction.feature.retrieving.desc'})}
              background="#CDE9FF80" icon='icon-search1'/>
            <FeatureCard
              title={formatMessage({id: 'aminer.paper.mrt.introduction.feature.reading'})}
              description={formatMessage({id: 'aminer.paper.mrt.introduction.feature.reading.desc'})}
              background="#AED1FF80" icon='icon-read'/>
            <FeatureCard
              title={formatMessage({id: 'aminer.paper.mrt.introduction.feature.roadmapping'})}
              description={formatMessage({id: 'aminer.paper.mrt.introduction.feature.roadmapping.desc'})}
              background="#8EBAFF80" icon='icon-git-branch'/>
            <FeatureCard
              title={formatMessage({id: 'aminer.paper.mrt.introduction.feature.reasoning'})}
              description={formatMessage({id: 'aminer.paper.mrt.introduction.feature.reasoning.desc'})}
              background="#6FA2FF80" icon='icon-LC_icon_light_line'/>
          </Row>
          <a href="https://www.aminer.cn/conf/nips2019"><FM id="aminer.mrt.direct2nips2019"/></a>
        </div>

        <div id='example-section' className={styles.mrtRecommendation}>
          <h2 className={styles.mrtSectionTitle}><FM id="aminer.paper.mrt.examples"/></h2>
          <Row gutter={[16, 16]} type="flex">
            {examplesList.map(example => <MRTCard id={example.id} key={example.id} title={example.title} description={example.description}/>)}
          </Row>
          <div>
            <Button className={styles.mrtExampleChange} onClick={gotoNextExampleBatch} size='default'>
              <svg className="icon" aria-hidden="true" style={{marginRight: 5}}><use xlinkHref={`#icon-refresh`} /></svg>
              {formatMessage({ id: 'aminer.paper.mrt.examples.swap' })}
            </Button>
          </div>
        </div>

        <h2 className={styles.mrtSectionTitle} id="gallery"><FM id="aminer.paper.mrt.gallery"/></h2>
        <div className={styles.controlLine}>
          <SearchSorts
            sorts={['popularity', 'time', 'NeurIPS2019']}
            sortKey={{key: searchSortKey}}
            onSortChange={onSortChange}
          />
        </div>
        <Spin spinning={loading === true}>
          <PaperMRTList mrtList={mrtList}/>
          {total && <Pagination
            current={Number(page)}
            defaultCurrent={1}
            defaultPageSize={20}
            total={total}
            onChange={onPageChange}
            style={{ margin: '24px 0', textAlign: 'center'}}
          />}
        </Spin>
      <FeedbackComponent />
      </article>
    </Layout>
  )
}
export default component(
  connect(({ loading, mrt }) => ({
    loading: loading.effects[`mrt/getMrts`],
    mrtList: mrt.mrtList,
    total: mrt.total
  })),
  withRouter
)(MRTIndex);
