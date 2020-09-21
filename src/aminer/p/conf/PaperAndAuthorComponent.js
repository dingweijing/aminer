// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Spin } from 'aminer/components/ui';
import { KeywordsList } from './c';
import styles from './PaperAndAuthorComponent.less';

const PaperAndAuthorComponent = props => {
  const [keywords, setKeywords] = useState();
  const [currentKey, setCurrentKey] = useState([]);

  const { confInfo, ChildrenComp } = props;
  const { dispatch, keywords_loading } = props;

  useEffect(() => {
    getKeywords();
  }, []);

  const getKeywords = () => {
    dispatch({
      type: 'aminerConf/GetKeywords',
      payload: { conf_id: confInfo.id },
    }).then(result => {
      setKeywords(result.data);
    });
  };

  const updateCurrentKey = key => {
    if (key !== 'all') {
      setCurrentKey([key]);
    } else if (key === 'all') {
      setCurrentKey([]);
    }
  };

  return (
    <div className={styles.paperAndAuthorComponent}>
      <div className="leftBlock desktop_device">
        <Spin loading={keywords_loading} size="small" />
        {keywords && (
          <KeywordsList
            keywords={keywords}
            getPubByKey={updateCurrentKey}
            currentKey={currentKey[0]}
          />
        )}
      </div>
      <div className="centerContent">
        {ChildrenComp({ currentKey, confInfo, updateCurrentKey })}
      </div>
    </div>
  );
};

export default page(
  connect(({ auth, loading }) => ({
    user: auth.user,
    roles: auth.roles,
    keywords_loading: loading.effects['aminerConf/GetKeywords'],
  })),
)(PaperAndAuthorComponent);
