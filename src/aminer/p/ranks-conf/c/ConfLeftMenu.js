import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types';
import { component } from 'acore';
import { Hole } from 'components/core';
import { useResizeEffect } from 'helper/hooks';
// import { SideMenu } from 'aminer/components/widgets';
import ConfSider from './ConfSider';
import styles from './ConfLeftMenu.less';

const ConfLeftMenu = (props, ref) => {
  const menuRef = useRef();

  const { onChangeSide, titleZoneFuncs, ...siderParams } = props;

  const onChangeMenu = key => {
    if (onChangeSide) {
      onChangeSide(key);
    }
    const { clientWidth } = document.body;
    if (clientWidth <= 768) {
      menuRef.current.style.display = 'none';
    }
  }

  useResizeEffect(menuRef);

  useImperativeHandle(ref, () => ({
    hideMenu: () => {
      menuRef.current.style.display = 'none';
    },
    showMenu: () => {
      const parent = menuRef.current.parentElement;
      if (parent) {
        parent.style.position = 'static';
      }
      menuRef.current.style.display = 'block';
    },
    isShow: () => menuRef.current.style.display === 'block'
  }));
  return (
    <div className={styles.confLeftMenu} ref={menuRef}>
      <Hole
        name="search.rightZoneFuncs"
        fill={titleZoneFuncs}
        defaults={[]}
      // param={{ query }}
      // config={{ containerClass: 'menu_title mobile_device' }}
      />
      <ConfSider onChangeSide={onChangeMenu} {...siderParams} />
    </div>
  )
}

ConfLeftMenu.propsType = {
  onChangeSide: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default component(forwardRef)(ConfLeftMenu);
