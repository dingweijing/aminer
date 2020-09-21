import React, { useState, useMemo, useEffect } from 'react';
import { page, connect } from 'acore';
import consts from 'consts';
import { Layout } from 'aminer/layouts';
import { logtime } from 'utils/log';
import helper from 'helper';
import { sysconfig } from 'systems';
import { FM, formatMessage } from 'locales';
import { Tabs } from 'antd';
import seohelper from 'helper/seo';
import { Spin } from 'aminer/components/ui';
import { Loading } from 'components/ui';
import { Panel } from 'aminer/ui/panel';
import { Error404 } from 'p/errors';
import { PanelAbout, PanelTags, PanelComment, SimPapers, RefPapers, CitePapers } from './c';
import PanelAuthor, { getPanelAuthorsData } from './c/PanelAuthor';
import PanelBestPaper from './c/PanelBestPaper';
import { getPubLabels, setPubStyle } from './utils';
import styles from './index2.less';

const { TabPane } = Tabs;
const { Pub_Abstract_Chop_Num } = sysconfig;

// -----------------------------------------------------
// Get Data.
// -----------------------------------------------------
const getData = async ({ dispatch, id }) => {
  if (id) {
    dispatch({ type: 'pub/getProfile', payload: { id } });
    const { paper, bestpaper, simpapers } = await dispatch({
      type: 'pub/paperBootstrap',
      payload: {
        id,
        offset: 0, // (current - 1) * Pub_SimilarPaper_Pagesize,
        size: sysconfig.Pub_SimilarPaper_Pagesize,
      },
    });
    // console.log('???????????????????? paper', paper);
    // console.log('???????????????????? bestpaper', bestpaper);
    // console.log('???????????????????? simpapers', simpapers);

    let authorsData = null;
    if (paper) {
      authorsData = await getPanelAuthorsData({ dispatch, authors: paper.authors });
    }

    return { data: paper || null, bestpaper, simpapers, authorsData };
  }
  return null;
};

// -----------------------------------------------------
// Components.
// -----------------------------------------------------
// TODO 优化，列表中已经有了一些论文信息，点击链接过来的时候，是否可以带上这些信息直接显示呢？这样就可以不闪烁了。
// Paper页面入口方式有三种:
//   1. SSR直接进入，服务端已经读取了paper数据，延时在服务端，页面出来的时候瞬出。
//   2. 后续CSR跳转，列表页跳入。论文页面会白页面，等待数据加载，然后刷新。（此处可以优化）
//   2. 其他页面跳入，没有论文的情况，只能白页面等待加载，可以给出loading，（此处不能优化）

