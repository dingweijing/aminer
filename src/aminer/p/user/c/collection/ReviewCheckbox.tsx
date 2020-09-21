import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { Checkbox } from 'antd';
import { IFollowCategory } from 'aminer/components/common_types';

interface IPropTypes {
  categories: IFollowCategory[];
}

const ReviewCheckbox: React.FC<IPropTypes> = props => {
  const { categories } = props;

  return <Checkbox />;
};

export default component(connect())(ReviewCheckbox);
