import React from 'react';
import { connect, component } from 'acore';

const PaperPackLink = props => {
  const { data, dispatch } = props;

  const goPaperPage = () => {
    dispatch({ type: 'pub/setPaper', payload: { data } })
  }

  return (
    <span onClick={goPaperPage}>
      {props.children}
    </span>
  )
}

export default component(connect())(PaperPackLink);
