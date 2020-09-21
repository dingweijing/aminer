import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { Menu, Dropdown, Button, Modal, Tabs, Input, Descriptions, Icon, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import { isRoster, isPeekannotationlog } from 'utils/auth';
// import { formatMessage } from 'locales';
import { setShortName } from 'services/personService';
import { classnames } from 'utils'
import EbMember from './EbMember'
import EbNominateContent from './EbNominateContent'
import EbExpert from './EbExpert'
import styles from './EbNavbar.less';

const { TabPane } = Tabs;

const dataList = [
  { key: 'total', name: '总数' },
  { key: 'affs', name: '单位' },
  { key: 'avatar', name: '头像' },
  { key: 'email', name: '电子邮件' },
  { key: 'pubs', name: '出版物' },
]

const EbNavbar = props => {

  const { dispatch, ebId = '5e71e8c34c775e93ef9b4f86', user, stats, expertList } = props;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const totalNum = stats && stats.total;

  useEffect(() => {
    setTotal(expertList && expertList.total)
  }, [expertList])

  const menu = (
    <Menu>
      <Menu.Item key="Simple" >
        <a href={`https://api.aminer.cn/api/roster/${ebId}/export/s/offset/0/size/${total}/data.csv`} target="_blank">Simple</a>
      </Menu.Item>
      <Menu.Item key="Advanced" >
        <a href={`https://api.aminer.cn/api/roster/${ebId}/export/d/offset/0/size/${total}/data.csv`} target="_blank">Advanced</a>
      </Menu.Item>
    </Menu>
  )

  // const userPermission = isRoster(user) || isPeekannotationlog(user);

  const showNominate = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'Nominate Expert',
        width: '900px',
        content: <EbNominateContent />,
      }
    })
  }

  const showExpert = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'Add Expert',
        width: '900px',
        content: <EbExpert />
      }
    })
  }

  const showStatisticsData = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: '统计数据',
        width: '900px',
        content: (
          <Descriptions
            bordered={true}
            column={1} >
            {stats && dataList && dataList.map(item => (
              <Descriptions.Item key={item.key} label={item.name} className={classnames({ 'pubsStyle': item.key === 'pubs' })}>{
                item.key !== 'pubs' ? `${stats[item.key]}${(item.key !== 'total' ? toPercentage(stats[item.key]) : '')}` : pubsList()
              }</Descriptions.Item>
            ))
            }</Descriptions>
        )
      }
    })
  }

  const showMember = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: '成员',
        width: '900px',
        footer: null,
        content: <EbMember id={ebId} />
      }
    })
  }

  const toPercentage = num => {
    return ` (${(100 * num / totalNum).toFixed(2)}%)`
  }

  const extractEbEmail = _ => {
    dispatch({
      type: 'editEb/ExtractEbEmail',
      payload: { id: ebId }
    }).then(res => {
      res.status ? message.success(res.message) : message.error(res.message)
    })
  }

  const pubsList = () => (
    <Descriptions
      bordered={true}
      column={1}
    >
      <Descriptions.Item key={-1} label='范围'>数量/百分比</Descriptions.Item>
      {
        stats && stats.pubs && stats.pubs.map(item => (
          <Descriptions.Item key={item.l} label={item.r.h === -1 ? `${item.r.l} +` : `${item.r.l} - ${item.r.h}`}>{
            `${item.c} ${toPercentage(item.c)}`
          }</Descriptions.Item>
        ))
      }
    </Descriptions>
  )

  return (
    <div className={styles.EbNavbar}>
      <div>
        <Button className={styles.buttonStyle} onClick={showNominate}>Nominate</Button>
        <Button className={styles.buttonStyle} onClick={showExpert}>添加专家</Button>
        <span>{`0 ~ 2 of 2 results`}</span>
        {/* 这里有 2 和 2 对应着 page size 和 total @元涛 */}
        <input className={styles.inputStyle} defaultValue={1} />
        <Button type="primary">跳转</Button>
      </div>
      <div>
        <Button className={styles.buttonStyle} onClick={showStatisticsData}>统计数据</Button>
        {/* 抽取电子邮件这个按钮要控制权限 @元涛 */}
        <Button className={styles.buttonStyle} onClick={extractEbEmail}>抽取电子邮件</Button>
        <Dropdown className={styles.buttonStyle} overlay={menu} trigger={['click']}>
          <Button>Export<Icon type='down' /></Button>
        </Dropdown>
        <Button onClick={showMember}>成员</Button>
      </div>
    </div>
  )

}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(EbNavbar) 
