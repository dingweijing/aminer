// parent tree改造，parent属性指向id，避免循环引用
import React, { Component, useState, useMemo, useEffect } from 'react';
import { FM } from 'locales';
import { Empty, Skeleton } from 'antd';
import { classnames } from 'utils'
import { genParentTree, getAllKeys, getAllChilds } from 'utils/treeFuncs'
import DisplayCard from './DisplayCard'
import styles from './style.less'

const countryIcon = 'https://static.aminer.cn/misc/aiopen/img/country.png'
const companyIcon = 'https://static.aminer.cn/misc/aiopen/img/company.png'
const peopleIcon = 'https://static.aminer.cn/misc/aiopen/img/people.png'

const imgLayerMap = {
  1: countryIcon,
  2: companyIcon,
  // 3: peopleIcon,
}

const mockData = {
  num: 8888,
  title1: 'Department of Electr',
  title2: 'Qi-guang Miao, Cheng',
  title3: 'Optics Communication',
  title4: '大理巍山波长廊一带白族堂祭仪式中至今依然',
}

const TreeNode = ({ children, title, onClick, show, loading, layer, isExpand, node, ...data }) => {
  /* eslint-disable no-nested-ternary */
  if (layer > 3) return null


  const image = imgLayerMap[layer]
  const obj = layer === 3 ? mockData : {}
  const handleClick = e => {
    e.preventDefault()
    onClick(e)
    e.stopPropagation()
  }

  const isBlock = node && node.children && node.children[0].desc


  return (typeof show !== 'undefined' ? (
    <li className={classnames(styles.title, 'treeLeaf')} onClick={e => handleClick(e)}>
      {layer !== 0 && <div className="top">
        {image && <img src={image} alt="" />}
        <DisplayCard name={title} {...obj} />
      </div>}
      <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
        {children && children.length && <ul
          className="list"
          style={typeof isExpand !== 'undefined' ? { height: `${children.length * (isBlock ? 130 : 24)}px`, opacity: 1 } : {
            opacity: layer === 0 ? 1 : 0.3,
            height: 0
          }}
        >
          {React.Children.map(children, i => i)}
        </ul>}
      </Skeleton>
    </li>
  )
    : null)
}


const Tree = ({ root, defaultExpandKeys, onSingleClick }) => {
  const copyRoot = useMemo(() => JSON.parse(JSON.stringify(root)), [root])
  const parentTree = useMemo(() => genParentTree(copyRoot), [copyRoot]) // parent属性指向上一级id的树
  // const treeMap = useMemo(() => genTreeMap(root), [root])
  const showKeys = useMemo(() => getAllKeys(root, root.id), [copyRoot])
  const [currentExpandKeys, setCurrentExpandKeys] = useState(showKeys)
  const [waitForExpandParentKeys, setAsyncExpandKeys] = useState([]) // 新树更新时，从这个队列中提取更新的键值，更新showKeyMap

  useEffect(() => {
    // 如果waitForExpandParentKeys更新了，遍历从treeData找到他们的孩子节点,插入到currentExpandKeys中
    const temp = []
    waitForExpandParentKeys.forEach(key => {
      const myChilds = getAllChilds(parentTree, key) || []
      temp.push(...myChilds)
    })
    setAsyncExpandKeys([])
    setCurrentExpandKeys([...currentExpandKeys, ...temp])
  }, [parentTree])

  const showKeyMap = Object.fromEntries(currentExpandKeys.map((item, idx) => [item, idx]));

  const onExpand = (node, layer) => {
    const { id, children } = node

    if (!children || !children.length) { // 没有孩子时请求
      onSingleClick(node, layer)
      setAsyncExpandKeys([...waitForExpandParentKeys, id])
    }

    const c = [...currentExpandKeys]
    const isExpand = children && children.length && c.some(key => key === (children[0].id))
    if (isExpand) { // 已展开则把自己的所有子节点删除，没有展开则显示自己和第一层孩子
      const deleteIDs = getAllChilds(node, id)
      deleteIDs.forEach(iid => {
        const idx = c.findIndex(key => key === iid)
        if (idx > -1) {
          c.splice(idx, 1)
        }
      })
    } else {
      c.push(id)
      if (children) {
        children.forEach(child => { c.push(child.id) })
      }
    }

    const finalC = Array.from(new Set(c))

    setCurrentExpandKeys(finalC)
  }


  const loop = (node, layer = 0) => (<TreeNode
    key={node.id}
    node={node}
    title={node.name}
    layer={layer}
    loading={waitForExpandParentKeys.includes(node.id)}
    show={showKeyMap[node.id]}
    isExpand={node.children && showKeyMap[node.children[0].id]} // 他的1个孩子是否在showKeyMap中,并且他的孩子有描述
    onClick={e => onExpand(node, layer, e)} >
    {node.children ?
      node.children.map(n => (loop(n, layer + 1))) : null}
  </TreeNode>)

  const treeResult = useMemo(() => loop(parentTree), [parentTree, showKeyMap])
  // const treeResult = loop(parentTree)
  return (
    <div>{React.Children.only(treeResult)}</div>
  )
}

const DisplayTree = ({ treeData, onSingleClick }) => (
  <div className={styles.DisplayTree}>
    {
      treeData && treeData.tree && Array.isArray(treeData.tree) ?
        <Tree
          defaultExpandKeys={['5dc122672ebaa6faa962bdcb']}
          onSingleClick={onSingleClick}
          root={{ id: 'root', children: treeData.tree }}
        /> : <Empty />
    }

  </div>
)


export default DisplayTree;
