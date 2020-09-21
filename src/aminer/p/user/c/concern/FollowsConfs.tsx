import React, { useEffect, useState, useRef } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { IJconf } from 'aminer/components/common_types';
import { IFollow } from 'aminer/p/user/notification_types';
import { ConfItem } from 'aminer/p/user/components';
import styles from './FollowsConfs.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  pageSize?: number;
}

const FollowsConfs: React.FC<IPropTypes> = props => {
  const { dispatch, pageSize = 20 } = props;
  const [jconfs, setJconfs] = useState<IJconf[]>();
  const page = useRef<number>(1);
  const end = useRef<boolean>(false);

  const getFollows = () => {
    dispatch({
      type: 'social/GetFollows',
      payload: {
        includes: ['jconf'],
        offset: (page.current - 1) * pageSize,
        size: pageSize,
      },
    }).then((result: IFollow) => {
      if (!result?.jconfs) {
        return;
      }
      if (!jconfs) {
        setJconfs(result.jconfs);
      } else {
        const new_jconfs = jconfs.concat(result.jconfs);
        setJconfs(new_jconfs);
      }
    });
  };

  const onLoadMore = () => {
    getFollows();
  };

  useEffect(() => {
    getFollows();
  }, []);

  return (
    <div className={classnames(styles.followsConfs, 'follows-confs')}>
      {jconfs?.length && (
        <div className="follow_list jconfs">
          {jconfs.map(jconf => (
            <ConfItem key={jconf.id} conf={jconf} />
          ))}
        </div>
      )}
      {!end.current && (
        <div className="loadmore">
          <span className="loadmore_btn" onClick={onLoadMore}>
            <FM id="aminer.common.loadmore" defaultMessage="Load More" />
          </span>
        </div>
      )}
    </div>
  );
};

export default component(connect())(FollowsConfs);
