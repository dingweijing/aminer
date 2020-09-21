import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { Checkbox } from 'antd';

const DelCheckbox = props => {
  const { pid, status, updateDelPubs, isStar } = props;

  const onChangeDelPub = () => {
    updateDelPubs({ id: pid });
  };

  return <Checkbox disabled={isStar} className="checkbox" checked={status} onChange={onChangeDelPub} />;
};

DelCheckbox.propTypes = {};

DelCheckbox.defaultProps = {};


export default component(
  connect(({ profile }, { pid }) => {
    // console.log('pidpid', pid)
    const status = profile && profile.checkDelPubs && pid && profile.checkDelPubs.includes(pid);
    // console.log('statusstatus', status)
    return {
      status,
    };
  }),
)(DelCheckbox);
