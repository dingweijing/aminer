import React, { useEffect, useState, useMemo, useRef } from 'react';
import { connect, component } from 'acore';
import { FM } from 'locales';
import { Button } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { getCategoryAndUnclassified, filterUnclassified } from 'helper/data';
import { IFollowCategory } from 'aminer/components/common_types';
import { ModifyCategory } from './index';
import styles from './MarkPub.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  pubCollection: IFollowCategory[];
  categories: IFollowCategory[];
  is_starring: boolean;
  size: 'normal' | 'small';
  withNum: boolean;
  isFollow: any;
  num_starred: number;
}

const MarkPub: React.FC<IPropTypes> = props => {
  const {
    pubCollection,
    dispatch,
    user,
    paper,
    categories: cats,
    is_starring,
    num_starred,
    size = 'normal',
    withNum = true,
    isFollow,
  } = props;
  const { id: pid } = paper;
  const { is_follow, count } = isFollow || {};
  const [isStarring, setIsStarring] = useState(is_starring || is_follow);
  const [numStarred, setNumStarred] = useState(num_starred || count);

  // const [numStarred, setNumStarred] = useState(num_starred);
  const [show, setShow] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const timer = useRef<NodeJS.Timer>();

  const getCategoryByFollowIDs = (ids: string[]) => {
    dispatch({
      type: 'collection/GetCategoryByFollowIDs',
      payload: {
        ids,
      },
    });
  };

  const setCollectionMap = (ids: string[], is_cancel?: boolean) => {
    const map = ids.reduce((res, cur) => {
      const follow = !is_cancel;
      const follow_count = is_cancel ? numStarred - 1 : is_follow ? numStarred : numStarred + 1;
      res[cur] = { is_follow: follow, count: follow_count };
      return res;
    }, {});
    dispatch({
      type: 'collection/setCollectionMap',
      payload: {
        data: map,
      },
    });
  };
  const is_login = isLogin(user);

  const paperMark: (cid: string, state: boolean, remove_all: boolean) => void = (
    cid = '',
    state = isStarring,
    remove_all,
  ) => {
    if (is_login) {
      const params = {
        ids: [pid],
        f_type: 'p',
        op: state ? 'cancel' : '',
        remove_completely: remove_all,
      };
      if (cid) {
        params.cat_id = cid;
      }
      dispatch({
        type: 'collection/Follow',
        payload: params,
      }).then(res => {
        // setCollectionMap([pid]);
        getCategoryByFollowIDs([pid]);
        // 收藏成功 或者 取消收藏时改变状态，添加、取消分类不改变状态
        // state: false 添加 tag
        if (res && !state) {
          setCollectionMap([pid]);
          // setIsStarring(true);
          // setNumStarred(numStarred + 1);
        }
        // if (res && !state && !remove_all) {
        //   setNumStarred(numStarred + 1);
        // }
        if (res && state && remove_all) {
          setCollectionMap([pid], true);
          // setIsStarring(false);
          // setNumStarred(numStarred - 1);
        }
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const getCategoryList = () => {
    dispatch({
      type: 'collection/ListCategory',
      payload: {
        includes: ['p'],
      },
    });
  };

  const showCategoryList = () => {
    setIsEnter(true);
    cancelHide();
    if (isLogin(user)) {
      const list = document?.getElementsByClassName('cat_list');
      Array.from(list)?.forEach((item: Element) => {
        item.style.display = 'none';
      });
      setShow(true);
    }
  };

  const hideCategoryList = () => {
    setIsEnter(false);
    cancelHide();
    timer.current = setTimeout(() => {
      setShow(false);
    }, 300);
  };

  const cancelHide = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  useEffect(() => {
    setIsStarring(is_starring || is_follow);
  }, [is_starring, is_follow]);

  useEffect(() => {
    setNumStarred(num_starred || count);
  }, [num_starred, count]);

  useEffect(() => {
    if (show && !isStarring && !pubCollection) {
      getCategoryList();
    }
  }, [show]);

  // 显示分类颜色标记 排除未分类
  const categories = useMemo(() => {
    return filterUnclassified(pubCollection, cats);
  }, [cats, pubCollection]);

  // 显示分类列表上方颜色标记 排除未分类
  const categoryies_tiny = useMemo(() => {
    return filterUnclassified(pubCollection, cats, true);
  }, [cats, pubCollection]);

  const [collections, not_cat] = useMemo(() => {
    return getCategoryAndUnclassified(pubCollection);
  }, [pubCollection]);

  return (
    <div className={classnames(styles.markPub, styles[size], 'mark-pub')}>
      <div className="btns_box">
        {isStarring && (
          <div className="btn_box">
            <div className="for_hint">
              <Button
                className="marked_btn btn"
                onClick={() => {
                  paperMark('', true, true);
                }}
                onMouseEnter={showCategoryList}
                onMouseLeave={hideCategoryList}
              >
                <div className={styles.left}>
                  <FM id="aminer.common.marked" defaultMessage="Marked" />
                </div>
                {withNum && !!numStarred && <span className="count">{numStarred}</span>}
              </Button>

              {/* {isEdit && (
                <Button
                  className="marked_btn btn disable"
                  onMouseEnter={showCategoryList}
                  onMouseLeave={hideCategoryList}
                >
                  <div className={styles.left}>
                    <FM id="aminer.user.list.add" defaultMessage="Add List" />
                  </div>
                </Button>
              )} */}
              {!!categories?.length && (
                <div className="tags_hint">
                  {categories.map((category: IFollowCategory) => {
                    const { color, id: cid } = category;
                    return (
                      <div
                        key={cid}
                        className="hint_bg_split"
                        style={{
                          backgroundColor: color,
                          width: `${(1 / categories.length) * 100}%`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}
              {show && pubCollection && (
                <div
                  className={classnames('cat_list edit', { show: isEnter })}
                  onMouseEnter={cancelHide}
                  onMouseLeave={hideCategoryList}
                  // onMouseOver={this.cancelHide}
                >
                  {!!categoryies_tiny?.length && (
                    <div className="cat_hint">
                      {categoryies_tiny.map((category: IFollowCategory) => {
                        const { color, id: cid } = category;
                        return (
                          <div
                            key={cid}
                            className="hint_bg_split"
                            style={{
                              backgroundColor: color,
                              width: `${(1 / categoryies_tiny.length) * 100}%`,
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  )}
                  {!categoryies_tiny?.length && <div className="cat_hint none"></div>}
                  <ModifyCategory
                    addFollowToCategory={paperMark}
                    collections={collections}
                    categories={categories}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {!isStarring && (
          <div className="btn_box mark_btn_box">
            <div onMouseEnter={showCategoryList} onMouseLeave={hideCategoryList}>
              <Button
                className="mark_btn btn"
                onClick={() => {
                  paperMark('', false, false);
                }}
              >
                <div className={styles.left}>
                  {/* <i className={classnames('fa fa-plus', styles.icon)} /> */}
                  <FM id="aminer.common.mark" defaultMessage="Mark" />
                </div>
                {withNum && !!numStarred && <span className="count">{numStarred}</span>}
              </Button>
              {show && collections && is_login && (
                <div className="cat_list">
                  <ModifyCategory addFollowToCategory={paperMark} collections={collections} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default component(
  connect(({ collection, auth }, { paper }) => ({
    // paperAllLiked: searchpaper.paperAllLiked,
    user: auth.user,
    pubCollection: collection.pubCollection,
    categories: collection?.pubCategoryMap[paper.id],
    isFollow: collection?.collectionMap[paper.id],
  })),
)(MarkPub);
