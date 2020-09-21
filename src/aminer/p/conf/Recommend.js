// getSchedule
import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Tabs, Pagination, Input } from 'antd';
import { Spin } from 'aminer/components/ui';
import { ConfPaperList, AlertLoginBlock, ConfSearchBox, SetOrGetViews } from './c';
import { isLogin } from 'utils/auth';
import { formatMessage, FM } from 'locales';
import styles from './Recommend.less';

const { Search } = Input;
const SIZEPERPAGE = 1000;
const MAXTRECOMMENTLENGTH = 20;
const Recommend = props => {
  // TODO: 复制的论文的
  const [data, setData] = useState();
  const [current, setCurrent] = useState(1);

  const { confInfo, user, loading, activeKey } = props;
  const { dispatch } = props;
  let total = 0;

  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  useEffect(() => {
    if (activeKey === 'recommend') {
      getRecommendPubs();
    }
  }, [activeKey]);

  const getRecommendPubs = () => {
    // if (isLogin(user)) {
    if (confInfo && confInfo.id) {
      dispatch({
        type: 'aminerConf/GetRecommendPubs',
        payload: { conf_id: confInfo.id, offset: 0, size: MAXTRECOMMENTLENGTH },
      }).then(result => {
        setData(result.items);
      });
    }
    // }
  };

  return (
    <div
      className={classnames(styles.recommend, {
        [styles.flexGrow]:
          confInfo.config && confInfo.config.right && confInfo.config.right.length === 0,
      })}
    >
      {/* {isLogin(user) && ( */}
      <>
        {/* <ConfSearchBox /> */}
        {/* <div className="like_legend">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-list" />
            </svg>
            <FM id="aminer.conf.paper.legend" default="Paper List" />
          </div> */}
        <Spin loading={loading} size="small" />
        <div className="like_content">
          {/* {data &&
              data.length > 0 &&
              data.map((pub, index) => {
                return (
                 
                );
              })} */}
          <ConfPaperList isTagClick={false} pubs={data} confInfo={confInfo} />
          {data && total > SIZEPERPAGE && (
            <Pagination
              className={styles.pagination}
              defaultCurrent={1}
              current={current}
              total={total}
              pageSize={SIZEPERPAGE}
              onChange={curr => {
                console.log('分页功能');
                return setCurrent(curr);
              }}
            />
          )}
        </div>
      </>
      {/* )} */}
      {!isLogin(user) && <AlertLoginBlock />}
    </div>
  );
};

export default page(
  connect(({ auth, loading }) => ({
    user: auth.user,
    roles: auth.roles,
    loading: loading.effects['aminerConf/GetRecommendPubs'],
  })),
)(Recommend);