const PublicationPage = props => {
  const { id } = helper.parseMatchesParam(props, {}, ['title', 'id']); // title
  const { dispatch, paper, transPaper, loading } = props;

  const [pub, setPub] = useState(transPaper || paper);
  const pid = pub && pub.id;
  const summary = pub; // TODO rename

  const [bestpapers, setBestpapers] = useState(props.bestpaper);
  const [simpapers, setSimpapers] = useState(props.simpapers);
  const [authorsData, setAuthorsData] = useState(props.authorsData);

  const [absMore, setAbsMore] = useState(false);

  // console.log('+++++++ refresh', id);
  // let type = 'sim'; // ???
  // state = {
  //   visible: false,
  // }

  useEffect(() => {
    // pub 一旦有值， 赶紧把model存的临时的备份清除
    if (pub && transPaper) {
      dispatch({ type: 'pub/setPaper', payload: { data: null } });
    }
  }, [pub]);

  useEffect(() => {
    if (!id || (paper && paper.id === id)) {
      return;
    }

    // before get, clean data.
    // setPub(null); // 这里不确定@gaobo
    setBestpapers(null);
    setSimpapers(null);
    setAuthorsData(null);

    // call data.
    getData({ dispatch, id }).then(data => {
      // { data, bestpaper, simpapers, authorsData }
      setPub(data.data);
      setBestpapers(data.bestpaper);
      setSimpapers(data.simpapers);
      setAuthorsData(data.authorsData);
    });
  }, [id]);

  const seoinfo = useMemo(() => {
    const title = seohelper.seoPubPageTitle(pub);
    const abs = seohelper.seoPaperAbstract(pub);
    return {
      title,
      abs,
      seoTitle: `${title && title.slice(0, 170)} ${consts.titleSuffix}`,
      seoAbs: abs && abs.slice(0, 170),
    };
  }, [pub]);

  const labels = useMemo(() => getPubLabels(pub), [pub]);

  const toggleAbstract = () => {
    setAbsMore(!absMore);
  };

  const abstractBlock = useMemo(() => {
    const abstract = seoinfo.abs;
    if (abstract) {
      return (
        <div className={styles.abstract}>
          <p className={styles.headline}>
            <FM id="aminer.paper.abstract" defaultMessage="Abstract" />
          </p>
          <div className={styles.abstractText}>
            {absMore || abstract.length <= Pub_Abstract_Chop_Num
              ? abstract
              : `${abstract.slice(0, Pub_Abstract_Chop_Num)}...`}
            {abstract.length > Pub_Abstract_Chop_Num && (
              <span className={styles.morebtn} onClick={toggleAbstract}>
                {absMore ? (
                  <FM id="aminer.common.less" defaultMessage="Less" />
                ) : (
                    <FM id="aminer.common.more" defaultMessage="More" />
                  )}
              </span>
            )}
          </div>
        </div>
      );
    }
    return false;
  }, [seoinfo.abs, absMore]);

  const onTabChange = key => {
    // type = key; // 这一行代码报错， 并且没有用
  };

  if (pub === null) {
    return <Error404 />;
  }

  return (
    <Layout
      headerSize="large" // ???
      pageTitle={seoinfo.seoTitle}
      pageDesc={seoinfo.seoAbs}
    >
      <article className={styles.article}>
        <div className={styles.loadingWrap}>
          {loading && <Loading fatherStyle={styles.loading} />}
        </div>

        <section className={styles.mainContent}>
          <h1>
            <span>{seoinfo.title}</span>
            {labels &&
              labels.length > 0 &&
              labels.map(label => (
                <span key={label} className={styles.titleLabel}>
                  {label}
                </span>
              ))}
          </h1>
          {setPubStyle(pub).includes('NeurIPS, 2019') && (
            <a className={styles.confInfo} href="https://www.aminer.cn/conf/nips2019/papers" target="_blank">
              <FM id="aminer.paper.toConfLink" defaultMessage="Click here to see all papers in nips2019" />
            </a>
          )}

          {abstractBlock}

          {summary && summary.pdf && (
            <div className={styles.fullText}>
              <p>{formatMessage({ id: 'aminer.paper.fulltext', defaultMessage: 'Full Text' })}</p>
              <iframe
                src={`//static.aminer.cn/js/reader/web/viewer.html?file=${summary.pdf}`}
                title="pdf"
                width="100%"
                height="800"
                className={styles.pdf}
                allowFullScreen
                webkitallowfullscreen="true"
              />
            </div>
          )}

          {summary && (
            <div className={styles.cardContainer}>     
              <Tabs type="card" onChange={onTabChange}>
                <TabPane tab="Similar" key="sim">
                  <SimPapers id={summary.id} data={simpapers} />
                </TabPane>
                <TabPane tab="Reference" key="ref">
                  <RefPapers id={summary.id} />
                </TabPane>
                <TabPane tab="Cited" key="cite">
                  <CitePapers id={summary.id} />
                </TabPane>
              </Tabs>
            </div>
          )}
        </section>

        <section className={styles.rightBar}>
          <PanelAbout withPanel paper={summary || {}} />

          <PanelBestPaper withPanel bestpapers={bestpapers} />

          <PanelTags withPanel pid={summary && summary.id} />

          <PanelAuthor
            withPanel
            pid={pid}
            syncPid={pid}
            authors={pub && pub.authors}
            authorsData={authorsData}
          />

          <PanelComment withPanel pid={pub && pub.id} />
        </section>
      </article>
    </Layout>
  );
};

PublicationPage.getInitialProps = async params => {
  const { store, isServer,match } = params;

  if (!isServer) {
    return;
  }

  logtime('PublicationPage.getInitialProps');

  const { id } = match.params;
  const { data, bestpaper, simpapers, authorsData } = await getData({
    dispatch: store.dispatch,
    id,
  });

  logtime('PublicationPage.getInitialProps Done');

  return { paper: data, bestpaper, simpapers, authorsData };

  // const x = store.getState();
  // console.log('===========route', route.params);
  // console.log('===========location', location);
  // console.log('===========req', req);
  // console.log('===========res', res);
  // console.log('===========match', match);
};

export default page(
  connect(({ loading, pub }) => ({
    // loading,
    loading: loading.effects['pub/paperBootstrap'],
    transPaper: pub.paper, // 外面点击论文预先传到model里的paper信息, 防止白屏太久
  })),
)(PublicationPage);

// ------------------------------------------------------------------------------------------------

// 暂时不用这个了，顺序执行的单个调用。用下面的并发获取了。下一步是合并API，改成一个api调用。
const getData2 = async ({ dispatch, id }) => {
  if (id) {
    const data = await dispatch({
      type: 'pub/searchPaperById', // TODO 暂时调用老API，将来要换成新的search.search或者其他的。
      payload: { id },
    });

    const bestpaper = await dispatch({
      type: 'pub/getBestPaper',
      payload: { ids: [id] },
    });

    const simpapers = await dispatch({
      type: 'pub/getSimPubs',
      payload: {
        // type: this.type,
        id,
        offset: 0, // (current - 1) * Pub_SimilarPaper_Pagesize,
        size: sysconfig.Pub_SimilarPaper_Pagesize,
      },
    });
    // console.log('????????????????????', data, bestpaper, simpapers);

    return { data, bestpaper, simpapers };
  }
  return null;
};
