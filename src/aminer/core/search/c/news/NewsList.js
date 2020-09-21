import React from 'react';
import { Pagination, Modal, Tabs, Icon, Divider, Tag } from 'antd';
import styles from './NewsList.less';

const NewsList = props => {
  const { news } = props;
  return news.map(item => <div className={styles.news} key={item.newsID}>
      <h3><a href={item.url} target='_blank'>{item.title}</a></h3>
      <div className='info'>
        <span><Icon type="clock-circle" className='publishTimeIcon'/> {item.publishTime}</span>
        <span className='split' />
        <span><Icon type="global" className='publisherIcon'/>{item.publisher}</span>
      </div>
      <div className='content' style={{ WebkitBoxOrient: 'vertical' }}>{item.content}</div>
      <div className='keywords'>{item.keywords.map(key => {
        return <span key={key.word}>{key.word}</span>
        })}
      </div>
    </div>);
};

export default (React.memo(NewsList));
