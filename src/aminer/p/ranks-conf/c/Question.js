import React, { useState } from 'react';
import { Link } from 'acore'
import { Select, DatePicker, Menu, Button, message, InputNumber } from 'antd';
import { getLangLabel } from 'helper';
import moment from 'moment'
import styles from './Question.less'

const { SubMenu } = Menu;
const { Option } = Select;

const Q1_title_zh = '最牛的论文有哪些'
const Q2_title_zh = '华人在各大会议占比情况如何'
const Q3_title_zh = '会议的排名数据会受到其所在领域的影响吗'
const Q4_title_zh = '想了解会议的最优指标'
const Q5_title_zh = '各大期刊会议热点话题'
const Q1_title_cn = 'The best papers in recent years'
const Q2_title_cn = 'The proportion of Chinese in major conferences'
const Q3_title_cn = 'Will the ranking data of the conference be affected by its field?'
const Q4_title_cn = 'The best indicators for meetings'
const Q5_title_cn = 'The hot topics in major conferences'
const btn_zh = '发送'
const btn_cn = 'Submit'
const conf_zh = '选择会议'
const conf_cn = 'Conference'
const domain_zh = '选择领域'
const domain_cn = 'Domain'
const time_zh = '选择时间'
const time_cn = 'Time'
const conf_err_zh = '会议信息输入有误'
const conf_err_cn = 'Please check the conference name you entered'
const domain_err_zh = '领域信息输入有误'
const domain_err_cn = 'Please check the domain name you entered'
const time_err_zh = '时间信息输入有误'
const time_err_cn = 'Please check the time information you entered'

