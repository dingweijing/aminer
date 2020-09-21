import React, { useEffect, useMemo, useState } from 'react';
import { component, connect, withRouter, Link, history } from 'acore';
import { Button } from 'antd';
import { classnames } from 'utils';
// import * as H from 'history';
import { parseUrlParamWithSearch, toRGB } from 'helper';
import { getCategoryAndUnclassified } from 'helper/data';
import { FM, formatMessage } from 'locales';
import { IFollowCategory } from 'aminer/components/common_types';
import EditCategory from './EditCategory';
import CategoryItem from './CategoryItem';
import styles from './PubListMenu.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  pubCollection: IFollowCategory[];
  // location: H.Location;
}

const PubListMenu: React.FC<IPropTypes> = props => {
  const { dispatch, pubCollection } = props;
  // const { list = '' } = query || {};
  const { list } = parseUrlParamWithSearch(props, {}, ['list']);

  const [show_create, setShowCreate] = useState(false);

  const getCategoryList = () => {
    dispatch({
      type: 'collection/ListCategory',
      payload: {
        includes: ['p'],
      },
    });
  };
  useEffect(() => {
    if (!pubCollection) {
      getCategoryList();
    }
  }, []);

  const changList = (id?: string) => {
    if (id === list) {
      return;
    }
    const str = id ? `?list=${id}` : '';
    history.push(`/user/collections${str}`);
  };

  const [collections, not_cat] = useMemo(() => {
    return getCategoryAndUnclassified(pubCollection, true);
  }, [pubCollection]);

  const [icon_color_all, bg_color_all] = useMemo(() => {
    const colors = collections?.map(item => item.color);
    // const colors = ['#9E9EA7', '#E4484F', '#FFBD00', '#0095FF'];
    const icon = colors ? `conic-gradient(${colors.join(', ')})` : '#00936B';
    const bg = colors ? `linear-gradient(to right, ${colors.join(', ')})` : '#00936B';
    return [icon, bg];
  }, [collections]);

  const toggleShowCategoryList = () => {
    setShowCreate(!show_create);
  };

  return (
    <div className={classnames(styles.pubListMenu, 'pubList-menu')}>
      <p className="menu_title">
        <FM id="aminer.user.publist.title" defaultMessage="My Publist" />
      </p>
      <ul className="category_list">
        <li
          className={classnames('category_item', { active: !list })}
          onClick={() => {
            changList();
          }}
        >
          <div className="under_color" style={{ background: bg_color_all }} />
          <div className="up">
            <div className="left">
              <span className="color">
                <span className="color_icon" style={{ background: icon_color_all }}></span>
              </span>
              <span className="name">ALL</span>
            </div>
          </div>
        </li>
        {!!collections?.length &&
          collections.map(category => {
            const { id } = category;
            return (
              <li
                key={id}
                className={classnames('category_item', { active: id === list })}
                onClick={() => {
                  changList(id);
                }}
              >
                <CategoryItem category={category} notCatID={not_cat?.id} />
              </li>
            );
          })}
        {show_create && (
          <li className="category_item">
            <EditCategory onChangeEdit={toggleShowCategoryList} />
          </li>
        )}
      </ul>
      {!show_create && (
        <div className="create_btn">
          <div className="btn" onClick={toggleShowCategoryList}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-add" />
            </svg>
            <FM id="aminer.category.create.btn" defaultMessage="Create New Tag"></FM>
          </div>
        </div>
      )}
    </div>
  );
};

export default component(
  withRouter,
  connect(({ collection }) => ({
    pubCollection: collection.pubCollection,
  })),
)(PubListMenu);
