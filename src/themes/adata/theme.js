/**
 * Created by BoGao on 2018/4/30.
 */
import React from 'react';
import consts from 'consts';
import { Link } from 'acore';
import LazyFooter from 'aminer/layouts/footer/Footer';
import RightZone from 'aminer/layouts/header/RightZone';
import HeaderLeftZone from 'aminer/layouts/header/HeaderLeftZone';
import LeftSlideBar from './c/LeftSlideBar';
import styles from './theme.less';

const version = 'v1';
const imgPath = `${consts.ResourcePath}/sys/aminer/layout/${version}`;

// * This is for 2B systems.
export default {
  themeName: 'aminer', // Required. Read by File.
  skin: 'theme',
  styles,

  //
  // Layout
  //
  Layout_ShowHeader: true,
  Layout_ShowFooter: true,
  Layout_ShowHeaderSearch: false,

  // Layout
  logoZone: [({ className }) => (
    <Link key="1" to="/" className={styles.aminer} aria-label="aminer">
      {/* <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-AMinerlogo" />
      </svg> */}
      <img src={`${imgPath}/aminer_logo.png`} alt="AMiner" />
      <div className={styles.text_logo}>
        智能标注工具
        </div>
    </Link>
  )],

  rightZone: [({ className }) => (
    <RightZone key="10" className={className} />
  )],

  leftZone: [({ className }) => (
    // <HeaderLeftZone className={className} key="10" />
    <Link key="1" to="/" className={styles.aminer} aria-label="aminer">
      <span className={styles.logo}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-AMinerlogo" />
        </svg>
      </span>
      <div className={styles.text}>标注工具</div>
    </Link>
  )],

  sider: [

  ],

  sidebar: [
    <LeftSlideBar key='1' />
  ],

  footer: [({ className, showTop }) => (
    <LazyFooter key="10" showTop={showTop} className={className} />
  )]

};
