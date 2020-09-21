/**
 *  Created by BoGao on 2018-04-17;
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { classnames } from 'utils';
import { PersonCard } from 'components/person/widgets';
import styles from './PersonPaths.less';

@connect()
export default class PersonPaths extends Component {
  static propTypes = {
    className: PropTypes.string,
    paths: PropTypes.array,
    sortIndex: PropTypes.number,
  };

  static defaultProps = {
    sortIndex: 0,
  };

  state = {}

  render() {
    const { className, paths, sortIndex } = this.props;
    console.log('>>>', sortIndex);
    console.log('>>>', paths);

    return (
      <div className={classnames(styles.personPaths, className)}>

        {!paths && (<div>无结果</div>)}

        {paths && paths.map((path, index) => {
          const key = `${index}_hahah`;

          return (
            <div key={key} className={styles.pathLine}>
              <div className={styles.info}>
                <span className={styles.label}>Path #{index + 1}:</span>
                {/* <span className={styles.key}>路径长度：</span><span className={styles.value}>{path.steps}</span>, */}
                {/* <span className={styles.key}>合作次数：</span><span className={styles.value}>{path.total_cocount}</span>, */}
                {/* <span className={styles.key}>总Hindex：</span><span className={styles.value}>{path.total_weight}</span> */}
                {pathTitle.map((item, num) => (
                  <span key={item.index}
                    className={(item.index === sortIndex ? styles.isSelect : '')}>
                    <span className={styles.key}>{item.text}：</span>
                    <span className={styles.value}>{path[item.value]}</span>
                  </span>
                ))}
              </div>
              <div key={key} className={styles.path}>
                {path.nodes && path.nodes.map((node, nodeidx) => {
                  const { length } = path.nodes;
                  return (
                    <div className={styles.nodeContainer} key={node.id}>
                      {nodeidx > 0 && (
                        <div className={styles.arrow}>
                          <span className={styles.key}>#cos:</span><span
                            className={styles.value}>{node.cocount}</span>
                        </div>
                      )}
                      {nodeidx > 0 && (
                        <div className={styles.jian} />
                      )}
                      {nodeidx > 0 && nodeidx < length - 1 &&
                        <PersonCard id={node.id} person={node.person} classname="personpathaction" />
                      }
                      {(nodeidx === 0 || nodeidx === length - 1) &&
                        <PersonCard id={node.id} person={node.person} />
                      }

                      {/* <div className={styles.avatar}>
                        <img src="//static.aminer.cn/default/default.jpg" alt={node.id} />
                      </div> */}

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>
    );
  }
}

const pathTitle = [
  { text: '路径长度', value: 'steps' },
  { text: '合作次数', value: 'total_cocount' },
  { text: '总Hindex', value: 'total_weight' },
  { text: '平均Hindex', value: 'average_hindex' },
  { text: '最大Hindex', value: 'max_hindex' },
  { text: '平均合作次数', value: 'average_coauthor' },
  { text: '最小合作次数', value: 'min_coauthor' },
  { text: '最小Hindex', value: 'min_hiNdex' },
].map((c, index) => Object.assign(c, { index }));
