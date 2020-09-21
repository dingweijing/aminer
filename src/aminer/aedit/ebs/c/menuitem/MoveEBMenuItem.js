import React, { Component } from 'react';
import { connect } from 'acore';
import { TreeSelect, Modal, Button, message, Icon } from 'antd';
import hierarchy from 'helper/hierarchy';
import PropTypes from 'prop-types';
import H from 'helper';

@connect(({ expertbaseTree }) => ({ expertbaseTree }))
export default class MoveEBMenuItem extends Component {

  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    onGetData: PropTypes.func,
    filters: PropTypes.func,
  };

  static defaultProps = {
    label: 'Move',
    icon: 'select',
  };

  state = {
    value: '',
    data: null,
    visible: false,
  };

  allChildrenId = [];

  onChange = (value) => {
    this.setState({ value });
  };

  showModal = () => {
    const newData = this.getNode();
    this.allChildrenId = [];
    this.getCurrentNodeAllChildren(newData);
    this.setState({
      visible: true,
      data: newData,
    });
    this.props.callbackParent && this.props.callbackParent();
  };

  getNode = () => {
    const { expertbaseTree, onGetData } = this.props;
    const { id } = onGetData && onGetData();
    const { treeIndex } = expertbaseTree;
    return treeIndex && treeIndex[id];
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const node = this.getNode();
    const { id } = node;
    dispatch({
      type: 'expertbaseTree/MoveExperBaseByID',
      payload: {
        id: id || '',
        parentsId: this.state.value === '666' ? '' : this.state.value,
      },
    }).then((data) => {
      if (data.succeed) {
        dispatch({ type: 'expertbaseTree/deleteNode', payload: { id } });
        let { value } = this.state;
        value = (value === '666') ? '' : value;
        dispatch({
          type: 'expertbaseTree/addNode',
          payload: { node, id: value },
        });
        message.success('移动成功');
        this.handleCancel();
      } else {
        message.error('移动失败');
      }
    });
  };

  handleCancel = () => {
    this.allChildrenId = [];
    this.setState({
      visible: false,
    });
  };

  ListToArray = (data, index) => {
    const newData = hierarchy.fromData(index, data);
    const orgs = [
      { id: '666', name_zh: '根节点', name: 'root' },
      ...newData.data,
    ];
    // const orgs = newData.data;
    // orgs.unshift({ id: '666', name_zh: '根节点', name: 'root' });
    return this.renderTreeNodes(orgs);
  };

  getCurrentNodeAllChildren = (data) => {
    const { id } = data;
    this.allChildrenId.push(id);
    if (data.childs) {
      data.childs.forEach((child) => {
        this.getCurrentNodeAllChildren(child);
      });
    }
  };

  renderTreeNodes = (orgs) => {
    if (orgs) {
      return orgs.map((org) => {
        const { mainName, subName, isDefaultLocale } = H.renderLocalNames(org.name, org.name_zh);
        let title = mainName;
        if (subName) {
          title += isDefaultLocale ? `（${subName}）` : `(${subName})`;
        }
        if (org.childs) {
          return (
            <TreeSelect.TreeNode title={title} value={org.id} key={org.id}
              disabled={this.allChildrenId.includes(org.id)}>
              {this.renderTreeNodes(org.childs)}
            </TreeSelect.TreeNode>
          );
        }
        return (
          <TreeSelect.TreeNode title={title} value={org.id} key={org.id}
            disabled={this.allChildrenId.includes(org.id)} />);
      });
    }
  };

  render() {
    const { expertbaseTree, label, icon, className, id } = this.props;
    const { treeData, treeIndex } = expertbaseTree;
    const { data } = this.state;

    let title = label;
    if (data) {
      const { mainName, subName, isDefaultLocale } = H.renderLocalNames(data.name, data.name_zh);
      if (mainName) {
        title += ` ${mainName}`;
      }
      if (subName) {
        title += isDefaultLocale ? `（${subName}）` : `(${subName})`;
      }
    }
    
    return (
      <div>
        <div onClick={this.showModal} className={className}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref={`#${icon}`} />
          </svg>
          <span>{label}</span>
        </div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label>移动到：</label>
          <TreeSelect
            showSearch
            style={{ width: 300 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeNodeFilterProp='title'
            onChange={this.onChange.bind(this)}
          >
            {this.ListToArray(treeData, treeIndex)}
          </TreeSelect>

        </Modal>
      </div>
    );
  }
}
