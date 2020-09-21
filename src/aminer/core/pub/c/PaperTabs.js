import React, { useState, useMemo } from 'react';
import { component, connect } from 'acore';
import { Tabs, Button } from 'antd';
import { FM, formatMessage } from 'locales';
import { isLogin } from 'utils/auth';
import { parseUrlParam } from 'helper';
import { UploadFile, UploadPpt } from 'aminer/core/pub/widgets';
import { SimPapers, RefPapers, CitePapers, UploadAndEditPdf } from './index';
import { PaperAnalysis } from 'aminer/components/common';
import styles from './PaperTabs.less';

const PaperTabs = props => {
  const { paper, simpapers, user, token, dispatch, pdfInfo, setNewPPT } = props;
  const [newPdf, setNewPdf] = useState('');
  const [tabKey, setTabKey] = useState('');

  const setNewPdfs = (file) => {
    setNewPdf(file);
  }

  const showUploadModal = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({ id: 'aminer.paper.upload', defaultMessage: 'Upload' }),
          content: <UploadFile setNewPdfs={setNewPdfs} pid={paper.id} token={token} />
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const onChangTab = (key) => { setTabKey(key) };

  const showUploadPPtModal = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: <>{formatMessage({ id: 'aminer.paper.upload', defaultMessage: 'Upload' })} PPT</>,
          content: <UploadPpt setNewPPT={setNewPPT} pid={paper.id} token={token} />,
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const initTabConfig = {
    analysis: {
      key: <FM id="aminer.paper.insight" defaultMessage="Insight" />,
      content: () => <PaperAnalysis pdfInfo={pdfInfo} />
    },
    pdf: {
      key: paper.pdf ? <FM id='aminer.paper.fulltext' defaultMessage='Full Text' /> :
        <span><FM id='aminer.paper.fulltext' defaultMessage='Full Text' /> (<FM id="aminer.paper.upload" />PDF)</span>,
      show: true, content: () => {
        const fpdf = newPdf || paper && paper.pdf;
        return (
          <>
            {fpdf && (
              <div className={styles.fullText} >
                <iframe
                  src={`//static.aminer.cn/js/reader/web/viewer.html?file=${fpdf}`}
                  title="pdf"
                  width="100%"
                  height="800"
                  className={styles.pdf}
                  allowFullScreen
                  webkitallowfullscreen="true"
                />
              </div >)}
            {!fpdf && (
              <Button className={styles.uploadBtn} onClick={showUploadModal}>
                <i className="fa fa-cloud-upload" />
                <FM id="aminer.paper.upload" defaultMessage="Upload" />PDF
              </Button>
            )}
          </>
        )
      }
    },
    ppt: {
      key: paper.ppt ? 'PPT' :
        <span>PPT (<FM id="aminer.paper.upload" />PPT)</span>,
      show: true, content: () => {
        const fppt = paper && paper.ppt;
        const fileType = fppt && fppt.split('.') && fppt.split('.').pop();
        const srcType = fileType === 'pdf' ? `//static.aminer.cn/js/reader/web/viewer.html?file=${fppt}` :
        `https://view.officeapps.live.com/op/view.aspx?src=${fppt}`
        return (
          <>
            {fppt && (
              <div className={styles.fullText} >
                <iframe
                  src={srcType}
                  title="pdf"
                  width="100%"
                  height="800"
                  className={styles.pdf}
                  allowFullScreen
                  webkitallowfullscreen="true"
                />
              </div >)}
            {!fppt && (
              <Button className={styles.uploadBtn} onClick={showUploadPPtModal}>
                <i className="fa fa-cloud-upload" />
                <FM id="aminer.paper.upload" defaultMessage="Upload" />PPT
              </Button>
            )}
          </>
        )
      }
    },
    sim: {
      key: <FM id="aminer.paper.Similar" defaultMessage="Similar" />,
      content: () => <SimPapers id={paper.id} data={simpapers} />
    },
    ref: {
      key: <FM id="aminer.paper.Reference" defaultMessage="Reference" />,
      content: () => <RefPapers id={paper.id} />
    },
    cite: {
      key: <FM id="aminer.paper.CitedPaper" defaultMessage="Cited" />,
      content: () => <CitePapers id={paper.id} />
    },
  }

  const tabConfig = useMemo(() => {
    initTabConfig.ref.show = !!paper.total_ref;
    initTabConfig.cite.show = !!paper.cited_pubs;
    initTabConfig.sim.show = !!(paper.total_sim || paper.total_ref);
    initTabConfig.analysis.show = !!(pdfInfo.url && pdfInfo.headline);
    let keyArr = [
      pdfInfo.url && pdfInfo.headline ? 'analysis' : '',
      paper && paper.pdf || newPdf ? 'pdf' : '',
      paper.total_sim || paper.total_ref ? 'sim' : '',
      paper.total_ref ? 'ref' : '',
      paper.cited_pubs ? 'cite' : ''
    ];
    const newKey = keyArr.find(n => n !== 'pdf' && n) || 'pdf';
    setTabKey(newKey);
    return initTabConfig;
  }, [paper, pdfInfo, newPdf])
  return (
    <div className={styles.paperTabs}>
      <div className={styles.tabHead}>
        <Tabs activeKey={tabKey} onChange={onChangTab} animated={false}>
          {Object.keys(tabConfig).map(n => {
            return tabConfig[n]['show'] && (
              <Tabs.TabPane key={n} tab={tabConfig[n]['key']}>
                {tabConfig[n] && tabConfig[n].content()}
              </Tabs.TabPane>
            )
          })}
        </Tabs>
        <UploadAndEditPdf setNewPPT={setNewPPT} setNewPdfs={setNewPdfs} paper={paper} />
      </div>
    </div>
  )
}

export default component(connect(({ auth }) => ({
  user: auth.user,
  token: auth.token,
})))(PaperTabs)

{/* <Tabs.TabPane tab="Pdf" key="pdf" >
          {paper && paper.pdf && (
            <div className={styles.fullText} >
              <p>{formatMessage({ id: 'aminer.paper.fulltext', defaultMessage: 'Full Text' })}</p>
              <iframe
                src={`//static.aminer.cn/js/reader/web/viewer.html?file=${paper.pdf}`}
                title="pdf"
                width="100%"
                height="800"
                className={styles.pdf}
                allowFullScreen
                webkitallowfullscreen="true"
              />
            </div >
          )}
          {paper && !paper.pdf && isLogin(user) && (
            <Button className={styles.uploadBtn} onClick={showUploadModal}>
              <i className="fa fa-cloud-upload" />
              <FM id="aminer.paper.upload" defaultMessage="Upload" />
            </Button>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Similar" key="sim">
          <SimPapers id={paper.id} data={simpapers} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Reference" key="ref">
          <RefPapers id={paper.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cited" key="cite">
          <CitePapers id={paper.id} />
        </Tabs.TabPane> */}
