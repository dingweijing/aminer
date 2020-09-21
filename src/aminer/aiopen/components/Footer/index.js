import React, { Component } from 'react';
import { FM } from 'locales';
import { isMobile } from 'utils'
import QRCodeTab from 'components/ui/QRCodeTab'
import qrcodedata from './options'
import styles from './style.less'


const isMobileState = isMobile() || document.body.clientWidth < 700

const Footer = () => (
  <div className={styles.footer}>
    <div className="top">
      <img src="https://static.aminer.cn/misc/aiopen/img/logo2_white.png" alt="" />
      <div className="mid">
        <div>
          <FM id="aiopen.footer.email"></FM>
          <p>aiopen@aminer.cn</p>{/*  */}
        </div>

        <div>
          <FM id="aiopen.footer.wechat"></FM>
          <p>AMiner308</p>{/*  */}
        </div>

        <div>
          <FM id="aiopen.footer.addr"></FM>
          <p> <FM id="aiopen.footer.addr.text"></FM></p>
        </div>
      </div>
      <div className="right">
        {isMobileState ? (
          <img src={qrcodedata[0].img} alt="" />
        ) : <QRCodeTab data={qrcodedata} />}
        {/* <FM id="aiopen.footer.qcode"></FM>
        <img src="https://originalfileserver.aminer.cn/sys/aminer/wechat.jpg" alt="二维码" /> */}
      </div>
    </div>
    {/*    <div className="bottom">
      <span>© 2005-2020 AMiner 京ICP备17059297号-2</span>
    </div> */}
  </div>
)

export default Footer;
