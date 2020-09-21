import React, { useState, useMemo, useEffect } from 'react';
import { page, connect, withRouter, Link, history } from 'acore';
import { sysconfig } from 'systems';
import { isLogin } from 'utils/auth';
import { PaperMark } from 'aminer/core/search/c/widgets';
import { PaperInsight } from 'aminer/components/common';
import pubHelper from 'helper/pub';
import helper, { getLangLabel } from 'helper';
import { Loading } from 'components/ui';
import { Button } from 'antd';
import { FM, formatMessage } from 'locales';
import { useGetFollowsByID, useGetCategoriesByID, useGetPubCollections } from 'utils/hooks';
import { MarkPub, OpenModalWithAntd } from 'aminer/components/widgets';
import {
  PubMiscTagsLine,
  getPanelAuthorsData,
  PaperAuthors,
  PaperAbstract,
  PaperBasicInfoZh,
  PaperKeywords,
} from 'aminer/core/pub/c';
import { getPubLabels, setPubStyle } from 'aminer/core/pub/utils';
import styles from './PubModal.less';

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

const PubModal = props => {
  const { dispatch, loading, userinfo, pid } = props;
  const [pub, setPub] = useState();

  const [pdfInfo, setPdfInfo] = useState(props.pdfInfo);
  const [authorsData, setAuthorsData] = useState(props.authorsData);

  const is_login = isLogin(userinfo);

  useGetFollowsByID(dispatch, is_login, [{ id: pid }]);
  useGetCategoriesByID(dispatch, is_login, [{ id: pid }]);

  useEffect(() => {
    setPdfInfo(null);
    setAuthorsData(null);

    const fetchData = async () => {
      try {
        const data = await getData({ dispatch, id: pid });
        setPub(data && data.data);
        setPdfInfo(data && data.pdfInfo);
        setAuthorsData(data && data.authorsData);
      } catch (error) {
        console.error('error!!!', error);
        afterClose();
      }
    };
    fetchData();
  }, [pid]);

  // if (serverRedirect) {
  //   return null;
  // }

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

  const afterClose = () => {
    // helper.routeTo(prop/s, null, null, { removeParams: ['pid'] });
    history.replace('/user/notification');
  };

  const content = () => {
    const { title, title_zh } = pub || {};
    return (
      <article className={styles.article}>
        <section className={styles.content}>
          <div className="titleline">
            <h1 className="titleInner">
              <Link
                to={pubHelper.genPubTitle({
                  id: pub.id,
                  title: pub.title,
                })}
                target="_blank"
              >
                {pubHelper.cleanTitle(getLangLabel(title, title_zh))}
              </Link>
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

          {pub && pub.title_zh && <PaperBasicInfoZh paper={pub} />}
        </section>
      </article>
    );
  };

  if (!pub) {
    return <></>;
  }

  return (
    <OpenModalWithAntd
      title={formatMessage({ id: 'aminer.recommend.pubmodal.title' })}
      width="80vw"
      visible
      centered
      footer={null}
      content={content()}
      maskClosable={false}
      afterClose={afterClose}
      zIndex={50}
    />
  );
};

export default page(
  withRouter,
  connect(({ auth, loading, pub }) => ({
    user: auth.user,
    loading: loading.effects['pub/paperBootstrap'],
  })),
)(PubModal);
