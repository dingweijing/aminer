import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'antd';
import { classnames } from 'utils';
import { connect, component } from 'acore';
import styles from './PersonRefresh.less';

const PersonRefresh = props => {
  const { dispatch, pid } = props;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const timer = useRef();
  const refreshPerson = () => {
    timer.current = setTimeout(() => {
      setLoading(true);
    }, 200);
    dispatch({
      type: 'profile/personRefresh',
      payload: { id: pid },
    }).then(res => {
      const { succeed, timeleft } = res || {};
      clearTimeout(timer.current);
      setLoading(false);
      if (!succeed) {
        return;
      }
      // const { status, message } = data;
      if (timeleft) {
        setError(timeleft ? `Try again ${timeleft}s. later` : 'Try again later');
      } else {
        setError('Done');
      }
    });
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <span className={styles.personRefresh}>
      {/* {error && <span>{"Try again "+error.split("_")[3]+"s. later"}</span>} */}
      <span className="message">{error || ''}</span>
      <Tooltip placement="top" title="Refresh">
        <svg
          onClick={refreshPerson}
          className={classnames('icon refresh', { [styles.loading]: loading })}
          aria-hidden="true"
        >
          <use xlinkHref="#icon-refresh" />
        </svg>
      </Tooltip>
    </span>
  );
};

export default component(connect())(PersonRefresh);
