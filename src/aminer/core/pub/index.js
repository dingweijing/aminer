import React, { useState, useMemo, useEffect } from 'react';
import { page, connect, Link } from 'acore';
import consts from 'consts';
import { Layout } from 'aminer/layouts';
import { logtime } from 'utils/log';
import helper from 'helper';
import { wget } from 'utils/request-umi-request';
import { sysconfig } from 'systems';
import { isLogin } from 'utils/auth';
import { PaperMark } from 'aminer/core/search/c/widgets';
import { PaperInsight } from 'aminer/components/common';
import seohelper from 'helper/seo';
import pubHelper from 'helper/pub';
import { Loading } from 'components/ui';
import { Button } from 'antd';
import { FM } from 'locales';
import { useGetFollowsByID, useGetCategoriesByID, useGetPubCollections } from 'utils/hooks';
import { MarkPub } from 'aminer/components/widgets';
import { setUserTrack } from 'utils/aminer-common';
import {
  PubMiscTagsLine,
  PaperFlags,
  PanelBestPaper,
  PanelComment,
  getPanelAuthorsData,
  PaperAuthors,
  PaperAbstract,
  PaperBasicInfoZh,
  PaperTabs,
  PanelTags,
  PanelAbout2,
  PaperCodeData,
  PaperKeywords,
  PaperFigures,
} from './c';
import { getPubLabels, setPubStyle } from './utils';
import styles from './index.less';

const { Pub_SimilarPaper_Pagesize } = sysconfig;

// -----------------------------------------------------
// Get Data Asynchronized.
// -----------------------------------------------------
const getData = async ({ dispatch, id }) => {
  if (id) {
    // dispatch({ type: 'pub/getProfile', payload: { id } });
    // all in one effect call.
    const { paper, bestpaper, simpapers, redirect_id, notfound, pdfInfo } = await dispatch({
      type: 'pub/paperBootstrap',
      payload: {
        id,
        include: ['bp'],
        offset: 0,
        size: Pub_SimilarPaper_Pagesize,
      },
    });
    let authorsData = null;
    if (paper) {
      authorsData = await getPanelAuthorsData({ dispatch, authors: paper.authors });
    }

    return {
      data: paper || null,
      bestpaper,
      simpapers,
      authorsData,
      redirect_id,
      notfound,
      pdfInfo: pdfInfo || {},
    };
  }
  return null;
};

// -----------------------------------------------------
// Components.
// -----------------------------------------------------
// Note 优化，列表中已经有了一些论文信息，点击链接过来的时候，是否可以带上这些信息直接显示呢？这样就可以不闪烁了。
// Paper页面入口方式有三种:
//   1. SSR直接进入，服务端已经读取了paper数据，延时在服务端，页面出来的时候瞬出。
//   2. 后续CSR跳转，列表页跳入。论文页面会白页面，等待数据加载，然后刷新。（此处可以优化）
//   2. 其他页面跳入，没有论文的情况，只能白页面等待加载，可以给出loading，（此处不能优化）

