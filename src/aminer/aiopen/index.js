import React, { useEffect, useState, useMemo } from 'react';
import { page } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import consts from 'consts';
import { Layout, EmptyLayout } from 'aminer/layouts';
import TabPageScroll from 'components/ui/TabPageScroll'
import Header from './components/Header'
import Footer from './components/Footer'
import { Rank, List, IndexPage } from './containers'
import styles from './index.less';

const pageIndex_headerOption_Map = {
  0: 'index',
  1: 'open'
}

const pathname_component_Map = {
  '/': <IndexPage />,
  '/list': <List />,
  '/rank': <Rank />,
}

const Home = props => {
  const { location: { pathname } } = props
  const [showIndex, setIndex] = useState(0)
  const onMenuClick = idx => {
    setIndex(idx)
  }

  const currentPage = useMemo(() => pathname_component_Map[pathname], [pathname])

  return (
    <EmptyLayout
      className={styles.aiopenWrapper}
      pageTitle="AI OPEN INDEX"
      pageSubTitle="AI 2000"
      {...props}
    >
      <Header onMenuClick={onMenuClick} type={pageIndex_headerOption_Map[showIndex]} />
      <TabPageScroll className={styles.article} nextIndex={showIndex}>
        {currentPage}
        {/*  <Rank />
        <div className="tabpage">222222</div>
        <div className="tabpage">3333</div> */}
      </TabPageScroll>
      <Footer />
    </EmptyLayout>
  )
};


/* eslint-disable consistent-return */
/* Home.getInitialProps = async ({ store, route, isServer }) => {
  // console.log('--------store', global);
  if (!isServer) return;
  await store.dispatch({ type: 'aminerCommon/getHomeData', payload: { size: 5 } })
  const { report, aminerCommon } = store.getState();
  return { report, aminerCommon };
}; */

export default page()(Home);
