import React, { useEffect, useState } from 'react';
import { component } from 'acore';
import { classnames } from 'utils';
import { Button } from 'antd';
import styles from './ConfYearPaper.less';

let activeNode = null, nodeTimer = null;
const ConfYearPaper = props => {
    const { items } = props;
    const [limit, setLimit] = useState(20);
    const [activeId, setActiveId] = useState();
    const [paths, setPaths] = useState();
    const [svgHeight, setSvgHeight] = useState(0);
    const maxAuthors = 50;
    const showMore = () => {
        let n = limit + 10;
        if (n > maxAuthors) {
            n = maxAuthors;
        }
        setLimit(n);
    };

    const onMouseEnter = (n, e) => {
        activeNode = e.target;
        setActiveId(n);
    }

    const onMouseLeave = () => {
        setActiveId('');
        if (nodeTimer) {
            clearTimeout(nodeTimer);
        }
    }

    useEffect(() => {
        if (activeId) {
            startFindNodes();
        } else {
            setPaths(null);
        }
    }, [activeId])

    const startFindNodes = () => {
        if (nodeTimer) {
            clearTimeout(nodeTimer);
        }
        nodeTimer = setTimeout(() => {
            findNodes();
        }, 300);
    }

    const findNodes = () => {
        const nodelist = document.querySelectorAll("#paperwrap span[active='true']");
        const allNodes = [];
        if (activeNode && nodelist && (nodelist.length >= 2)) {
            allNodes.push(activeNode);
            for (let i = 0; i < nodelist.length; i++) {
                if (activeNode !== nodelist[i]) {
                    allNodes.push(nodelist[i]);
                }
            }
        }
        if (allNodes && allNodes.length > 1) {
            drawLine(allNodes);
        } else {
            setPaths(null);
        }
    }

    const drawLine = (nodes) => {
        const [startNode, ...otherNode] = nodes;
        const startXy = getNodeXY(startNode);
        const result = [{ x: startXy.x, y: startXy.y }];
        for (let i = 0; i < otherNode.length; i++) {
            const { x, y } = getNodeXY(otherNode[i]);
            result.push({ x, y });
        }
        result.sort((a, b) => a.x - b.x);
        const newPaths = [];
        result && result.map(({ x, y }, m) => {
            if (m + 1 < result.length) {
                newPaths.push(`M${x} ${y} L${result[m + 1].x} ${result[m + 1].y}`);
            }
        })
        setPaths(newPaths);
    }

    const getNodeXY = (node) => {
        const prect = document.getElementById('paperwrap').getBoundingClientRect();
        const crect = node.getBoundingClientRect();
        return {
            x: crect.left - prect.left,
            y: crect.top - prect.top,
        }
    }

    const onScrollList = (e) => {
        const { scrollLeft } = e && e.target || {};
        setSvgHeight(scrollLeft);
    }

    return (
        <>
            <div className={styles.confYearPaper} id='paperwrap' onScroll={onScrollList}>
                <div className={styles.papercon}>
                    {items && items.map((n) => {
                        const { authors, year } = n;
                        return (
                            <div key={year} className={styles.yearItem}>
                                <div className={styles.ytitle}>{year}</div>
                                {authors && authors.slice(0, limit).map((item, index) => {
                                    const { name, paper_num, citations, trend, id } = item;
                                    return (
                                        <div key={index} >
                                            <span onMouseEnter={onMouseEnter.bind(this, id)}
                                                onMouseLeave={onMouseLeave.bind(this, id)}
                                                active={activeId && (activeId === id) ? 'true' : ''}
                                                className={classnames(styles.author,
                                                    { [styles.activeAuthor]: activeId && (activeId === id) })}>{name}</span>
                                            : {paper_num} / {citations}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <svg height="100%" className={styles.svg} style={{ right: -svgHeight }}>
                    {paths && paths.map(d => <path key={d} d={d} stroke='#1890ff' strokeWidth='1' fill='#f00' />)}
                </svg>
            </div>
            <Button type='primary' block onClick={showMore}>
                {limit >= maxAuthors ? "There's no more data" : "Show More"}
            </Button>
        </>
    )
}

export default component()(ConfYearPaper)