const Question = props => {
  const { handleQ1Change, confList, handleQ3Change, openQ3Modal = () => { }, sendTitleMsg, handleQ2Q4Q5Change, domainZH_CNMap } = props
  const [title, setTitle] = useState(null)
  const [beginYear, setBeginYear] = useState(2010)
  const [endYear, setEndYear] = useState(2020)
  const [conf, setConf] = useState(null)
  const [domain, setDomain] = useState(null)
  const [defaultOpKeys, setDefaultOpKeys] = useState([])
  const confFilterList = []
  const domainFilterList = []
  const domainSet = new Set()
  const rootSubmenuKeys = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']

  for (let i = 0; i < confList.length; i += 1) {
    const { id, conference_name, ccf_category } = confList[i]
    confFilterList.push(<Option key={id}>{conference_name}</Option>)
    domainSet.add(ccf_category)
  }
  const domainList = [...domainSet]
  for (let i = 0; i < domainList.length; i += 1) {
    domainFilterList.push(<Option key={domainList[i]}>{getLangLabel(domainZH_CNMap.get(domainList[i]), domainList[i])}</Option>)
  }
  // // 控制range picker 时间范围
  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current > moment().endOf('day');
  // }
  // 控制年份上限
  const myDate = new Date();
  const year = Number(myDate.getFullYear())
  // 获取问题
  const onSendTitle = value => {
    setConf(null)
    if (value.key === 'Q3' && defaultOpKeys.indexOf('Q3') === -1) {
      openQ3Modal()
      // sendTitleMsg('Q3')
      return;
    }
    setTitle(value.key);

  }
  // 获取会议 --> id
  const handleConfChange = value => {
    console.log('value', value)
    if (value && value !== '') {
      setConf(value)
    } else {
      setConf(null)
    }
  }

  const validateDate = () => {
    console.log(beginYear, endYear)
  }

  // 获取时间
  const handleBegin = value => {
    setBeginYear(value)
  }
  const handleEnd = value => {
    setEndYear(value)
  }
  // 获取领域
  const handleDomainChange = value => {
    console.log('domain ', value)
    if (value && value !== '') {
      setDomain(value)
    } else {
      setDomain(null)
    }
  }

  // filter 用户输入的会议名称简写
  const filter = word => confList.filter(obj => (obj.id === word ||
    (obj.conference_name.includes(word) && obj.conference_name.length === word.length)
    || (obj.short_name.includes(word) && obj.short_name.length === word.length)))


  // 提交问题 1
  const handleQ1 = () => {
    if (!conf || !filter(conf).length) {
      message.error(getLangLabel(conf_err_cn, conf_err_zh))
    } else if (!beginYear || !endYear || beginYear > endYear) {
      message.error(getLangLabel(time_err_cn, time_err_zh))
    } else {
      const time = beginYear < endYear ? [beginYear, endYear] : [endYear, beginYear]
      handleQ1Change(title, filter(conf), time)
    }
  }

  // 每次只打开一个子菜单
  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => defaultOpKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setDefaultOpKeys(openKeys)
    } else {
      setDefaultOpKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }
  // 问题2处理函数
  const handleQ2 = () => {
    if (!conf || !filter(conf).length) {
      message.error(getLangLabel(conf_err_cn, conf_err_zh))
    } else {
      handleQ2Q4Q5Change(title, filter(conf))
    }
  }
  // 问题Q3 处理函数
  const handleQ3 = () => {
    if (!domain) {
      message.error(getLangLabel(domain_err_cn, domain_err_zh))
    } else {
      handleQ3Change(title, domain)
    }
  }
  // 问题Q4 处理函数
  const handleQ4 = () => {
    if (!conf || !filter(conf).length) {
      message.error(getLangLabel(conf_err_cn, conf_err_zh))
    } else {
      handleQ2Q4Q5Change(title, filter(conf))
    }
  }
  // 问题Q4 处理函数
  const handleQ5 = () => {
    if (!conf || !filter(conf).length) {
      message.error(getLangLabel(conf_err_cn, conf_err_zh))
    } else {
      handleQ2Q4Q5Change(title, filter(conf))
    }
  }

  return (
    <div className={styles.question}>
      <Menu
        // 宽度 robot width 对齐
        style={{ width: 340, hight: 20 }}
        onOpenChange={onOpenChange}
        openKeys={defaultOpKeys}
        mode="inline"
        theme="light"
        id="meun"
      >
        {/* <Menu.Item key="methrics-definition"> */}
        {/* <a href="https://aminer.cn" target="_blank">点击查看methrics定义</a> */}
        {/* <Link to = "/ranks/definition-help" target="_blank">点击查看methrics定义</Link> */}
        {/* </Menu.Item> */}
        <SubMenu key="Q1" title={getLangLabel(Q1_title_cn, Q1_title_zh)} onTitleClick={onSendTitle} id="submeun-1">
          <Menu.Item key="search-conf">
            <span>{getLangLabel(conf_cn, conf_zh)}: </span>
            <Select
              allowClear
              showSearch
              value={conf}
              style={{ width: '180px' }} onChange={handleConfChange}
              getPopupContainer={() => document.getElementById('meun')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {confFilterList}
            </Select>
          </Menu.Item>
          <Menu.Item>
            <span>{getLangLabel(time_cn, time_zh)}: </span>
            {/* <RangePicker picker="year" style={{ width: '75%' }} onChange={handleTimeOpt} disabledDate={disabledDate}
                getPopupContainer={() => document.getElementById('meun')}
                /> */}
            <InputNumber onChange={handleBegin}
              min={1990}
              max={year}
              defaultValue={2010}
            /> ~ <InputNumber onChange={handleEnd}
              min={1990}
              max={year}
              defaultValue={2020}
            />
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={handleQ1} >{getLangLabel(btn_cn, btn_zh)}</Button>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="Q2" title={getLangLabel(Q2_title_cn, Q2_title_zh)} onTitleClick={onSendTitle} id="submeun-2">
          <Menu.Item key="search-conf">
            <span>{getLangLabel(conf_cn, conf_zh)}: </span>
            <Select
              allowClear
              value={conf}
              showSearch
              style={{ width: '180px' }} onChange={handleConfChange}
              getPopupContainer={() => document.getElementById('submeun-2')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {confFilterList}
            </Select>
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={handleQ2}>{getLangLabel(btn_cn, btn_zh)}</Button>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="Q3" onClick={onSendTitle} id="submeun-3">
          {getLangLabel(Q3_title_cn, Q3_title_zh)}
          {/* <Menu.Item key="search-conf">
            <span>{getLangLabel(domain_cn, domain_zh)}: </span>
            <Select
              allowClear
              showSearch
              style={{ width: '180px' }} onChange={handleDomainChange}
              getPopupContainer={() => document.getElementById('submeun-3')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {domainFilterList}
            </Select>
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={handleQ3}>{getLangLabel(btn_cn, btn_zh)}</Button>
          </Menu.Item> */}
        </Menu.Item>
        <SubMenu key="Q4" title={getLangLabel(Q4_title_cn, Q4_title_zh)} onTitleClick={onSendTitle} id="submeun-4">
          <Menu.Item key="search-conf">
            <span>{getLangLabel(conf_cn, conf_zh)}: </span>
            <Select
              allowClear
              value={conf}
              showSearch
              style={{ width: '180px' }} onChange={handleConfChange}
              getPopupContainer={() => document.getElementById('submeun-4')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {confFilterList}
            </Select>
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={handleQ4} >{getLangLabel(btn_cn, btn_zh)}</Button>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="Q5" title={getLangLabel(Q5_title_cn, Q5_title_zh)} onTitleClick={onSendTitle} id="submeun-5">
          <Menu.Item key="search-conf">
            <span>{getLangLabel(conf_cn, conf_zh)}: </span>
            <Select
              allowClear
              value={conf}
              showSearch
              style={{ width: '180px' }} onChange={handleConfChange}
              getPopupContainer={() => document.getElementById('submeun-4')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {confFilterList}
            </Select>
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={handleQ5} >{getLangLabel(btn_cn, btn_zh)}</Button>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
}

// export default component(connect(), Form.create())(Question);
export default Question;
