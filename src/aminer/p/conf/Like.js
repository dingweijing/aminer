// getSchedule
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { page, connect, Link } from 'acore';
import { Pagination, Input, Collapse } from 'antd';
import { Spin } from 'aminer/components/ui';
import { formatMessage, FM } from 'locales';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { useResizeEffect } from 'helper/hooks';
import { ConfPaperList, AlertLoginBlock, ConfSearchBox, KeywordsList, SetOrGetViews } from './c';
import styles from './Like.less';

const { Search } = Input;
const SIZEPERPAGE = 20;
const Like = props => {
  const [data, setData] = useState();
  const [keywords, setKeywords] = useState();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const { confInfo, user, loading, activeKey } = props;
  const { dispatch, filters } = props;

  const menuRef = useRef();

  useResizeEffect(menuRef);

  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  useEffect(() => {
    if (activeKey === 'like') {
      getPubByKey('all');
      // getKeywords();
    }
  }, [activeKey]);

  useEffect(() => {
    keywords && getPubByKey(filters && filters.keywords);
  }, [current, filters]);

  // const getKeywords = () => {
  //   if (isLogin(user)) {
  //     dispatch({
  //       type: 'aminerConf/GetUserLikeKeywords',
  //       payload: { id: confInfo.id },
  //     }).then(result => {
  //       setKeywords(result);
  //     });
  //   }
  // };

  const getPubByKey = (key = 'all') => {
    if (isLogin(user)) {
      dispatch({
        type: 'aminerConf/GetUserLikePubs',
        payload: {
          conf_id: confInfo.id,
          offset: (current - 1) * SIZEPERPAGE,
          size: SIZEPERPAGE,
        },
      }).then(result => {
        result.items &&
          result.items.length > 0 &&
          result.items.map(pub => {
            pub.is_like = true;
          });
        setTotal(result.total);
        setData(result.items);
      });
    }
  };

  const showMenu = useCallback(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.style.display === 'block') {
      menuRef.current.style.display = 'none';
      dispatch({ type: 'aminerConf/setisMobileClickMenu', payload: false });
    } else {
      menuRef.current.style.display = 'block';
      dispatch({ type: 'aminerConf/setisMobileClickMenu', payload: true });
    }
  }, []);

  return (
    <div
      className={classnames(styles.like, {
        [styles.flexGrow]:
          confInfo.config && confInfo.config.right && confInfo.config.right.length === 0,
      })}
    >
      {isLogin(user) && data && (
        <div className={styles.content}>
          {/* <div className={styles.leftBlock} ref={menuRef}>
            {keywords && (
              <Collapse activeKey="keywords">
                <Collapse.Panel
                  key="keywords"
                  showArrow={false}
                  header={
                    <>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-key" />
                      </svg>
                      <FM id="aminer.conf.keywords.legend" />
                    </>
                  }
                >
                  <KeywordsList keywords={keywords} showDropDown={false} showMenu={showMenu} />
                </Collapse.Panel>
              </Collapse>
            )}
          </div> */}
          <div className={styles.rightBlock}>
            {/* <ConfSearchBox /> */}
            <div className="paperList">
              {/* <div className="like_legend">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-list" />
                </svg>
                <FM id="aminer.conf.paper.legend" default="Paper List" />
                <div className="mobile_device mobile_left_filter_icon" id="likeMenu">
                  <svg className="icon menu_icon" aria-hidden="true" onClick={showMenu}>
                    <use xlinkHref="#icon-menu2" />
                  </svg>
                </div>
              </div> */}
              <Spin loading={loading} size="small" />
              <div className="like_content">
                {/* {data &&
                  data.length > 0 &&
                  data.map((pub, index) => {
                    return (
                      
                    );
                  })} */}
                <ConfPaperList pubs={data} confInfo={confInfo} />
                {data && total > SIZEPERPAGE && (
                  <Pagination
                    className={styles.pagination}
                    defaultCurrent={1}
                    current={current}
                    total={total}
                    pageSize={SIZEPERPAGE}
                    onChange={curr => {
                      return setCurrent(curr);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isLogin(user) && !data && !loading && (
        <div className={styles.noResultTip}>
          <Link to={`/conf/${confInfo.short_name}/papers`}>
            <FM default="You haven't liked any paper." id="aminer.conf.like.tip" />
          </Link>
        </div>
      )}

      {!isLogin(user) && <AlertLoginBlock />}
    </div>
  );
};

export default page(
  connect(({ auth, loading, aminerConf }) => ({
    user: auth.user,
    filters: aminerConf.filters,
    loading: loading.effects['aminerConf/GetUserLikePubsByKeywords'],
  })),
)(Like);
