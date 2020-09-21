import React, { useState, useEffect, useMemo, useRef } from 'react';
import { page, connect, } from 'acore';
import { Layout } from 'aminer/layouts';
import _ from 'lodash'
import { Table, Icon, Input, BackTop } from 'antd'
import helper, { getLangLabel } from 'helper';
import { formatMessage, FM } from 'locales';
// import { translateDate } from 'utils/utils'
import { sysconfig } from 'systems';
import { /* Selection, Panel, */ CheckboxDropDown } from 'aminer/components/ui';
import { classnames } from 'utils';
import Selection2 from 'aminer/components/ui/Selection2';
import MDModal from 'aminer/components/widgets/MDModal'
import styles from './index.less';
import { md, md_zh } from './detail_md_str'
import RadarChart from './c/RadarChart'
import FeedbackButton from './c/FeedbackButton'
import TableHeadComponent from './c/TableHeadComponent'
// import BarChart from './c/BarChart'
import DailyNews from './c/DailyNewsComponent'
import { Robot } from './c'

const titleMap = {
  ccf: {
    zh: 'CCF分类',
    en: 'CCF'
  },
  thu: {
    zh: '清华大学分类',
    en: 'THU'
  }
}

const { Search } = Input;
let isServerRender = false

let prevSortKey = null // columnKey+order, 用于触发筛选翻页
let newSorter = null
let hasInit = false
// let isMobileOut = false
// let isMobileOut = window ? window.document.body.clientWidth <= 414 : false
let isMobileOut = false
const isUndefined = v => ((typeof v === 'undefined' || v === '') ? '-' : v)
let selectionStateLocal = true

/* -----------------------------FETCH------------------------- */
const fetchTableData = (dispatch = () => { }, obj = {}) => { // 获取表格数据
  return dispatch({
    type: 'rank/getListConferenceRank', payload: { ...obj, sorter: newSorter }
  })
}

const fetchTypes = (dispatch = () => { }, cateType = 'ccf') => { // 获取菜单栏
  return dispatch({
    type: 'rank/getSelectionOpts',
    payload: {
      cateType
    }
  })
}


let params = { // onChangeType中的请求参数
  category_type: 'ccf', // ccf 或thu
  category: 'All',
  category_en: 'All',
  type: ['C', 'J']
}

const transQueryToParams = (query = {}) => {
  const { category = '', category_en, category_type, type } = query
  params = {
    category, category_en, category_type, type
  }
}


