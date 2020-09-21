/**
 * Created by bo gao on 2019-06-10
 */
import React, { useState, useEffect } from 'react';
import { connect, component, Link } from 'acore';
import { Button } from 'antd';
import styles from './EditModalTrigger.less';

const EditModalTrigger = (props) => {
  const { roles, dispatch, link } = props;
  const { model, data } = props;

  // console.log("....update....", props)

  const showModal = () => {
    console.log("....", model, data);
    if (model && model.current && model.current.open) {
      model.current.updateAndOpen(data);
    }
  }

  return (
    <a className={styles.container} onClick={showModal} size='small'>
      EDIT
    </a>
  )
}
export default component(connect())(EditModalTrigger)
