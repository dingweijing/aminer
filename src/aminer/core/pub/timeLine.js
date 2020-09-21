import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { classnames } from 'utils';
// import consts from 'consts';
import { sysconfig } from 'systems';
import qs from 'qs';
import { LangIndicator } from 'aminer/layouts/header/widgets';
import { loadWechatJSSDK } from 'utils/requirejs';
import { Timeline, Modal, Checkbox, Button, BackTop, Row, Col } from 'antd';
import PaperListTiny from 'aminer/core/pub/PaperListTiny';
import { FM, formatMessage } from 'locales';
import InfiniteScroll from 'react-infinite-scroller';
import { Spin } from 'aminer/components/ui';
import { getLangLabel } from 'helper/';
import CovidBanner from './CovidBanner';
import styles from './timeLine.less';
import specialistLocal from './specialist';
import withCollapse from './withCollapse';
import NewsList from './TimeLine/ExpertNews'

import {
  localeId_topic_map,
  typeOptions,
  topicOptions,
  // specialistOptions,
} from './constants_timeline';


const CollapseTimeline = withCollapse(Timeline);

const goPage = (evt, url, saveType) => {
  evt.preventDefault()
  const w = window.open('about:blank');
  w.location.href = url;
  saveType()
  evt.stopPropagation();
};

function ExpertsPoint(props) {
  const { point, className, isSpecialist = false, saveType } = props;
  const { id, content = '', content_en = '', name = '', img, link } = point;
  return (
    <div className={classnames(styles.expertsPoint, styles[className])} id={id}>
      <a
        onClick={evt => goPage(evt, `https://www.aminer.cn/profile/${id}`, saveType)}
      >
        {!isSpecialist && (
          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrap}>
              <img src={img} className={styles.avatar} alt={name} />
            </div>
            <div className={styles.expertName}>{name}</div>
          </div>
        )}
      </a>
      {link ? (
        <a
          className={styles.timeLineLink}
          onClick={evt => goPage(evt, link, saveType)}
        >
          <div className={styles.content}>{getLangLabel(content_en, content)}</div>
        </a>
      ) : (
          <div className={styles.content}>{getLangLabel(content_en, content)}</div>
        )}
    </div>
  );
}

function KeyEvent(props) {
  const { event, className, saveType } = props;
  const { id, content = '', link, content_en } = event;
  return (
    <div className={classnames(styles.keyEvent, styles[className])} id={id}>
      {link ? (
        <a
          href={link}
          className={styles.timeLineLink}
          onClick={evt => goPage(evt, link, saveType)}
        >
          <div className={styles.content}>{getLangLabel(content_en, content)}</div>
        </a>
      ) : (
          <div className={styles.content}>{getLangLabel(content_en, content)}</div>
        )}
    </div>
  );
}

// function isMobileFunc() {
//   let isMobiles;
//   if (global && global.isMobile) {
//     isMobiles = global.isMobile;
//   } else if (window && window.navigator && window.navigator.userAgent) {
//     isMobiles = /mobile|android|iphone|ipad|phone/i.test(window.navigator.userAgent)
//   }
//   return isMobiles;
// }

function Like(props) {
  const { id, updateLike, likeData } = props;
  return (
    <div className={styles.like} onClick={() => updateLike(id)}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-zan" />
      </svg>
      <div className={styles.likeNum}>{likeData || 0}</div>
    </div>
  );
}

const ALL_TYPE = ['allType'];
const ALL_TOPIC = ['allTopic'];

@connect(({ timeLine, aminerCommon }) => ({
  timeLine,
  wechatVer: aminerCommon.wechatVer,
}))
class TimeLine extends PureComponent {
  constructor(props) {
    super(props);

    const localType = ALL_TYPE;
    const localTopic = ALL_TOPIC;

    this.state = {
      visible: false,
      defaultCollapse: false,
    };
    this.page = 0;
    this.pageSize = 20;
    this.end = false;
    this.type = localType;
    this.classes = localTopic;
    this.locale = sysconfig.Locale || 'zh-CN';
    this.saveType = this.saveType.bind(this)
  }

