
const genParentTree = (node, parent) => { // 生成parent树
  if (parent) {
    /* eslint-disable no-param-reassign */
    try {
      node.parent = parent.id
      // node.parent = Object.assign({}, newParent);
    } catch (err) {
      console.log('err', err)
    }
  }

  if (node.tree) {
    node.tree.forEach(n => {
      genParentTree(n, node);
    });
  }

  return node;
};

// 生成索引表
const genTreeMap = root => {
  const map = {}
  const loop = node => {
    const { id, children, ...other } = node
    if (id) {
      const newNode = other
      map[id] = newNode
    }

    if (children && children.length) {
      children.forEach(child => {
        loop(child)
      })
    }
  }

  loop(root)
  return map
}

// 找到目标节点
const getTargetNode = (node, target, cb, isFind = false) => {
  if (node.id === target) {
    cb(node);
    isFind = true
  } else if (node.children && !isFind) {
    node.children.forEach(n => {
      getTargetNode(n, target, cb, isFind);
    });
  }
};

const getAllKeys = (treeNode, key) => {
  const temp = []

  // 把当前节点的子级和当前节点父节点的子级放入数组中
  const getNodePath = node => {
    if (Array.isArray(node.children)) {
      node.children.forEach(n => {
        temp.push(n.id);
      });
    }

    if (node.parent) {
      getNodePath(node.parent);
    } else {
      temp.push(node.id);
    }
  };


  getTargetNode(treeNode, key, getNodePath, false)
  return temp
}


// 取目标节点的【所有】子节点（不包含自身）
const getAllChilds = (node, key) => {
  const temp = []
  let isFirst = true
  const getChilds = n => {
    if (!isFirst) {
      temp.push(n.id)
    }
    isFirst = false
    if (n.children) {
      n.children.forEach(child => {
        getChilds(child)
      })
    }
  }
  getTargetNode(node, key, getChilds, false)
  return temp
}


export { genParentTree, getAllKeys, getAllChilds, getTargetNode, genTreeMap }
