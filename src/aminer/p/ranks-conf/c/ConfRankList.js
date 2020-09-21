import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'acore';
import { Table, Rate } from 'antd';
import PropTypes from 'prop-types';
import { logtime } from 'utils/log';
import { BasicTable } from 'amg/ui/table';
import { Loading } from 'components/ui';
import InfiniteScroll from 'react-infinite-scroller';
import { PreheatConfLink } from 'aminer/components/widgets';
import styles from './ConfRankList.less';

const columns1 = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    render: (n, m, i) => i + 1
  },
  {
    title: 'Conference（Full Name）',
    dataIndex: 'conference_name',
    render: (text, record) => <Link style={{ color: '#3C80BC' }} to={`/conference/${record.id}`}>{text || record.short_name}</Link>
  },
  {
    title: 'Short Name',
    dataIndex: 'short_name',
    render: (text, record) => text && <Link style={{ color: '#3C80BC' }} to={`/conference/${record.id}`}>{text}</Link>
  },
  {
    title: 'H5-Index',
    dataIndex: 'h5_index',
  },
  {
    align: 'center',
    title: 'CCF Level',
    dataIndex: 'ccf_level',
    filters: [
      { text: 'A', value: 'A', },
      { text: 'B', value: 'B' },
      { text: 'C', value: 'C' },
    ],
    // filterMultiple: false,
    onFilter: (value, { ccf_level }) => ccf_level && ccf_level.includes(value),
  },
  {
    title: 'SCI',
    dataIndex: 'section',
    filters: [
      { text: 1, value: 1, },
      { text: 2, value: 2 },
      { text: 3, value: 3 },
      { text: 4, value: 4 },
    ],
    onFilter: (value, { section }) => section === value
  },
  {
    title: 'IF',
    dataIndex: 'IF',
    sorter: (a, b, c) => {
      const num = c === 'ascend' ? 1000 : -1;
      return (a.IF || num) - (b.IF || num)
    },
  },

  // {
  //   title: 'SCI/E',
  //   dataIndex: 'SCI/E',
  //   filters: [
  //     { text: 'SCI', value: 'SCI', },
  //     { text: 'SCIE', value: 'SCIE' },
  //   ],
  //   onFilter: (value, record) => {
  //     return record['SCI/E'] === value;
  //   },
  // },

  {
    title: 'Acceptance Difficulty of Papers',
    width: 150,
    dataIndex: 'employment_proportion',
    sorter: (a, b, c) => {
      let n = a.employment_proportion;
      let m = b.employment_proportion;
      if (c === 'ascend') {
        return n - m;
      }
      n = n == '8' ? -1 : n;
      m = m == '8' ? -1 : m;
      return n - m;
    },
    render: value => {
      const v = Number(value);
      if (v <= 6) {
        return <Rate disabled value={v} count={v} />
      }
    }
  },

  // {
  //   title: 'Average Publication Number',
  //   dataIndex: 'avg_pub',
  // },
  // {
  //   title: 'Median of Citation Number',
  //   dataIndex: 'cit_med',
  // },
];

const addNum = (n, max) => {
  switch (n) {
    case 300:
      return 500;
    case 500:
      return max;
    default:
      return max;
  }
}

