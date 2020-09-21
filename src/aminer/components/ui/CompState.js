import React from 'react';
import { FM } from 'locales';

const CompState = props => {
  const { children, condition } = props;

  if (!condition) {
    return <div><FM id="aminer.common.loading" /></div>
  }

  if (condition && condition.length === 0) {
    return <div><FM id="aminer.common.noresults" /></div>
  }

  return (
    <>{children}</>
  )
}

export default CompState;
