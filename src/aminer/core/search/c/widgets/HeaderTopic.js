// HeaderTopic.js
import React, { useMemo, useEffect, useState } from 'react'
import { component, connect, Link } from 'acore';
import { Table, Tooltip, Button } from 'antd';
import consts from 'consts';
import pubHelper from 'helper/pub';
import { FM, enUS, formatMessage } from 'locales';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { getLangLabel } from 'helper';
import TopicEdit from './TopicEdit';
import MustReadEdit from './MustReadEdit';
import styles from './HeaderTopic.less';

const defSize = 1000;
const tableSize = 100;
const pagination = {
  hideOnSinglePage: true,
  pageSize: 50
}

const { Topis_Img_Ids } = sysconfig;
const img_path = `${consts.ResourcePath}/sys/aminer/topic`;

const chop = (text, size) => {
  if (text) {
    return text.length > size ? `${text.substring(0, size)}...` : text;
  }
  return '';
}

const isMobileFunc = () => {
  let isMobiles;
  if (global && global.isMobile) {
    isMobiles = global.isMobile;
  } else if (window && window.navigator && window.navigator.userAgent) {
    isMobiles = /mobile|android|iphone|ipad|phone/i.test(window.navigator.userAgent)
  }
  return isMobiles;
}

const HeaderTopic = (props) => {
  const { topic, user, dispatch, hideTopicTip, onSortChange } = props;
  if (!topic) return <></>;
  const [expand, setExpand] = useState(true);

  const { name, name_zh, def, def_zh, id } = topic;

  const toggleExpand = () => {
    setExpand(!expand);
  }

  useEffect(() => {
    if (isMobileFunc()) {
      setExpand(false);
    }
    getHideTopicTip();
  }, [])

  const onImgClick = () => {
    dispatch({
      type: 'imgViewer/open',
      payload: {
        src: `${img_path}/${id}.jpg`,
        intro: formatMessage({ id: 'aminer.paper.topic.imgIntro', defaultMessage: '如需查看以上论文详细信息，请移步至“必读”列表下，选择“精选”查看。'}),
      }
    })
  }

  const getHideTopicTip = () => {
    dispatch({ type: 'searchpaper/getHideTopicTip' });
  }

  const setHideTopicTip = () => {
    dispatch({ type: 'searchpaper/setHideTopicTip' });
  }

  return (
    <div className={styles.searchTopic} key={id}>
      {!hideTopicTip && (
        <div className={classnames(styles.mustReadTip,"desktop_device")}>
          <FM
            id="aminer.search.topic.mustReadingTip"
            tagName="div"
            values={{
              must_reading: (
                <span onClick={() => onSortChange('must_reading')} className={classnames(styles.switchBtn, styles.mustRead)}>
                  <FM id="com.search.sort.label.must_reading" />
                </span>
              ),
              relevance: (
                <span onClick={() => onSortChange('relevance')} className={styles.switchBtn}>
                  <FM id="com.search.sort.label.relevance" />
                </span>
              ),
              topic: <span className={styles.topicName}>{getLangLabel(name, name_zh)}</span>,
              btn: (
                <span className={styles.iKnowBtn} onClick={setHideTopicTip} >
                  <FM id="com.search.sort.label.i_know" />
                </span>
              )
            }}
          />
        </div>
      )}
      <div className={styles.topicWrap}>
        <div className={styles.expandBtn} onClick={toggleExpand}>
          <svg aria-hidden="true">
            <use xlinkHref={expand ? '#icon-collapse' : '#icon-expand'}/>
          </svg>
        </div>
        <div className={styles.content}>
          <div className={styles.topic}>
            <div className={styles.name}>
              {getLangLabel(name, name_zh)} 
              {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && <TopicEdit topic={topic} editType='update'/>}
              {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && <TopicEdit topic={topic} editType='create'/>}
            </div>
            {/* ăă */}
            {expand && (
              <div className={styles.desc}>
                <div className={styles.def}>
                  {def || def_zh ? (
                    <>
                      {getLangLabel(def, def_zh).split('##').map((item, index) => (
                        <span key={`def${index}`} className={styles.otherContent}>{item}</span>
                      ))}
                    </>
                  ) : (
                    <span className={styles.noReason}><FM id='aminer.paper.topic.wait' defaultMessage='Coming Soon...'/></span>
                  )}
                </div>
              </div>
            )}
          </div>
          {/*  */}
          {expand && Topis_Img_Ids.includes(id) && (
            <div className={styles.table}>
              <img src={`${img_path}/${id}.jpg`} alt="如需查看以上论文详细信息，请移步至“必读”列表下，选择“精选”查看。" onClick={onImgClick}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default component(
  connect(({ searchpaper, auth }) => ({ 
    topic: searchpaper.topic,
    hideTopicTip: searchpaper.hideTopicTip,
    user: auth.user, 
  }))
)(HeaderTopic);
