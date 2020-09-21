/**
 * Created by bo gao on 2019-05-17
 * Refactor: Use Hooks.
 */
import React, { useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { connect, component, Link } from 'acore';
import { differenceInDays, parseISO } from 'date-fns';
import { formatMessage, FD, FT, FR } from 'locales';
import { Table, Checkbox } from 'antd';
import EditModalTrigger from './widgets/EditModalTrigger';
import EditModal from './widgets/EditModal';
import styles from './JConfList.less';

const JConfList = props => {
  const { roles, dispatch, link } = props;

  // const [jconfs, setJconfs] = useState()
  const [jconfs, dispatchJConfs] = useReducer(reducer);

  const offset = 0;
  const size = 20;

  // * loading person effect.
  useEffect(() => {
    dispatch({
      type: 'jconf/list',
      payload: { offset, size, pure: true, mode: '' },
    }).then(data => {
      console.log('....', data);
      dispatchJConfs({ type: 'init', payload: { data } });
    }).catch(err => {
      console.log('...some error occured, ', err);
    });
  }, [dispatch]); // TODO when update.


  console.log('render');

  // * Modal ref
  const editModalRef = useRef(null);

  const modalCall = method => {
    if (editModalRef && editModalRef.current) {
      const f = editModalRef.current[method];
      if (f) {
        f();
      }
    }
  };

  const onUpdate = param => {
    console.log('0090909090909808908098098', param);
    // TODO update conference
    if (param && param.newValue) {
      dispatchJConfs({ type: 'update', payload: { jconf: param.newValue } });
    }
    modalCall('close');
  };

  const onCancel = () => {
    modalCall('close');
  };

  const columns = useMemo(() => getColums({ link, editModalRef }), [link]);

  // console.log("00", jconfs)

  return (
    <div className={styles.container}>
      <h1>jconference list.</h1>
      <Table
        className={styles.jconflist}
        columns={columns}
        dataSource={jconfs}
        rowKey="id"
        bordered
        size="small"
        scroll={{ x: '130%', y: '100%' }}
        rowClassName={(record, index) => (record && record.updated ? styles.highlight : '')}
        pagination={{
          pageSize: size,
          defaultCurrent: 1,
          hideOnSinglePage: true,
          // showQuickJumper: 'true',
          total: 140000,
          // onChange: this.onChange
        }}
      />

      <EditModal
        register={editModalRef}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />

    </div>
  );
};


// -----------------------------------------------------------------------------
// -- TODO: functions with immer
// -----------------------------------------------------------------------------

function reducer(state, action) {
  switch (action.type) {
    case 'init':
      return action.payload.data;
    case 'update':
      if (!action.payload.jconf) {
        return state;
      }
      // TODO use immer?
      return state.map(item => {
        if (item.id === action.payload.jconf.id) {
          // eslint-disable-next-line no-param-reassign
          action.payload.jconf.updated = true;
          return action.payload.jconf;
        }
        return item;
      });
    default:
      throw new Error(`dispatch unknown action ${action.type}`);
  }
}

// -----------------------------------------------------------------------------
// -- tables
// -----------------------------------------------------------------------------
const now = new Date();

const getColums = ({ link, editModalRef }) => {
  // console.log(".....", link)
  const defaultFunc = (id, jconf) => (`/jconf/view/${id}`);
  const linkFunc = link || defaultFunc;
  return [
    {
      title: '',
      dataIndex: 'id',
      key: 'checkbox',
      width: 34,
      align: 'center',
      fixed: 'left',
      render: (id, jconf) => <Checkbox onChange={() => { }} />,
    },
    {
      title: <b>J/Conf</b>,
      dataIndex: 'abbr',
      key: 'abbr',
      width: 68,
      align: 'left',
      fixed: 'left',
      className: 'tdAbbr',
      render: (text, jconf) => <Link to={linkFunc(jconf.id, jconf)}>{text}</Link>,
      // filters: [{ text: 'Joe', value: 'Joe', }, { text: 'John', value: 'John', },],
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: <b>Full Name</b>,
      dataIndex: 'name',
      key: 'name',
      width: 280,
      align: 'left',
      fixed: 'left',
      render: (text, jconf) => <Link to={linkFunc(jconf.id, jconf)}>{text}</Link>,
    },
    {
      title: 'Short Name',
      dataIndex: 'short_name',
      key: 'short_name',
      width: 180,
      align: 'left',
      render: (text, jconf) => <Link to={linkFunc(jconf.id, jconf)}>{text}</Link>,
    },

    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 60,
    },
    {
      title: 'Statistics',
      children: [
        {
          title: '#pub',
          dataIndex: 'pub_count',
          key: 'pub_count',
          width: 60,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: '10H',
          dataIndex: 'h10',
          key: 'h10',
          width: 60,
          // sorter: (a, b) => a.age - b.age,
        },
        {
          title: 'H5index',
          dataIndex: 'h5index',
          key: 'h5index',
          width: 80,
          // sorter: (a, b) => a.age - b.age,
        },
      ],

    },
    {
      title: 'Update Time',
      dataIndex: 'updated_time',
      key: 'updatetime',
      width: 80,
      // align: 'right',
      className: 'utime',
      render: value => {
        if (!value) {
          return false;
        }
        const diff = 0;
        try {
          diff = differenceInDays(now, parseISO(value));
        } catch (err) { }
        return (
          <>
            <FD value={value} />
            {diff <= 1 && <><br /> <FT value={value} /></>}
          </>
        );
      },
    },

    // {
    //   title: 'Other',
    //   children: [
    //     {
    //       title: 'Age',
    //       dataIndex: 'age',
    //       key: 'age',
    //       width: 200,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: 'Address',
    //       children: [
    //         {
    //           title: 'Street',
    //           dataIndex: 'street',
    //           key: 'street',
    //           width: 200,
    //         },
    //         {
    //           title: 'Block',
    //           children: [
    //             {
    //               title: 'Building',
    //               dataIndex: 'building',
    //               key: 'building',
    //               width: 100,
    //             },
    //             {
    //               title: 'Door No.',
    //               dataIndex: 'number',
    //               key: 'number',
    //               width: 100,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: 'Company',
      children: [
        {
          title: 'Company Address',
          dataIndex: 'companyAddress',
          key: 'companyAddress',
        },
        {
          title: 'Company Name',
          dataIndex: 'companyName',
          key: 'companyName',
        },
      ],
    },

    {
      title: <b>Operation</b>,
      // dataIndex: 'operation',
      key: 'operation',
      width: 80,
      fixed: 'right',
      render: (text, jconf) => (
          <>
            <EditModalTrigger model={editModalRef} data={jconf} />
          </>
        ),

    },
  ];
};

// -------------------------------------
// -- export
// -------------------------------------
export default component(
  connect(({ auth }) => ({ roles: auth.roles })),
  // Auth,
)(JConfList);
