import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Collapse, Checkbox, Icon, Input, Button, Tree } from 'antd';
import { formatMessage, FM,getLocale } from 'locales';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
import moment from 'moment';
import styles from './SearchFilterContent.less';

const { TreeNode } = Tree;

const renderTreeNodes = (data, onTreeNodeClick, onClickTreeExpandIcon, treeNodeExpandKeys) => {
  return data.map((item, index) => {
    if (item.children) {
      return (
        <TreeNode
          key={item.title}
          title={(
            <div className={styles.treeNodeTitle}>
              <span className={styles.treeNodeText} onClick={() => onTreeNodeClick(item.title)}>
                <FM id={`aminer.search.filter.field.${item.key}`} defaultMessage={item.title} />
              </span>
              <svg
                className={classnames(styles.treeNodeParentIcon, { [styles.treeNodeExpanded]: treeNodeExpandKeys.includes(item.title) })}
                aria-hidden="true"
                onClick={() => onClickTreeExpandIcon(item.title)}
              >
                <use xlinkHref="#icon-Triangle" />
              </svg>
            </div>
          )}
        >
          {renderTreeNodes(item.children, onTreeNodeClick, onClickTreeExpandIcon, treeNodeExpandKeys)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={item.title}
        title={(
          <div className={styles.treeNodeTitle} onClick={() => onTreeNodeClick(item.title)}>
            <FM id={`aminer.search.filter.field.${item.key}`} defaultMessage={item.title} />
          </div>
        )}
      ></TreeNode>
    );
  });
}

const SearchFilterContent = props => {
  const {
    checkOptions,
    isTree,
    onTreeNodeClick,
    topZone,
    bottomZone,
    onChecked,
    checkedKey,
    showOptionCnt = 5,
    useFM,
    useExpanded,
    showLangSearchValue,
  } = props;
  const [expanded, setExpanded] = useState(false);
  const [treeNodeExpandKeys, setTreeNodeExpandKeys] = useState([]);
  const lang = getLocale();

  const getKeyInArr = (checkedKey, arr) => {
    const keysInArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (checkedKey && checkedKey.includes(arr[i])) {
        keysInArr.push(arr[i]);
      }
    }
    return keysInArr;
  }

  const getKeyInTree = (checkedKey, tree) => {
    let keysInTree = [];
    for (let i = 0; i < tree.length; i++) {
      if (checkedKey.includes(tree[i].title)) {
        keysInTree.push(tree[i].title);
      }
      if (tree[i].children && tree[i].children.length) {
        const keysInChildren = getKeyInTree(checkedKey, tree[i].children);
        if (keysInChildren.length) {
          keysInTree = keysInTree.concat(keysInChildren);
        }
      }
    }
    return keysInTree;
  }

  const [displayOptions, checkedKeysInDisplay] = useMemo(() => {
    let displayOptions = [...checkOptions], checkedKeysInDisplay = checkedKey;
    if (useExpanded && !expanded) {
      displayOptions = displayOptions.slice(0, showOptionCnt || 5);
      // 将不在 displayOptions 中的 checkedKey 去除
      if (isTree) {
        checkedKeysInDisplay = getKeyInTree(checkedKey, displayOptions);
      } else {
        if (showLangSearchValue) {
          checkedKeysInDisplay = getKeyInArr(checkedKey, displayOptions.map(item => item.value));
        } else {
          checkedKeysInDisplay = getKeyInArr(checkedKey, displayOptions);
        }
      }
    }
    return [displayOptions, checkedKeysInDisplay];
  }, [expanded, checkedKey, checkOptions, lang]);

  const defaultBottomZone = useMemo(() => {
    if (useExpanded && checkOptions && checkOptions.length > 5) {
      if (bottomZone) return bottomZone;
      return (
        <div className={styles.filterControll}>
          <Button type="link" onClick={() => setExpanded(!expanded)} className={styles.expandBtn}>
            <svg className={styles.expandIcon} aria-hidden="true">
              <use xlinkHref={expanded ? '#icon-subtraction' : '#icon-add'} />
            </svg>
            {formatMessage({
              id: `aminer.search.filter.${expanded ? 'collapse' : 'expand'}`,
              defaultMessage: expanded ? 'Collapse' : 'Expand',
            })}
          </Button>
        </div>
      )
    }
    return <></>;
  }, [expanded])

  const onCheckedChange = (checkedKeys) => {
    if (expanded) onChecked(checkedKeys);
    else {  // options 被收起，这时的 checkedKeys 不完整，未包含被隐藏的已选中的 options
      const hidedCheckedKeys = checkedKey.filter(item => !checkedKeysInDisplay.includes(item));
      onChecked(checkedKeys.concat(hidedCheckedKeys));
    }
  }

  if (!displayOptions || !displayOptions.length) return <></>;

  if (isTree) {
    const onClickTreeExpandIcon = (key) => {
      if (treeNodeExpandKeys.includes(key)) {
        setTreeNodeExpandKeys([...treeNodeExpandKeys].filter(item => item !== key));
      } else {
        setTreeNodeExpandKeys([...treeNodeExpandKeys].concat(key));
      }
    }
    return (
      <div className={styles.checkList}>
        {topZone && topZone}
        <Tree
          checkable
          // checkStrictly
          expandedKeys={treeNodeExpandKeys}
          checkedKeys={checkedKeysInDisplay}
          onCheck={onCheckedChange}
        >
          {renderTreeNodes(displayOptions, onTreeNodeClick, onClickTreeExpandIcon, treeNodeExpandKeys)}
        </Tree>
        {defaultBottomZone}
      </div>
    );
  }

  return (
    <div>
      {topZone && topZone}
      <Checkbox.Group onChange={onCheckedChange} value={checkedKeysInDisplay} style={{ display: 'block' }}>
        <div className={classnames(styles.checkList)}>
          {displayOptions.map((item, index) => (
            <div key={showLangSearchValue ? `${item.value}${index}` : `${item}${index}`}>
              {showLangSearchValue ? (
                <Checkbox value={item.value} className={styles.checkboxItem}>
                  {useFM
                    ? formatMessage({
                        id: `aminer.search.filter.field.${item.en}`,
                        defaultMessage: item.en,
                      })
                    : <span title={item.zh}>{getLangLabel(item.en, item.zh)}</span>}
                </Checkbox>
              ) : (
                <Checkbox value={item} className={styles.checkboxItem}>
                  {useFM
                    ? formatMessage({
                        id: `aminer.search.filter.field.${item}`,
                        defaultMessage: item,
                      })
                    : <span title={item}>{item}</span>}
                </Checkbox>
              )}
            </div>
          ))}
        </div>
      </Checkbox.Group>
      {checkOptions && checkOptions.length > showOptionCnt && defaultBottomZone}
    </div>
  );
};

export default SearchFilterContent;