const ConfRank = props => {
  const search = props.location.query
  const { type = params.type, category = params.category, category_en, category_type = params.category_type } = search || {}
  const [floatState, setFloatState] = useState(false) // panel悬浮顶部状态
  const [listParams, setListParams] = useState(params)
  const [settingState, setSettingState] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectionState, setSelectionState] = useState(selectionStateLocal)
  const [selectedRows, setSelectedRows] = useState([])
  const panelRef = useRef()
  const [currentPage, setCurrentPage] = useState(1)
  // robot 的显示状态
  const [isVisuable, setVisuable] = useState(false)
  const [isMobile, setMobileState] = useState(isMobileOut)
  const lang = sysconfig.Locale
  const { dispatch, loading, confList, dailyList, categories, options, modalVisible, isServer } = props;

  const matchRouteWithSubMenu = (obj = {}) => {
    const { category, category_type, type = '', category_en = '' } = obj
    helper.routeTo(props, {
      category_type: obj.category_type || 'ccf',
      category,
      category_en,
      type: obj.type && obj.type.length === 1 ? obj.type[0] : undefined
    }, null)
  }



  /* ------------------------CONSTS--------------------------------- */
  /* eslint-disable react-hooks/exhaustive-deps */
  const ROWS = useMemo(() => {
    return ({
      h5_index: {
        key: 'h5_index',
        title: getLangLabel('H5 Index', 'H5指数'),
        dataIndex: 'h5_index',
        align: 'center',
        sortDirections: ['descend'],
        sorter: true,
        render: v => isUndefined(v),
      },
      rising_index: {
        key: 'rising_index',
        title: getLangLabel('Rising Index', '上升指数'),
        align: 'center',
        dataIndex: 'rising_index',
        sortDirections: ['descend'],
        sorter: true,
        render: v => isUndefined(v),
      },
      tk5_median: {
        key: 'tk5_median',
        title: getLangLabel('TK5 Index', 'TK5指数'),
        align: 'center',
        dataIndex: 'tk5_median',
        sortDirections: ['descend'],
        sorter: true,
      },
      ccf_level: {
        key: 'ccf_level',
        title: getLangLabel('CCF Level', 'CCF等级'),
        dataIndex: 'ccf_level',
        align: 'center',
        filters: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }, { text: 'C', value: 'C' }],
        // filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.ccf_level === value,
        render: v => isUndefined(v),
      },
      thu_level: {
        key: 'thu_level',
        title: getLangLabel('THU Level', 'THU等级'),
        dataIndex: 'thu_level',
        align: 'center',
        filters: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }],
        // filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.thu_level === value,
        // filters: ['A', 'B', 'C', 'ALL'],
        render: v => isUndefined(v)
      },
      academic_index_radar: {
        key: 'academic_index_radar',
        title: getLangLabel('Basic Research Creativity Index', '基础研究创新指数'),
        dataIndex: 'academic_index',
        align: 'center',
        sortDirections: ['descend'],
        sorter: true,
        render: v => v && v.toFixed(2)
      },
      industry_index_radar: {
        key: 'industry_index_radar',
        title: getLangLabel('Applied Research Creativity Index', '应用研究创新指数'),
        dataIndex: 'industry_index',
        align: 'center',
        sortDirections: ['descend'],
        sorter: true,
        render: v => v && v.toFixed(2)
      },
      /*       conference_time: {
              key: 'conference_time',
              title: getLangLabel('Time', '会议时间'),
              dataIndex: 'conference_time',
              align: 'center',
              render: v => (typeof v === 'undefined' ? '-' : translateDate(v))
            },
            location: {
              key: 'location',
              title: getLangLabel('Location', '会议地点'),
              dataIndex: 'location',
              align: 'center',
              render: v => isUndefined(v)
            }, */
      action: {
        key: 'action',
        title: getLangLabel('Map', '指标图'),
        align: 'center',
        width: '100px',
        render: (obj, row) => (
          <a className={styles.link} onClick={() => { openModal(row) }}>
            <Icon type="radar-chart" />
            {/* {formatMessage({ id: 'aminer.rank.radar', defaultMessage: 'Radar Map' })} */}
          </a>
        )
      },
    })
  }, [sysconfig.Locale])


  const displayRobot = () => {
    setVisuable(!isVisuable)
  }


  useEffect(() => { // 首次渲染
    console.log('isServer', isServer)
    if (isServerRender) return;
    if (!hasInit) {
      console.log('useEffect1')
      params = {
        ...listParams,
        category_type: category_type || 'ccf',
        category,
        category_en,
        type,
      }
      setListParams(params)
      fetchTableData(dispatch, params)
      if (!categories || !categories.length) {
        fetchTypes(dispatch, category_type)
      }
      hasInit = true
    }

  }, [confList.length])


  useEffect(() => {
    // 监听窗口大小
    // console.log('useEffect2')
    const listener = () => {
      const { clientWidth } = document.body

      isMobileOut = clientWidth <= 414
      setMobileState(isMobileOut)
    }
    window.addEventListener('load', listener)
    return () => {
      window.removeEventListener('load', listener)
    }
  }, [isServerRender, confList.length])

  useEffect(() => {
    // console.log('useEffect3')
    // 当滚轮滑动到panel的时候，固定panel；当滑到panel高度以上放开panel
    const scrollListener = () => {
      const el = panelRef.current
      const currentScrollTop = el.scrollHeight
      const { scrollTop } = document.documentElement
      setFloatState(scrollTop - currentScrollTop >= 0)
    }
    const scTh = _.throttle(scrollListener, 100)
    document.addEventListener('scroll', scTh)

    // 获取本地的rows设置项
    const cr_rows = localStorage.getItem('cr_rows')
    const default_row = ['h5_index', 'rising_index', 'tk5_median', 'ccf_level', 'academic_index_radar', 'thu_level', 'action']
    const obj = cr_rows && (cr_rows.length) ? ((cr_rows.includes('location') || cr_rows.includes('conference_time')) ? default_row : JSON.parse(cr_rows)) : default_row
    setSelectedRows(obj)


    // 获取新闻
    dispatch({ type: 'rank/getDailyNews', payload: {} })
    return () => {
      document.removeEventListener('scroll', scTh)
    }
  }, [])

  const pageTitle = useMemo(() => ([
    formatMessage({
      id: 'aminer.rank.conf.title',
      defaultMessage: 'Computer Science'
    }),
    formatMessage({
      id: 'aminer.home.rankings.conference_rank',
      defaultMessage: 'Conference Rank'
    }),
    formatMessage({ id: 'aminer.common.colon', defaultMessage: ': ' }),
  ].join('')), [])

  // selection改变时清空search中的文字


  const onSelectChange = async (res, key, obj) => {
    await dispatch({
      type: 'rank/setSelection',
      payload: {
        key,
        value: res[key],
        cateType: res.category_type
      }
    })

    setSearchValue('')
    const { category, category_type, type } = res
    const { label } = obj

    // 如果type变了，领域置于all
    let newCategory = res.category
    if (listParams.category_type !== category_type) { // 切换ccf和thu
      newCategory = 'All'
    }
    const textObj = obj && key === 'category' && obj.label ? { label: obj.label, label_zh: obj.label_zh } : {}
    params = {
      category_type,
      category: newCategory,
      // category_en: key === 'category' ? label : 'All',
      type: Array.isArray(res.type) ? res.type : [res.type],
      ...textObj
    }
    if (key === 'category') {
      params.category_en = label || 'All'
    } else if (key === 'type') {
      params.category_en = listParams.category_en || 'All'
    }
    setListParams(params)
    fetchTableData(dispatch, params)
    matchRouteWithSubMenu(params)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const { order, columnKey } = sorter
    const { current } = pagination
    setCurrentPage(current)
    if (sorter.order) {
      const curSortKey = columnKey + order
      if (curSortKey !== prevSortKey) {
        prevSortKey = curSortKey
        newSorter = { order: order === 'descend' ? 1 : -1, key: columnKey }
        dispatch({
          type: 'rank/sortConfList',
          payload: newSorter
        })
        setCurrentPage(1)
      }
    }
  }

  // 显示雷达图
  const openModal = data => {
    const { academic_index = 0, rising_index = 0, tk5_median = 0, industry_index = 0, h5_index = 0, h5_median = 0, } = data
    const arr = [academic_index + 30, rising_index + 20, tk5_median + 30, industry_index + 30, h5_index + 60, h5_median + 100]
    dispatch(
      {
        type: 'modal/open',
        payload: {
          title: formatMessage({ id: 'aminer.rank.radar', defaultMessage: 'Radar Map' }),
          width: '500px',
          content: <RadarChart isMobile={isMobile} data={arr} />,
        }
      }
    )
  }

  const openBarChartModal = async () => {
    await dispatch({
      type: 'rank/askQ3',
      payload: {
        lang: sysconfig.Locale
      }
    })

    /*     await dispatch(
          {
            type: 'modal/open',
            payload: {
              width: '500px',
              content: <BarChart isMobile={isMobile} />,
            }
          }
        ) */

  }

  const openTipsModal = () => { // 显示
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.rank.conference.tips' }),
        width: '900px',
        content: <MDModal mdStr={getLangLabel(md, md_zh)} visible={modalVisible} />,
      }
    })
  }

  const oldColumn = useMemo(() => {
    const fixed = isMobile ? { fixed: 'left' } : {}
    return [
      {
        key: 'index',
        title: getLangLabel('Rank', '排名'),
        dataIndex: 'index',
        width: '75px',
        align: 'center',
        ...fixed
      },
      {
        key: 'conference_name',
        title: isMobile ? getLangLabel('Conference Rank', '会议排名') : getLangLabel('Conference Name', '会议名称'),
        dataIndex: 'conference_name',
        width: isMobile ? '130px' : 'auto',
        align: 'center',
        ...fixed,
        // fixed: isFixed ? 'left' : undefined,
        // render: (val, row) => (<a href={`https://www.aminer.cn/conference/${row.id}`} className={styles.link} target="_blank" rel="noopener noreferrer">{val}</a>)
        render: (val, row) => <TableHeadComponent isMobile={isMobile} {...row} />
      },
      /*     {
            key: 'setting',
            width: '0px',
            title: '',
          } */
    ]
  }, [isMobile, lang])

  const columns = useMemo(() => {
    const prev = oldColumn.slice(isMobile ? 1 : 0, 2) // 移动端不显示排行那列，写到会议名称哪个组件里了
    const mid = selectedRows && selectedRows.map(key => (key in ROWS) && { ...ROWS[key], width: '100px' })
    const aff = oldColumn.slice(-1)
    return [...prev, ...mid]
  }, [selectedRows.join(''), isMobile, sysconfig.Locale])

  /* eslint-disable max-len */
  const tableColumns = useMemo(() => {
    return Object.keys(ROWS).map(key => ({ value: key, label: ROWS[key].title }))
  }, [Object.keys(ROWS).join(''), sysconfig.Locale])


  const changeTableRow = row => {
    // 当手机端选择三个以上时让表格滚动
    /*     const idx = row.findIndex(r => r === 'action')
        // 把action放在尾部
        if (idx > -1) {
          const target = row[idx]
          row.splice(idx, 1)
          row.push(target)
        } */
    setSelectedRows(row)

    localStorage.setItem('cr_rows', JSON.stringify(row))
  }

  const searchConference = (name) => {

    dispatch({
      type: 'rank/searchConference',
      payload: name
    })
  }

  return (
    <Layout
      pageTitle={pageTitle}
      pageKeywords={`${sysconfig.PageKeywords}, ${getLangLabel('Conference ranking, computer conference ranking, computer subject, computer top conference, computer top journal', '会议排名，计算机会议排名、计算机学科，计算机顶会，计算机顶刊')} `}
    >
      <div className={styles.index2}>
        <div className="header">
          <FM id="aminer.rank.conference.head.title" />
        </div>
        <div className={styles.container}>
          <div ref={panelRef} className={classnames('selection-wrapper', { floatTopClass: floatState })} >
            <div className="search-wrapper">
              <Search
                placeholder={getLangLabel('Search Conference', '搜索会议')}
                onSearch={searchConference}
                style={{ width: '100%' }}
                value={searchValue}
                onChange={el => { setSearchValue(el.target.value) }}
              />
            </div>
            <Selection2
              isFold={selectionState}
              selectedKeys={listParams}
              options={options}
              isMobile={isMobile}
              setFoldState={s => { setSelectionState(s); selectionStateLocal = s }}
              openCallback={() => setSettingState(false)}
              onSelectChange={onSelectChange} />
          </div>

          <div className="table-wrapper" >
            <div className="text">
              <span className="select-text">
                {listParams.category === 'All' ? getLangLabel(titleMap[listParams.category_type].en, titleMap[listParams.category_type].zh)
                  : getLangLabel(listParams.category_en, listParams.category)}
              </span>
              {/* <span className="select-text">{listParams.label ? getLangLabel(listParams.label, listParams.label_zh) : getLangLabel(listParams.category_en || 'All', (listParams.category === 'All' ? '全部' : listParams.category) || '')}</span> */}
              {/* <span className="select-text">{listParams.label ? getLangLabel(listParams.label, listParams.label_zh) : getLangLabel(listParams.category === 'All' ?: listParams.category_en || listParams.category_type, (listParams.category === 'All' ? listParams.category_type : listParams.category) || '')}</span> */}
              <a href="#" className={styles.tips} onClick={openTipsModal}><FM id="aminer.rank.conference.tips" /> </a>
            </div>

            <Table
              // bordered
              onChange={handleTableChange}
              rowKey="id"
              loading={loading}
              dataSource={confList}
              columns={columns}
              bordered
              /* scroll={{ x: 200 }} */
              scroll={isMobile ? { x: 350 } : undefined}
              // scroll={selectedRows.length > 3 ? { x: 1200 } : undefined}
              pagination={{
                current: currentPage,
                pageSize: 50,
                size: 'small'
              }}
              className="my-table"
            />
            <div className="setting-wrapper">
              <CheckboxDropDown
                isMobile={isMobile}
                isOpen={settingState}
                setOpenState={setSettingState}
                openCallback={() => setSelectionState(true)}
                options={tableColumns}
                parentOpenState={settingState}
                value={selectedRows}
                onChange={changeTableRow} />
            </div>
          </div>
          <div className="adv-wrapper">
            <DailyNews list={dailyList} />
          </div>

          <FeedbackButton link="https://jinshuju.net/f/HypZTy" />

          <BackTop />

          <div className="robot">
            <img src="https://originalstatic.aminer.cn/misc/dist/images/5337bd6ec6f99aca3c4b78e2afaf4a90.png"
              onClick={displayRobot} alt="" className="robot-img" />
            {isVisuable && <Robot displayRobot={displayRobot} openQ3Modal={openBarChartModal} />}
          </div>
        </div>
      </div>

    </Layout>
  );
}

ConfRank.getInitialProps = async (props) => {
  const { isServer, store, history } = props
  // console.log('getInitialProps')
  if (!isServer) { return }
  try {
    isServerRender = true
    const { location } = history
    const { query = {} } = location
    const { category_type = 'ccf' } = query
    // eslint-disable-next-line consistent-return
    console.log('query', query)
    console.log('getInitialProps server', isServer)
    await fetchTableData(store.dispatch, { ...query, category_type, isServer })
    await fetchTypes(store.dispatch, category_type)
  } catch (e) {
    console.log('e', e)

  }
  const { rank } = store.getState();
  return ({ rank })
};


export default page(connect(({ rank, loading, modal }) => ({
  confList: rank.confList,
  options: rank.options,
  dailyList: rank.dailyList,
  isServer: rank.isServer
})))(ConfRank)
