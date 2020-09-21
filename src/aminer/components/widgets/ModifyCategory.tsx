import React, { useEffect, useState, useMemo } from 'react';
import { connect, component } from 'acore';
import { Icon } from 'antd';
import { FM } from 'locales';
import { classnames } from 'utils';
import { IFollowCategory } from 'aminer/components/common_types';
import { EditCategory } from 'aminer/p/user/c/side';
import styles from './ModifyCategory.less';

interface IPropTypes {
  // dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  collections: IFollowCategory[];
  categories: IFollowCategory[];
  addFollowToCategory: (cid: string, state: boolean, remove_all: boolean) => void;
}

const ModifyCategory: React.FC<IPropTypes> = props => {
  const { collections, addFollowToCategory, categories } = props;

  const [show_create, setShowCreate] = useState(false);

  const toggleShowCategoryList = () => {
    setShowCreate(!show_create);
  };

  const onFollow = (id: string) => {
    if (addFollowToCategory) {
      addFollowToCategory(id, exist_cat_ids?.includes(id), false);
    }
  };

  const exist_cat_ids = useMemo(
    () => categories?.map((collection: IFollowCategory) => collection.id),
    [categories],
  );

  return (
    <div className={classnames(styles.modifyCategory, 'modify-category')}>
      <ul className="category_list">
        {!!collections?.length &&
          collections.map(collection => {
            const { color, name, id: cid } = collection;
            const is_exist = exist_cat_ids?.includes(cid);
            return (
              <li
                key={cid}
                className="category_item"
                style={{ color }}
                onClick={() => {
                  onFollow(cid);
                }}
              >
                <span className="color" style={{ backgroundColor: color }}>
                  <svg className={classnames('icon', { not_exist: !is_exist })} aria-hidden="true">
                    <use xlinkHref="#icon-check" />
                  </svg>
                </span>
                {/* <svg className="icon" aria-hidden="true" style={{color: '#fff'}}>
                    <use xlinkHref="#icon-confirm" />
                  </svg> */}
                {/* <Icon type="user" /> */}
                <span className={classnames('name', { exist: is_exist })}>{name}</span>
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

export default ModifyCategory;
