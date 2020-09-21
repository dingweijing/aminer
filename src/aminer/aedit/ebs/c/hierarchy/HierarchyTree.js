/**
 * Created by GaoBo on 2018/03/14.
 * Add LocalStorage cache 2019-03-27 by bogao.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter, connect } from 'acore';
import { sysconfig } from 'systems';
import { enUS, zhCN } from 'locales';
import { Tree, Icon } from 'antd';
import { ListTristate } from 'components/core';
import actionMenu from 'helper/actionmenu';
import { isAuthed, isSuperAdmin } from 'utils/auth';
import helper from 'helper';
import { classnames } from 'utils';
import display from 'utils/display';
import { compare, anyNE } from 'utils/compare';
import ActionMenu from './ActionMenu';
import styles from './HierarchyTree.less';


// 具体的某个组件需要在这个的基础上包装一层，加上自定义的部分。
@withRouter
@connect(({ auth }) => ({ user: auth.user, roles: auth.roles }))
class HierarchyTree extends PureComponent {
  static propTypes = {
    // data: PropTypes.object.required, // allow null
    id: PropTypes.string.isRequired, // string name
    title: PropTypes.string,
    selected: PropTypes.string,
    onItemClick: PropTypes.func,
    menuConfig: PropTypes.array,
    menuConfigType: PropTypes.array,
    topMenuConfig: PropTypes.arrayOf(PropTypes.object),
    dataFilter: PropTypes.func, // filter out items that not wanted.
    className: PropTypes.string,
    // manupulateAction: PropTypes.object, // {onAdd(), onDelete(), onMove(), onReorder(), ...}
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.actionMenu = null;

    this.firstID = ''; // ???????
    this.firstItem = ''; // ???????

    // can show type?
    this.showMenuMap = {};
    if (props.menuConfigType) {
      for (const t of props.menuConfigType) {
        this.showMenuMap[t] = true;
      }
      // props.menuConfigType.map(t => this.showMenuMap[t] = true);
    }

  }

  state = {
    selected: null,
  };

  componentDidMount() {
    const { id } = this.props;
    this.menu = actionMenu.init(id);
  }

  componentWillReceiveProps = (nextProps) => {
    if (anyNE(nextProps, this.props, 'selected', 'data')) {
      const { match: { id } } = nextProps;
      this.setState({ selected: id || this.getSelectedID(nextProps) });
    }
  };

  // TODO 禁止取消选择
  // 目前只取第一个元素
  onSelect = (selectedKeys) => {
    const { onItemClick } = this.props;
    const id = selectedKeys && selectedKeys.length > 0 && selectedKeys[0];
    if (onItemClick && id && id.length > 0) {
      onItemClick(id /*, this.firstItem*/);
    }
  };

  getSelectedID = (props) => {
    const { selected, data } = props;
    return selected || (data && data.length > 0 && data[0] && data[0].id);
  };

  canShowMenu = (nodetype) => {
    if (!this.props.menuConfigType) {
      return true;
    }
    if (this.showMenuMap[nodetype]) {
      return true;
    }
    return false;
  };

  onActionMenuHover = (model, e) => {
    if (!model) {
      console.error('error model is null');
      return;
    }
    if (this.actionMenu) {
      this.actionMenu.cancelHide();
    }
    if (this.menu) {
      this.menu.show(e.target, model);
    }
  };

  onActionMenuOut = () => {
    if (this.actionMenu) {
      this.actionMenu.tryHideMenu();
    }
  };

  // sortByOrder = (a, b) => {
  // };


  // 处理数据形成树
  renderTreeNodes = (nodes) => {
    const { dataFilter, menuConfig, roles } = this.props;
    const { selected } = this.state;
    // nodes.sort(this.sortByOrder);
    // console.log('8888 render HierarchyTree', nodes);

    return helper.renderEach(nodes, (node) => {
      // filter out not wantted items. first used in shared eb.
      if (dataFilter && !dataFilter(node)) {
        return null;
      }

      const { id, childs, nodetype } = node;
      const displayName = display.getEBDisplayName(node);
      const nchilds = childs && childs.length;

      // 什么鬼。。。。👻 我的天哪。
      const nchildsBlock = (
        <span className={styles[selected === id ? 'childrenNumActive' : 'childrenNum']}>
          {nchilds}
        </span>
      )
      const afterTitle = childs && childs.length > 0 ? <span>({nchildsBlock})</span> : '';

      const title = (
        <div className={styles.line}>
          <div className={styles.highlight}>
            <div className={styles.treeNode}>{displayName} {afterTitle}</div>
          </div>

          <div className={styles.actionIcon}>
            {/* {isAuthed(roles) && this.canShowMenu(nodetype) && menuConfig && ( */}
            {/* <i className="fa fa-bars " onMouseEnter={this.onActionMenuHover.bind(this, node)}
              onMouseLeave={this.onActionMenuOut} onBlur={() => {
              }} /> */}
            <svg className="icon" aria-hidden="true" onMouseEnter={this.onActionMenuHover.bind(this, node)}
              onMouseLeave={this.onActionMenuOut} onBlur={() => {
              }} >
              <use xlinkHref='#icon-list' />
            </svg>
          </div>
        </div>
      );

      // each node has 'nodetype', which describs node type.
      // key must be id, used in expands.
      return (
        <Tree.TreeNode
          key={id}
          title={title}
          dataRef={node}
          className={classnames(`ht_type_${nodetype}`, { [styles.selectedKeys]: id === selected })}
        >
          {childs && childs.length > 0 && this.renderTreeNodes(childs)}
        </Tree.TreeNode>
      );
    });
  };

  actionMenuRef = (comp) => {
    this.actionMenu = comp
  };


  // onDragStart = ({ event, node }) => {
  //   console.log('拖拽开始', node)
  // }

  // onDragEnter = ({ event, node, expandedKeys }) => {
  //   // console.log('拖拽进入', node)
  //   console.log('拖拽进入', expandedKeys);
  // };

  // onDragEnd = ({ evecnt, node }) => {
  //   console.log('拖拽结束', node)
  // }
  // onDragLeave = ({ event, node }) => {
  //   console.log('拖拽离开', node)
  // }
  //
  // onDragOver = ({ event, node }) => {
  //   console.log('拖拽过程中', node)
  // }

  // onDrop = ({ event, node, dragNode, dragNodesKeys }) => {
  //   console.log('拖拽onDrop', dragNodesKeys);
  // };

  render() {
    const { id, title, data, menuConfig, topMenuConfig, className, dataFilter, roles } = this.props;
    const { selected } = this.state;
    return (
      <div className={classnames(styles.hierarchyTree, className)} id={`${id}_ROOT`}>

        <div className={styles.toolBox}>
          <div className={styles.treeHeader}>{title}</div>

          <div className={styles.tools}>
            {/* TODO 暂时 isSuperAdmin给AiBase用 isSuperAdmin(roles) &&*/}
            {true && topMenuConfig && topMenuConfig.map((item) => {
              if (item.component) {
                const { component, ...props } = item;
                const newProps = {
                  ...props,
                  className: styles.item,
                };
                return React.createElement(component, newProps);
              }
              return null;
            })}
          </div>

        </div>

        <ListTristate condition={data} test={selected} empty={<div>No Expert Base</div>}>
          <ActionMenu
            key={0} id={id} config={menuConfig} top={0}
            ref={this.actionMenuRef}
          />
          {data && (
            <Tree
              key={1} onSelect={this.onSelect}
              selectedKeys={[selected]}
              // onDragStart={this.onDragStart}
              // onDragEnter={this.onDragEnter}
              // onDragEnd={this.onDragEnd}
              // onDragLeave={this.onDragLeave}
              // onDragOver={this.onDragOver}
              // onDrop={this.onDrop}
              showLine
              defaultExpandAll={true}
            // defaultExpandedKeys=}
            // expandedKeys={opens}
            // draggable={false}
            >
              {this.renderTreeNodes(data)}
            </Tree>
          )}
        </ListTristate>

      </div>
    );
  }
}

export default HierarchyTree;
