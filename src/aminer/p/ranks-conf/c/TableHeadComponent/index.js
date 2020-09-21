import React, { Component } from 'react';
import { FM } from 'locales';
import { Icon } from 'antd'
import { translateDate } from 'utils/utils'
import styles from './style.less'

/* eslint-disable max-len */
const PosIcon = () => <svg t="1596529178406" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14897" width="48" height="48"><path d="M477.632115 323.159669a111.444962 111.444962 0 1 1-0.341333 222.719258 111.444962 111.444962 0 0 1 0.341333-222.719258z m0-67.157109a179.199403 179.199403 0 1 0 0.511998 358.398805A179.199403 179.199403 0 0 0 477.632115 256.00256z" p-id="14898"></path><path d="M785.769754 124.333666A438.953203 438.953203 0 0 0 477.888114 0.003413C361.835167 0.003413 250.731538 44.888597 170.006473 124.333666c-169.812767 167.167443-169.812767 432.382559 0 599.550001L477.888114 1024l307.88164-300.116333c169.812767-167.167443 169.812767-432.382559 0-599.550001z m-46.421178 557.310142l-261.460462 255.999147-261.460462-255.999147a352.93749 352.93749 0 0 1 0-508.670305A373.588088 373.588088 0 0 1 477.888114 67.672521c98.559671 0 192.85269 37.973207 261.460462 105.300982a352.93749 352.93749 0 0 1 0 508.670305z" p-id="14899"></path></svg>


const TableHeadComponent = ({ isMobile, short_name, conference_name, conference_time, location, id, index }) => (
  <div className={styles.TableHeadComponent}>
    <a href={`https://www.aminer.cn/conference/${id}`} className="title" target="_blank" rel="noopener noreferrer">
      {isMobile ? <span className="mobileIndex">{index}</span> : null}
      {short_name && <span className="shortname">{isMobile ? short_name : `[${short_name}]`}</span>}
      {isMobile ?
        (!short_name && <span className="name">{conference_name}</span>)
        : <span className="name">{conference_name}</span>}
    </a>
    {!isMobile && (conference_time || location) && short_name && <p>
      <a href={`https://aminer.cn/conf/${short_name === 'SIGKDD' ? 'kdd' : short_name.toLowerCase()}${conference_time.slice(-4)}`} target="_blank">
        {conference_time && <a className="time" ><Icon type="clock-circle" />{translateDate(conference_time, !isMobile)}</a>}
        {location && <span className="location">
          <PosIcon />
          {location}</span>}
      </a>

    </p>}
  </div>
)

export default TableHeadComponent;
