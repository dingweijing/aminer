import React, { useState, useMemo } from 'react';
import { classnames } from 'utils';
import { withRouter, connect, component } from 'acore';
import helper from 'helper';
import { FM, formatMessage } from 'locales';
import { SideMenu } from 'aminer/components/widgets';
import styles from './Menu.less';

const Menu = props => {
  const { scholars2019, defaultType, menuRef } = props;

  const onSelect = key => {
    const { clientWidth } = document.body;

    if (clientWidth <= 768) {
      menuRef.current.style.display = 'none'
    }

    if (key && !defaultType) {
      helper.routeTo(props, null, { type: key }, {
        transferPath: [
          { from: '/ai10', to: '/ai10/:type' },
        ],
      });
    } else if (key && defaultType) {
      helper.routeTo(props, null, { type: key }, {
        transferPath: [
          { from: '/ai10/:type/:position', to: '/ai10/:type' },
        ],
      });
    } else {
      helper.routeTo(props, null, { type: key }, {
        transferPath: [
          { from: '/ai10/:type', to: '/ai10' },
          { from: '/ai10/:type/:position', to: '/ai10' },
        ],
      });
    }
  }

  const siderList = useMemo(() => scholars2019.map(item => ({
    title: formatMessage({ id: item.title, defaultMessage: item.name }),
    key: item.alias,
  })), [scholars2019])

  return (
    <div>
      <p className={classnames(styles.menuTitle, { [styles.active]: !defaultType })} onClick={() => { onSelect(''); }}>
        <FM id="ai10.menu.ai" defaultMessage="Artificial Intelligence" />
      </p>
      <SideMenu
        list={siderList}
        onChangeSide={onSelect}
        selected={defaultType}
      />
    </div>
  );
};

export default component(withRouter, connect())(Menu);
