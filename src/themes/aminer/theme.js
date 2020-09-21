/**
 * Created by BoGao on 2018/4/30.
 */
import React from 'react';
import consts from 'consts';
import { Link } from 'acore';
import LazyFooter from 'aminer/layouts/footer/Footer';
import RightZone from 'aminer/layouts/header/RightZone';
import HeaderLeftZone from 'aminer/layouts/header/HeaderLeftZone';

import styles from './theme.less';

console.log('LazyFooter', RightZone);
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
  Layout_ShowHeaderNav: true,

  // Layout
  logoZone: [({ className }) => (
    <Link key="1" to="/" className={styles.aminer} aria-label="aminer">
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#icon-AMinerlogo" />
      </svg>
      <img src={`${imgPath}/aminer_logo.png`} alt="AMiner" />
    </Link>
  )],

  rightZone: [({ className }) => (
    <RightZone key="10" className={className} />
  )],

  leftZone: [({ className, showSearch, showNav }) => (
    <HeaderLeftZone className={className} showSearch={showSearch} showNav={showNav} key="10" />
  )],

  sider: [

  ],

  footer: [({ className, showTop }) => (
    <LazyFooter key="10" showTop={showTop} className={className} />
  )]

};
