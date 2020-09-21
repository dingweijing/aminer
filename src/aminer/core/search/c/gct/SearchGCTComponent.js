import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { connect, component } from 'acore';
import { Hole } from 'components/core';
import { FM } from 'locales';
import { Spin, CompState } from 'aminer/components/ui';
import KGSearchHelper from '../ai/KGSearchHelper';
import GCTList from './GCTList';
import styles from './SearchGCTComponent.less';


const SearchGCTComponent = props => {

  const { query, dispatch } = props;

  const { searchgct, loading, rightZoneFuncs, topic } = props;
  const { matched, searchResult } = searchgct;

  useEffect(() => {
    callSearch(query);
  }, [query.query])

  const callSearch = (changes, advquery) => {
    const { query } = changes
    dispatch({
      type: 'searchgct/getExpertBaseTreeByQuery',
      payload: { query: query || '', advquery }
    })
  }

  const onAssistantChange = (texts) => {
    callSearch(query, { texts })
  }

  const freeList = useMemo(() => {
    return searchResult && searchResult.filter(item => item.price === 0);
  }, [searchResult])

  return (
    <div className={styles.gctComponent}>
      <div className='gct_search'>

        <div className='result_line'>
          {matched && (
            <FM
              id='aminer.search.gct.result'
              values={{
                keyword: <span className='keyword'>{query.query}</span>,
                total: freeList.length
              }}
            />
          )}
          {!matched && freeList && freeList.length > 0 && (
            <FM
              id='aminer.search.gct.noresult'
              values={{
                keyword: <span className='keyword'>{query.query}</span>
              }}
            />
          )}

        </div>

        <KGSearchHelper query={query} modelName='searchgct'
          onAssistantChanged={onAssistantChange} />

        <Spin loading={loading} />

        <div className='gct_content'>
          <div className='list_content'>
            <div className='gct_list'>
              <CompState condition={freeList}>
                <GCTList list={freeList} query={query.query} matched={matched} />
              </CompState>

            </div>
            <Hole
              name="search.rightZoneFuncs"
              fill={rightZoneFuncs}
              param={{ query }}
            />
          </div>
        </div>
      </div>
    </div>
  )

}
export default component(connect(({ loading, searchgct, search }) => ({
  searchgct,
  loading: loading.effects[`searchgct/getExpertBaseTreeByQuery`],
  topic: search.topic
})))(SearchGCTComponent)