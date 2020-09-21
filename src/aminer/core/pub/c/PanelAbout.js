import React, { Fragment, useState, useEffect } from 'react';
import { connect, component, history } from 'acore';
import { formatMessage, FM } from 'locales';
import { Panel } from 'aminer/ui/panel';
import PropTypes from 'prop-types';
import { NE } from 'utils/compare';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { Button, Rate, Radio } from 'antd';
import { Bibtex, UploadFile } from 'aminer/core/pub/widgets';
import { setPubStyle } from '../utils'
import styles from './PanelAbout.less';

const getRatingData = async ({ dispatch, id }) => {
  const data = await dispatch({ type: 'pub/getRating', payload: { id } })
  return data || {};
}

const getUserRatingData = async ({ dispatch, id }) => {
  const data = await dispatch({ type: 'pub/getUserRating', payload: { id } })
  return data || {};
}

const MRT_MIN_REQUIRED_REF_SIZE = 10;
const getRefPubs = async ({ dispatch, id }) => {
  const data = await dispatch({
    type: 'pub/getRefPubs',
    payload: { id, offset: 0, size: MRT_MIN_REQUIRED_REF_SIZE }
  })
  return data || {};
}

const DataSourceModal = props => {
  // 创建MRT之前先选择数据源
  const { paper, dispatch, loading } = props;
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  const [dataSource, setDataSource] = useState('default');

  const createMRT = () => {
    dispatch({
      type: 'mrt/createPaperMRT',
      payload: {
        publication_id: paper.id,
        data_source: dataSource,
      }
    }).then(({ id }) => {
      if (id) {
        history.push(`/mrt/${id}`);
      }
    })
  }

  return (
    <div className={styles.dataSourceModal}>
      <Radio.Group onChange={e => setDataSource(e.target.value)} defaultValue="default">
        <Radio style={radioStyle} value="default">
          Default
        </Radio>
        <Radio style={radioStyle} value="aminer">
          AMiner
        </Radio>
      </Radio.Group>
      <div className={styles.btnLine}>
        <Button
          onClick={() => dispatch({ type: 'modal/close' })}
          className={styles.btn} >取消</Button>
        <Button onClick={createMRT} type="primary" className={styles.btn} loading={loading}>确认</Button>
      </div>
    </div>
  )
}

