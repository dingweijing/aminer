
import React, { useEffect, useState } from 'react';
import { page, connect, Link } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import { Layout } from 'aminer/layouts';
import { Spin } from 'aminer/components/ui';
import { Header } from '../../c'
import cookies from 'utils/cookie';

import styles from './index.less';

const SIZEPERPAGE = 10;
const ConfType = props => {
  const [confInfo, setConfInfo] = useState();
  const [result, setResult] = useState();
  const { dispatch } = props;
  const { short_name } = helper.parseMatchesParam(props, {}, ['short_name'])

  useEffect(() => {
    const getConfInfo = cookies.getCookie('conf');
    if (getConfInfo) {
      setConfInfo(JSON.parse(getConfInfo))
    } else {
      const shortLength = short_name.length
      dispatch({ type: "aminerConf/getConfList", payload: { offset: 0, size: 1, short_name: short_name.slice(0, shortLength - 4), year: short_name.slice(shortLength - 4, shortLength) } }).then((data) => {
        setConfInfo(data.item[0])
      }
      )
    }
  }, [short_name])

  const callback = () => {

  }
  return (
      <div className={styles.ConfInfo}>
        {confInfo && <Header confInfo={confInfo} />}

      </div>
  );
};

export default page(connect())(ConfType);
