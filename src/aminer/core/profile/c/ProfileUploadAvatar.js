import React, { useEffect, useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import { connect, component } from 'acore';
import { Button, Upload, Icon, Modal } from 'antd';
import { FM, formatMessage } from 'locales';
import * as profileUtils from 'utils/profile-utils';
import { NE } from 'utils/compare';
import * as auth from 'utils/auth';
import { nextAPIURLOnlineProduction } from 'consts/api';
import { isLogin, isRoster } from 'utils/auth';
import styles from './ProfileUploadAvatar.less';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const ProfileUploadAvatar = props => {
  const { dispatch, personId, changeAvatars } = props;
  const [imgList, setImgList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    dispatch({
      type: 'editProfile/getAvatars',
      payload: { ids: [personId] }
    }).then((info) => {
      if (info && info.avatars) {
        const items = info.avatars.map((n, m) => {
          return { uid: m, url: n.url, status: 'done' };
        });
        setImgList(items);
      }
    })
  }, [personId])

  const onPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
  };

  const beforeUpload = ({ size = 0 }) => {
    const isLimit4M = size / 1024 / 1024 < 4;
    if (!isLimit4M) {
      Modal.error({
        content: 'Image must smaller than 4MB!'
      })
    }
    return isLimit4M;
  }

  const onChange = ({ file, fileList }) => {
    if (!beforeUpload(file)) { return }
    if (file.status === 'done') {
      const { data } = file.response || {};
      const { keyValues, warn } = data && data[0] || {};
      let error = warn && warn.join('');
      if (error) {
        Modal.error({ content: error }); return;
      }
      const newFile = { uid: imgList.length + 1, url: keyValues && keyValues.url || '' };
      const last = fileList.length - 1;
      fileList[last].url = newFile.url;
      changeAvatars(fileList);
    }
    if (file.status === "removed") {
      changeAvatars(fileList);
    }
    setImgList([...fileList]);
  }

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onCancelPreview = () => {
    setPreviewVisible(false);
  }

  return (
    <div className={styles.profileUploadAvatar}>
      <Upload
        listType="picture-card"
        fileList={imgList}
        onPreview={onPreview}
        accept=".jpg, .jpeg, .png"
        action={`${nextAPIURLOnlineProduction}/magic`}
        data={{ action: 'person.UploadAvatar', parameters: JSON.stringify({ id: personId }) }}
        headers={{ Authorization: props.token || auth.getLocalToken() }}
        onChange={onChange}
      >
        {imgList.length >= 5 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={onCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default component(connect(({ auth }) => ({
  token: auth.token,
})))(ProfileUploadAvatar)
