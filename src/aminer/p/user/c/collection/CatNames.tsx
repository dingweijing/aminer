import React, { useEffect, useState } from 'react';
import { Popconfirm } from 'antd';
import { FM, formatMessage } from 'locales';
import { toRGB } from 'helper';
import { IFollowCategory } from 'aminer/components/common_types';
import { PubInfo } from 'aminer/components/pub/pub_type';
import styles from './CatNames.less';

interface IPropTypes {
  categories: IFollowCategory[] | null;
}

const CatNames: React.FC<IPropTypes> = props => {
  const { categories } = props;

  return (
    <div className={styles.catNames}>
      {!!categories?.length &&
        categories.map(cat => {
          const { color, name, id: cid } = cat;
          const color_rgb = toRGB(color);
          const borderColor = color_rgb
            ? `rgba(${color_rgb.r}, ${color_rgb.g}, ${color_rgb.b}, 0.4)`
            : color;

          return (
            <span
              key={cid}
              className="cat_name"
              style={{
                color,
                borderColor,
              }}
            >
              {name}
            </span>
          );
        })}
    </div>
  );
};

export default CatNames;
