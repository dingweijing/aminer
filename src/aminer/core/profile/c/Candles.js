import React, { useState, useEffect, useMemo } from 'react';
import { connect, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { Tooltip } from 'antd';
import styles from './Candles.less';

const Candles = props => {
  const {
    dispatch,
    pid,
    userburned,
    n_candles,
    user,
    gender,
  } = props;

  const [burned, setBurned] = useState(userburned);
  const [nCandles, setNCandles] = useState(n_candles);

  useEffect(() => {
    setBurned(userburned);
  }, [userburned]);
  useEffect(() => {
    setNCandles(n_candles);
  }, [n_candles]);

  const is_login = isLogin(user);

  const onCandle = () => {
    if (!is_login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    const params = {
      id: pid,
    };
    if (burned) {
      params.op = 'cancel';
    }
    dispatch({
      type: 'editProfile/BurnLittleCandle',
      payload: params,
    }).then(res => {
      if (res) {
        setBurned(!burned);
        let num = nCandles;
        if (burned) {
          num -= 1;
        } else {
          num += 1;
        }
        setNCandles(num);
      }
    });
  };

  const gender_text = useMemo(() => {
    let text = '';
    if (gender === 'male') {
      text = formatMessage({ id: 'aminer.person.him' });
    } else if (gender === 'female') {
      text = formatMessage({ id: 'aminer.person.her' });
    } else {
      text = formatMessage({ id: 'aminer.person.himher' });
    }
    return text;
  }, [gender]);

  // if (!is_click) {
  //   return false;
  // }
  return (
    <div className={styles.burncandles}>
      <Tooltip
        title={
          burned ? (
            <FM id="aminer.person.candle.cancel" values={{ gender: gender_text }} />
          ) : (
            <FM id="aminer.person.candle.burn" values={{ gender: gender_text }} />
          )
        }
      >
        <svg className={classnames('icon click')} aria-hidden="true" onClick={onCandle}>
          <use xlinkHref="#icon-candle" />
          {/* {!burned && <use xlinkHref="#icon-candle1" />} */}
          {/* {burned && <use xlinkHref="#icon-candle" />} */}
        </svg>
      </Tooltip>

      {!!nCandles && (
        <>
          <div className="text">
            <FM
              id="aminer.person.death.candle"
              values={{
                count: <span className="count">{nCandles}</span>,
              }}
            />
          </div>
          <div className="text">
            <FM
              id="aminer.person.death.candle1"
              values={{
                gender: gender_text,
              }}
            />
          </div>
        </>
      )}
      {!nCandles && (
        <div className="text">
          <FM
            id="aminer.person.candle.burn"
            values={{
              gender: gender_text,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(Candles);
