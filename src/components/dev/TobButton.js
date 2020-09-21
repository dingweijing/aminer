/* eslint-disable react/no-unused-prop-types,react/require-default-props,react/destructuring-assignment */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import { connect, system, Link } from 'acore';
// import { RequireGod } from 'acore/hoc';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Icon, Dropdown, Menu, Layout } from 'antd';
import { classnames } from 'utils';
import styles from './TobButton.less';

@connect(({ auth, debug }) => ({
  user: auth.user,
  roles: auth.roles,
  debug,
}))
// @RequireGod // TODO 这个button，如果不是god， 就不显示。
class TobButton extends PureComponent {
  state = {
    visible: false,
    fixed: false,
  };

  onclick = (sys) => {
    const { user } = this.props;
    system.saveSystem(sys, user);
    window.location.reload();
  };

  onIconToggle = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible, fixed: false });
  };

  onMenuClick = () => {
    this.setState({ fixed: true });
  }

  onMenuMouseOut = () => {
    if (this.state.fixed) {
      return;
    }
    this.Timer = setTimeout(() => {
      if (!this.state.fixed) {
        this.setState({ visible: false });
      }
    }, 500);
  };

  onMenuMouseIn = () => {
    clearTimeout(this.Timer);
  };

  setDebug = () => {
    const { dispatch, debug } = this.props;
    const { HighlightHoles } = debug || {};
    dispatch({ type: 'debug/set', payload: { HighlightHoles: this.dfa[HighlightHoles] } });
  };

  dfa = {
    none: 'yes',
    yes: 'all',
    all: 'none',
  };

  render() {
    const { debug } = this.props;
    const { HighlightHoles } = debug || {};
    // const allSystemConfigs = getAllSystemConfigs(); // singleton
    const allSystemConfigs = AvailableSystems;

    // const menu = (
    //   <div>
    //     <Layout className={styles.menu}>
    //       <Layout.Sider width={150}>
    //         <Menu selectedKeys={[sysconfig.SYSTEM]}>
    //           <Menu.Item className={styles.headerMenuItem}>快速切换系统</Menu.Item>
    //           <Menu.Divider />
    //
    //           {allSystemConfigs && allSystemConfigs.map(sys => (
    //             <Menu.Item key={sys}>
    //               <div onClick={this.onclick.bind(this, sys)} className={styles.syslogo}>
    //                 <img src={`/sys/${sys}/favicon.ico`} />
    //                 <span>{sys}</span>
    //               </div>
    //             </Menu.Item>
    //           ))}
    //
    //           {/*{allSystemConfigs && allSystemConfigs.map(src => (*/}
    //           {/*<Menu.Item key={src.SYSTEM}>*/}
    //           {/*<div onClick={this.onclick.bind(this, src.SYSTEM)} className={styles.syslogo}>*/}
    //           {/*<img src={`/sys/${src.SYSTEM}/favicon.ico`} />*/}
    //           {/*<span>{src.SYSTEM}</span>*/}
    //           {/*</div>*/}
    //           {/*</Menu.Item>*/}
    //           {/*))}*/}
    //
    //         </Menu>
    //       </Layout.Sider>
    //
    //       <Layout.Content>
    //         <Menu>
    //           <Menu.Item className={styles.headerMenuItem}>开发者工具</Menu.Item>
    //           <Menu.Divider />
    //           <Menu.Item>
    //             <Link to="/2b"><Icon type="home" />后台管理</Link>
    //           </Menu.Item>
    //           <Menu.Divider />
    //
    //           <Menu.Item>
    //             <div onClick={this.setDebug.bind(this)}>
    //               Holes调试: {HighlightHoles}
    //             </div>
    //           </Menu.Item>
    //
    //           <Menu.Divider />
    //
    //           <Menu.Item>
    //             <Link to="/cross"><Icon type="close" />交叉搜索</Link>
    //           </Menu.Item>
    //           <Menu.Item>
    //             <Link to="/tools/compareperson">姓名比较工具</Link>
    //           </Menu.Item>
    //
    //         </Menu>
    //       </Layout.Content>
    //     </Layout>
    //   </div>
    // );
    const { visible } = this.state;

    return (
      <div>
        {/*<Dropdown overlay={menu} placement="bottomRight" trigger={['click']}*/}
        {/*visible={this.state.isVisible} getPopupContainer={() => document.body}*/}
        {/*onVisibleChange={this.handleVisibleChange}>*/}
        {/*<Icon type="appstore-o" className={classnames(styles.icon, "noTextIcon")} />*/}
        {/*</Dropdown>*/}
        {visible && (
          <div onClick={this.onMenuClick} onMouseEnter={this.onMenuMouseIn} onMouseLeave={this.onMenuMouseOut}
            className={styles.dropList}>
            <Layout className={styles.menu}>
              <Layout.Sider width={150}>
                <Menu selectedKeys={[sysconfig.SYSTEM]}>
                  <Menu.Item className={styles.headerMenuItem}>快速切换系统</Menu.Item>
                  <Menu.Divider />

                  {allSystemConfigs && allSystemConfigs.map(sys => (
                    <Menu.Item key={sys}>
                      <div onClick={this.onclick.bind(this, sys)} className={styles.syslogo}>
                        <img src={`/sys/${sys}/favicon.ico`} alt='' />
                        <span>{sys}</span>
                      </div>
                    </Menu.Item>
                  ))}

                  {/*{allSystemConfigs && allSystemConfigs.map(src => (*/}
                  {/*<Menu.Item key={src.SYSTEM}>*/}
                  {/*<div onClick={this.onclick.bind(this, src.SYSTEM)} className={styles.syslogo}>*/}
                  {/*<img src={`/sys/${src.SYSTEM}/favicon.ico`} />*/}
                  {/*<span>{src.SYSTEM}</span>*/}
                  {/*</div>*/}
                  {/*</Menu.Item>*/}
                  {/*))}*/}

                </Menu>
              </Layout.Sider>

              <Layout.Content>
                <Menu>
                  <Menu.Item className={styles.headerMenuItem}>开发者工具</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>
                    <Link to="/2b"><Icon type="home" />后台管理</Link>
                  </Menu.Item>
                  <Menu.Divider />

                  <Menu.Item>
                    <div onClick={this.setDebug.bind(this)}>
                      Holes调试: {HighlightHoles}
                    </div>
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item>
                    <Link to="/cross"><Icon type="close" />交叉搜索</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/tools/compareperson">姓名比较工具</Link>
                  </Menu.Item>

                  <Menu.Item>
                    <Link to="/eb"><Icon type="folder" /> 智库</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/person/path"><Icon type="folder" /> 专家关联关系</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/awardranking"><Icon type="folder" /> 评奖系统</Link>
                  </Menu.Item>

                </Menu>
              </Layout.Content>
            </Layout>
          </div>
        )}
        <Icon type="appstore-o" onClick={this.onIconToggle}
          className={classnames(styles.icon, styles.dropIcon, "noTextIcon")}
        />
      </div>
    );
  }
}

export default TobButton;
