import React, { useEffect, useState } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { IUserInfo } from 'aminer/components/common_types';
import { PersonItem, ConfItem } from 'aminer/p/user/components';
import { IFollow } from 'aminer/p/user/notification_types';
import styles from './Overview.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  // FIXME: xenaluo -- use useState type
  showDetailFollows: any;
}

const Overview: React.FC<IPropTypes> = props => {
  const { dispatch, showDetailFollows } = props;
  const [follows, setFollows] = useState<IFollow>();
  const { experts, jconfs } = follows || {};

  useEffect(() => {
    dispatch({
      type: 'social/GetFollows',
      payload: {
        includes: ['expert', 'jconf'], // 'institution', 'user'
      },
    }).then((result: any) => {
      setFollows(result);
    });
  }, []);

  const showMore = (key: string) => {
    if (showDetailFollows) {
      showDetailFollows(key);
    }
  };

  return (
    <div className={classnames(styles.overview, 'overviews')}>
      {experts?.length && (
        <div className="follow_list experts">
          <h4 className="type_title">
            <div className="title_inner">
              <span className="title">
                <FM id="aminer.follows.experts.title" />
              </span>
              <span className="more" onClick={() => showMore('expert')}>
                <FM id="aminer.common.more" />
              </span>
            </div>
          </h4>
          {experts.map(expert => (
            <PersonItem key={expert.id} person={expert} />
          ))}
        </div>
      )}

      {jconfs?.length && (
        <div className="follow_list jconfs">
          <h4 className="type_title">
            <div className="title_inner">
              <span className="title">
                <FM id="aminer.follows.confs.title" />
              </span>
              <span className="more" onClick={() => showMore('conference')}>
                <FM id="aminer.common.more" />
              </span>
            </div>
          </h4>
          {jconfs.map(jconf => (
            <ConfItem key={jconf.id} conf={jconf} />
          ))}
        </div>
      )}
    </div>
  );
};

export default component(connect())(Overview);
