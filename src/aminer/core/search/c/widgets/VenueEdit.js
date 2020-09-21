// Subscribe
import React, { useMemo, useEffect, useState } from 'react'
import { page, connect, component } from 'acore';
import { InputNumber, Input, Button, Select, Switch, message } from 'antd';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './VenueEdit.less';

const VenueForm = (props) => {
  const { onSubmit, onCancel, onSearch, changes } = props;
  const [showInput, setShowInput] = useState(false);
  const [type, setType] = useState('createVenue');

  const onEnNameSearch = async () => {
    const data = await onSearch(changes['value']);
    if (data) {
      if (data.id) {
        changes.id = data.id;
        setType('updateVenue');
      }
      if (data.venue_name_en) {
        changes.venueNameEn = data.venue_name_en;
      }
      if (data.venue_name_zh) {
        changes.venueNameZh = data.venue_name_zh;
      }
      if (data.alias) {
        changes.alias = data.alias;
      }
    }
    setShowInput(true);
  }
  const onVenueSubmit = () => {
    onSubmit(type);
  }

  return (
    <div className={styles.form}>
      <div className={styles.formItem}>
        期刊名称
        { ':' }
        <Input onChange={e => changes['value'] = e.target.value } />
        {!showInput && <Button onClick={onEnNameSearch}>搜索</Button>}
      </div>
      {showInput && (
        <div>
          <div className={styles.formItem}>
            英文名称
            { ':' }
            <Input onChange={e => changes['venueNameEn'] = e.target.value }  defaultValue={changes.venueNameEn}/>
          </div>
          <div className={styles.formItem}>
            中文名称
            { ':' }
            <Input onChange={e => changes['venueNameZh'] = e.target.value }  defaultValue={changes.venueNameZh}/>
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
          <Button onClick={onVenueSubmit}><FM id='aminer.search.filter.confirm' defaultMessage='Confirm' /></Button>
        </div>}
      </div>
    </div>
  )
}

const VenueEdit = (props) => {
  const { dispatch } = props;
  let changes = {};

  const onSubmit = (type) => {
    delete changes['value'];
    if (Object.keys(changes).length) {
      dispatch({
        type: `venue/${type}`,
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
        type: 'venue/searchVenue',
        payload: {
          venueNameEn: name
        }
      }).then(data => {
        res = data;
      })
    }
    return res;
  }

  const openVenueModal = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: '期刊会议',
        height: 'auto',
        width: '600px',
        content: <VenueForm onSearch={onSearch} onSubmit={onSubmit} onCancel={closeModal} changes={changes}/>,
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
    <div className={styles.venueEdit} >
      <a onClick={openVenueModal}>标注期刊</a>
    </div>
  )
}

export default page(
  connect()
)(VenueEdit);
