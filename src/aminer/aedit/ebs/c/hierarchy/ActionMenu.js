/**
 *  Created by BoGao on 2018-03-14;
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Icon } from 'antd';
import styles from './ActionMenu.less';

// 这个component现在用的是dom的方式去操作显示和隐藏。我也可以通过react的方式去刷新menu内容。
// 只要使用refs拿到component的对象，就可以操作他下面的方法等。可以通过这样的方式去让menu更新。
// 这样可以做到每个菜单内容不同。

export default class ActionMenu extends Component {

  static propTypes = {
    id: PropTypes.string,
    config: PropTypes.array,
  };

  static defaultProps = {
    id: 'actionMenu',
  };

  constructor(props) {
    super(props);
    this.menu = null; // ref
  }

  state = {};

  getData = () => {
    let data = this.menu && this.menu.dataset.item;
    data = JSON.parse(data);
    return data;
  };

  tryHideMenu = () => {
    if (this.timerHandler) {
      clearTimeout(this.timerHandler);
    }
    this.hide = true;
    this.timerHandler = setTimeout(() => {
      if (this.hide) {
        if (this.menu) {
          this.menu.firstElementChild.style.visibility = 'hidden';
        }
      }
    }, 200);
  };

  cancelHide = () => {
    this.hide = false;
    if (this.timerHandler) {
      clearTimeout(this.timerHandler);
    }
  };

  nothing = () => { };

  refMenu = (menu) => {
    this.menu = menu;
  };

  render() {
    const { id, config } = this.props;
    return (
      <div id={id} className={styles.actionMenu} ref={this.refMenu}
        onMouseOut={this.tryHideMenu}
        onMouseEnter={this.cancelHide}
        onMouseOver={this.cancelHide}
        onFocus={this.nothing}
        onBlur={this.nothing}
      >
        <div className={styles.menu}>
          {config && config.map((item) => {
            if (item.component) {
              const { component, ...props } = item;
              const newProps = {
                ...props,
                className: styles.item,
                onGetData: this.getData,
              };
              return React.createElement(component, newProps);
            }
            const iconType = item.icon;
            const onclick = item.onClick || null;
            return (
              <div key={item.key} className={styles.item} onClick={onclick}>
                <Icon type={iconType} />
                <span>{item.label}</span>
              </div>
            );

          })}
        </div>
      </div>
    );
  }
}
