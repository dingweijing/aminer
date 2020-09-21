import React, { PureComponent } from 'react';
import { connect, withRouter } from 'acore';
import { classnames } from 'utils';
import { Input, Tag, Button } from 'antd';
import { routeTo, parseUrlParam } from 'helper';
import styles from './SearchArticle.less';

const { Search } = Input;

export default @connect(({ report }) => ({
  keywords: report.keywords,
}))
@withRouter
class SearchArticle extends PureComponent {

  constructor(props) {
    super(props);

    const { title = '', keyword = '' } = parseUrlParam(this.props, {}, ['title', 'keyword']);
    this.title = title;
    this.checkedKey = keyword;
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  searchKeyword = (keyword) => {
    this.title = '';
    const { location } = this.props;
    let { pathname } = location;

    pathname += `?page=1`

      pathname += `&keyword=${keyword}`
      this.checkedKey = keyword;
      routeTo(this.props, { page: '1', keyword }, null, {removeParams: ['classify', 'title']});
      this.props.searchListByKey({ keyword });

  }

  searchList = (title) => {
    routeTo(this.props, { page: '1', title }, null, {removeParams: ['classify', 'keyword']});
    this.props.searchListByKey({ title });
  }

  render() {
    const { keywords } = this.props;
    return (
      <div className={styles.searchArticle}>
        <div className={styles.searchBox}>
          <Search
            placeholder="请输入搜索词"
            defaultValue={this.title}
            enterButton={
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-search" />
              </svg>
            }
            allowClear={true}
            onSearch={v => this.searchList(v)}
          />
        </div>
        <div className={styles.keywords}>
          <div className={styles.keywordsTitle}>热门话题</div>
          <div>
            {(keywords && keywords.length) ? keywords.map(item => (
              <Tag
                key={item.name}
                className={classnames({'isChecked': this.props.keyword === item.name}, 'keyword')}
                onClick={this.searchKeyword.bind(this, item.name)}>
                  {item.name}
                </Tag>
            )) : '暂无热门话题'}
          </div>
        </div>
      </div>
    );
  }
}
