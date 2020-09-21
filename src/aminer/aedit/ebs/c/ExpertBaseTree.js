import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import HierarchyTree from './hierarchy/HierarchyTree';
import { NE } from 'utils/compare';
import { isAuthed } from 'utils/auth';
import { AddEBMenuItem, DeleteMenuItem, MoveEBMenuItem } from './menuitem';

@connect(({ auth, expertbaseTree }) => ({
    roles: auth.roles,
    expertbaseTree,
}))
class ExpertbaseTree extends Component {
    static propTypes = {
        onItemClick: PropTypes.func,
        onReady: PropTypes.func,
        selected: PropTypes.string,
    };

    static defaultProps = {};

    componentDidMount() {
        const { dispatch, roles } = this.props;
        console.log('roles', roles);
        // if (isAuthed(roles)) {
        dispatch({ type: 'expertbaseTree/getTreeData' });
        // }
    }

    componentDidUpdate(prevProps) {
        if (NE(prevProps, this.props, 'expertbaseTree', 'treeData')) {
            const { onReady, expertbaseTree } = this.props;
            if (onReady) {
                onReady(expertbaseTree && expertbaseTree.treeData);
            }
        }
    }

    actionMenuConfig = [
        {
            key: 'create',
            label: '新建子智库',
            type: 'create',
            callbackParent: this.switch,
            icon: 'icon-add',
            component: AddEBMenuItem,
        },
        { key: 'edit', label: '编辑', type: 'edit', icon: 'icon-edit', component: AddEBMenuItem },
        { key: 'move', label: '移动', icon: 'icon-xiangyou', component: MoveEBMenuItem },
        { key: 'del', label: '删除', icon: 'icon-delete-', component: DeleteMenuItem },
    ];

    topMenuConfig = [
        {
            key: 'create',
            label: '新建智库',
            type: 'create',
            callbackParent: this.switch,
            component: AddEBMenuItem,
        },
    ];

    // shareEbTopMenu = [
    //     {
    //         key: 'create',
    //         label: '订阅更多智库',
    //         type: 'create',
    //         component: () => {
    //             return (
    //                 <div key={0} onClick={this.changeVisible}>
    //                     <Link to="/eb/gallery">
    //                         <Icon type="plus" /><span>订阅更多智库</span>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ];

    filterCommonEBs = (item) => {
        return item && item.shared !== true;
    };

    filterSharedCommonEBs = (item) => {
        return item && item.shared === true;
    };

    render() {
        const { onItemClick, selected, expertbaseTree } = this.props;
        const { treeData } = expertbaseTree;
        console.log('treeData', treeData);
        return (
            <HierarchyTree
                id="commoneb"
                title=''
                data={treeData}
                selected={selected}
                onItemClick={onItemClick}
                menuConfig={this.actionMenuConfig}
                menuConfigType={['private']}
                topMenuConfig={this.topMenuConfig}
                dataFilter={this.filterCommonEBs}
            />
        );
    }
}

export default ExpertbaseTree;
