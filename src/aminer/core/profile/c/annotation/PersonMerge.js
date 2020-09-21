import React, { useEffect, useState, useMemo } from 'react';
import { connect, component } from 'acore';
import { Button, Checkbox, Pagination, message } from 'antd';
import { Loading } from 'components/ui';
import { PersonList } from 'aminer/core/person/c';
import { FM, formatMessage } from 'locales';
import { SearchBox } from 'aminer/core/search/c/control';
import { PersonMergeModal } from './index';
import styles from './PersonMerge.less';

const PersonMerge = props => {
  const { dispatch, pid, query, loading, pagination, names, results } = props;
  const [checkIds, setCheckIds] = useState({});
  const [currentPerson, setCurrentPerson] = useState(null);

  useEffect(() => {
    const changes = {
      query: {
        advanced: { name: names.name || name.name_zh, org: '', term: '' },
        query: ''
      }
    };
    callSearch(changes)// TODO 这里会调两次
    return () => {
      dispatch({ type: 'searchperson/reset' });
    }
  }, [names]);

  useEffect(() => {
    if (pid) {
      dispatch({
        type: 'editProfile/getPerson',
        payload: { ids: [pid] }
      }).then((data) => {
        setCurrentPerson(data);
      })
    }
  }, [pid]);

  const onSearch = ({ queryObject, query, extra_ids }) => {
    const changes = { query: { ...queryObject, query }, extra_ids }
    if (changes) {
      setCheckIds({});
      dispatch({ type: 'expertSearch/reset' });
      callSearch(changes)
    }
  }

  const onCheck = (id, e) => {
    if (e.target.checked) {
      checkIds[id] = '';
    } else {
      delete checkIds[id];
    }
    setCheckIds({ ...checkIds });
  }

  const contentRightZone = useMemo(() =>
    [
      ({ person: { id } }) => {
        if (pid !== id) {
          return (
            <Checkbox key="1" checked={checkIds.hasOwnProperty(id)}
              onChange={onCheck.bind(this, id)} />
          )
        }
        return '#';
      },
    ], [checkIds])

  const callSearch = changes => {
    if (changes) {
      const schema = [
        'id', 'name', 'name_zh', 'avatar', 'tags', 'is_follow',
        'num_view', 'num_follow', 'is_upvoted', 'num_upvoted', 'is_downvoted', 'bind',
        { profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh', 'org'] },
        { indices: ['hindex', 'gindex', 'pubs', 'citations', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'] }
      ]
      changes.schema = schema;
      changes.include = [];

      if (changes.extra_ids && !!changes.extra_ids.length) {
        changes.query = {
          query: '',
          advanced: { name: "", org: "", term: "" }
        }
      }
      dispatch({ type: 'expertSearch/search', payload: changes });
    }
  }

  const onChangePage = (current, pageSize) => {
    const pagination = { current, pageSize };
    callSearch({ pagination });
  }

  const openMergeModal = () => {
    if (!Object.keys(checkIds).length) {
      message.error('请至少勾选一个人合并'); return;
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'com.profileMerge.button.merge', defaultMessage: 'Merge' }),
        height: '90vh',
        width: '90vw',
        content: <PersonMergeModal pid={pid} checkIds={Object.keys(checkIds)} />
      }
    });
  }

  const filterPersonList = () => {
    const index = results && currentPerson && results.findIndex(item => item.id === currentPerson[0].id)
    if (index >= 0 && results) {
      results.splice(index, 1)
    }
    return results;
  }
  return (
    <div className={styles.personMerge}>
      <div className={styles.formZone}>
        <SearchBox
          queryObject={query}
          showSearchIcon
          onSearch={onSearch}
          fixAdvancedSearch
          disableSearchPid={false}
        />
        <Button className={styles.mergrBtn} type="primary" onClick={openMergeModal}>
          <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
        </Button>
      </div>
      <div className={styles.sortZone}>
        {pagination && pagination.total > 20 && (
          <Pagination
            size="small"
            current={pagination.current}
            defaultCurrent={1}
            defaultPageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onChangePage}
          />
        )}
      </div>
      <div className={styles.loadingWrap}>
        {loading ? <Loading fatherStyle={styles.loader} /> : <p>Merge To</p>}
      </div>
      <PersonList
        id="aminerPersonList"
        contentLeftZone={[]}
        contentRightZone={[]}
        personList={currentPerson}
        target='_blank'
      />
      <div className={styles.splitLine} />
      <PersonList
        id="aminerPersonList"
        contentRightZone={contentRightZone}
        contentLeftZone={[]}
        personList={filterPersonList()}
        target='_blank'
      />
      {pagination && pagination.total > 20 && (
        <Pagination
          className={styles.paginationWrap}
          current={pagination.current}
          defaultCurrent={1}
          defaultPageSize={pagination.pageSize}
          total={pagination.total}
          onChange={onChangePage}
        />
      )}
    </div>
  );
}

export default component(connect(({ expertSearch, loading }) => ({
  results: expertSearch.results,
  pagination: expertSearch.pagination,
  query: expertSearch.query,
  loading: loading.effects['expertSearch/search']
})))(PersonMerge)
