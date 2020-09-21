import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import { classnames } from 'utils';
import styles from './PersonPathSort.less';

const SORT_CONFIG = [
  { text: '路径长度', sort: ['step_asc', 'hindex_desc'] },
  { text: '总Hindex', sort: ['hindex_desc', 'step_asc'] },
  { text: '平均Hindex', sort: ['avg_hindex_desc', 'step_asc', 'max_hindex_desc'] },
  { text: '最大Hindex', sort: ['max_hindex_desc', 'step_asc', 'hindex_desc'] },
  { text: '平均合作次数', sort: ['avg_coauthor_desc', 'step_asc'] },
  { text: '最小合作次数', sort: ['min_coauthor_desc', 'step_asc'] },
  { text: '最小Hindex', sort: ['min_hindex_desc', 'step_asc'] },
].map((c, index) => Object.assign(c, { index }));

export default class PersonPathSort extends Component {
  static propTypes = {
    sort: PropTypes.number,
    count: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    sort: 0,
    count: 10,
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onChangeCount = this.onChangeCount.bind(this);
  }

  onSelect = (sort, item) => {
    const { onChange, count } = this.props;
    if (onChange) {
      onChange(sort, count, item.sort);
    }
  };

  onChangeCount = count => {
    const { onChange, sort } = this.props;
    if (onChange) {
      const sortConfig = SORT_CONFIG[sort];
      onChange(sort, count, sortConfig && sortConfig.sort);
    }
  };

  render() {
    const { count, sort } = this.props;

    return (
      <div className={styles.personPathSort}>
        <div className={styles.pathSort}>
          <div className={styles.sortLabel}>排序条件：</div>
          {SORT_CONFIG.map((item, index) => (
            <Button
              key={item.index}
              className={classnames({ [styles.selectedBtn]: sort === index })}
              onClick={this.onSelect.bind(this, index, item)}
            >
              <span>{item.text}</span>
            </Button>
          ))}
          <span className={styles.count}>结果数：</span>
          <Select value={count} onChange={this.onChangeCount}>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={20}>20</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
          </Select>
        </div>
        {/* TODO 排序说明： 这有一段话具体内容待商量 */}
        {/* <div className={styles.pathNote}>排序说明：</div> */}
      </div>
    );
  }
}
