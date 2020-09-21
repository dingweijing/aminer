/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 12:40:00
 * @LastEditTime: 2019-10-15 15:18:21
 * @LastEditors: Please set LastEditors
 */
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { connect, history, Link, component, withRouter } from 'acore';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import * as auth from 'utils/auth';
import { FM, formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
import styles from './index.less';

const Annotation = props => {
  const page = useRef(1);
  const count = useRef(0);
  const [list, setList] = useState([]);
  // const [page, setPage] = useState(1);
  let end = false;
  const { dispatch } = props;
  const size = 100;

  // console.log('type', type)
  // let { location: { hash } } = props;

  useEffect(() => {
    getRosterList();
  }, [list]);

  const getRosterList = () => {
    if (list.length >= count.current && count.current !== 0) {
      return;
    }
    dispatch({
      type: 'roster/getRosterList',
      payload: { size, offset: (page.current - 1) * size },
    }).then(data => {
      count.current = data.count;
      page.current += 1;
      setList(list.concat(data.data));
    });
  };
  return (
    <div className={styles.annotationContect}>
      <Link to="/dashboard/expert/folders/create" className="create_btn">
        <FM id="aminer.dashboard.annotation.create" defaultMessage="Create Expert Base" />
      </Link>
      <ul className="annotation_list">
        <li className="list_item">
          <span className="row1"></span>
          <span className="row2">
            {formatMessage({ id: 'aminer.annotation.title', defaultMessage: 'Title' })}
          </span>
          <span className="row3">
            {formatMessage({ id: 'aminer.annotation.description', defaultMessage: 'Description' })}
          </span>
          <span className="row4">
            {formatMessage({ id: 'aminer.annotation.note', defaultMessage: 'Note' })}
          </span>
          <span className="row5">
            {formatMessage({ id: 'aminer.annotation.creator', defaultMessage: 'Creator' })}
          </span>
        </li>
        {list &&
          list.map((item, index) => {
            return (
              <li key={item.id} className="list_item">
                <span className="row1">{index + 1}</span>
                <span className="row2">
                  <Link to={`/dashboard/annotation/${item.id}/true`} target="_blank">
                    {item.title}
                  </Link>
                </span>
                <span className="row3">
                  {item.desc && item.desc.length > 50 ? `${item.desc.slice(0, 50)}…` : item.desc}
                </span>
                <span className="row4">{item.note}</span>
                <span className="row5">{item.creator_name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default component(connect())(Annotation);
