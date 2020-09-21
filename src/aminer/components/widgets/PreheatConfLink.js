import { connect, component } from 'acore';

const PreheatConfLink = props => {
  const { dispatch, data, children } = props;

  const onClick = () => {
    if (data) {
      dispatch({ type: 'rank/setConfInfo', payload: null })
      dispatch({
        type: 'rank/setConfIntro',
        payload: data
      })
    }
  }

  return (
    <span onClick={onClick}>
      {children}
    </span>
  )
}

export default component(connect())(PreheatConfLink);
