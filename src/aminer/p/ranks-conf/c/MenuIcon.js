import React from 'react';

const MenuIcon = props => {

  const { menuRef, children } = props;

  const showMenu = () => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.isShow()) {
      menuRef.current.hideMenu();
    } else {
      menuRef.current.showMenu();
    }
  }

  return (
    <div style={{ cursor: 'pointer' }} onClick={showMenu}>{children}</div>
  )
}

export default MenuIcon;