import React from 'react';
import { connect, Link, component } from 'acore';

// TODO refactor: move to PreheatExpertLink, PreheatPaperLink.
const ExpertLink = props => {
  const { dispatch, author, children, toLinkNoCover = false } = props;

  if (!author) {
    return false;
  }

  const preheatProfile = () => {
    if (toLinkNoCover) { return };
    if (author.img && !author.avatar) {
      author.avatar = author.img
    }
    dispatch({ type: 'profile/resetProfile' });
    dispatch({ type: 'profile/setTransitionData', payload: { data: author } })
  }

  return (
    <span onClick={preheatProfile}>
      {props.children}
    </span>
  )
}

export default component(connect())(ExpertLink);
