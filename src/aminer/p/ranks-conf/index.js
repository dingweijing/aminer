import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { page, connect, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import { Dropdown, Icon, Button, Menu, Radio, Row } from 'antd'
import helper from 'helper';
import { getQueryPath } from 'utils/utils'
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { Spin } from 'aminer/components/ui';
// import { logtime } from 'utils/log';
import { resolve } from 'url';
import { ConfRankList, ConfLeftMenu, DailyNews, MenuIcon, Robot } from './c';
import styles from './index.less';

const { getLangLabel } = helper

// -------- consts ------------------------------------

const mobile_title = 'ALL'; // ????????????????????

const getNewsList = ({ dispatch }) => {
  dispatch({
    type: 'rank/getDailyNews', payload: {}
  })
}


// -------- Components ------------------------------------

const listParams = { // onChangeType中的请求参数
  category_type: 'ccf', // ccf 或thu
  category: null,
  ccf_level: undefined,
  thu_level: undefined,
}

const ConfRank = props => {
  const search = props.location.query
  const { type, category, cj } = search || {}

  const { dispatch, loading, confList, dailyList, categories, subMenuList } = props;
  // const [dropDownName,setDropName]=useState(null)
  const [currentCategory, setCurrentCategory] = useState(listParams.category)
  const [currentType, setCurrentType] = useState(listParams.category_type)
  const [radioType, setRadioType] = useState(listParams.type)

  const matchRouteWithSubMenu = () => {
    const { category, category_type } = listParams
    const cjType = listParams.type
    helper.routeTo(props, { type: category_type, category, cj: cjType }, null)
    /*    setCurrentCategory(category && category.length ? category : undefined)
       setCurrentType(category_type || 'ccf')
       setRadioType(cjType) */
  }

  const fetchTableData = () => {
    dispatch({
      type: 'rank/getListConferenceRank', payload: listParams
    })
  }

  const getTypes = () => {
    dispatch({
      type: 'rank/getListCategoryType', payload: { category_type: type }
    })
  }


  // 选择左边的dropdown选项
  const onSelectCategory = async (selectedKey, children) => {
    if (selectedKey !== listParams.category_type) {
      listParams.category = undefined
      listParams.category_type = selectedKey
      listParams.type = undefined
      await dispatch({
        type: 'rank/setSubMenuList',
        payload: children
      })
      await fetchTableData()
      await matchRouteWithSubMenu()
    }
  }

  // 选择子选项
  const onChangeType = async key => {
    listParams.category = key
    setCurrentCategory(key)
    await fetchTableData()
    await matchRouteWithSubMenu()
  }

  const dropDownName = useMemo(() => {
    if (!categories || !Object.keys(categories).length) return getLangLabel('CCF Recommended List', 'CCF推荐国际学术会')
    const obj = categories[listParams.category_type] || {}
    const { name, name_zh = '' } = obj
    return getLangLabel(name, name_zh.slice(0, 10))
  }, [listParams.category_type])


  const menuRef = useRef();

  useEffect(() => {
    // console.log('useEffect, categories', categories)
    if (!categories || !categories.length) {
      getTypes(type)
    }

    if (!confList || !confList.length) {
      fetchTableData()
    }

    if (!dailyList || !dailyList.length) {
      getNewsList({ dispatch })
    }
    // // 把route的参数写入listparams中

    // listParams.category_type = type || 'ccf'
    // listParams.category = category
    // listParams.type = cj
    // matchRouteWithSubMenu()
  }, [])


  const titleZoneFuncs = [
    <MenuTitle key="conf_menu_title" />
  ]

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


  /*   const liftMenu = useMemo(() => (
      <ConfLeftMenu
        ref={menuRef}
        list={subMenuList}
        onChangeSide={onChangeType}
        selected={currentCategory}
        titleZoneFuncs={titleZoneFuncs}
      />
    ), [listParams.category, listParams.category_type]) */

  const setRadio = e => {
    const { value } = e.target
    setRadioType(value)
    listParams.type = value
    matchRouteWithSubMenu()
    fetchTableData()
  }

  const table = useMemo(() => !(type && !subMenuList) && (
    <ConfRankList items={confList || []} />
  ), [currentType, currentCategory, confList && confList.length])

  if (type && !subMenuList) {
    return false;
  }


  const mymenu = useMemo(() => {
    if (!categories) return null;
    const keys = Object.keys(categories)
    const bigCategory = keys.map(key => (categories[key]))
    if (!bigCategory || !bigCategory.length) return null;
    return (
      <Menu >
        {bigCategory.map(({ name, name_zh, children }, index) => (
          <Menu.Item key={name}
            onClick={() => onSelectCategory(keys[index], children)}>
            {getLangLabel(name, name_zh)}
          </Menu.Item>))}
      </Menu>
    )
  }, [categories]);


  return (
    <Layout
      pageTitle={pageTitle}
      pageKeywords={`${sysconfig.PageKeywords}, 会议排名，计算机会议排名、计算机学科，计算机顶会，计算机顶刊`}
      autoScale={1200}
    >
      <article className={styles.confRank}>
        <div className="container">

          <DailyNews dailyList={dailyList} />

          <div className="mobile_device tobestpaper">
            <Link to="/bestpaper">
              <FM id="aminer.home.rankings.best" defaultMessage="Best Papers vs. Top Cited Papers" />
            </Link>
          </div>
          <div className="mobile_device tobestpaper">
            <Link to="/resources/awards-se.html">
              <span>自然科学类奖项</span>
            </Link>
          </div>
          <h1 className="title">
            <span className="desktop_device">
              <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank" />
              <FM id="aminer.common.colon" defaultMessage=": " />
              <FM id="aminer.rank.conf.title" defaultMessage="Computer Science" />
            </span>
            <span className="mobile_device">
              {mobile_title}
            </span>
            <MenuIcon menuRef={menuRef}>
              <svg className="icon mobile_device" aria-hidden="true">
                <use xlinkHref="#icon-menu1" />
              </svg>
            </MenuIcon>
            <div className="right">
              <Link to="/bestpaper" className="desktop_device tobestpaper">
                <FM id="aminer.home.rankings.best" defaultMessage="Best Papers vs Top Cited Papers" />
              </Link>
              <Link to="/resources/awards-se.html" className="desktop_device tobestpaper">
                <span>自然科学类奖项</span>
              </Link>
            </div>

          </h1>

          <div className="list_content">
            <div className="left-wrapper">
              <div className="radio-wrapper">
                <Radio.Group onChange={setRadio} value={radioType}>
                  <Radio value={undefined}>{getLangLabel('All', '所有')} </Radio>
                  <Radio value="C">{getLangLabel('Conference', '会议')} </Radio>
                  <Radio value="J">{getLangLabel('Journal', '期刊')} </Radio>

                </Radio.Group>
              </div>

              <Dropdown overlay={mymenu} >
                <Button>
                  {dropDownName}
                  <Icon type="down" />
                </Button>
              </Dropdown>
              <ConfLeftMenu
                ref={menuRef}
                list={subMenuList}
                onChangeSide={onChangeType}
                selected={currentCategory}
                titleZoneFuncs={titleZoneFuncs}
              />
            </div>
            <div className="right">
              <Spin loading={!!loading} />
              {table}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}


ConfRank.getInitialProps = async ({ store, isServer, location }) => {
  if (!isServer) { return }
  const { query = {} } = location
  const { category = null, type = 'ccf' } = query
  await store.dispatch({
    type: 'rank/getListCategoryType', payload: { category_type: type }
  })
  await store.dispatch({
    type: 'rank/getListConferenceRank', payload: { ...listParams, category_type: type, category }
  })
  await store.dispatch({
    type: 'rank/getDailyNews', payload: {}
  })
  const { rank } = store.getState();
  const { categories, subMenuList, currentConfType, confList, dailyList } = rank
  return { categories, subMenuList, currentConfType, confList, dailyList };
};

export default page(connect(({ rank, loading }) => ({
  categories: rank.categories,
  subMenuList: rank.subMenuList,
  // currentConfType: rank.currentConfType,
  confList: rank.confList,
  loading: loading.effects['rank/getListConferenceRank'] || loading.effects['rank/getConfAndDailyList'],
  dailyList: rank.dailyList,
})))(ConfRank)


const MenuTitle = () => (
  <div className="menu_title mobile_device">
    <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank" />
    <FM id="aminer.common.colon" defaultMessage=": " />
    <FM id="aminer.rank.conf.title" defaultMessage="Computer Science" />
  </div>
)
