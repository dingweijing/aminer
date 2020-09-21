import React, { useState, useEffect } from 'react';
import { Button, Tabs, Input } from 'antd'
import { component, connect } from 'acore';
import { classnames } from 'utils'
import EbSearchFilter from './EbSearchFilter'
import styles from './EbCommonStyle.less'


const EbExpert = props => {

  return (
    <div className={styles.EbCommonStyle}>
      <div className={classnames('functionModal')}>
        <Tabs type="card">
          <Tabs.TabPane tab='Search' key='Search'>
            <EbSearchFilter />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={classnames('nominateFooter')}>
        <Button style={{ float: 'left' }}>Add All</Button>
        <Button type="primary">Add</Button>
      </div>
    </div>
  )
}

export default component()(EbExpert)
