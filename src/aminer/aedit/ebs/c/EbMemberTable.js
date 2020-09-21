import React, { useState, useEffect } from 'react';
import { Pagination, Dropdown, Menu, Tooltip, Popconfirm, message } from 'antd'
import { component, connect } from 'acore';
import { classnames } from 'utils'
import styles from './EbMemberTable.less'

const EbMemberTable = props => {

  const { memberList, user, dispatch, id, reset } = props
  const { list = {}, size= {} } = memberList
  const { users = [] } = list
  const userNum = size.users || 1
  const [usersList, setUsersList] = useState([])

  const menu = (
    <Menu onClick={(e) => changeMemberPerm(e)}>
      <Menu.Item key={1}>Browser</Menu.Item>
      <Menu.Item key={2}>Editor</Menu.Item>
      <Menu.Item key={3}>Manager</Menu.Item>
      <Menu.Item key={4}>Owner</Menu.Item>
    </Menu>
  )

  useEffect(() => {
    users.length && pageChange(1, 10)
  }, [users])

  const deleteMember = () => {
    dispatch({
      type: 'editEb/deleteMember',
      payload: { id, userId: user.id }
    }).then(res => {
      if (res) {
        message.success("成功删除成员。")
        reset && reset();
      } else {
        message.error("删除成员失败。")
      }
    })
  }

  const changeMemberPerm = (e) => {
    dispatch({
      type: 'editEb/setEbMember',
      payload: {
        data: {
          id: user.id,
          perm: +e.key,
        },
        id,
      }
    }).then(res => {
      if (res) {
        message.success("成功修改成员权限。")
        reset();
      } else {
        message.error("修改成员权限失败。")
      }
    })
  }

  const pageChange = (page, pageSize) => {
    setUsersList(users.slice((page - 1) * pageSize, pageSize))
  }

  return (
    <div className={styles.EbMemberTable}>
      {usersList && usersList.map((item, index) => (
        <div key={item.id} className={styles.EbMemberList}>
          <a>
            <img src={item && item.detail && item.detail.avatar} className={styles.avatar} />
            <span className={styles.name}>{item && item.detail && item.detail.name}</span>
          </a>
          <div>
            <span className={styles.role}>{item && item.relation_str}</span>
            <Dropdown className={classnames('memberEdit')} overlay={menu} trigger={['click']}>
              <Tooltip placement="top" title='edit access level'>
                <svg className="icon titleEditIcon" aria-hidden="true" >
                  <use xlinkHref='#icon-edit' />
                </svg>
              </Tooltip>
            </Dropdown>
            <Tooltip placement="top" title='remove user from team'>
              <Popconfirm title={`确定删除成员${item && item.detail && item.detail.name}吗？`} okText="是" cancelText="否" onConfirm={deleteMember}>
                <svg className={classnames('icon', 'delete')} aria-hidden="true" >
                  <use xlinkHref="#icon-modal_close" />
                </svg>
              </Popconfirm>
            </Tooltip>
          </div>
        </div>
      ))}
      <Pagination size="small" total={userNum} className={styles.pagination} onChange={pageChange}/>
    </div>
  )
}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(EbMemberTable)
