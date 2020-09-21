import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'utils';
import { Hole } from 'components/core';
import styles from './SideMenu.less';

// TODO change to SideMenu
const SideMenu = props => {
  const { list, onChangeSide, selected, icon, className, showSelectClass } = props;
  const { leftZone } = props;

  const selectKey = key => {
    if (onChangeSide) {
      onChangeSide(key);
    }
  };

  return (
    <ul className={classnames(styles.aminerSider, styles[className])}>
      {list &&
        list.length > 0 &&
        list.map(item => {
          const { title, key, sub } = item;
          // console.log('>>>>>>>>3333', title, key)
          // console.log('>>>>>>>>irestn', selected, key, selected === key)
          // return (
          //   <li
          //     key={key}
          //     // onClick={selectKey.bind(this, key)}
          //     className={classnames(
          //       'sider_item',
          //       { selected: selected === key }
          //     )}>
          //     <Link to={}>{title}</Link>
          //     {/* <span></span> */}
          //   </li>
          // )
          return (
            <li
              key={key}
              onClick={selectKey.bind(this, key)}
              className={classnames('sider_item', { selected: selected === key && showSelectClass })}
            >
              <Hole
                name="Sider.leftZone"
                fill={leftZone}
                defaults={[]}
                // plugins={P.getHoles(plugins, 'PaperList.contentRightZone')}
                param={{ values: item }}
                config={{ containerClass: 'sider_left_zone' }}
              />
              <span className="sider_content">
                {title}
                {icon && (
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={`#icon-${icon}`} />
                  </svg>
                )}
                {sub || ''}
              </span>
            </li>
          );
        })}
    </ul>
  );
};

SideMenu.propTypes = {
  list: PropTypes.array.isRequired,
  leftZone: PropTypes.array,
  showSelectClass: PropTypes.bool,
  onChangeSide: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SideMenu.defaultProps = {
  leftZone: [],
  showSelectClass: true
};

export default SideMenu;
