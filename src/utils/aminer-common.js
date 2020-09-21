const setViews = (dispatch, id) => {
  if (id) {
    dispatch({
      type: 'aminerConf/setOrGetClickView',
      payload: { type: 'click', id },
    });
  }
};

const getViews = (dispatch, id, cb) => {
  if (id) {
    dispatch({
      type: 'aminerConf/setOrGetClickView',
      payload: { type: 'getClick', id },
    }).then(result => {
      cb(result);
    });
  }
};

const setUserTrack = (dispatch, data) => {
  const payload = Array.isArray(data) ? data : [data];
  dispatch({
    type: 'aminerCommon/setTrack',
    payload,
  });
};

export { setViews, getViews, setUserTrack };