const PanelAbout = props => {
  const { subStyle = 'normal', paper, dispatch, user, token, withPanel, mrtList, loading } = props;
  const [userRating, setUserRating] = useState(0);
  const [rating, setRating] = useState(null);
  const [is_starring, setIs_starring] = useState(false);
  const [genMRTAvailable, setGenMRTAvailable] = useState(false);

  let unmounted = false;

  useEffect(() => {
    getRates();
    getMrtByPaperIDs();
    setMRTAvlbByGetRefPubs();
    return () => {
      unmounted = true;
      dispatch({ type: 'mrt/reset' })
    }
  }, [paper]);

  const getRates = () => {
    if (paper.is_starring) {
      setIs_starring(true);
    }
    getRating();
    if (isLogin(user)) {
      getUserRating();
    }
  }

  const getRating = () => {
    getRatingData({ dispatch, id: paper.id })
      .then(data => {
        if (!unmounted) {
          setRating(data);
        }
      })
  }

  const getUserRating = () => {
    getUserRatingData({ dispatch, id: paper.id })
      .then(({ data, status }) => {
        if (status && !unmounted) {
          setUserRating(data.count)
        }
      })
  }

  const getMrtByPaperIDs = () => {
    if (paper && paper.id) {
      dispatch({
        type: 'mrt/getMrtByPaperIDs',
        payload: {
          ids: [paper.id]
        }
      })
    }
  }

  const saveRate = value => {
    let rating = value;
    if (value === 0) {
      rating = userRating
    }
    if (isLogin(user)) {
      dispatch({
        type: 'pub/saveRating',
        payload: {
          id: paper.id,
          body: { id: paper.id, rate: `${rating}` }
        }
      })
        .then(({ status }) => {
          if (status && !unmounted) {
            getRating();
            setUserRating(rating);
          }
        })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const showUploadModal = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({ id: 'aminer.paper.upload', defaultMessage: 'Upload' }),
          content: <UploadFile pid={paper.id} token={token} />
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const onBibtex = id => {
    // dispatch({ type: 'aminerSearch/bibtex', payload: { id } })
    //   .then(({ status, data }) => {
    //     if (status && !unmounted) {
    //       dispatch({
    //         type: 'modal/open',
    //         payload: {
    //           title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
    //           content: <Bibtex bibtex={data} />
    //         }
    //       })
    //     }
    //   })
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
        content: <Bibtex id={id} />
      }
    })
  }

  const paperMark = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'searchpaper/paperMark',
        payload: {
          id: paper.id,
        }
      }).then(({ success }) => {
        if (success && !unmounted) {
          setIs_starring(!is_starring);
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const paperUnMark = () => {
    dispatch({
      type: 'searchpaper/paperUnMark',
      payload: {
        id: paper.id,
      }
    })
      .then(({ data, success }) => {
        if (success && !unmounted) {
          setIs_starring(!is_starring)
        }
      })
  }

  const showPdf = () => {
    if (paper && paper.pdf) {
      window.open(paper.pdf)
    }
  }

  const downloadPDF = () => {
    if (paper && paper.pdf) {
      window.location.href = paper.pdf;
    }
  }

  const gotoMRT = () => {
    if (mrtList && mrtList[0].id) {
      history.push(`/mrt/${mrtList[0].id}`);
    }
  }

  const chooseDataSource = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({ id: 'aminer.paper.mrt.dataSource', defaultMessage: 'Please choose a data source.' }),
          content: <DataSourceModal dispatch={dispatch} loading={loading} paper={paper} />
        }
      })
    } else { dispatch({ type: 'modal/login' }) }
  }

  const setMRTAvlbByGetRefPubs = () => {
    // 如果论文的引用数据缺失则不显示 生成MRT 按钮
    getRefPubs({ dispatch, id: paper.id })
      .then(({ data, status }) => {
        if (status && data.length >= MRT_MIN_REQUIRED_REF_SIZE) {
          setGenMRTAvailable(true)
        }
      })
  }

  const content = () => (
    <div className={styles.content}>
      {subStyle === 'tiny' && (
        <div className={styles.oprs}>
          <span className={classnames(styles.cited, { [styles.zero]: paper.num_citation === 0 })}>
            <FM id="aminer.paper.cited" defaultMessage="Cited by" />
            <FM id="aminer.common.colon" defaultMessage=": " />&nbsp;
                <strong>{paper.num_citation || 0}</strong>
          </span>
          <span className={styles.split}>|</span>
          <span className={styles.views}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-eye" />
            </svg>
            {paper.num_viewed || 0}
          </span>
        </div>
      )}
      {subStyle === 'normal' && (
        <Fragment>
          <div className={styles.btns}>
            {!is_starring && (
              <div className={classnames(styles.btn, styles.mark)}>
                <Button onClick={paperMark}><i className="fa fa-bookmark" /> Mark</Button>
              </div>
            )}
            {is_starring && (
              <div className={classnames(styles.btn, styles.marked)}>
                <Button className={styles.mark}><i className="fa fa-check" /> Marked</Button>
                <Button className={styles.unmark} onClick={paperUnMark}><i className="fa fa-bookmark" /> UnMark</Button>
              </div>
            )}
            {paper && paper.pdf && (
              <div className={classnames(styles.btn)}>
                <Button onClick={showUploadModal}>
                  <i className="fa fa-cloud-upload" />
                  <span>{`${formatMessage({ id: 'aminer.paper.update', defaultMessage: 'Change' })} PDF`}</span>
                  {/* <FM id="" defaultMessage="Change" /> */}
                </Button>
              </div>
            )}
            {paper && !paper.pdf && isLogin(user) && (
              <div className={classnames(styles.btn)}>
                <Button onClick={showUploadModal}>
                  <i className="fa fa-cloud-upload" />
                  <FM id="aminer.paper.upload" defaultMessage="Upload" />
                </Button>
              </div>
            )}
            {paper && paper.pdf && (
              <div className={classnames(styles.btn)}>
                <Button onClick={showPdf}>
                  <i className="fa fa-eye" />
                  <FM id="aminer.paper.preview" defaultMessage="Preview" />
                </Button>
              </div>
            )}
          </div>

          <div className={styles.btns}>
            {mrtList && !!mrtList.length ? (
              <div className={classnames(styles.btn)}>
                <Button onClick={gotoMRT}>
                  <i className="fa fa-tree" />
                  <FM id="aminer.paper.mrt.goto" defaultMessage="Go To MRT" />
                </Button>
              </div>
            ) : (
                <div hidden={!genMRTAvailable} className={classnames(styles.btn)}>
                  <Button onClick={chooseDataSource}>
                    <i className="fa fa-tree" />
                    <FM id="aminer.paper.mrt.generate" defaultMessage="Generate MRT" />
                  </Button>
                </div>
              )}
          </div>


          <div className={styles.rating}>
            <div>
              <p className={styles.rateLine}>
                {/* <FM id='aminer.paper.availiable' defaultMessage='No rating availiable' /> */}
                {!rating && <span>&nbsp;</span>}

                {rating && rating.cnt === 0 && (
                  <FM id="aminer.paper.rating.none" defaultMessage="No Ratings" />
                )}

                {rating && rating.cnt !== 0 && (
                  <>
                    {`${formatMessage({ id: 'aminer.paper.ratings', defaultMessage: 'Ratings' })} : `}
                    {(rating && rating.rate) || 0}/5 from {(rating && rating.cnt) || 0} users
                      </>
                )}

              </p>

              <div className={styles.userRate}>
                <span>{`${formatMessage({ id: 'aminer.paper.rating', defaultMessage: 'Your Rating' })} :`}</span>
                <Rate value={userRating} onChange={saveRate} />
              </div>
            </div>

            {rating && rating.cnt !== 0 && (
              <div className={styles.score}>
                {rating && (
                  <span className={styles.rate}>{rating.rate || 0}</span>
                )}
                {/* <i className='fa fa-star' style={{color: '#FFAE00'}}>
                      <span>{rating.rate || 0}</span>
                    </i> */}
              </div>
            )}


          </div>
          <p className={styles.confInfo}>{setPubStyle(paper)}</p>
          <div className={styles.oprs}>
            <span className={classnames(styles.cited, { [styles.zero]: paper.num_citation === 0 })}>
              <FM id="aminer.paper.cited" defaultMessage="Cited by" />
              <FM id="aminer.common.colon" defaultMessage=": " />
              <strong>{paper.num_citation || 0}</strong>
            </span>
            <span className={styles.split}>|</span>
            <span className={styles.bibtex} onClick={onBibtex.bind(this, paper.id)}>
              <FM id="aminer.paper.bibtex" defaultMessage="Bibtex" />
            </span>
            <span className={styles.split}>|</span>
            <span className={styles.views}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-eye" />
              </svg>
              {paper.num_viewed || 0}
            </span>
          </div>
        </Fragment>
      )}
    </div>
  )

  if (withPanel) {
    return (
      <Panel
        title={formatMessage({ id: 'aminer.paper.about', defaultMessage: 'About' })}
        className={styles.x}
        subContent={content}
      />
    )
  }
  return content()
}

export default component(connect(({ auth, mrt, loading }) => ({
  user: auth.user,
  token: auth.token,
  mrtList: mrt.mrtList,
  loading: loading.effects['mrt/createPaperMRT']
})))(PanelAbout)
