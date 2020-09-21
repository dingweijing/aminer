/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import React, { } from 'react';
import { component, Link } from 'acore';
import { Breadcrumb, Icon } from 'antd';
import { classnames } from 'utils';
import styles from './PubBreadcrumb.less';


// * --------------------------------------------
// * Component
// * --------------------------------------------
const PubBreadcrumb = props => {
  const { className } = props;

  // TODO load breadcrumb from url?
  // TODO 样式调整

  return (
    <div className={classnames(styles.bc, className, 'desktop_device')}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'><Icon type="home" />Home</Link>
        </Breadcrumb.Item>
        {/* <Breadcrumb.Item>
          <a href="">TODO Publication List</a>
        </Breadcrumb.Item> */}
        <Breadcrumb.Item>Publication</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default component(
  // connect(({ auth }) => ({
  //   user: auth.user
  // }))
)(PubBreadcrumb);
