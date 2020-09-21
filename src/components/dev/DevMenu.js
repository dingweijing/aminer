/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { } from 'react';
import { component } from 'acore';
import { Icon } from 'antd';

const DevMenu = props => {
  const a = 1;
  return (
    <div>
      <Icon type="setting" className="noTextIcon"
        style={{ color: 'orange', fontSize: 16 }} />
    </div>
  );
};

export default component()(DevMenu);
