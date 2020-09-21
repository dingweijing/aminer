import React, { useEffect, useState, useMemo, useRef } from 'react';
import { page, connect, router } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import consts from 'consts';

import { Select, Skeleton, Pagination, Row, Col, Icon, Spin, Input } from 'antd'
import { Layout, EmptyLayout } from 'aminer/layouts';
import TabPageScroll from 'components/ui/TabPageScroll'
import { isMobile } from 'utils'
import { loadWechatJSSDK } from 'utils/requirejs';
import { Modal, ZoomingImage as ZoomingImageModal } from 'aminer/components/widgets';
import MessageBoard from '../p/ai2000/c/MessageBoard'
import { Text, Paragraph } from './components/Text'
import { CompanyInfo, CompanyPerson } from './components/CompanyComponent'
import Header from './components/Header'
import Menu from './components/Header/Menu'
import Footer from './components/Footer'
import My3DBalls from './components/3DBalls'
import Panel from './components/Panel'
import PersonCard from './components/PersonCard'

import Drawer from './components/Drawer'
import CompanyDetailPage from './companyDetail'
import { localSelections, menu } from './constants/company'
import { Rank, List, IndexPage } from './containers'
import styles from './index.less';

const isMobileState = isMobile() || document.body.clientWidth < 700
const { Search } = Input;
const PAGE_SIZE = 25

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
let selectItem = { page: 0, offset: 0, size: 10 }

const canbeJSON = str => {
  try {
    JSON.parse(str)
    return true
  } catch (err) {
    return false
  }
}

