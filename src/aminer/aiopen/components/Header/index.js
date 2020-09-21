import React, { useState } from 'react'
import withIndicator from 'components/hoc/withIndicator';

import { classnames, isMobile } from 'utils';
import { getLangLabel } from 'helper'
import Menu from './Menu'
import Indicator from '../Indicator'

import * as options from './options'
import styles from './style.less'

const mobileState = isMobile() || document.body.clientWidth < 700

const LangIndicator = withIndicator(Indicator)

// type:index 首页

const Header = ({ renderProps, isIndex = true, onMenuClick, type, className, defaultMenuIndex }) => {
  if (!options[type]) return null;
  const { headIcon, up_title, title, desc, DescComponent, mobileDesc_EN, mobileDesc, bgImg, bg_height, menuOpts, hideLangIndicator = false } = options[type]
  return (
    <div
      className={classnames(styles.header, className)}
      style={{ backgroundImage: `url(${bgImg})`, width: '100%', height: bg_height }}>
      <div className="top">
        <div className="left" >
          <a target="_blank" rel="noopener noreferrer" className="aiopenIconWrapper" href="http://www.aiopenindex.org/">
            <img src={headIcon} alt="" className="aiopenIcon" /></a>
          <a target="_blank" rel="noopener noreferrer" href="http://www.aminer.cn/">
            <svg className="aminerIcon" aria-hidden="true">
              <use xlinkHref="#icon-AMinerlogo" />
            </svg>
          </a>

          {/* {isIndex && <span>| AI 2000</span>} */}
        </div>

        {isIndex && <Menu onClick={onMenuClick} />}
        {menuOpts && <Menu opts={mobileState ? [] : menuOpts}
          onClick={onMenuClick} defaultActiveIndex={defaultMenuIndex} />}

        <div className="right">
          {!hideLangIndicator && <LangIndicator />}
        </div>
      </div>
      <div className="bottom">
        {/* {renderProps && renderProps()} */}
        <div className="inner">
          {up_title && <h2>{up_title}</h2>}
          {title && <h1>{title}</h1>}
          {mobileState && mobileDesc ?
            (getLangLabel(mobileDesc_EN || mobileDesc, mobileDesc) || (DescComponent ? <DescComponent /> : (<p>{desc}</p>))) :
            DescComponent ? (<DescComponent />) : (<p>{desc}</p>)
          }
          {/*
          {DescComponent ?
            <DescComponent /> :
            (<p>{mobileState ? mobileDesc : desc}</p>)} */}
          {/*   <span>
            评选规则
      </span> */}
        </div>
      </div>
    </div>
  )
}

export default Header;
