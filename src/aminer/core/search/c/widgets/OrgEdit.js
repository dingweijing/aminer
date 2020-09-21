// Subscribe
import React, { useMemo, useEffect, useState } from 'react'
import { page, connect, component } from 'acore';
import { InputNumber, Input, Button, Select, Switch, message } from 'antd';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './OrgEdit.less';

const OrgForm = (props) => {
  const { onSubmit, onCancel, onSearch, changes } = props;
  const [showInput, setShowInput] = useState(false);
  const [type, setType] = useState('createOrg');

  const onEnNameSearch = async () => {
    const data = await onSearch(changes['orgNameEn']);
    if (data) {
      if (data.id) {
        changes.id = data.id;
        setType('updateOrg');
      }
      if (data.org_name_zh) {
        changes.orgNameZh = data.org_name_zh;
      }
      if (data.alias) {
        changes.alias = data.alias;
      }
    }
    setShowInput(true);
  }
  const onOrgSubmit = () => {
    onSubmit(type);
  }

  return (
    <div className={styles.form}>
      <div className={styles.formItem}>
        英文名称
        { ':' }
        <Input onChange={e => changes['orgNameEn'] = e.target.value } />
        {!showInput && <Button onClick={onEnNameSearch}>搜索</Button>}
      </div>
      {showInput && (
        <div>
          <div className={styles.formItem}>
            中文名称
            { ':' }
            <Input onChange={e => changes['orgNameZh'] = e.target.value }  defaultValue={changes.orgNameZh}/>
          </div>
          <div className={styles.formItem}>
            别名
            { ':' }
            <Select mode='tags' defaultValue={changes.alias} style={{ width: '100%'}} dropdownRender={() => <></>} onChange={v => changes['alias'] = v } />
          </div>
        </div>
      )}
      <div className={styles.btnLine}>
        <div className={styles.submitBtn}>
          <Button onClick={onCancel}><FM id='aminer.search.filter.cancel' defaultMessage='Cancel' /></Button>
        </div>
        {showInput && <div className={styles.submitBtn}>
          <Button onClick={onOrgSubmit}><FM id='aminer.search.filter.confirm' defaultMessage='Confirm' /></Button>
        </div>}
      </div>
    </div>
  )
}

const OrgEdit = (props) => {
  const { dispatch } = props;
  let changes = {};

  const onSubmit = (type) => {
    if (Object.keys(changes).length) {
      dispatch({
        type: `org/${type}`,
        payload: {
          ...changes,
        }
      })
    }
    closeModal();
  }

  const onSearch = async (name) => {
    let res = null;
    if (name) {
      await dispatch({
        type: 'org/searchOrg',
        payload: {
          orgNameEn: name
        }
      }).then(data => {
        res = data;
      })
    }
    return res;
  }

  const openOrgModal = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: '机构',
        height: 'auto',
        width: '600px',
        content: <OrgForm onSearch={onSearch} onSubmit={onSubmit} onCancel={closeModal} changes={changes}/>,
      },
    });
  }

  const closeModal = () => {
    dispatch({
      type: 'modal/close',
    });
    changes = {};
  }

  return (
    <div className={styles.orgEdit} >
      <a onClick={openOrgModal}>标注机构</a>
    </div>
  )
}

export default page(
  connect()
)(OrgEdit);
