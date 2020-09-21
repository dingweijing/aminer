import React, { useEffect, useMemo, useState, useRef } from 'react';
import { component, connect,  } from 'acore';
import { Button, Input, message } from 'antd';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IFollowCategory } from 'aminer/components/common_types';
import styles from './EditCategory.less';

const { CATEGORY_COLORS_DEFAULT } = sysconfig;

type IColors = string[];
interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  colors: IColors;
  type: 'p' | 'e';
  category: IFollowCategory;
  onChangeEdit: () => void;
  // pubCollection: IFollowCategory[];
  // location: H.Location;
}

const EditCategory: React.FC<IPropTypes> = props => {
  const { colors = [], dispatch, type = 'p', category, onChangeEdit } = props;
  const { id: cid, name, color } = category || {};
  const cat_colors = Array.from(new Set([...colors, ...CATEGORY_COLORS_DEFAULT]));
  const defalut_color = color || (cat_colors && cat_colors[0]) || '#0095ff';
  const [select_color, setSelectColor] = useState<string>(defalut_color);
  const [show_colorlist, setShowColorList] = useState(false);
  const [cat_name, setCatName] = useState(name || '');

  const toggleColorList = () => {
    setShowColorList(!show_colorlist);
  };

  const onChangeColor = (c: string) => {
    setSelectColor(c);
    toggleColorList();
  };

  const onChangeCatName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setCatName(e?.target?.value);
  };

  const onCancel = (e: Event) => {
    e.stopPropagation();
    onChangeEdit();
  };

  const addCategory = (e: Event) => {
    e.stopPropagation();
    const t = cid ? 'UpdateCategory' : 'CreateCategory';
    const params = cid
      ? {
          id: cid,
          name: cat_name,
          color: select_color,
        }
      : { name: cat_name, color: select_color, f_type: type };

    if (cat_name) {
      dispatch({
        type: `collection/${t}`,
        payload: params,
      }).then(res => {
        if (res) {
          // setCatName('');
          message.success(formatMessage({ id: 'aminer.common.success' }));
          onChangeEdit();
        }
      });
    }
  };
  // const updateCategory = () => {
  //   if (cat_name) {
  //     dispatch({
  //       type: 'collection/UpdateCategory',
  //       payload: {
  //         name: cat_name,
  //         color: select_color,
  //         f_type: type,
  //       },
  //     }).then(res => {
  //       if (res) {
  //         setCatName('');
  //         message.success(formatMessage({ id: 'aminer.common.success' }));
  //       }
  //     });
  //   }
  // };

  return (
    <div className={styles.editCategory}>
      <div className="under_color" />
      <div className="up">
        <div className="left">
          <span className="color">
            <span
              className="color_icon"
              style={{ backgroundColor: select_color }}
              onClick={toggleColorList}
            >
              <div className={classnames('color_list', { hide: !show_colorlist })}>
                <ColorList
                  colors={cat_colors}
                  selectColor={select_color}
                  onChangeColor={onChangeColor}
                />
              </div>
            </span>
            <span className="dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </span>
          <span className="name">
            <Input
              placeholder={formatMessage({
                id: 'aminer.category.name',
                defaultMessage: 'Category Name',
              })}
              autoFocus
              value={cat_name}
              onChange={onChangeCatName}
              onPressEnter={addCategory}
            />
          </span>
        </div>
        <div className="right">
          <span className="opr_btn confirm_btn" onClick={addCategory}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-duigou" />
            </svg>
          </span>
          <span className="opr_btn cancel_btn" onClick={onCancel}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-modal_close" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default component(connect())(EditCategory);

interface IColorList {
  colors: IColors;
  selectColor: string;
  onChangeColor: (color: string) => void;
}

const ColorList: React.FC<IColorList> = props => {
  const { colors = [], selectColor, onChangeColor } = props;

  return (
    <div className={classnames(styles.colorList, 'color-list')}>
      {colors?.map(color => {
        return (
          <span
            key={color}
            className={classnames('color_span', {
              select: selectColor?.toLocaleLowerCase() === color?.toLocaleLowerCase(),
            })}
            style={{ backgroundColor: color }}
            onClick={() => {
              onChangeColor(color);
            }}
          />
        );
      })}
    </div>
  );
};
