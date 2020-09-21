import React, { useState, useEffect } from 'react';
import { connect, component, history } from 'acore';
import { formatMessage, FM } from 'locales';
import { Panel } from 'aminer/ui/panel';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { Button, Rate, Radio } from 'antd';
import consts from 'consts';
import styles from './PanelAbout2.less';

const getRatingData = async ({ dispatch, id }) => {
  const data = await dispatch({ type: 'pub/getRating', payload: { id } })
  return data || {};
}

const getUserRatingData = async ({ dispatch, id }) => {
  const data = await dispatch({ type: 'pub/getUserRating', payload: { id } })
  return data || {};
}

const MRT_MIN_REQUIRED_REF_SIZE = 10;
// const getRefPubs = async ({ dispatch, id }) => {
//   const data = await dispatch({
//     type: 'pub/getRefPubs',
//     payload: { id, offset: 0, size: MRT_MIN_REQUIRED_REF_SIZE }
//   })
//   return data || {};
// }

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
        dispatch({ type: 'modal/close' });
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

const PanelAbout2 = props => {
  const { paper, dispatch, user, token, mrtList, loading } = props;
  const [userRating, setUserRating] = useState(0);
  const [rating, setRating] = useState(null);
  const [genMRTAvailable, setGenMRTAvailable] = useState(false);

  let unmounted = false;

  useEffect(() => {
    if (paper) {
      getRates();
      getMrtByPaperIDs();
      // setMRTAvlbByGetRefPubs();
      return () => {
        unmounted = true;
        dispatch({ type: 'mrt/reset' })
      }
    }
  }, [paper]);

  useEffect(() => {
    if (paper && paper.id) {
      if (mrtList && mrtList.length > 0) {
        setGenMRTAvailable(true);
      } else {
        setMRTAvlbByGetRefPubs();
      }
    }
  }, [mrtList, paper]);

  const getRates = () => {
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
    if (paper && paper.total_ref >= MRT_MIN_REQUIRED_REF_SIZE) {
      setGenMRTAvailable(true)
    }
    // getRefPubs({ dispatch, id: paper.id })
    //   .then(({ data, status }) => {
    //     if (status && data.length >= MRT_MIN_REQUIRED_REF_SIZE) {
    //       setGenMRTAvailable(true)
    //     }
    //   })
  }

  const content = () => {
    return (
      <div className={styles.rating}>
        <div className={styles.score}>
          {/* <i className='fa fa-star' style={{ color: '#FFAE00' }}>
                <span>{rating.rate || 0}</span>
              </i> */}
          {rating && rating.rate || ''}
        </div>
        <div>
          <div className={styles.userRate}>
            <span className={styles.rateLabel}>{`${formatMessage({ id: 'aminer.paper.rating', defaultMessage: 'Your Rating' })} :`}</span>
            <Rate value={userRating} onChange={saveRate} />
            {userRating && <span className={styles.number}>{userRating}</span>}
          </div>
          <p className={styles.rateLine}>
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
        </div>
      </div>
    );
  }

  const mrtContent = () => {
    return (
      <div className={styles.mrtZone}>
        <img className={styles.mrtPre} title='Master Reading Tree' src={`${consts.ResourcePath}/sys/aminer/pubs/mrt_preview.jpeg`} />
        {mrtList && !!mrtList.length ? (
          <div className={styles.mrtText} onClick={gotoMRT}>
            {/* <i className="fa fa-tree" /> */}
            <span className={styles.textInner}>
              <FM id="aminer.paper.mrt.goto" defaultMessage="Go To MRT" />
            </span>
          </div>
        ) : (
            <div hidden={!genMRTAvailable} onClick={chooseDataSource} className={styles.mrtText}>
              {/* <i className="fa fa-tree" /> */}
              <span className={styles.textInner}>
                <FM id="aminer.paper.mrt.generate" defaultMessage="Generate MRT" />
              </span>
            </div>
          )}
      </div>
    )
  }

  return (
    <div className={styles.panelAbout2}>
      {genMRTAvailable && <Panel subContent={mrtContent} />}
      <Panel subContent={content} />
    </div>
  )
}

export default component(connect(({ auth, mrt, loading }) => ({
  user: auth.user,
  token: auth.token,
  mrtList: mrt.mrtList,
  loading: loading.effects['mrt/createPaperMRT']
})))(PanelAbout2)
