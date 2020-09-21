
import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { Popconfirm, message, Button } from 'antd';

const AnnotationVersionConfim = props => {
  const { aid, dispatch, version_num } = props;

  const affirmAnnotation = (version_num, affirm = false) => {
    console.log('affirmAnnotation', version_num);
    dispatch({
      type: 'editProfile/AffirmPersonAnnotation',
      payload: {
        aid, version_num,
        verified: true, affirm
      }
    }).then(({ judge, succeed }) => {
      console.log('data', judge, succeed);
      if (succeed) {
        if (judge) {
          affirmAnnotation(version_num, true);
          return;
        }
        message.success('成功')
      }
    })
  }

  return (
    <Button type='primary' size='small'
      onClick={() => affirmAnnotation(version_num)}
    >
      确认
    </Button>
  )
}

export default component(connect())(AnnotationVersionConfim)