  componentDidMount() {
    const { timeLine } = this.props;
    // const { type = ALL_TYPE, classes = ALL_TOPIC } = qs.parse(location.search.split('?')[1]);
    const localType = /*  type ||  */ window.sessionStorage.getItem('localType');
    const localTopic = /* classes || */ window.sessionStorage.getItem('localTopic');
    const localTop = window.sessionStorage.getItem('top') || 0;
    this.type = localType ? localType.split(',') : ALL_TYPE;
    this.classes = localTopic ? localTopic.split(',') : ALL_TOPIC;

    if (
      !timeLine.pubData ||
      !localType ||
      !localTopic ||
      (localType.includes('专家') && !timeLine.spcialistList.length)
    ) {
      this.getData();
    } else {
      this.page = 1;
    }
    this.setWechatShare();
    document.documentElement.scrollTop = localTop;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'aminerCommon/setWechatVer',
      payload: {
        ver: false,
      },
    });
    this.saveType(true);
  }

  loadMore = () => {
    const isSpecialist = this.type[0] === '专家';
    if (!isSpecialist) {
      this.page += 1;
      this.getData();
    }
  };

  getExpertNews = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeLine/getExpertNews',
      payload: {
        id
      },
    });
  }

  // 专家展开时的事件
  handleCollapseOpen = d => {
    const { id } = specialistLocal[d.name]
    if (id) {
      this.getExpertNews(id)
    }
  }

  getData = pass => {
    const { dispatch, timeLine } = this.props;
    const { total, pubData } = timeLine;
    const isExpert = this.type[0] === '专家';
    const { defaultCollapse } = this.state;

    if (!pass && pubData.length === total) {
      this.end = true;
      return;
    }
    if (
      isExpert &&
      ((this.classes[0] === 'allTopic' && defaultCollapse) || this.classes[0] !== 'allTopic')
    ) {
      this.setState({
        defaultCollapse: true,
      });
    }

    dispatch({
      type: 'timeLine/getPubTimeLine',
      payload: {
        type: isExpert ? ['allType'] : this.type,
        classes: /* reset && classes ? classes.split(',') : */ this.classes,
        skip: this.page * this.pageSize,
        limit: isExpert ? 2000 : this.pageSize,
        pass,
        isExpert,
      },
    })
  };

  setWechatShare = () => {
    const { wechatVer, dispatch, location } = this.props;
    const { pathname, search } = location;
    if (wechatVer) {
      return;
    }
    dispatch({
      type: 'aminerCommon/setWechatVer',
      payload: {
        ver: true,
      },
    });
    dispatch({
      type: 'aminerAI10/GetWechatSignature',
      payload: {
        url: `https://www.aminer.cn${pathname}${search}`,
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
          const shareLink = `https://www.aminer.cn${pathname}`;

          wx.onMenuShareAppMessage({
            title: '新型冠状病毒感染肺炎学术成果时间线 - AMiner', // 分享标题
            desc: '聚合新冠病毒肺炎(COVID-19)最新研究情报，解读最新学术成果、专家论点。', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://static.aminer.cn/misc/ncov/ncpshare.png', // 分享图标
            success: () => {
              // console.log('onMenuShareAppMessage 设置成功1');
              // 设置成功
            },
          });
          wx.onMenuShareTimeline({
            title: '新型冠状病毒感染肺炎学术成果时间线 - AMiner', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://static.aminer.cn/misc/ncov/ncpshare.png', // 分享图标
            success: () => {
              // console.log('onMenuShareTimeline 设置成功2');
              // 设置成功
            },
          });
        });

        wx.error(res => {
          // alert(JSON.stringify(res));
        });
      });
    });
  };

  getTimeLineContent = item => {
    let Component = null;
    let props = {};
    const { saveType } = this
    switch (item.type) {
      case '学术论文':
        Component = PaperListTiny;
        props = {
          id: 'aminerPaperList',
          paper: item,
          isPaperOuter: true,
        };
        break;
      case '专家论点':
        Component = ExpertsPoint;
        props = {
          id: 'expertsPoint',
          point: item,
          isSpecialist: this.type[0] === '专家',
          saveType,
        };
        break;
      case '学术事件':
        Component = KeyEvent;
        props = {
          id: 'keyEvent',
          event: item,
          saveType,
        };
        break;
      default:
        Component = PaperListTiny;
        props = {
          id: 'aminerPaperList',
          paper: item,
          isPaperOuter: true,
        };
        break;
    }
    return { Component, props };
  };

  onTypeClick = e => {
    const clickedValue = e.target.value; // 点击的 filter

    // const { dispatch } = this.props;
    const isClickedValueChecked = this.type.find(item => item === clickedValue); // 点击的 filter 是否已选中
    let newTypeChecked = [...this.type];

    // 专家
    /* f (clickedValue === '专家') {
      // this.classes = [];
      this.classes = !this.type.includes('专家') ? ['allTopic'] : this.classes;
      this.type = newTypeChecked.includes(clickedValue) ? ['allType'] : [clickedValue];

      this.page = 0;
      this.getData(1);
      return;
    } */
    /*  if (this.type.includes('专家') && clickedValue !== '专家') {
      this.classes = ['allTopic'];
    } */

    /* const idx = newTypeChecked.findIndex(i => i === '专家');
    if (idx > -1) {
      newTypeChecked.splice(idx, 1);
    } */

    if (clickedValue === 'allType') {
      if (isClickedValueChecked) return;
      newTypeChecked = ['allType'];
    } else if (clickedValue === '专家') {
      newTypeChecked = ['专家'];
    } else {
      if (this.type.find(item => item === 'allType')) {
        newTypeChecked = newTypeChecked.filter(item => item !== 'allType');
      }

      if (this.type.includes('专家')) {
        newTypeChecked = newTypeChecked.filter(item => item !== '专家');
      }

      if (isClickedValueChecked) {
        newTypeChecked = newTypeChecked.filter(item => item !== clickedValue);
        if (!newTypeChecked.length) newTypeChecked = ['allType'];
      } else {
        newTypeChecked.push(clickedValue);
      }
    }
    // this.setState({ typeChecked: newTypeChecked });
    this.type = newTypeChecked;
    this.page = 0;
    this.end = false;
    this.getData(1);
  };

  onTopicClick = e => {
    const clickedValue = e.target.value;
    // const { dispatch } = this.props;
    const isClickedValueChecked = this.classes.find(item => item === clickedValue); // 点击的 filter 是否已选中
    // const isSpecialList = this.type[0] === '专家';
    let newTopicChecked = [...this.classes];

    if (clickedValue === 'allTopic') {
      if (isClickedValueChecked) return;
      newTopicChecked = ['allTopic'];
    } else {
      if (this.classes.find(item => item === 'allTopic')) {
        newTopicChecked = newTopicChecked.filter(item => item !== 'allTopic');
      }
      if (isClickedValueChecked) {
        newTopicChecked = newTopicChecked.filter(item => item !== clickedValue);
        if (!newTopicChecked.length) newTopicChecked = ['allTopic'];
      } else {
        newTopicChecked.push(clickedValue);
      }
    }
    this.classes = newTopicChecked;
    this.page = 0;
    this.end = false;
    this.getData(1);
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  updateLike = id => {
    if (!id) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'timeLine/updateLike',
      payload: { id },
    });
  };

  // 这里存储用于解决中英切换重刷页面的问题
  saveType = () => {
    const { type, classes } = this;
    const top = document.documentElement.scrollTop;
    window.sessionStorage.setItem('localType', type);
    window.sessionStorage.setItem('localTopic', classes);
    window.sessionStorage.setItem('top', top);
    const str = qs.stringify({ type, classes });
    window.history.pushState(null, null, `?${str}`);
  };

  render() {
    const {
      pubData,
      updateTime,
      expert_loading,
      likeData,
      total,
      expertMap,
      spcialistList,
    } = this.props.timeLine;
    const { visible } = this.state;
    const isSpecialist = this.type[0] === '专家';
    const isEN = this.locale.includes('en');
    // const subOptions = isSpecialist ? specialistOptions : topicOptions;
    const subOptions = /* isSpecialist ? specialistOptions :  */ topicOptions;
    // console.log('spcialistList', spcialistList)
    return (
      <Layout
        pageTitle="AMiner-疫情科研论文事件-学术成果"
        pageDesc="AMiner学术成果栏目通过学术成果时间线的方式，提供近期疫情科研学术成果，包括近期疫情论文，疫情论点，疫情等事件新闻动态。"
        pageKeywords={[
          '疫情论文',
          '疫情科研',
          '疫情事件',
          '疫情论点',
          '新冠疫情',
          '武汉疫情',
          '新冠肺炎',
          'AMiner',
        ]}
        covidHeader={<CovidBanner />}
        rightZone={[]}
      >
        <div className={styles.timeLine}>
          {/* { SEO } */}
          <h1 style={{ display: 'none' }}>AMiner-新冠疫情专题</h1>
          {/* <div className={styles.feedback}>
            <a
              style={{ outline: 'none' }}
              onClick={evt => goPage(evt, 'http://aminer-scholar.mikecrm.com/7yonX25', this.saveType)}
            >
              <i className="fa fa-commenting-o feedbackBtn" aria-hidden="true" />
            </a>
          </div> */}
          {/* <div className={styles.tips}>
            <img src="https://originalstatic.aminer.cn/misc/ncov/xstt.png" alt="学术头条" />
          </div> */}
          <div className={[styles.timeLineImgBox, isEN && styles.timeLineImgBox_en].join(' ')}>
            <div className={styles.titleWrap}>
              <div className={[styles.title, isEN && styles.title_en].join(' ')}>
                <FM id="timeline.title1" />
              </div>
              {/* <div className={styles.subTitle}>新冠肺炎学术成果时间线</div> */}
              <div className={[styles.subTitle, isEN && styles.subTitle_en].join(' ')}>
                <FM id="timeline.title2" />
              </div>
              <div className={[styles.subTitle, isEN && styles.subTitle_en].join(' ')}>
                {' '}
                <FM id="timeline.title3" />
              </div>
              <div className={styles.subSubTitle}>
                ·Nature ·Science ·NEJM ·JAMA ·Lancet ·PNAS ·bioRxiv ·medRxiv
              </div>
              <div className={[styles.subSubTitle, isEN && styles.subSubTitle_en].join(' ')}>
                ·Coronavirus ·nCoV-2019 ·COVID-19 ·SARS-CoV-2
              </div>
              {/*   <div className={styles.subSubTitle}>
                ·钟南山 ·李兰娟 ·石正丽 ·张文宏 ·Lipkin ·Roberto Burioni etc.
              </div> */}
            </div>
            <div className={styles.imgWrap}>
              <img
                className={styles.img}
                src="https://fileserver.aminer.cn/sys/aminer/ncovbg.png"
                alt="论文时间线"
              />
            </div>
          </div>
          <div className={styles.timeLineData}>
            <BackTop />
            <div className={styles.LangIndicator}>
              <LangIndicator className="home" visible onClick={this.saveType} />
            </div>
            <div className={styles.filterWrap}>
              <div className={styles.filter}>
                <div className={styles.filterItem}>
                  <div className={styles.itemTitle}>
                    <FM id="timeline.checkbox.name1" defaultMessage="成果类型："></FM>
                  </div>
                  <Checkbox.Group className={styles.checkbox1} value={this.type}>
                    <Row>
                      <Col span={4} lg={isEN ? 6 : 4} xs={isEN ? 12 : 8}>
                        <Checkbox value="allType" onClick={this.onTypeClick}>
                          <FM id="timeline.all" defaultMessage="全部" />
                        </Checkbox>
                      </Col>
                      {typeOptions.map(item => (
                        <Col span={4} lg={isEN ? 6 : 4} xs={isEN ? 12 : 8} key={item.value}>
                          <Checkbox key={item.value} value={item.value} onClick={this.onTypeClick}>
                            <span className={item.isNew ? styles.newCheck : ''}>
                              {/* {item.label} */}
                              <FM id={item.id} defaultMessage={item.label} />
                            </span>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.itemTitle}>
                    <FM id="timeline.checkbox.name2" defaultMessage="研究主题："></FM>
                  </div>
                  <Checkbox.Group className={styles.checkbox2} value={this.classes}>
                    <Row>
                      <Col span={4} lg={isEN ? 6 : 4} xs={isEN ? 12 : 8}>
                        <Checkbox
                          value="allTopic"
                          onClick={this.onTopicClick}
                          className={styles.topicOption}
                        >
                          <FM id="timeline.all" defaultMessage="全部" />
                        </Checkbox>
                      </Col>
                      {subOptions.map(item => (
                        <Col span={4} lg={isEN ? 6 : 4} xs={isEN ? 12 : 8} key={item.value}>
                          <Checkbox
                            key={item.value}
                            value={item.value}
                            onClick={this.onTopicClick}
                            className={styles.topicOption}
                          >
                            <FM id={item.id} defaultMessage={item.label} />
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              </div>
              <div className={styles.otherInfo}>
                {updateTime && (
                  <span className={styles.updateTime}>
                    {formatMessage({ id: 'timeline.updateTime', defaultMessage: '更新时间' })}：
                    {updateTime}
                  </span>
                )}
                <span onClick={this.showModal} style={{ cursor: 'pointer', color: '#444' }}>
                  <FM id="timeline.Disclaimer.title" defaultMessage="免责声明"></FM>
                </span>
              </div>
            </div>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={isSpecialist ? false : !this.end}
            >
              {(isSpecialist ? spcialistList : [{}]).map((d, idx) => {
                const subData = isSpecialist ? d.data : pubData || [];
                const typesProps = {
                  ...specialistLocal[d.name],
                  type: this.type.join(','),
                  classes: this.classes.join(','),
                  saveType: this.saveType,
                  isEN,
                };
                const id = d && d.name ? specialistLocal[d.name].id : null
                const expert_news = isSpecialist && expertMap && id ? expertMap[id] : []
                const collapseProps = {
                  headData: typesProps,
                  footData: typesProps,
                  showHead: true,
                  showFoot: false,
                  defaultVisible: !this.classes.includes('allTopic') && isSpecialist,
                  opencb: () => this.handleCollapseOpen(d),
                  collapse: isSpecialist,
                  loading: isSpecialist && expert_loading
                }
                return (
                  <CollapseTimeline
                    mode="left"
                    key={d.name}
                    {...collapseProps}
                  >
                    {isSpecialist && <div className={styles.expertTitle}>实时动态</div>}
                    {isSpecialist && <NewsList expert_news={expert_news} goPage={goPage} saveType={this.saveType} />}
                    {isSpecialist && <div className={styles.expertTitle}>学术进展</div>}
                    {subData &&
                      subData.map((item, index) => {
                        const { Component, props } = this.getTimeLineContent(item, index);
                        let timeLineTime = null;
                        let timeLineType = null;
                        let timeLineTopic = null;
                        if (item.type) {
                          timeLineType = (
                            <span
                              className={classnames(styles.timeLineTypeTag, {
                                [styles.type]: item.type === '必读论文',
                              })}
                            >
                              {localeId_topic_map[item.type]
                                ? formatMessage({
                                  id: localeId_topic_map[item.type],
                                  defaultMessage: item.type,
                                })
                                : item.type}
                            </span>
                          );
                        }
                        if (item.time) {
                          timeLineTime = (
                            <span
                              className={classnames(styles.timeLineDate, {
                                [styles.titleBlue]: index === 0,
                              })}
                            >
                              {item.time}
                            </span>
                          );
                        }
                        if (item.class) {
                          timeLineTopic = (
                            <span className={classnames(styles.timeLineTypeTag)}>
                              {localeId_topic_map[item.class]
                                ? formatMessage({
                                  id: localeId_topic_map[item.class],
                                  defaultMessage: item.class,
                                })
                                : item.class}
                            </span>
                          );
                        }
                        return (
                          <Timeline.Item
                            key={`${item.aid || item.id || index}${index}`}
                            id={`${item.aid || item.id || index}${index}`}
                          /*   collapse={isSpecialist}
                            showHead
                            showFoot */
                          // headData={specialHeadData}
                          // footData={specialFootData}
                          >
                            <div>
                              <div className={styles.nodeInfo}>
                                {timeLineTime}
                                {timeLineType}
                                {timeLineTopic}
                                {!isSpecialist && (
                                  <Like
                                    id={item.aid || item.id}
                                    likeData={item.like || 0}
                                    updateLike={this.updateLike}
                                  />
                                )}
                              </div>
                              <Component {...props} />
                            </div>
                          </Timeline.Item>
                        );
                      })}
                    <Spin
                      loading={
                        isSpecialist
                          ? !(spcialistList && spcialistList.length)
                          : !pubData || !pubData.length
                      }
                      size="small"
                    />
                    {(!pubData || !pubData.length) && total === 0 && (
                      <div>暂未收录此类型数据，持续更新中...</div>
                    )}
                  </CollapseTimeline>
                );
              })}
            </InfiniteScroll>
          </div>
          <Modal
            title={formatMessage({ id: 'timeline.Disclaimer.title', defaultMessage: '免责声明' })}
            visible={visible}
            onOk={this.handleOk}
            centered
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>
                确定
              </Button>,
            ]}
          >
            <p>
              <FM
                id="timeline.Disclaimer"
                defaultMessage="“NCP学术成果时间线”由清华大学知识智能中心推出，该项服务旨在通过整合提供与新型冠状病毒感染的肺炎学术研究过程中产生的包括论文、论点在内的成果以及影响疫情发展的学术事件，为新型冠状病毒的科研学者和疫情关注者提供参考情报。在数据来源和信息展示上，工作团队保持中立立场，无倾向性意见，所摘录内容来源于权威媒体、机构、期刊公开发表的论文、论点和事件，努力通过时间轴的串联为读者提供一个尽可能全面的学术发展态势。所摘编内容都有具体的来源，请读者通过文献、论点、事件来源线索获取具体的详情内容，并自行甄别和使用。由于水平所限，所摘编内容不免会有疏漏，还请各位读者谅解。"
              ></FM>
            </p>
          </Modal>
        </div>
      </Layout>
    );
  }
}

TimeLine.getInitialProps = async ({ store, isServer, history }) => {
  if (!isServer) return;
  const { location } = history || {};
  const { type = ALL_TYPE, classes = ALL_TOPIC } = location && location.query || {};
  await store.dispatch({
    type: 'timeLine/getPubTimeLine',
    payload: {
      type: type.includes('专家') ? ALL_TYPE : type,
      classes,
      skip: 0,
      limit: 20,
      pass: 1,
    },
  });
  const { timeLine } = store.getState();
  return { timeLine }
};

export default TimeLine;
