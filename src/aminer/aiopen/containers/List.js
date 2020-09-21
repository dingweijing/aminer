import React, { Component, useState, useEffect, useMemo } from 'react';
import { connect } from 'acore';
import { Form, Checkbox, Dropdown, Icon, Button, Menu, Select, Input } from 'antd'
import { FM } from 'locales';
import withLoading from 'components/hoc/withLoading';
import { isMobile } from 'utils';
import { SelectTree, DisplayTree } from '../components/Tree'
import Panel from '../components/Panel'
import SelectionList from '../components/Selection'
import SelectionMobile from '../components/SelectionMobile'
import RadioTab from '../components/Selection/RadioTab'
import MessageBoard from '../../p/ai2000/c/MessageBoard'
import { ListOpts, GEOS } from './options'
import styles from './style.less'

const { SELECT_OPTIONS } = ListOpts
const { Option } = Select;
const { Search } = Input;

const options = ['rankings', 'citations', 'pubs']

function handleChange(e) {
  console.log('click', e);
}

const ROWS_NUM = 15
const randomWidth = Array(ROWS_NUM).fill(0).map(() => `${Math.random().toFixed(2) * 600}px`)

const LodingSelectTree = withLoading(SelectTree, 'spin')
const LodingDisplayTree = withLoading(DisplayTree, 'skeleton', { paragraph: { rows: ROWS_NUM, width: randomWidth } })

const Rank = props => {
  let isFirst = true
  const { dispatch, ai2000rank } = props
  const { domainLoading, rankLoading, domainTree, rankTree } = ai2000rank

  /* 默认筛选项,默认选择第一个 */
  const defaultSelection = useMemo(() => SELECT_OPTIONS.reduce((obj, item) => {
    /* eslint-disable  no-shadow,no-param-reassign */
    const { key, defaultValue } = item
    obj[key] = defaultValue;
    return obj
  }, {
    year_begin: '1850',
    year_end: '2020'
  }), [])

  let queryParams = defaultSelection

  // 领域树
  const fetchDomain = () => {
    dispatch({
      type: 'ai2000rank/getDomainTree',
      payload: { types: ['AI 2000'], year: 2019, page_type: 'rankings' }
    })
  }

  // 排名树
  const fetchRank = (params = {}) => {
    // if (isMobile) { } else {
    console.log('params', params)
    dispatch({
      type: 'ai2000rank/getRankTree',
      payload: params
    })
    // }
  }


  useEffect(() => {
    if (isFirst) {
      fetchDomain()
      fetchRank(queryParams)
      isFirst = false
    }
  }, [])

  const onSelectionChange = res => { // 筛选项中的值
    queryParams = res
    dispatch({
      type: 'ai2000rank/getRankTree',
      payload: res
    })
  }

  const onExpand = (parentNode, offset) => { // 点击displaytree的一个节点
    dispatch({
      type: 'ai2000rank/getOneRank',
      payload: { queryParams, parentNode, offset }
    })
  }

  const onCheck = checkedKeys => {
    fetchRank({ ...queryParams, domains: checkedKeys })
  }

  const isMobileState = isMobile()


  return (
    <div className={styles.list}>
      <Panel title={!isMobileState ? '筛选项' : undefined}>
        {/* {isMobile ? (<SelectionMobile name="选择领域" selections={GEOS} />)
          : <SelectionList
            onSelectChange={onSelectionChange}
            options={SELECT_OPTIONS}
            selectedKeys={{ author: ['其他'] }}
          ></SelectionList>} */}

        {isMobileState ? (<SelectionMobile name="选择领域" >
          <LodingSelectTree loading={domainLoading}
            treeData={domainTree}
            onCheck={onCheck}
          />
        </SelectionMobile>) : <SelectionList
          onSelectChange={onCheck}
          // onSelectChange={onSelectionChange}
          options={SELECT_OPTIONS}
          selectedKeys={{ author: ['其他'] }}
        ></SelectionList>}
      </Panel>

      {
        isMobileState ?
          (
            <Panel className={styles.bottom}>
              <div className="treeWrapper">
                <LodingDisplayTree loading={rankLoading} treeData={rankTree} onSingleClick={onExpand}></LodingDisplayTree>
              </div>
            </Panel>
          )
          : <Panel className={styles.bottom}>
            <div className="left">
              <Select defaultValue="area" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="area">Areas</Option>
                <Option value="journal">Journals</Option>
              </Select>
              <LodingSelectTree loading={domainLoading} treeData={domainTree}
                onCheck={onCheck}
              />
            </div>
            <div className="right">
              <div className="head">
                <RadioTab options={options}></RadioTab>
                <Search
                  placeholder="input search text"
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}
                />
              </div>
              <div className="bottom">
                <div className="treeWrapper">
                  <LodingDisplayTree loading={rankLoading} treeData={rankTree} onSingleClick={onExpand}></LodingDisplayTree>
                </div>
                <div className="messageBox">
                  <h3>Comments</h3>
                  <MessageBoard trackType="ai" comment_id="5e5c5040eb2fa482998aae7d" />
                </div>
              </div>

            </div>
          </Panel>}
    </div>
  )
}

export default connect(({ ai2000rank }) => ({ ai2000rank }))(Rank);
