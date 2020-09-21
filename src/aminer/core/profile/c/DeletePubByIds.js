/*
 * @Author: your name
 * @Date: 2019-11-25 16:19:39
 * @LastEditTime: 2019-11-25 17:48:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/aminer/core/profile/c/DeletePubByIds.js
 */
import React, { Fragment, useEffect, useMemo } from 'react';
import { connect, Link, history, component } from 'acore';
import { AutoForm } from 'amg/ui/form';
import { message } from 'antd';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import styles from './DeletePubByIds.less';

const formSchema = [
  {
    name: 'ids',
    label: '',
    type: 'textarea',
    autoSize: { minRows: 2, maxRows: 6 },
    rules: [
      {
        required: true,
        message: formatMessage({
          id: 'aminer.person.edit.bio.empty',
          defaultMessage: 'Please Enter IDs',
        }),
      },
    ],
  },
];

const DeletePubByIds = props => {
  const { id, dispatch, resetList } = props;
  const Submit = data => {
    const pids = data.ids.split(/[;,；，。. ]/).filter(id => id && id != '');
    dispatch({
      type: 'profile/RemovePubsFromPerson',
      payload: {
        id,
        pids,
      },
    }).then(() => {
      message.success(formatMessage({ id: 'aminer.paper.delete.success', defaultMessage: 'Delete Papers Success' }))
      dispatch({
        type: 'modal/close'
      })
      resetList()
    });
  };
  return (
    <div className={styles.deletePubByIds}>
      <span className={styles.tip}>多个id之间用分号分隔</span>
      <AutoForm
        config={formSchema}
        data={{ ids: '' }}
        onSubmit={Submit}
      />
    </div>
  );
};

export default component(connect())(DeletePubByIds);
