/*
 * @Author: your name
 * @Date: 2019-11-25 14:38:09
 * @LastEditTime: 2019-12-02 17:18:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/aminer/core/profile/c/annotation/AnnotationNote.js
 */
import React, { useEffect, useState, useMemo, memo } from 'react';
import consts from 'consts';
import { connect, component, Link } from 'acore';
import { Button, Tooltip } from 'antd';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { isLogin, isRoster, isPeekannotationlog } from 'utils/auth';
import AnnotationVersion from './AnnotationVersion';
import styles from './AnnotationNote.less';

const AnnotationNote = props => {
  const { dispatch, user, pid } = props;

  const userIsRoster = isRoster(user)
  const peekannotationlog = isPeekannotationlog(user)

  const [modifiers, setModifiers] = useState();

  const getModifiersOfPerson = () => {
    dispatch({ type: 'profile/GetModifiersOfPerson', payload: { id: pid } })
      .then(data => {
        if (data) {
          setModifiers(data)
        }
      })
  }

  useEffect(() => {
    if (pid && user && (userIsRoster || peekannotationlog)) {
      getModifiersOfPerson();
    }
  }, [pid]);

  const onOpenAllLog = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: '全部记录',
        content: <AnnotationVersion id={pid} />,
      },
    });
  }

  return (
    <div className={classnames('specialzone_annotate', styles.annotate)}>
      <span className="btn">
        <a
          href="https://annotation.aminer.cn/annotation/profilecrawler"
          target="_blank" rel="noopener noreferrer">
          标注工具
        </a>
        <Link to={`/set-url/${pid}`}
          target="_blank" rel="noopener noreferrer"
        >
          <FM id="aminer.person.seturl" defaultMessage="set url" />
        </Link>
      </span>
      <div className="modifiers">
        {modifiers && modifiers.length > 0 && modifiers.map((item, idx) => {
          const k = `${item.uid}_${idx}`;
          return (
            <span key={k} className="btn">
              {item.user_name && (
                <span>{item.user_name}&nbsp;&nbsp;</span>
              )}
              {item.ts && (
                <span>{item.ts.split('T')[0]}</span>
              )}
            </span>
          )
        })}
      </div>
      {/* <div><a rel="noopener noreferrer" onClick={onOpenAllLog}>全部记录</a></div> */}
    </div>
  );
}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(AnnotationNote)
