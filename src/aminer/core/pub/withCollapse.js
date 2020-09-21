import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper/';
import styles from './collapse.less';

/* eslint-disable func-names,space-before-function-paren */

function HeadComponent(props) {
  const { name, job, visible, imgUrl, place, detailHref, isEN, Title, href, ORG, saveType, type, classes } = props;
  const affterfix = `type=${type}+classes=${classes}`
  const goPage = (evt, url) => {
    const w = window.open('about:blank');
    // w.location.href = url;
/*     console.log('affterfix', affterfix)
    console.log('url', url)
    console.log('url', url.includes('?')) */
     w.location.href = /* url.includes('?') ? (`${url}&${affterfix}`) :  */`${url}?${affterfix}`;
    saveType()
    evt.stopPropagation();
  };

  const myUrl = window.location.href.split('?')[0]


  return (
    <div className={styles.headWrapper}>
      <div>
        <div className={styles.infoWrapper}>
          <a onClick={evt => goPage(evt, detailHref)}>
            <div className={styles.avatar} style={{ backgroundImage: `url(${imgUrl})` }}></div>
          </a>

          <div className={styles.description}>
            <div className={styles.name}>
              <a onClick={evt => goPage(evt, detailHref)}>{name}</a>
            </div>

            <span className={isEN ? styles.en_span : ''}>
              <i className="fa fa-institution fa-fw" />
              {getLangLabel(Title, place)}
            </span>
            <span>
              <i className="fa fa-briefcase" />
              {getLangLabel(ORG, job)}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.btnWrapper}>
      <div className={styles.blueBtn} onClick={evt => goPage(evt, href.includes('2019') ? `${href}&backUrl=${myUrl}` : href)} >
      <FM id="timeline.head.achievement" defaultMessage="学术成就"></FM>
      </div>
      <div className={styles.blueBtn}>
        <FM id="timeline.head.trend" defaultMessage="学者动态"></FM>
      <img
        className={styles.toggle}
        src={
          visible
            ? require('../../../../public/sys/aminer/ncp/downArrow.png')
            : require('../../../../public/sys/aminer/ncp/upArrow.png')
        }
        alt=""
      />
      </div>
      </div>


    </div>
  );
}

function FooterComponent({ name, href, saveType, type, classes }) {
  const saveAndGo = evt => {
    const affterfix = `type=${type}+classes=${classes}`
    const myUrl = window.location.href.split('?')[0]
    const w = window.open('about:blank');
    const base = href.includes('2019') ? `${href}&backUrl=${myUrl}` : href
     w.location.href = base.includes('?') ? (`${href}&${affterfix}`) : `${href}?${affterfix}`;
    saveType()
    evt.stopPropagation();
  }

  return (
    <a className={styles.footerWrapper} onClick ={saveAndGo}>
      {formatMessage({ id: 'timeline.bottom.prefix', defaultMessage: '查看' })}{`${name}`}
      {formatMessage({ id: 'timeline.bottom.afterfix', defaultMessage: '的实时动态' })}
    </a>
  );
}

export default function withCollapse(WrappedComponent) {
  return function(props) {
    const {
      showHead,
      showFoot,
      defaultVisible = true,
      collapse = false,
      headData,
      footData,
      opencb = () => {},
      loading = false,
      ...otherProps
    } = props;

    const [visible, onVisible] = useState(defaultVisible);
    const onHeaderClick = () => {
      if (!visible) {
        opencb()
      }
      onVisible(!visible)
    };
    const onFooterClick = () => {};
    useEffect(() => {
      onVisible(defaultVisible);
    }, [defaultVisible]);

    // console.log('visible', visible, headData && headData.name);

    /*  useEffect(() => {
      const subscription = props.source.subscribe();
      return () => {
        // 清除订阅
        subscription.unsubscribe();
      };
    }); */


    return collapse ? (
      <div className="collapse">
        {showHead && (
          <div className="collapseHeader" onClick={onHeaderClick}>
            <HeadComponent visible={visible} {...headData} />
          </div>
        )}
        {visible && (
          <div className={styles.spinWrapper}>
            <WrappedComponent {...otherProps} />
            <div className={styles.spin}>
            <Spin spinning={loading} />
            </div>
          </div>
        )
        }

        {showFoot && visible && (
          <div className="collapseFooter" onClick={onFooterClick}>
            <FooterComponent {...footData} />
          </div>
        )}
      </div>
    ) : (
      <WrappedComponent {...otherProps} />
    );
  };
}