const Home = props => {
  const { location: { pathname, host }, dispatch, modal, aiopenCompany: { list, bannerCompany, selections, detail, loading, total } } = props
  const [showSelection, setShowSelection] = useState(true)
  const [showIndex, setShowIndex] = useState(0)
  const [showTips, setShowTips] = useState(true)
  const [aiTypeDesc, setAiTypeDesc] = useState(false)
  const [currentPage, setPage] = useState(1)
  const [showSlider, setSliderVisible] = useState(false) // 显示侧栏
  const [openSlider, setSliderFoldable] = useState(true) // 展开侧栏
  const infoRef = useRef()


  const fetchList = (params = {}) => {
    const p = selectItem.page || 0
    const { ai_type, sort_by } = selectItem

    if (ai_type && ai_type.length && typeof ai_type === 'string' && canbeJSON(ai_type)) { // 因为ai_type字段是object类型，这里要处理一下
      const { title, desc } = JSON.parse(ai_type)
      setAiTypeDesc(desc) // 不同aitype要在下方显示其对应的行业描述
      selectItem.ai_type = title
    } else if (aiTypeDesc && aiTypeDesc.length) {
      setAiTypeDesc(false)
    }

    if (sort_by && sort_by.length && typeof sort_by === 'string' && canbeJSON(sort_by)) {
      const { desc, index } = JSON.parse(sort_by)
      setAiTypeDesc(desc) // 不同aitype要在下方显示其对应的行业描述
      selectItem.sort_by = index
    }
    dispatch({
      type: 'aiopenCompany/getRankList',
      payload: {
        ...selectItem,
        offset: PAGE_SIZE * (p),
        size: PAGE_SIZE
      }
    })
  }

  const onSearch = search => {
    dispatch({
      type: 'aiopenCompany/getRankList',
      payload: {
        search,
        offset: 0,
        size: PAGE_SIZE
      }
    })
  }

  const onSelect = (type, v) => {
    if (!v) {
      delete selectItem[type]
    } else {
      selectItem[type] = v
    }
    const { province, industry, sort_by, ai_type } = selectItem
    setShowTips(!province && !ai_type && !sort_by)
    fetchList()
  }

  const fetchDetail = () => {
    dispatch({
      type: 'aiopenCompany/getCompanyPerson',
      params: {}
    })
  }

  const onPaginationChange = (current, pageSize) => {
    setPage(current)
    selectItem.page = current - 1
    fetchList()
  }

  const changeTab = tabIndex => {
    // 0: 创新公司
    // 1: 巨头
    // 2: 跳转ai2000
    switch (tabIndex) {
      case 1: {
        setShowSelection(false)
        dispatch({
          type: 'aiopenCompany/getRankList',
          payload: { type: 'giant' }
        })
        break;
      }
      case 0: {
        setShowSelection(true)
        fetchList()
        setShowIndex(0)
        break;
      }
      default: {
        break;
      }
    }
    setPage(1)
    selectItem = {}
  }

  const listener = evt => {
    const el = infoRef.current
    const top = el.offsetTop
    const scrollHeight = window.scrollY
    setSliderVisible(scrollHeight > top)
  }

  useEffect(() => {
    dispatch({
      type: 'aiopenCompany/getBannerCompany',
    })
    dispatch({
      type: 'aiopenCompany/getSelections',
    })
    fetchList()
    fetchDetail()

    window.addEventListener('scroll', listener)


    dispatch({
      type: 'aminerAI10/GetWechatSignature',
      payload: {
        url: 'https://www.aiopenindex.com/industry',
      },
    }).then(data => {
      loadWechatJSSDK(wx => {
        const { appId, nonceStr, signature, timestamp } = data;
        const option = {
          // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId,
          nonceStr,
          signature,
          timestamp,
          jsApiList: [
            // 'updateAppMessageShareData', // “分享给朋友”及“分享到QQ”
            // 'updateTimelineShareData', // “分享到朋友圈”及“分享到QQ空间”
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
          ], // 必填，需要使用的JS接口列表
        };
        wx.config(option);
        wx.ready(() => {
          // 需在用户可能点击分享按钮前就先调用
          // const desc = '';
          const shareLink = 'https://www.aiopenindex.com/industry';

          wx.onMenuShareAppMessage({
            title: '中国人工智能产业格局', // 分享标题
            desc: '用AI算法寻找下一个十年里闪耀中国的AI企业。', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://fileserver.aminer.cn/data/ai_company/rgzngj.jpg', // 分享图标
            success: () => {
              console.log('success')
              // alert('aaaaaaaaaaaaaaaaa');
              // 设置成功
            },
          });
          wx.onMenuShareTimeline({
            title: '中国人工智能产业格局', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://fileserver.aminer.cn/data/ai_company/rgzngj.jpg', // 分享图标
            success: () => {
              console.log('success')
              // alert('bbbbbbbbbbbbbbbbb');
              // 设置成功
            },
          });
        });

        wx.error(res => {
          // alert(JSON.stringify(res));
        });
      });
    });

    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])

  const goDetail = id => {
    // 内页
    /*  dispatch({
       type: 'aiopenCompany/getCompanyDetail',
       payload: { com_id: id }
     })
     setShowIndex(1) */
    // 跳转外部
    router.push(`/industryDetail?com_id=${id}`);
  }

  /*   const finishRenderWebGl = state => {
      setFinishedWebGl(state)
    } */


  const type = showSelection ? 'normal' : 'giant'


  return (
    <EmptyLayout
      className={styles.companyWrapper}
      pageTitle="AI OPEN INDEX"
      pageSubTitle="AI 2000"
      {...props}
    >
      {!isMobileState && <My3DBalls companyList={bannerCompany} />}
      <Header type="company" className={styles.myHeader} isIndex={false} defaultMenuIndex={100} />
      <div className={styles.companyWrapper} ref={infoRef}>
        <Menu opts={menu} className="mymenu" onClick={changeTab} ></Menu>
        <TabPageScroll nextIndex={showIndex}>
          <div>
            <Panel outClassName={showSelection ? 'myPanelShow' : 'myPanelHide'} className="topSelect">
              {/* eslint-disable react/jsx-no-bind */}
              <Search
                className="mySearch"
                placeholder="搜索公司"
                onSearch={value => onSearch(value)}
                style={{ width: 200 }}
              />
              <Select className="mySelect" defaultValue=""
                onSelect={onSelect.bind(null, 'province')}>
                <Select.Option key="all" value="">全国</Select.Option>
                {selections.province && selections.province.map(opt => (<Select.Option key={opt}>{opt}</Select.Option>))}
              </Select>

              {/*   <Select className="mySelect" defaultValue="" onSelect={onSelect.bind(null, 'industry')}>
                <Select.Option key="all" value="">全部行业</Select.Option>
                {selections.industry && selections.industry.map(opt => (<Select.Option key={opt}>{opt}</Select.Option>))}
              </Select> */}

              <Select className="mySelect" defaultValue="" onSelect={onSelect.bind(null, 'ai_type')}>
                <Select.Option key="all" value="">全部企业类型</Select.Option>
                {selections.ai_type && selections.ai_type.map(opt => (<Select.Option key={opt.title} value={JSON.stringify(opt)}>{opt.title}</Select.Option>))}
              </Select>

              <Select className="mySelect" defaultValue="请选择排序方式" onSelect={onSelect.bind(null, 'sort_by')}>
                <Select.Option key=" " value="">请选择排序方式</Select.Option>
                {selections.sort_by.map(opt => (<Select.Option key={opt.title} value={JSON.stringify(opt)}>{opt.title}</Select.Option>))}
              </Select>


            </Panel>

            {showTips && <p className="tips">排序不分先后</p>}
            {aiTypeDesc && aiTypeDesc.length && <p className="tips">{aiTypeDesc}</p>}

            {/* 留言板 */}
            {showSlider && <div className={styles.slideWrapper}>
              {openSlider ? <div>
                <a className="joinBtn" rel="noopener noreferrer" target="_blank" href="https://jinshuju.net/f/Yb9E9f">我想加入</a>
                {isMobileState ? null : <div className="commentWrapper">
                  <MessageBoard trackType="ai" comment_id="5ee82a21af67239695222a81" />
                  <div className="folder" onClick={() => { setSliderFoldable(false) }}>收起</div>
                </div>}
              </div> :

                <div className="plusWrapper" onClick={() => { setSliderFoldable(true) }}>
                  <Icon type="plus" />
                </div>}

            </div>}
            <Spin spinning={loading} indicator={antIcon}>
              {list && list.length ? list.map(item => (
                <Drawer
                  key={item.id}
                  data={{ ...item, type }}
                  hiderData={item.members}
                  openInOuter={false}
                  renderTop={(data, handleDrawerToggle) => <Panel><CompanyInfo {...data} type={type} handleDrawerToggle={handleDrawerToggle} go={goDetail} /></Panel>}
                  renderHider={data => <Panel outClassName="personWrapper">
                    <CompanyPerson data={data} type={type} /></Panel>}
                />
              )) :
                (<Panel>您好，您的公司暂未收录。如果您认为自己的公司具有很强的技术创新性，请

                  <a href="https://jinshuju.net/f/Yb9E9f" rel="noopener noreferrer" target="_blank">点击链接</a>填写报名表单，我们审核之后，会跟您联系。感谢您的关注。</Panel>)
              }
            </Spin>

            <div className="pagination-wrapper">
              <Pagination onChange={onPaginationChange} current={currentPage} pageSize={PAGE_SIZE} total={total} />
            </div>
          </div>
          {/*
            留言板

          <div>
            <div className={styles.commentWrapper}>
              <MessageBoard trackType="ai" comment_id="5e5c5040eb2fa482998aae7d" />

            </div>
          </div> */}


          {/* <div className={styles.companyDetail}>
          <div className="icon-wrapper" onClick={() => { setShowIndex(0) }}>
            <Icon type="left" className="goBack" ></Icon>
            返回列表页
          </div>
          <Panel>
            <h2>{name_zh}</h2>
            <Row>
              <Text label="成立时间" value={start_time}></Text>
              <Text label="行   业" value={industry}></Text>
            </Row>
            <Row>
              <Paragraph label="公司简介" value={business_scope} />
              <Paragraph label="经营范围" value={business_scope} />
            </Row>
          </Panel>

          <Panel title="核心团队" className="teamWrapper">
            {members && members.map(bus => (<PersonCard {...bus} />))}
          </Panel>
          <Panel title="核心业务" className="businessWrapper">
            {business.map(bus => (<div className="businessInner">
              <Text label="名      称" value={bus.name}></Text>
              <Text label="产品标签" value={bus.tag}></Text>
              <Text label="介      绍" value={bus.introduction}></Text>
            </div>))}
          </Panel>
          {news && <Panel title="新闻舆情" className="newsWrapper">
            {news.map(n => (<div className="newsInner" />))}
          </Panel>}


        </div> */}

        </TabPageScroll>
      </div>
      <Modal />

      <Footer />
    </EmptyLayout>
  )
};


/* eslint-disable consistent-return */
/* Home.getInitialProps = async ({store, route, isServer}) => {
  // console.log('--------store', global);
  if (!isServer) return;
  await store.dispatch({type: 'aminerCommon/getHomeData', payload: {size: 5 } })
  const {report, aminerCommon} = store.getState();
  return {report, aminerCommon};
    }; */
export default connect(({ aiopenCompany, modal }) => ({ aiopenCompany, modal }))(page()(Home));
