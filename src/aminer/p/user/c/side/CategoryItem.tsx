import React, { useEffect, useMemo, useState } from 'react';
import { component, connect,} from 'acore';
import { Button, Input, message } from 'antd';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { IFollowCategory } from 'aminer/components/common_types';
import EditCategory from './EditCategory';
import Category from './Category';
import styles from './CategoryItem.less';

const { CATEGORY_COLORS_DEFAULT } = sysconfig;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  category: IFollowCategory;
  notCatID: string;
}

const CategoryItem: React.FC<IPropTypes> = props => {
  const { category, notCatID } = props;

  const [is_edit, setIsEdit] = useState(false);

  const onChangeEdit = (e: Event) => {
    e && e.stopPropagation();
    setIsEdit(!is_edit);
  };

  return (
    <div className={classnames(styles.categoryItem, { [styles.edit]: is_edit })}>
      {is_edit && <EditCategory category={category} onChangeEdit={onChangeEdit} />}
      {!is_edit && <Category category={category} onChangeEdit={onChangeEdit} notCatID={notCatID} />}
    </div>
  );
};
export default component(connect())(CategoryItem);
