import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { sysconfig } from 'systems';
import { connect } from 'acore';
import cookies from 'utils/cookie';
import * as auth from 'utils/auth';
import helper from 'helper';
import { AuthSuit } from '@/../.startup/authsuit';

const ckcest = props => {
  const { dispatch, thirdLoginSuccess } = props;
  useEffect( () => {
    const { token } = helper.parseUrlParam(props, {}, ['token']);
    dispatch({
      type: 'auth/ckcestLogin',
      payload: { token }
    }).then(success => {
      if (success) {
        if (window) {
          window.close();
          if (window.opener) {
            window.opener.location.href = '/';
          }
        }
      }
    })
  }, []);

  return (
    <></>
  )
}

export default connect(({ auth }) => ( { thirdLoginSuccess: auth.thirdLoginSuccess }))(ckcest);
