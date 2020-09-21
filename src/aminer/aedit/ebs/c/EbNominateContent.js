import React, { useState, useEffect } from 'react';
import { Button, Tabs, Input } from 'antd'
import { component, connect } from 'acore';
import { classnames } from 'utils'
// import EbSearchFilterList from './EbSearchFilterList';
import styles from './EbCommonStyle.less'

const tabsList = [
  { tab: '搜索', key: 'search', },
  { tab: 'Nominated List', key: 'nominatedList' },
]

const searchCondition = [
  { placeholder: '关键字', key: 'word', },
  { placeholder: '姓名', key: 'name', },
  { placeholder: '单位', key: 'company', },
]

const EbNominateContent = props => {

  const [footSwitch, setFootSwitch] = useState(true);

  const cutTabs = (key) => {
    setFootSwitch(key === 'search' ? true : false)
  }

  return (
    <div className={styles.EbCommonStyle}>
      <div className={classnames('functionModal')}>
        <Tabs onChange={cutTabs} type="card">{
          tabsList && tabsList.map(item => (
            <Tabs.TabPane tab={item.tab} key={item.key}>{
              // item.key === 'search' ? <EbSearchFilterList searchCondition={searchCondition} /> : ''
            }</Tabs.TabPane>
          ))
        }
        </Tabs>
      </div>
      {
        footSwitch && (
          <div className='nominateFooter'>
            <Button type="primary" >Nominate</Button>
          </div>
        )
      }
    </div>
  )
}

export default component()(EbNominateContent)
