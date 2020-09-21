import React, { useState } from 'react';
import { connect, component, Link } from 'acore';
import { sysconfig } from 'systems'
import { Tooltip, Drawer } from 'antd';
import { FM, formatMessage } from 'locales';
import * as profileUtils from 'utils/profile-utils';
import styles from './ProductList.less';
import { classnames } from '@/utils';

const productList = [
  {
    id: 'aminer.user.rss',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_RSS.png',
    href: '/user/notification',
  },
  {
    id: 'aminer.home.header.nav.channel',
    defaultMessage: 'Channel',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Channel.png',
    href: '/channel',
  },
  {
    id: 'aminer.home.nav.academicrank',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Academic Ranking.png',
    href: '/ranks/home',
  },
  {
    id: 'aminer.home.header.nav.gct',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_GCT.png',
    target: '_blank',
    href: 'https://gct.aminer.cn/',
  },
  {
    id: 'aminer.home.header.nav.thu',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_THU.png',
    href: '/research_report/articlelist',
  },
  {
    id: 'aminer.home.nav.newTrend',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Technology trends.png',
    target: '_blank',
    href: 'https://trend.aminer.cn/',
  },
  {
    id: 'aminer.home.labs.open_data',
    target: '_blank',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Open Data.png',
    href: '/data',
  },
  {
    id: 'aminer.home.header.nav.must_reading',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Mustreading.png',
    href: '/topic',
  },
  {
    id: 'aminer.home.nav.conf',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Conf.png',
    href: '/conf',
  },
  {
    id: 'aminer.home.insight.tree',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Mrt.png',
    href: '/mrt',
  },
  {
    id: 'com.searchTypeWidget.label.TechForesight',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Technology Foresight.png',
    target: '_blank',
    href: 'https://ai.aminer.cn/techforesight',
  },
  {
    id: 'aminer.home.header.nav.conf_ranking',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Conf Ranking.png',
    href: '/ranks/conf',
  },
  {
    id: 'aminer.home.arrival.ai2000',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_AI.png',
    href: '/ai2000',
  },
  {
    id: 'aminer.home.arrival.star',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Talent Scount.png',
    target: '_blank',
    href: 'https://star.aminer.cn/',
  },
  {
    id: 'aminer.home.nav.Trajectory',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Trajectory.png',
    href: 'https://map.aminer.cn/geo/touch_v2/trajectory?domain=55e6573845ce9da5c99535a9',
    target: '_blank',
  },
  {
    id: 'aminer.home.nav.report_analysis',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Report Analysis.png',
    target: '_blank',
    href: 'https://analysis.aminer.cn',
  },
  {
    id: 'aminer.home.nav.open',
    image: 'https://fileserver.aminer.cn/sys/aminer/product/AMinerIcon_Open.png',
    target: '_blank',
    href: 'https://open.aminer.cn',
  },
]

const ProductList = props => {

  const { className } = props;
  const [iconChecked, setIconChecked] = useState(false);
  const [drawerChecked, setDrawerChecked] = useState(false);

  const renderProductList = (
    <>
      <div className={styles.productTitle}>{formatMessage({ id: 'aminer.home.header.productList' })}</div>
      <div className={classnames('product')}>
        {productList && productList.length > 0 &&
          productList.map(product => (
            product.target ? (
              <a className={classnames('productItem')} key={product.id} href={product.href} target={product.target} rel="noopener noreferrer">
                <img className={classnames('productIcon')} src={product.image} />
                <p className={styles.productName}>{formatMessage({ id: product.id })}</p>
              </a>
            ) : (
              <Link className={classnames('productItem')} key={product.id} to={product.href}>
                <img className={classnames('productIcon')} src={product.image} />
                <p className={styles.productName}>{formatMessage({ id: product.id })}</p>
              </Link>
            )
          ))}
      </div>
    </>
  )

  const visibleChange = (visible) => {
    setIconChecked(visible);
  }

  const drawerClose = () => {
    setDrawerChecked(false);
  }

  const clickIcon = () => {
    if (document.body.clientWidth <= 736) {
      setDrawerChecked(true);
    }
  }

  return (
    <>
      <Tooltip
        placement="bottom"
        title={renderProductList}
        trigger="click"
        overlayClassName="productList"
        onVisibleChange={visibleChange}
        destroyTooltipOnHide={true}
      >
        <div className={classnames(styles.productIcon, styles[className])}>
          <svg className={classnames("icon product_icon", { iconChecked, home: className === 'home' })} aria-hidden="true" onClick={clickIcon}>
            <use xlinkHref="#icon-list1" />
          </svg>
        </div>
      </Tooltip>
      <Drawer
        placement="right"
        closable={false}
        onClose={drawerClose}
        visible={drawerChecked}
        className="drawer"
        width="80%"
      >
        <div>{renderProductList}</div>
      </Drawer>
    </>
  )
}

export default component(connect(({ auth }) => ({ user: auth.user })))(ProductList)
