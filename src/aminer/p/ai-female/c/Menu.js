import React, { useState, useMemo } from 'react';
import { classnames } from 'utils';
import { withRouter, connect, component } from 'acore';
import helper from 'helper';
import { FM, formatMessage } from 'locales';
import styles from './Menu.less';

const Menu = props => {
  const { defaultType, menuRef, menus } = props;

  const onSelect = (key, index) => {
    const { clientWidth } = document.body;

    if (menuRef && clientWidth <= 768) {
      menuRef.current.style.display = 'none';
    }

    if (index === 0) {
      if (!defaultType) {
        return;
      }
      helper.routeTo(
        props,
        null,
        {},
        {
          transferPath: [{ from: '/women-in-ai/:type', to: '/women-in-ai' }],
        },
      );
      return
    }

    if (key === defaultType) {
      return;
    }

    if (key && !defaultType) {
      helper.routeTo(
        props,
        null,
        { type: key },
        {
          transferPath: [{ from: '/women-in-ai', to: '/women-in-ai/:type' }],
        },
      );
    } else if (key && defaultType) {
      helper.routeTo(props, null, { type: key });
    } else {
      helper.routeTo(
        props,
        null,
        { type: key },
        {
          transferPath: [{ from: '/women-in-ai/:type', to: '/women-in-ai' }],
        },
      );
    }
  };

  return (
    <div className={styles.menus}>
      <Sider defaultType={defaultType} list={menus} onSelect={onSelect} />
    </div>
  );
};

export default component(withRouter, connect())(Menu);

const Sider = props => {
  const { list, defaultType, onSelect } = props;

  return (
    <ul className={styles.sider}>
      {list &&
        list.map((menu, index) => {
          const { title_id, key } = menu;
          let active = false;
          if (typeof key === 'string' && key === defaultType) {
            active = true;
          }
          if (Array.isArray(key) && key.includes(defaultType)) {
            active = true;
          }
          return (
            <li
              className={classnames('menu_item', { active })}
              key={key}
              onClick={() => {
                onSelect(key, index);
              }}
            >
              {title_id && <FM id={title_id} />}
            </li>
          );
        })}
    </ul>
  );
};
