import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Pagination } from 'antd';
import { connect, component } from 'acore';
import { Hole } from 'components/core';
import { formatMessage, FM } from 'locales';
import { Spin, CompState } from 'aminer/components/ui';
import styles from './SearchNewsComponent.less';
import NewsList from './NewsList';


const SearchNewsComponent = props => {
  const { query, dispatch, searchnews, rightZoneFuncs, loading } = props;
  const { news, total } = searchnews;
  const [curPage, setCurPage] = useState(1);

  useEffect(() => {
    fetchNews({ query: query.query, page: curPage });
  }, [query.query, curPage])

  const fetchNews = changes => {
    const { query, page } = changes;
    dispatch({
      type: 'searchnews/searchNews',
      payload: {
        word: query,
        endDate: dayjs().format('YYYY-MM-DD'), // !!!
        page: page || 1
      }
    })
  }

  return (
    <div className={styles.newsComponent}>
      <Spin loading={loading} />

      <div className="news_content">
        <div className="list_content">
          <div className="news_list">
            <CompState condition={news}>
              <div className="result_line">
                {total && (
                  <FM
                    id="aminer.search.news.result"
                    values={{
                      keyword: <span className="keyword">{query.query}</span>,
                      total
                    }}
                  />
                )}
                {!total && (
                  <FM
                    id="aminer.search.news.noresult"
                    values={{
                      keyword: <span className="keyword">{query.query}</span>
                    }}
                  />
                )}
              </div>
              <NewsList news={news} />
            </CompState>
          </div>
          <Hole
            name="search.rightZoneFuncs"
            fill={rightZoneFuncs}
            param={{ query }}
          />
        </div>
        <div className="pageinationWrap">
          {!!total && (
            <Pagination
              showQuickJumper
              current={curPage}
              defaultCurrent={1}
              // defaultPageSize={pagination.pageSize}
              total={total}
              onChange={
                page => setCurPage(page)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default component(connect(({ loading, searchnews }) => ({
  searchnews,
  loading: loading.effects['searchnews/searchNews'],
})))(SearchNewsComponent)
