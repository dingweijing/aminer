import React, { Component, useState, useMemo } from 'react';
import { FM } from 'locales';
import { Tree, Icon } from 'antd'
import { getAllChilds } from 'utils/treeFuncs'
import styles from './style.less'

const { TreeNode } = Tree;


const loop = data => {
  if (!data || !Array.isArray(data)) return null;
  return data.map(item => {
    const { name, children } = item
    if (children && Array.isArray(children)) {
      return (
        <TreeNode key={item.id} title={name}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.id} title={name} />;
  })
}


const SelectTree = ({ treeData, onCheck = () => { } }) => {
  if (!treeData || !treeData.tree || !treeData.tree.children) return null
  const res = treeData.tree.children
  const u = useMemo(() => loop(res), [res])
  const [expandedKeys, setExpandedKeys] = useState(['0-0', res[0].children[0].id])
  const onSelect = (selectedKeys, { node, }) => {
    // 选中添加,取消选择删掉
    const key = node.props.eventKey
    const idx = expandedKeys.findIndex(k => k === key)
    const selected = idx > -1

    if (!selected) {
      const arr = [...expandedKeys, ...selectedKeys]
      setExpandedKeys(arr)
    } else {
      const arr = [...expandedKeys]
      arr.splice(idx, 1)

      setExpandedKeys(arr)
    }
  }


  return (
    <div className={styles.SelectTree} onClick={e => { e.preventDefault(); e.stopPropagation() }}>
      <Tree
        checkable
        showLine
        expandedKeys={expandedKeys}
        switcherIcon={<Icon type="caret-down" />}
        /*  onExpand={this.onExpand}
         autoExpandParent={autoExpandParent} */
        onSelect={onSelect}
        onCheck={onCheck}
      >
        {u}
      </Tree>
    </div>
  )
}

export default SelectTree;
