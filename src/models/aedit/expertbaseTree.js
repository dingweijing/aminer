/* eslint-disable no-param-reassign */

import { createSortFunc } from 'utils';
import * as ebService from 'services/eb/expert-base';
import hierarchy from 'helper/hierarchy';

const { deleteNodeReducer, addNodeReducer, updateNodeReducer } = hierarchy;

export default {
    namespace: 'expertbaseTree',

    state: {
        treeData: null,
        treeIndex: null,
        hasSharedEBs: false,
    },

    effects: {

        // @elivoa 2018-04-21 同时获取共享的智库
        // @elivoa 2018-05-16 修改2B2C系统看到的智库列表不一样：
        //  如果是2B系统，用户可以看到所有当前系统的所有智库。
        //  如果是2C系统，用户只能看到自己创建的智库。但是AMDIN可以看到所有。
        * getTreeData({ payload }, { call, put, all }) {
            const { data } = yield call(ebService.getExpertBaseTreeData);
            console.log('getTreeData', data);
            yield put({ type: 'getTreeDataSuccess', payload: { items: data && data.data } });
        },

        // caai未登录时调用
        * getExpertBaseList({ payload }, { call, put }) {
            const data = yield call(ebService.getExpertBases, payload);
            const { items } = data && data.data;
            if (items) {
                yield put({ type: 'getTreeDataListSuccess', payload: { items } });
            }
        },

        * getExpertBases({ payload }, { call }) {
            const { data } = yield call(ebService.getExpertBases, payload);
            if (data && data.items && data.items[0]) {
                return data.items[0];
            }
            return null;
        },

        * createExpertBase({ payload }, { call }) {
            const { data } = yield call(ebService.createExpertBase, payload);
            return data;
        },

        * UpdateExperBaseByID({ payload }, { call }) {
            const pdata = yield call(ebService.UpdateExperBaseByID, payload);
            return pdata.data;
        },

        * DeleteExperBaseByID({ payload }, { call }) {
            const { data } = yield call(ebService.DeleteExperBaseByID, payload);
            return data;
        },

        * getExperBaseByID({ payload }, { call, put }) {
            const { data } = yield call(ebService.getExpertBases, payload);
            return data && data.items && data.items[0];
        },

        * MoveExperBaseByID({ payload }, { call }) {
            const { id, parentsId } = payload;
            const data = { id, to: parentsId };
            const newData = yield call(ebService.MoveExperBaseByID, data);
            return newData.data;
        },

        * getExpertsByIds({ payload }, { call, put }) {
            const data = yield call(ebService.getExpertsByIds, payload);
            const { items } = data && data.data;
            if (items) {
                yield put({ type: 'getTreeDataListSuccess', payload: { items } });
            }
        },

    },

    reducers: {
        // @elivoa 2018-05-08 merge shared expertbases into data.
        getTreeDataSuccess(state, { payload }) {
            let { items = [], sharedItems } = payload;
            let hasSharedEBs = false;
            if (items) {
                for (const item of items) {
                    item.shared = false;
                    item.nodetype = 'private';
                }
            }
            if (sharedItems) { // 解决parent循环问题。
                for (const item of sharedItems) {
                    item.shared = true;
                    item.nodetype = 'share';
                    delete item.parents;
                    items.push(item)
                }
                hasSharedEBs = true
            }

            // console.log("------before------------------------", items, sharedItems)
            const hi = hierarchy.init(items); // TODO im
            // const sharedHi = hierarchy.init(sharedItems); // TODO im
            // console.log("------after------------------", hi, sharedHi)

            // add shared ebs.
            // let hasSharedEBs = false;
            // for (const d of sharedHi.data) { // TODO im
            //   d.shared = true;
            //   hi.data.push(d);
            //   hasSharedEBs = true;
            // }
            // for (const d of Object.values(sharedHi.index)) {
            //   d.shared = true;
            //   hi.index[d.id] = d;
            //   hasSharedEBs = true;
            // }

            // sort by alphabetical
            const sortfunc = createSortFunc('order', 'order');
            // hi.data.sort(sortfunc);
            // console.log('hi.data', hi.data);
            // hi.data.forEach((item) => {
            //   if (item.childs) {
            //     item.childs.sort(sortfunc);
            //   }
            // });

            const b = (arr) => {
                arr.sort(sortfunc);
                arr.forEach(ele => {
                    if (ele.childs) {
                        b(ele.childs);
                    }
                });
            };
            b(hi.data);


            // write data to state.
            state.treeData = hi.data;
            state.treeIndex = hi.index;
            state.hasSharedEBs = hasSharedEBs;
        },

        // sort tree data
        sortTree(state, { payload: { sort, by } }) {
            const sortfunc = createSortFunc(sort, by);
            if (state.treeData && sortfunc) {
                state.treeData = state.treeData.sort(sortfunc);
            }
        },

        getTreeDataListSuccess(state, { payload }) {
            const { items } = payload;
            if (items) {
                for (const item of items) {
                    item.shared = false;
                    item.nodetype = 'private';
                }
            }
            const hi = hierarchy.init(items);
            state.treeData = hi.data;
            state.treeIndex = hi.index;
        },

        deleteNode(state, { payload }) {
            const { id } = payload;
            const { treeData, treeIndex } = state;
            treeData.forEach((treeItem, index) => {
                deleteNodeReducer(id, treeItem, treeData, index);
            });
            state.treeData = treeData;
            delete treeIndex[id];
            state.treeIndex = treeIndex;
        },

        addNode(state, { payload }) {
            const { id, node } = payload;
            const { treeData, treeIndex } = state;
            if (id && node) {
                if (id === 'root') {
                    treeData.push(node);
                    state.treeData = treeData;
                } else {
                    treeData.forEach((treeItem) => {
                        addNodeReducer(treeItem, id, node, treeData);
                    });
                    state.treeData = treeData;
                }
                treeIndex[node.id] = node;
                state.treeIndex = treeIndex;
            }
        },

        updateNode(state, { payload }) {
            const { node } = payload;
            const { treeData, treeIndex } = state;
            updateNodeReducer(node, treeData);
            state.treeData = treeData;
            treeIndex[node.id] = node;
            state.treeIndex = treeIndex;
        },


        // 操作树节点的reducers

        // updateNode(state, { payload }) {
        //   const { node } = payload;
        //   let path = hierarchy.findPath(state.get('treeData'), state.get('treeIndex'), node.id);
        //   if (path == null) {
        //     console.error('can\' find [%s] in tree.', node.id);
        //     return state;
        //   }
        //   path = ['treeData', ...path, '__replace_me__'];
        //   const replaceIdx = path.length - 1;
        //   return state.withMutations((map) => {
        //     Object.keys(node).map((key) => {
        //       if (key !== 'id') {
        //         path[replaceIdx] = key;
        //         map.setIn(path, node[key]);
        //       }
        //       return null;
        //     });
        //   });
        // },


        // TODO rename to detachNode


    },
};
