// import React, { PureComponent } from 'react';
import React from 'react';
import { Icon, Upload, message, Modal } from 'antd';
import { FM, formatMessage } from 'locales';
import { connect, component } from 'acore';
import { nextAPIURLOnlineProduction } from 'consts/api';
import styles from './UploadFile.less';

const UploadFile = props => {
  const { setNewPdfs, dispatch } = props;

  const beforeUpload = ({ size = 0 }) => {
    const isLimit16M = size / 1024 / 1024 <= 16;
    if (!isLimit16M) {
      Modal.error({
        content: 'Image must smaller than 16MB!'
      })
    }
    return isLimit16M;
  }

  const uploadPDF = info => {
    const { status, response } = info.file;
    if (status === 'error') {
      if (!beforeUpload(info.file)) { return }
    }
    if (response && response.data && response.data.length > 0 && response.data[0].succeed) {
      message.success(
        formatMessage({ id: 'aminer.paper.upload.success', defaultMessage: 'Upload success' }),
        1,
      );
      const pdf = response.data[0].keyValues && response.data[0].keyValues.pdf;
      if (setNewPdfs && pdf) {
        setNewPdfs(pdf);
      }
      dispatch({ type: 'modal/close' });
    }
    if (response && response.data && response.data.length > 0 && !response.data[0].succeed) {
      message.error(
        formatMessage({ id: 'aminer.paper.upload.error', defaultMessage: 'Upload error' }),
        1,
      );
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <Upload.Dragger
        name="file"
        onChange={uploadPDF}
        accept=".pdf"
        action={`${nextAPIURLOnlineProduction}/magic`}
        data={{ action: 'publication.AssignPdfToPaper', parameters: JSON.stringify({ id: props.pid }) }}
        headers={{ Authorization: props.token }}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          <FM
            id="aminer.paper.upload.file.info"
            defaultMessage="Click or drag file to this area to upload"
          />
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default component(connect())(UploadFile);