const PublicationPage = props => {
  // ! refactor line =-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const { id } = helper.parseMatchesParam(props, {}, ['title', 'id']); // title
  const { conf } = helper.parseUrlParam(props, {}, ['conf']);
  const { dispatch, paper, transPaper, loading, user } = props;
  const [pub, setPub] = useState(transPaper || paper);
  // const pid = pub && pub.id;

  const [bestpapers, setBestpapers] = useState(props.bestpaper);
  const [pdfInfo, setPdfInfo] = useState(props.pdfInfo);
  const [authorsData, setAuthorsData] = useState(props.authorsData);
  const [redirect_id, setRedirectId] = useState(props.redirect_id);
  const [notfound, setNotFound] = useState(props.notfound);

  // const [confPubIds, seConfPubIds] = useState();
  const is_login = isLogin(user);

  useGetFollowsByID(dispatch, is_login, [{ id }]);
  useGetCategoriesByID(dispatch, is_login, [{ id }]);

  // TODO  simpapers要全部删掉

  useEffect(() => {
    // pub 一旦有值， 赶紧把model存的临时的备份清除
    if (pub && transPaper) {
      dispatch({ type: 'pub/setPaper', payload: { data: null } });
    }
  }, [pub]);

  useEffect(() => {
    const payload = { id };
    setUserTrack(dispatch, {
      type: 'aminer.pub',
      target_type: 'detail',
      payload: JSON.stringify(payload),
    });
  }, [id]);

  useEffect(() => {
    // 读取iclr 2020
    // if (!confPubIds) {
    //   wget(`${consts.ResourcePath}/sys/aminer/pubs/confPubIds.json`)
    //     .then(items => {
    //       seConfPubIds(items);
    //     })
    // }
    if (!id || (paper && paper.id === id)) {
      return;
    }
    // setPub(null); // 这里不确定@gaobo
    setBestpapers(null);
    setPdfInfo(null);
    setAuthorsData(null);
    // call data.
    // dispatch({
    //   type: 'pub/getPDFInfoByPIDs',
    //   payload: { ids: [id] }
    // })
    getData({ dispatch, id }).then(data => {
      setPub(data.data);
      setBestpapers(data.bestpaper);
      setPdfInfo(data.pdfInfo);
      setAuthorsData(data.authorsData);
      setRedirectId(data.redirect_id);
      setNotFound(data.notfound);
    });
  }, [id]);

  let serverRedirect = false;
  if (redirect_id) {
    if (consts.IsServerRender()) {
      const newURL = helper.getRouteToUrl(props, null, { id: redirect_id });
      serverRedirect = encodeURI(newURL.pathname);
      throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${serverRedirect}"}`);
    } else {
      serverRedirect = true;
      helper.routeToReplace(
        props,
        null,
        { id: redirect_id },
        {
          transferPath: [{ from: '/pub/:id/:title', to: '/pub/:id/:title' }],
        },
      );
    }
  }
  if (notfound) {
    return "The paper doesn't exist";
  }

  // if (serverRedirect) {
  //   return null;
  // }

  const seoinfo = useMemo(() => {
    const title = seohelper.seoPubPageTitle(pub);
    const abs = seohelper.seoPaperAbstract(pub);
    const keywords = seohelper.seoPaperKeywords(pub);
    return {
      title,
      abs,
      keywords,
      seoTitle: `${title && title.slice(0, 170)} ${consts.titleSuffix}`,
      seoAbs: abs && abs.slice(0, 170),
    };
  }, [pub]);

  const labels = useMemo(() => getPubLabels(pub), [pub]);

  const showPdf = () => {
    if (pub && pub.pdf) {
      window.open(pub.pdf);
    }
  };

  const showPpt = () => {
    if (pub && pub.ppt) {
      window.open(pub.ppt);
    }
  };

  const venueInfo = setPubStyle(pub);

  const setNewPPT = ppt => {
    setPub({ ...pub, ppt });
  };

  const afterUpdatePub = resources => {
    setPub({ ...pub, resources });
  };

  return (
    <Layout
      headerSize="large" // ???
      showSearch
      pageTitle={seoinfo.seoTitle}
      pageDesc={seoinfo.seoAbs}
      pageKeywords={seoinfo.keywords}
    >
      <article className={styles.article}>
        {/* Loading 出现和小时的时候，不应该使页面跳动，也不应该占用页面内容 */}

        <div className={styles.loadingWrap}>
          {loading && <Loading fatherStyle={styles.loading} />}
        </div>

        {/* <PubBreadcrumb className={styles.pbc} /> */}

        <section className={styles.content}>
          <div className="titleline">
            <h1 className="titleInner">
              <span className="text">{seoinfo.title}</span>
              <div className="btnWrap">
                {pub && pub.pdf && (
                  <Button onClick={showPdf} className="downloadBtn">
                    {/* <i className="fa fa-file-pdf-o" /> */}
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-pdf" />
                    </svg>
                    <FM id="aminer.paper.fulltext" defaultMessage="Full Text " />
                  </Button>
                )}
                {pub && pub.ppt && (
                  <Button onClick={showPpt} className="downloadBtn">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-ppt" />
                    </svg>
                    PPT
                  </Button>
                )}
              </div>
            </h1>
            <div className="rightconner desktop_device">
              {pub && <MarkPub paper={pub} size="small" />}
            </div>
          </div>

          <PaperAuthors authorsData={authorsData} /* authors={pub && pub.authors} */ />

          {venueInfo && <p className={styles.confInfo}>{venueInfo}</p>}

          {venueInfo.includes('NeurIPS') && venueInfo.includes('2019') && (
            <div className={styles.confInfo}>
              <a href="https://www.aminer.cn/conf/nips2019/papers" target="_blank">
                <FM id="aminer.paper.toConfLink" values={{ name: 'nips2019' }} />
              </a>
            </div>
          )}
          {/* confPubIds */}
          {pub && conf && (
            <div className={styles.confInfo}>
              <Link to={`/conf/${conf}/homepage?from=pub`} target="_blank">
                <FM id="aminer.paper.toConfLink" values={{ name: ` ${conf} ` }} />
              </Link>
            </div>
          )}

          {pub && (
            <div className="tagLine">
              <PubMiscTagsLine paper={pub} />
              {labels && labels.length > 0 && (
                <div>
                  {labels.map(label => (
                    <span key={label} className="label">
                      {label}{' '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <PaperKeywords list={(pub && pub.keywords) || (pdfInfo && pdfInfo.keywords)} />

          {pdfInfo && pdfInfo.headline && <PaperInsight text={pdfInfo.headline} />}

          <PaperAbstract
            lang="en"
            abstract={
              pubHelper.getPaperAbstract(pub) ||
              (pdfInfo && pdfInfo.metadata && pdfInfo.metadata.abstract)
            }
          />

          {pub && (
            <PaperCodeData afterUpdatePub={afterUpdatePub} resources={pub.resources} id={pub.id} />
          )}

          <PaperFigures pid={pub && pub.id} data={pdfInfo && pdfInfo.metadata} />

          {pub && pub.title_zh && <PaperBasicInfoZh paper={pub} />}

          {/* {pub && <PaperInfluentialCite id={pid} />} */}
          {pub && pdfInfo && <PaperTabs setNewPPT={setNewPPT} paper={pub} pdfInfo={pdfInfo} />}
        </section>

        <section className={styles.rightBar}>
          <PanelAbout2 paper={pub} />

          <PanelBestPaper withPanel bestpapers={bestpapers} />

          <PanelTags withPanel pid={pub && pub.id} />

          <PanelComment withPanel pid={pub && pub.id} />
        </section>
      </article>
    </Layout>
  );
};

PublicationPage.getInitialProps = async params => {
  const { store, route, isServer } = params;
  if (!isServer) {
    return;
  }

  logtime('PublicationPage.getInitialProps');
  const { id } = route.params;
  const { data, bestpaper, simpapers, authorsData, redirect_id, notfound, pdfInfo } = await getData(
    {
      dispatch: store.dispatch,
      id,
    },
  );
  logtime('PublicationPage.getInitialProps Done');
  // eslint-disable-next-line consistent-return
  return { paper: data, bestpaper, simpapers, authorsData, redirect_id, notfound, pdfInfo };
};

export default page(
  connect(({ auth, loading, pub }) => ({
    user: auth.user,
    loading: loading.effects['pub/paperBootstrap'],
    transPaper: pub.paper, // 外面点击论文预先传到model里的paper信息, 防止白屏太久
  })),
)(PublicationPage);
