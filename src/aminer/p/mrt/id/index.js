import React, { useState, useEffect } from 'react';
import { connect, Link, component } from 'acore';
import { Layout } from 'aminer/layouts';
import { FM, formatMessage , getLocale} from 'locales';
import { Tooltip, Button, Icon, Spin, Typography, message, Modal } from 'antd';
import helper from 'helper';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import QRCode from 'qrcode';
import styles from './index.less';
import FeedbackComponent from '../feedback/index'
import { MRT, adapters, recommenders } from 'react-mrt';
import { loadHtml2canvas } from 'utils/requirejs';

const MAXAUTHORLENGTH = 15

const { Paragraph } = Typography;
let timer = null;
const MasterReadingTree = props => {
  const { dispatch, user, loading, mrtData, mrtUserEdit } = props
  const { id } = helper.parseMatchesParam(props, {}, ['id'])
  const [userEdit, setUserEdit] = useState(null)
  const [mrtStatus, setMrtStatus] = useState(null)
  const [like, setLike] = useState(false)
  const [renderData, setRenderData] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [html2canvas, setHtml2canvas] = useState(null)

  const getPaperMRTById = () => {
    dispatch({
      type: 'mrt/getPaperMRTById',
      payload: {
        ids: [id]
      }
    })
  }

  const joinInSponsor = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'mrt/addPaperMRTSponsor',
        payload: {
          id
        }
      }).then(data => {
        message.success('支持成功');
        window.location.reload();
      })
    } else {
      dispatch({ type: 'modal/login' });
    }
  }

  const isSponsored = () => {
    if (mrtData && user && mrtData.sponsors.find(item => item === user.id)) return true;
    return false;
  }

  const isLiked = () => {
    if (mrtData && user && mrtData.likes && mrtData.likes.includes(user.id)) return true;
    return false;
  }

  const onUserEdit = (action, nodeId, value) => {
    if(mrtUserEdit) {
      let edit_data = {...mrtUserEdit};
      let edit = edit_data[nodeId];
      if(!edit) {
        edit = edit_data[nodeId] = {
          rate: 0,
          clusterId: getClusterIdById(nodeId)
        }
      }
      switch(action) {
        case "thumb-delete":
          edit.rate = 0;
          break;
        case "thumb-up":
          edit.rate = 1;
          break;
        case "thumb-down":
          edit.rate = -1;
          break;
        case "exchange":
          edit.clusterId = value;
          break;
      }
      dispatch({
        type: 'mrt/createMRTUserEdit',
        payload: {
          tree_id: id,
          edit_data
        }
      })
      dispatch({
        type: 'mrt/updateMrtUserEdit',
        payload: edit_data
      })
    }
  }

  const getClusterIdById = (nodeId) => {
    if(renderData) {
      renderData.data.blocks.forEach(block => {
        block.nodes.forEach(node => {
          if(node.id == nodeId) {
            return block.clusterIndex;
          }
        })
      })
    }
  }

  const getMRTUserEdit = () => {
    dispatch({
      type: 'mrt/getMRTUserEdit',
      payload: {
        tree_id: id,
      }
    })
  }

  const addOrCancelMRTLike = () => {
    dispatch({
      type: 'mrt/addOrCancelMRTLike',
      payload: {
        id,
        like: !like
      }
    }).then(() => {
      setLike(!like);
    })
  }

  const addMrtClickNum = () => {
    dispatch({
      type: 'mrt/addMrtClickNum',
      payload: {
        id,
      }
    })
  }

  const onHit = (paper_id, action) => {
    dispatch({
      type: 'mrt/Track',
      payload: {
        type: 'mrt/paper-hit',
        target_name: paper_id,
        target_type: action,
        payload: id
      }
    })
  }

  useEffect(() => {
    getPaperMRTById();
    getMRTUserEdit();

    loadHtml2canvas(ret => {
      setHtml2canvas({ func: ret });
    })

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    if (mrtData) {
      setLike(isLiked());
    }
  }, [mrtData])

  const transformRawData = (mrtData, mrtUserEdit) => {
    const adapter = new adapters.PaperAdapter()
    const adapterInput = {data: mrtData.tree_data, userEdits: mrtUserEdit}
    const transformedData = adapter.transform(adapterInput)
    const recommender = adapter.transformRecommender(adapterInput, 5)
    setRenderData({data: transformedData, recommender});
  }

  useEffect(() => {
    if (!mrtData) return;
    if (mrtData.tree_data) {
      // completed
      transformRawData(mrtData, mrtUserEdit);
      addMrtClickNum();
      setMrtStatus('completed');
    } else if (mrtData.status === false) {
      setMrtStatus('failed');
    } else if (mrtData.requested || mrtData.sponsors.length >= 3) {
      setMrtStatus('calculating');
    } else {
      if (isSponsored()) {
        generateQRCode();
      }
      setMrtStatus('find_sponsor');
    }
  }, [mrtData, user])

  useEffect(() => {
    if(mrtData && mrtUserEdit) transformRawData(mrtData, mrtUserEdit)
  }, [mrtUserEdit])

  const generateQRCode = () => {
    timer = setTimeout(() => {
      const qrCodeDiv = document.getElementById('qrcodeForShare');
      if (!qrCodeDiv) return;
      QRCode.toCanvas(qrCodeDiv, window.location.href, e => console.log(e));
    }, 500)
  }

  const askingForSponsor = mrtStatus === 'find_sponsor' && !isSponsored()

  const renderMrtContent = () => {
    if (!mrtStatus) return;
    if (mrtStatus === 'find_sponsor' && isSponsored()) {
      return (
        <div className={styles.mrtContent}>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div>
                <FM id="aminer.paper.mrt.findSponsor" defaultMessage='Seeking Sponsor'
                  values={{ sponsor_num: mrtData.sponsors.length }} />
              </div>
              <div className={styles.subTitle}>
                <FM id="aminer.paper.mrt.shareForSponsor" defaultMessage='Share with your friends for sponsorship.' />
              </div>
            </div>
            <svg  aria-hidden="true" className={classnames(styles.arrowBetweenStatus, styles.pcOnly)} style={{ right: '-22px' }}>
              <use xlinkHref="#icon-rightArrow" />
            </svg>
            <div className={classnames(styles.step, styles.linerGradientRight, styles.pcOnly)} style={{ right: '-232px' }}>
              <FM id="aminer.paper.mrt.calculating" defaultMessage='Calculating' />
              <div className={styles.subTitle}>
                <FM id="aminer.paper.mrt.notifySponsor" defaultMessage='Sponsors will be notified by email on completion.' />
              </div>
            </div>
          </div>
          <div className={styles.statusContent}>
            <svg  aria-hidden="true" className={styles.downArrow}>
              <use xlinkHref="#icon-downArrow" />
            </svg>
            <Paragraph copyable className={styles.shareLink}>{window.location.href}</Paragraph>
            <div className={styles.qrcodeWrap}><canvas id="qrcodeForShare" width="64" height="64" /></div>
          </div>
        </div>
      );
    } if (mrtStatus === 'calculating') {
      return (
        <div className={styles.mrtContent}>
          <div className={styles.steps}>
            <div className={classnames(styles.step, styles.linerGradientLeft, styles.pcOnly)} style={{ left: '-318px' }}>
              <div>
                <FM id="aminer.paper.mrt.findSponsor" defaultMessage='Seeking Sponsor'
                  values={{ sponsor_num: 3 }} />
              </div>
              <div className={classnames(styles.subTitle, styles.pcOnly)}>
                <FM id="aminer.paper.mrt.shareForSponsor" defaultMessage='Share with your friends for sponsorship.' />
              </div>
            </div>
            <svg  aria-hidden="true" className={classnames(styles.arrowBetweenStatus, styles.pcOnly)} style={{ left: '-108px' }}>
              <use xlinkHref="#icon-leftArrow" />
            </svg>
            <div className={styles.step}>
              <FM id="aminer.paper.mrt.calculating" defaultMessage='Calculating' />
              <div className={styles.subTitle}>
                <FM id="aminer.paper.mrt.notify" defaultMessage='Sponsors will be notified by email on completion.' />
              </div>
            </div>
            <svg  aria-hidden="true" className={classnames(styles.arrowBetweenStatus, styles.pcOnly)} style={{ right: '-104px' }}>
              <use xlinkHref="#icon-rightArrow" />
            </svg>
            <div className={classnames(styles.step, styles.linerGradientRight, styles.pcOnly)} style={{ right: '-214px' }}>
              <FM id="aminer.paper.mrt.completed" defaultMessage='Completed' />
            </div>
          </div>
        </div>
      );
    } if (mrtStatus === 'failed') {
      return (
        <div className={styles.mrtContent}>
          <div className={styles.steps}>
            <div className={classnames(styles.step, styles.linerGradientLeft, styles.pcOnly)} style={{ left: '-318px' }}>
              <div>
                <FM id="aminer.paper.mrt.calculating" defaultMessage='Calculating' />
              </div>
              <div className={classnames(styles.subTitle, styles.pcOnly)}>
                <FM id="aminer.paper.mrt.notify" defaultMessage='Sponsors will be notified by email on completion.' />
              </div>
            </div>
            <svg  aria-hidden="true" className={classnames(styles.arrowBetweenStatus, styles.pcOnly)} style={{ left: '-108px' }}>
              <use xlinkHref="#icon-rightArrow" />
            </svg>
            <div className={styles.step}>
              <FM id="aminer.paper.mrt.failed" defaultMessage='Failed' />
              <div className={styles.subTitle}>
                <FM id="aminer.paper.mrt.sorry" defaultMessage='Sorry, we cannot find enough references for this paper to calculate. Please try other publications.' />
              </div>
            </div>

          </div>

        </div>
      )
    }
  }

  const lang = getLocale().slice(0, 2)
  return (
    <Layout showHeader showFooter>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.min.css" integrity="sha256-ezkI8P4X6ooQyIcpiqtQZpWVOYRtagYu4DAHG7viflQ=" crossOrigin="anonymous" />
      <article className={styles.reportPage}>
        {mrtStatus !== 'completed' && <div className={styles.background}>
          <img className={askingForSponsor ? styles.horizontal : styles.diagonal} src="http://webplus-cn-zhangjiakou-s-5d3021e74130ed2505537ee6.oss-cn-zhangjiakou.aliyuncs.com/aminer/mrt/bg.png" />
        </div>}
        <Spin spinning={loading} size="small">
          {mrtStatus && mrtStatus !== 'completed' && !askingForSponsor && (
            <div className={styles.unCompletedMRT}>
              {mrtData && mrtData.publication && (
                <div className={styles.paperMRT}>
                  <div className={styles.paperTitle}>{mrtData.publication.title_zh || mrtData.publication.title}</div>
                  <div className={styles.authors}>
                    {mrtData.publication.authors && mrtData.publication.authors.slice(0,MAXAUTHORLENGTH).map(item => (
                      <span key={item.name} className={styles.personName}>{item.name_zh || item.name}</span>
                    ))}
                    {mrtData.publication.authors && mrtData.publication.authors.length > MAXAUTHORLENGTH && "..."}
                  </div>
                  {renderMrtContent()}
                </div>
              )}
              <div className={styles.ruleWrap}>
                <div className={styles.rules}>
                  <div><FM id="aminer.paper.mrt.rules" defaultMessage="Rules:" /></div>
                  <p><FM id="aminer.paper.mrt.rulesDetail" /></p>
                </div>
              </div>
            </div>
          )}
          { mrtStatus === 'completed' && renderData && (
            <div style={{ paddingTop: 16, backgroundColor: '#F3F3F3' }}>
              {/* { MRT graph here } */}
              {/* <MRT data={mrtData.tree_data} authors={mrtData.sponsor_list.map(item => item.name)}
                userEdits={mrtUserEdit || {}}
                onEditChange={edits => onUserEdit({ ...edits })}
                onLike={addOrCancelMRTLike}
                onHit={onHit}
                lang={lang}
                like={like}
              /> */}
              <MRT data={renderData.data} authors={mrtData.sponsor_list.map(item => item.name)}
                html2canvas={html2canvas ? html2canvas.func : undefined}
                onEdit={onUserEdit}
                shareable={true}
                likeable={true} onLike={addOrCancelMRTLike} like={like}
                lang={lang}
                onHit={onHit}
                recommender={renderData.recommender}/>
            </div>
          )}
        </Spin>
        {!loading && askingForSponsor && mrtData && mrtData.publication && (
          <div className={styles.askingForSponsor}>
            <h4>{mrtData.sponsor_list.map(sponsor => sponsor.name).join(', ')} {formatMessage({ id: 'aminer.paper.mrt.seekingPartner' }, { be: mrtData.sponsor_list.length > 1 ? 'are' : 'is' })} <span>{formatMessage({ id: 'aminer.paper.mrt' })}</span>{lang === 'en' ? ' for' : ''}</h4>
            <h1>{mrtData.publication.title_zh || mrtData.publication.title}</h1>
            <h3>
              {mrtData.publication.authors && mrtData.publication.authors.slice(0,MAXAUTHORLENGTH).map(item => item.name_zh || item.name).join(', ')}
              {mrtData.publication.authors && mrtData.publication.authors.length > MAXAUTHORLENGTH && "..."}
            </h3>
            <h4 style={{ marginTop: '2.5rem' }}>{formatMessage({ id: 'aminer.paper.mrt.seekHelp' })} <span>{formatMessage({ id: 'aminer.paper.mrt.traceOrigin' })}</span>{lang === 'zh' ? '吗？' : '?'}</h4>
            <Button className={styles.acceptBtn} onClick={joinInSponsor}>
              <FM id="aminer.paper.mrt.accept" defaultMessage="Accept" />
            </Button>
            <a onClick={() => setModalVisible(true)}><FM id="aminer.paper.mrt.learnMore" defaultMessage="Learn More" /></a>
            {/* <MRTHelperModal lang={lang} visible={modalVisible} onCancel={() => setModalVisible(false)} /> */}
          </div>
        )}
      <FeedbackComponent />
      </article>
    </Layout>
  )
};

export default component(
  connect(({ auth, loading, mrt }) => ({
    user: auth.user,
    loading: loading.effects['mrt/getPaperMRTById'],
    mrtData: mrt.mrtData,
    mrtUserEdit: mrt.mrtUserEdit,
  }))
)(MasterReadingTree);
