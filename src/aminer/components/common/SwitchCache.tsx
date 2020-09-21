import React from 'react';
import { Switch } from 'antd';
import cookies from 'utils/cookie';
import styles from './SwitchCache.less';

interface PropTypes {
  skip: boolean;
  reload: boolean;
  debug: boolean;
  setSkip: (skip: boolean) => void;
  setReload: (reload: boolean) => void;
  setDebug: (reload: boolean) => void;
}

const SwitchCache = (props: PropTypes) => {
  const { skip, setSkip, reload, setReload, debug, setDebug } = props;

  const onChangeSkip = () => {
    setSkip(!skip);
    cookies.setCookie('api_skipcache', !skip ? 'true' : '', '/');
  };

  const onChangeReload = () => {
    setReload(!reload);
    cookies.setCookie('api_reloadcache', !reload ? 'true' : '', '/');
  };

  const onChangeDebug = () => {
    setDebug(!debug);
    cookies.setCookie('api_debug', !debug ? 'true' : '', '/');
  };

  const getResetData = () => {
    window?.location?.reload();
  }

  return (
    <div className={styles.switchCache}>
      <div className="skip line">
        <Switch checked={skip} onChange={onChangeSkip} />
        <span className="text">Skip Cache</span>
      </div>
      <div className="reload line">
        <Switch checked={reload} onChange={onChangeReload} />
        <span className="text">Reload Cache</span>
      </div>
      <div className="debug line">
        <Switch checked={debug} onChange={onChangeDebug} />
        <span className="text">Debug</span>
      </div>
      <div className="re_search">
        <span className="btn" onClick={getResetData}>重新加载</span>
      </div>
    </div>
  );
};

export default SwitchCache