const ConfRankList = props => {
  const { items } = props;
  const [size, setSize] = useState(Infinity);
  logtime('------ Benchmark: render conflist');


  const loadMore = () => {
    const max = items && items.length || 2000;
    if (max > 300) {
      setSize(addNum(size, max));
    }
  }

  const columns = [
    {
      Header: 'Rank',
      accessor: 'rank',
      Cell: ({ row: { index } }) => index + 1,
      align: 'center',
      width: 34,
    },
    {
      Header: 'Conference（Full Name）',
      accessor: 'conference_name',
      Cell: ({ cell: { row } }) => {
        const { id, conference_name, short_name } = row && row.original || {};
        return (
          <PreheatConfLink data={row && row.original}>
            <Link className={styles.name} to={`/conference/${id}`}>{conference_name || short_name}</Link>
          </PreheatConfLink>
        )
      },
    },
    {
      Header: 'Short Name',
      accessor: 'short_name',
      Cell: ({ cell: { row } }) => {
        const { short_name, id } = row && row.original || {};
        return (
          <PreheatConfLink data={row && row.original}>
            <Link className={styles.name} to={`/conference/${id}`}>{short_name}</Link>
          </PreheatConfLink>
        )
      },
      width: 84,
    },
    {
      Header: 'H5-Index',
      accessor: 'h5_index',
      width: '70px',
      align: 'center',
    },
    {
      Header: 'H5-Median',
      accessor: 'h5_median',
      width: '70px',
      align: 'center',
    },
    {
      Header: 'CCF Level',
      accessor: 'ccf_level',
      filterMultiple: false,
      disableFilters: false,
      width: 116,
      align: 'center',
    },
    {
      Header: 'THU Level',
      accessor: 'thu_level',
      filterMultiple: false,
      disableFilters: false,
      width: 116,
      align: 'center',
    },
    /*     {
          Header: 'SCI',
          accessor: 'section',
          filterMultiple: false,
          disableFilters: false,
          width: 50,
          align: 'center',
        },
        {
          Header: 'IF',
          accessor: 'IF',
          Cell: ({ cell: { value } }) => {
            return value && value.toFixed(2) || null
          },
          width: 28,
          align: 'center',
          disableSorting: false,
        },
        {
          Header: 'Acceptance Difficulty of Papers',
          accessor: 'employment_proportion',
          Cell: ({ cell: { value } }) => {
            const v = Number(value);
            if (v <= 6) {
              return <Rate className={styles.rate} disabled value={v} count={v} />
            }
            return null;
          },
          disableSorting: false,
        } */
  ]

  const list = useMemo(() => items && items.slice(0, size), [size, items])

  const table = useMemo(() => {
    if (!list) {
      return false;
    }

    const antd = true;
    let content = null;
    if (antd) {
      content = (
        <BasicTable
          rowKey="id"
          data={list}
          columns={columns}
          className={styles.list}
        />
      )
    }

    if (!antd) {
      content = (
        <ul className={styles.list}>
          <li className="conf_item conf_head">
            <span className="item item1">Rank</span>
            <span className="item item2">Conference <span className="desktop_device">(Full Name)</span></span>
            <span className="item item3">Short Name</span>
            <span className="item item4">H5-Index</span>
            <span className="item item5">CCF Level</span>
          </li>
          {list && list.length > 0 && list.map((item, index) => {
            const { short_name, conference_name, id, h5_index, ccf_level } = item;
            return (
              <li className="conf_item" key={id}>
                <span className="item item1">{index + 1}</span>
                <span className="item item2">
                  <Link to={`/conference/${id}`}>
                    {conference_name}
                    {/* {short_name && (
                  <span className='mobile_device'> ({short_name})</span>
                )} */}
                  </Link>
                </span>
                <span className="desktop_device item item3">
                  <Link to={`/conference/${item.id}`}>{short_name}</Link>
                </span>
                <span className="item item4">{h5_index}</span>
                <span className="item item5">{ccf_level}</span>
              </li>
            )
          })}
        </ul>
      )
    }

    return content

    return (
      <InfiniteScroll
        className={styles.confList}
        pageStart={0}
        initialLoad={false}
        loadMore={loadMore}
        hasMore={(items && items.length) > 300 && size < (items && items.length)}
        useWindow
        loader={<Loading key="0" fatherStyle={styles.loader} />}
      >
        {content}
      </InfiniteScroll>
    );
  }, [list])

  // console.log('loading',size, size >= (items && items.length), list && list.length)

  return table;
}

ConfRankList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default React.memo(ConfRankList);
