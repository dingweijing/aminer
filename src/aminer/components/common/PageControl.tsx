import React, { ReactElement, useState, useRef } from 'react';
import { component, connect } from 'acore';
import cookies from 'utils/cookie';
import { classnames } from 'utils';
import { isLogin, isRoster } from 'utils/auth';
import SwitchCache from './SwitchCache';
import styles from './PageControl.less';

function loadCookie(key: string) {
  const [v, serverRender] = cookies.syncSSRCookie(key);
  const st = serverRender ? v : cookies.getCookie(key);
  return st;
}
interface PropType {
  user: object;
  children: ReactElement;
  status: boolean;
}

const PageControl = (props: PropType) => {
  const { user } = props;
  const timer = useRef<NodeJS.Timeout | undefined>();

  const [show, setShow] = useState<boolean>(false);

  const [skip, setSkip] = useState<boolean>(!!loadCookie('api_skipcache'));
  const [reload, setReload] = useState<boolean>(!!loadCookie('api_reloadcache'));
  const [debug, setDebug] = useState<boolean>(!!loadCookie('api_debug'));

  const showControl = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setShow(true);
  };
  const hideControl = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setShow(false);
    }, 200);
  };

  if (!isRoster(user)) {
    return <></>;
  }
  return (
    <div
      className={styles.pageControl}
      onMouseEnter={showControl}
      onMouseLeave={hideControl}
      // onClick={toggleShow}
    >
      {show && (
        <div className="control_content">
          <SwitchCache
            skip={skip}
            setSkip={setSkip}
            reload={reload}
            setReload={setReload}
            debug={debug}
            setDebug={setDebug}
          />
        </div>
      )}
      <div className="control_btn"></div>
      <div className={classnames('show_status', { highlight: skip || reload || debug })}>
        <div className="gua li">
          <span className="yao yang"></span>
          <span className="yao yin"></span>
          <span className="yao yang"></span>
        </div>
      </div>
    </div>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(PageControl);
