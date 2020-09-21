import React, { useEffect, useMemo, useState } from 'react';
import { component, connect, withRouter,  } from 'acore';
import { Button, Popconfirm, message } from 'antd';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { IFollowCategory } from 'aminer/components/common_types';
import { FM, formatMessage } from 'locales';
import styles from './Category.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  category: IFollowCategory;
  notCatID: string;
  onChangeEdit: () => void;
}

const Category: React.FC<IPropTypes> = props => {
  const { category, dispatch, onChangeEdit, notCatID } = props;
  const { color, name, id: cid } = category || {};

  const removeCategory = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'collection/RemoveCategory',
      payload: {
        ids: [cid],
      },
    }).then(res => {
      if (res) {
        message.success(formatMessage({ id: 'aminer.common.success' }));
      }
    });
  };
  const onCancel = e => {
    e && e.stopPropagation();
  };

  return (
    <div className={styles.categoryItem}>
      <div className="under_color" style={{ background: color }} />
      <div className="up">
        <div className="left">
          <span className="color">
            <span className="color_icon" style={{ backgroundColor: color }} />
          </span>
          <span className="name">{name}</span>
        </div>
        {cid !== notCatID && (
          <div className="right">
            <span className="opr_btn edit_btn" onClick={onChangeEdit}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-edit_cat" />
              </svg>
            </span>
            <Popconfirm
              placement="right"
              overlayClassName="confirm_certified_popconfirm"
              title={formatMessage({ id: 'aminer.category.remove.tip' })}
              onConfirm={removeCategory}
              onCancel={onCancel}
              okText={formatMessage({ id: 'aminer.common.ok' })}
              cancelText={formatMessage({ id: 'aminer.common.cancel' })}
            >
              <span className="opr_btn remove_btn" onClick={e => e.stopPropagation()}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-delete-" />
                </svg>
              </span>
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
};
export default component(connect())(Category);
