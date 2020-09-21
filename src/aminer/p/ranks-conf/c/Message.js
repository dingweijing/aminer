import React, { useRef, useEffect } from 'react';
import { getLangLabel } from 'helper';
import styles from './Message.less'

const click_btn_zh = '点击查看详情'
const click_btn_cn = 'click for more information'
const source_title_zh = '来源'
const source_title_cn = 'Source'

const Message = props => {
  const { content, role, source, link, content_cn, source_cn } = props
  const scrollList = useRef();
  useEffect(() => {
    scrollList.current.scrollIntoView({ behavior: 'smooth' });
  });
  return (
    <div className={styles.message}>
      {/* {role === 'robot' ? <img src={robot_png} className="img" alt=""/> : null} */}
      <div className={role === 'robot' ? 'robot-msg' : 'user-msg'} ref={scrollList}>
        <span>{getLangLabel(content_cn, content)}
          <div>
            {link && <a href={link} target="_blank" >{getLangLabel(click_btn_cn, click_btn_zh)}</a>}
            {source && <span>{getLangLabel(source_title_cn, source_title_zh)}: {getLangLabel(source_cn, source)}</span>}</div>
        </span>
      </div>
    </div>
  );
}

export default Message;
