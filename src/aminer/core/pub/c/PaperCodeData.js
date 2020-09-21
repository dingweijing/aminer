import React, { useMemo, useState, useEffect } from 'react';
import { component, connect, withRouter } from 'acore';
import { message, Input, Button, Popconfirm } from 'antd';
import { parseUrlParam } from 'helper';
import { formatMessage, FM } from 'locales';
import { isLogin } from 'utils/auth';
import styles from './PaperCodeData.less';

const EditCodeData = props => {
  const { dispatch, type, id, afterEdit } = props;
  const [data, setData] = useState(props.data || []);

  const onChange = (n, v, e) => {
    const rest = data[n];
    data[n] = { ...rest, [v]: e.target.value };
  }

  const Submit = () => {
    let sType = type === 'code' ? 'Code' : 'Data';
    dispatch({
      type: 'pub/updateResources',
      payload: { [sType]: data, type, id }
    }).then((info) => {
      if (info) {
        message.success(formatMessage({ id: 'aminer.common.success' }))
        afterEdit(type, data);
        dispatch({ type: 'modal/close' });
      }
    }).catch((err) => { message.error(err || 'err') })
  }

  const AddOne = () => {
    data.push({ link: '', desc: '', peek: '' });
    setData([...data]);
  }

  const deleteItem = (n) => {
    data.splice(n, 1);
    setData([...data]);
  }

  return (
    <div className={styles.editCdForm}>
      {data.map(({ link, desc, peek }, index) => {
        return (
          <div key={index} className={styles.cdItem}>
            {index + 1}&nbsp;
            <label> <FM id="aminer.paper.link" defaultMessage='Link' />: </label>
            <Input onChange={onChange.bind(this, index, 'link')} className={styles.input} defaultValue={link} />
            <label><FM id="aminer.annotation.description" defaultMessage='Description' />: </label>
            <Input.TextArea onChange={onChange.bind(this, index, 'desc')} className={styles.input} defaultValue={desc} />
            <Popconfirm
              title="delete this?"
              onConfirm={deleteItem.bind(this, index)}
              okText="Yes"
              cancelText="No"
            >
              <svg color='#f00' className="icon" aria-hidden="true">
                <use xlinkHref='#icon-delete-' />
              </svg>
            </Popconfirm>
          </div>
        )
      })}
      <div className={styles.addBtn}>
        <Button className={styles.btn} onClick={AddOne} icon='plus'></Button>
      </div>
      <Button type='primary' onClick={Submit}><FM id="aminer.paper.submit" /></Button>
    </div>
  )
}


const PaperCodeData = props => {
  const { resources = {}, dispatch, user, id, afterUpdatePub } = props;
  const { code, data } = resources;

  const { anchor } = parseUrlParam(props, {}, ['anchor']);
  useEffect(() => {
    anchor && scrollToAnchor(anchor);
  }, [anchor]);

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'instant',
        });
      }
    }
  };

  const afterEdit = (type, list) => {
    resources[type] = list;
    afterUpdatePub(resources)
  }

  const openEdit = (params, type) => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    const payload = { dispatch, afterEdit, type, data: params, id }
    dispatch({
      type: 'modal/open',
      payload: {
        width: '800px',
        title: `${formatMessage({ id: 'aminer.common.edit' })} ${
          type === 'code' ? formatMessage({ id: "aminer.paper.code" }) :
            formatMessage({ id: 'aminer.home.title.data' })}`,
        content: <EditCodeData {...payload} />
      }
    })
  }

  return (
    <div className={styles.paperCodeData}>
      <>
        <p className={styles.title} id='code'>
          <span className={styles.label}>
            {formatMessage({ id: "aminer.paper.code", defaultMessage: "Code" })}
          </span>
          <FM id='aminer.common.colon' defaultMessage=': ' />
          <svg className="icon" aria-hidden="true" onClick={openEdit.bind(this, code, 'code')}>
            <use xlinkHref='#icon-edit' />
          </svg>
        </p>
        {code && code.length > 0 && code.map(({ link, desc, peek }, index) => {
          return (
            <p key={index}>
              <a href={link} target="_blank" >{link}</a>
              <span>{desc ? `, ${desc}` : ''}</span>
            </p>
          )
        })}
      </>
      <>
        <p className={styles.title} id='data'>
          <span className={styles.label}>
            {formatMessage({ id: "aminer.home.title.data", defaultMessage: "Data" })}
          </span>
          <FM id='aminer.common.colon' defaultMessage=': ' />
          <svg className="icon" aria-hidden="true" onClick={openEdit.bind(this, data, 'data')}>
            <use xlinkHref='#icon-edit' />
          </svg>
        </p>
        {data && data.length > 0 && data.map(({ link, desc, peek }, index) => {
          return (
            <p key={index}>
              <a href={link} target="_blank" >{link}</a>
              <span>{desc ? `, ${desc}` : ''}</span>
            </p>
          )
        })}
      </>
    </div>
  );
}

export default component(connect(({ auth }) => ({
  user: auth.user
})), withRouter)(PaperCodeData)
