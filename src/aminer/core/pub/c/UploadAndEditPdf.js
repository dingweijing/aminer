import React, { } from 'react';
import { connect, component } from 'acore';
import { formatMessage, FM } from 'locales';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { Button } from 'antd';
import { UploadFile, UploadPpt } from 'aminer/core/pub/widgets';
import styles from './UploadAndEditPdf.less';

const UploadAndEditPdf = props => {
  const { paper, dispatch, user, token, setNewPdfs, setNewPPT } = props;

  const showUploadPdfModal = () => {
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

  const showPdf = () => {
    if (paper && paper.pdf) {
      window.open(paper.pdf)
    }
  }

  const downloadPDF = () => {
    if (paper && paper.pdf) {
      window.location.href = paper.pdf;
    }
  } //xxxsss

  return (
    <div className={classnames(styles.uploadAndEditPdf, 'desktop_device')}>
      {paper && paper.pdf && (
        <span className={classnames(styles.btn)}>
          <Button onClick={showUploadPdfModal}>
            <i className="fa fa-cloud-upload" />
            <span>
              {`${formatMessage({ id: 'aminer.paper.update', defaultMessage: 'Update' })}`}
              <FM id="aminer.paper.fulltext" defaultMessage="Full Text " />
            </span>
          </Button>
        </span>
      )}
      {paper && !paper.ppt && (
        <span className={classnames(styles.btn)}>
          <Button onClick={showUploadPPtModal}>
            <i className="fa fa-cloud-upload" />
            <span><FM id='aminer.paper.upload' defaultMessage='Upload' />PPT</span>
          </Button>
        </span>
      )}
      {paper && paper.ppt && (
        <span className={classnames(styles.btn)}>
          <Button onClick={showUploadPPtModal}>
            <i className="fa fa-cloud-upload" />
            <span><FM id='aminer.paper.update' defaultMessage='Update' />PPT</span>
          </Button>
        </span>
      )}
      {/* {paper && !paper.pdf && isLogin(user) && (
        <span className={classnames(styles.btn)}>
          <Button onClick={showUploadModal}>
            <i className="fa fa-cloud-upload" />
            <FM id="aminer.paper.upload" defaultMessage="Upload" />
          </Button>
        </span>
      )} */}
      {/* {paper && paper.pdf && (
        <span className={classnames(styles.btn)}>
          <Button onClick={showPdf}>
            <i className="fa fa-eye" />
            <FM id="aminer.paper.preview" defaultMessage="Preview" />
          </Button>
        </span>
      )} */}
    </div>
  )
}

export default component(connect(({ auth }) => ({
  user: auth.user,
  token: auth.token,
})))(UploadAndEditPdf)
