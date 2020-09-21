
const createHierarchy = () => {
    return {
        index: null, // {} id -> node
        data: null, // []

        get: (id) => {
            return this.index[id];
        },

        getData: () => {
            return this.data;
        },
    };
};

const fromData = (index, data) => {
    return Object.assign(createHierarchy(), { index, data });
};

const empty = (hi) => {
    hi = hi || createHierarchy();
    hi.index = {};
    hi.data = [];
    return hi;
};

const init = (objs) => {
    const hi = createHierarchy();
    if (!objs || objs.length <= 0) {
        return empty(hi);
    }

    // step1 Build index
    const oindex = {};
    for (const obj of objs) {
        if (obj && obj.id) {
            oindex[obj.id] = obj;
        } else {
            console.error('obj in hiObj must have id', obj);
        }
    }

    // step2 建立结构, 修改model，需要将结果写回去。
    Object.keys(oindex).map((id) => {
        const obj = oindex[id];
        const { parents } = obj;
        if (parents && parents.length > 0) {
            const pid = parents[0];
            const parent = oindex[pid];
            if (parent) {
                // 建立双向连接
                // obj.parent = parent;
                const childs = parent.childs || [];
                childs.push(obj);
                parent.childs = childs;
            }
        }
        return null; // map return
    });

    // convert index.
    
    hi.index = oindex;

    // step3 创建data
    hi.data = [];
    Object.values(hi.index).map((obj) => {
        if (obj && obj.id && hi.index[obj.id]) {
            const temp = hi.index[obj.id];
            const parents = temp && temp.parents;
            if (!parents || parents.length === 0) {
                hi.data.push(temp);
            }
        }
        return null; // map return
    });

    // console.log("lksjdflsjdlfjslkdjf", hi.index)
    // console.log("lksjdflsjdlfjslkdjf", Object.values(hi.index))
    // console.log("lksjdflsjdlfjslkdjf", hi.data)

    // for (const obj of hi.index.values()) {
    //   const id = obj && obj.get('id');
    //   const temp = hi.index.get(id);
    //   const parents = temp && temp.get('parents');
    //   if (!parents || parents.size === 0) {
    //     list.push(temp);
    //   }
    // }

    // hi.data = hi.data.withMutations((list) => {
    //   for (const obj of hi.index.values()) {
    //     const id = obj && obj.get('id');
    //     const temp = hi.index.get(id);
    //     const parents = temp && temp.get('parents');
    //     if (!parents || parents.size === 0) {
    //       list.push(temp);
    //     }
    //   }
    // });

    return hi;
};

// --------------------------------------
// const findPath = (data, index, id) => {
//   if (data == null || index == null) {
//     return null;
//   }
//   const node = index.get(id);
//   if (!node) {
//     // console.log('ERROR FIND ID', id);
//     return null;
//   }

//   // prepare parents path;
//   let parents = node.get('parents');
//   parents = (parents && parents.toJS()) || [];
//   parents.reverse();
//   parents.push(id);
//   // console.log('>>>>>>>> node\'s parents is ', parents);

//   // generate path.
//   let currentList = data;
//   const result = [];
//   for (let i = 0; i < parents.length; i += 1) {
//     const path = parents[i];
//     const idx = currentList.findIndex(item => path === item.get('id'));
//     if (idx < 0) {
//       // console.log('>>>>>>>>>> error can\'find id ', path);
//       return null;
//     }

//     result.push(idx);
//     if (i < parents.length - 1) {
//       result.push('childs');
//       currentList = currentList.get(idx).get('childs');
//     }
//   }
//   return result;
// };

const findInfoByEBId = (data, index, ids, fileds) => {
    if (data == null || index == null) {
        return null;
    }
    const ebArray = ids.map((id) => {
        if (index.id) {
            return index.id;
        } else {
            return null;
        }
    });
    const ebInfo = ebArray.map((item) => {
        const itemArray = {};
        fileds.forEach((filed) => {
            itemArray[filed] = item.filed;
        });
        return itemArray;
    });
    return ebInfo;
};


// -------------------------------------------------------
// 操作 State 的节点： state: Map({treeData, treeIndex }),
// -------------------------------------------------------

// const detachNodeReducer = (state, id) => {
//   let path = findPath(state.get('treeData'), state.get('treeIndex'), id);
//   if (path == null) {
//     console.error('can\' find [%s] in tree.', id);
//     return state;
//   }
//   path = ['treeData', ...path];
//   return state.withMutations((map) => {
//     map.removeIn(path);
//   });
// };

// const appendNodeReducer = (state, id, node) => {
//   if (id.length > 0) {
//     let path = findPath(state.get('treeData'), state.get('treeIndex'), id);
//     if (path == null) {
//       console.error('can\' find [%s] in tree.', node.id);
//       return state;
//     }
//     const toParents = state.get('treeData').getIn(path).toJS();
//     const newParents = toParents &&
//       toParents.parents ? [toParents.id, ...toParents.parents] : [toParents.id];
//     node.parents = newParents;
//     path = ['treeData', ...path, 'childs'];
//     return state.withMutations((map) => {
//       map.updateIn(path, ((childs) => {
//         if (childs) {
//           return childs.push(fromJS(node));
//         } else {
//           return List().push(fromJS(node));
//         }
//       }));
//       map.setIn(['treeIndex', node.id], fromJS(node));
//     });
//   } else {
//     return state.withMutations((map) => {
//       map.updateIn(['treeData'], value => value.push(fromJS(node)));
//       map.setIn(['treeIndex', node.id], fromJS(node));
//     });
//   }
// };

const deleteNodeReducer = (id, data, source, index1) => {
    if (data && data.childs && data.childs.length > 0) {
        data.childs.forEach((ele, index) => {
            deleteNodeReducer(id, ele, data.childs, index);
            if (ele.id === id) {
                // data.childs.splice(index, 1);
            }
        });
    } else if (data && data.id === id) {
        source.splice(index1, 1);
    }
};

const addNodeReducer = (data, parentId, newNode, source) => {
    if (data && (data.id === parentId)) {
        data.childs = data.childs || [];
        data.childs.push(newNode);
    } else if (data && data.childs) {
        data.childs.forEach((ele) => {
            addNodeReducer(ele, parentId, newNode, source);
        });
    }
};

const updateNodeReducer = (node, source) => {
    source.forEach((item, index) => {
        if (item.id === node.id) {
            // source.splice(index, 1, node); // has bugs
            Object.assign(item, node);
            return;
        }
        if (item && item.childs) {
            updateNodeReducer(node, item.childs);
        }
    });
};


// -------------------------------------------------------
// exports
// -------------------------------------------------------

export default {
    fromData, init,
    // findPath, detachNodeReducer, appendNodeReducer,
    findInfoByEBId,
    deleteNodeReducer, addNodeReducer,
    updateNodeReducer,
};
