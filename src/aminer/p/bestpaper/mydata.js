import React, { useEffect, useState } from 'react';
import { component, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { classnames } from 'utils';
import { isLogin, isAuthed, parseRoles, haveRole, isAdmin } from 'utils/auth';
import { Button, Popconfirm, Row, Form, Input, Checkbox, Select, Modal } from 'antd';
import { CommitDataSource } from './c';
import styles from './mydata.less'
import helper from 'helper';

const MyBestPaperData = props => {
  const [mydatas, setMydatas] = useState(null);
  const { dispatch, user } = props;

  useEffect(() => {
    if (!isLogin(user)) {
      helper.routeTo(props, {}, {}, {
        transferPath: [
          { from: '/bestpaper/my/data', to: '/bestpaper' }
        ]
      })
      return;
    }
    getDataSources();
  }, [])

  const getDataSources = () => {
    let params = {};
    if (isAuthed(parseRoles(user)) || haveRole(parseRoles(user), 'roster_editor')) {
      params = { "all": true }
    }
    dispatch({
      type: 'rank/GetBestPaperSubmitByUid',
      payload: params
    }).then(result => {
      setMydatas(result);
    })
  }

  const onUpdateData = (item) => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'update',
        content: <CommitDataSource dataSource={item} onCommitFinish={getDataSources} />
      }
    })
  }

  const onDeleteData = (id) => {
    dispatch({
      type: 'rank/DeleteBestPaperSubmit',
      payload: { ids: [id] }
    }).then(res => {
      getDataSources();
    })
  }
  const isAdminUser = isAdmin(parseRoles(user));
  return (
    <Layout>
      <div className={styles.mydata}>
        <ul className='mydata_list'>
          <li className='list_item'>
            <span className='item item1'>No</span>
            <span className='item item2'>Conference Name</span>
            <span className='item item3'>Url</span>
            {isAdminUser && <span className='item item4'>User Name</span>}
            <span className='item item5'>Status</span>
            <span className='item item6' />
          </li>
          {mydatas && mydatas.length > 0 && mydatas.map((item, index) => {
            const { conference_name, url, user_name, status } = item;
            return (
              <li key={item.id} className='list_item'>
                <span className='item item1'>{index + 1}</span>
                <span className='item item2'>{conference_name || ''}</span>
                <span className='item item3'>{url}</span>
                {isAdminUser && <span className='item item4'>{user_name}</span>}
                <span className='item item5'>{status}</span>
                <span className='item item6'>
                  <Button
                    size='small'
                    className='update_item'
                    disabled={!isAuthed(parseRoles(user)) && !haveRole(parseRoles(user), 'roster_editor') && item.status !== 'submit'}
                    onClick={onUpdateData.bind(null, item)}
                  >
                    update
                  </Button>
                  <Popconfirm
                    title="Are you sure delete this task?"
                    placement="bottom"
                    onConfirm={onDeleteData.bind(null, item.id)}
                    onCancel={() => { }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      size='small'
                      disabled={!isAuthed(parseRoles(user)) && !haveRole(parseRoles(user), 'roster_editor') && item.status !== 'submit'}
                    >
                      delete
                    </Button>
                  </Popconfirm>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>

  )
}

// MyBestPaperData.getInitialProps = async ({ store, route, isServer }) => {
// };

export default component(connect(({ auth }) => ({ user: auth.user })))(MyBestPaperData)
