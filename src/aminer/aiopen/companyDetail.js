import React, { useEffect, useState, useMemo } from 'react';
import { page, connect, router } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import consts from 'consts';

import { Select, Skeleton, Pagination, Row, Col, Icon, Spin } from 'antd'
import { Layout, EmptyLayout } from 'aminer/layouts';
import Header from './components/Header'
import { Text, Paragraph } from './components/Text'
import PersonCard from './components/PersonCard'
import Footer from './components/Footer'
import Panel from './components/Panel'
import styles from './index.less';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Home = props => {
  const { location: { pathname, query }, dispatch, aiopenCompany: { detail, loading } } = props
  const { business = [], com = {}, news } = detail
  const { name_zh, start_time, industry, business_scope, members } = com

  const fetchDetail = () => {
    const { com_id } = query
    if (com_id) {
      dispatch({
        type: 'aiopenCompany/getCompanyDetail',
        payload: { com_id }
      })
    }
  }

  console.log('detail', detail)

  useEffect(() => {
    fetchDetail()
  }, [])

  const goBack = () => {
    router.push('/industry');
  }

  return (
    <EmptyLayout
      pageTitle="AI OPEN INDEX"
      pageSubTitle="AI 2000"
      {...props}
    >
      <Header type="company" isIndex={false} defaultMenuIndex={100} />
      <Spin spinning={loading} indicator={antIcon}>
        <div className={styles.companyDetail}>
          <div className="icon-wrapper" onClick={() => { goBack() }}>
            <Icon type="left" className="goBack" ></Icon>
            返回列表页
          </div>
          <Panel>
            <h2>{name_zh}</h2>
            <Row>
              <Text label="成立时间" value={start_time}></Text>
              <Text label="行   业" value={industry}></Text>
            </Row>
            <Row>
              <Paragraph label="公司简介" value={business_scope} />
              <Paragraph label="经营范围" value={business_scope} />
            </Row>
          </Panel>

          {members && <Panel title="核心团队" className="teamWrapper">
            {members.map(mems => (<PersonCard {...mems} />))}
          </Panel>}
          {business && <Panel title="核心业务" className="businessWrapper">
            {business.map(bus => (<div className="businessInner">
              <Text label="名      称" value={bus.name}></Text>
              <Text label="产品标签" value={bus.tag}></Text>
              <Text label="介      绍" value={bus.introduction}></Text>
            </div>))}
          </Panel>}
          {news && <Panel title="新闻舆情" className="newsWrapper">
            {news.map(n => (<div className="newsInner" >
              <a href={n.url} target="_blank">{n.title}</a>
              <Text label="来源" value={n.source}></Text>
              {n.time && n.time.includes('T') && <Text label="时间" value={n.time.split('T')[0]}></Text>}
            </div>))}
          </Panel>}


        </div>
      </Spin>
      <Footer />
    </EmptyLayout>
  )
};


/* eslint-disable consistent-return */
/* Home.getInitialProps = async ({store, route, isServer}) => {
  // console.log('--------store', global);
  if (!isServer) return;
  await store.dispatch({type: 'aminerCommon/getHomeData', payload: {size: 5 } })
  const {report, aminerCommon} = store.getState();
  return {report, aminerCommon};
    }; */
export default connect(({ aiopenCompany, modal }) => ({ aiopenCompany, modal }))(page()(Home));
