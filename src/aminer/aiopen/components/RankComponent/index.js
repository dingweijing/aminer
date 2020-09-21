import React, { Component } from 'react';
import { FM } from 'locales';
import TinyPlayer from 'aminer/components/video/tinyPlayer';
import { classnames, isMobile } from 'utils';
import { getLangLabel } from 'helper';
import styles from './style.less'

const thumbStyle = {
  align: {
    width: '349px',
    height: '170px',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  vertical: {
    width: '387px',
    height: '178px',
    borderRadius: '14px',
    overflow: 'hidden',
  }
}

const videoIcon = (
  <div className="videoIcon videoBtn">
    <img src="https://static.aminer.cn/misc/aiopen/img/playBtn.png" alt="" />
  </div>
)

const isMobileState = isMobile()


const RankComponent = ({ title, desc, vertical = true, thumbNail,
  className = '', video, title_cn, desc_cn, link1 = '#', link2, btnText, showBtn = false }) => (
    <a href={link1} target="_blank" rel="noopener noreferrer"
      className={classnames(styles.RankComponent, { [styles.vertical]: vertical, [styles.align]: !vertical, }, className)}>
      <div className="player-wrapper">
        <TinyPlayer
          src={thumbNail}
          video={video}
          type="help"
          modalStyle={isMobileState ? { width: '370px', height: '220px' } : { width: '1000px', height: '556px' }}
          /* ImgWidth={isMobile && title !== 'AI OPEN' ? '92%' : '100%'} */
          imgOutBlockSty={isMobileState ? null : (vertical ? thumbStyle.vertical : thumbStyle.align)}
          videoIcon={videoIcon}
          className={styles.playerWrapper}
          playerType="bilibili"
        />
      </div>
      <div className="info">
        <h3>{getLangLabel(title, title_cn)}</h3>
        <div className="desc">{getLangLabel(desc, desc_cn)}</div>
        {showBtn && <div className="btn">
          <a href={link1} target="_blank" rel="noopener noreferrer">
            <FM id={btnText || 'aiopen.index.rankComponent.btn1'}></FM>
          </a>
          {link2 && <a href={link2} target="_blank" rel="noopener noreferrer">
            <FM id="aiopen.index.rankComponent.btn2"></FM>
          </a>}
        </div>}
      </div>
    </a>
  )

export default RankComponent;
