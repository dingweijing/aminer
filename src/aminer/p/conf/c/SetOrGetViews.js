import React, { useEffect, useState } from 'react';
import cookies from 'utils/cookie';

const SetOrGetViews = (type = 'getClick', dispatch, id) => {
  let tempId;
  if (!id) {
    const getConfInfo = cookies.getCookie('conf');
    if (getConfInfo) {
      tempId = JSON.parse(getConfInfo).id || '';
    }
  } else {
    tempId = id;
  }
  dispatch({
    type: 'aminerConf/setOrGetClickView',
    payload: { type, id: tempId },
  });
};

export { SetOrGetViews };
