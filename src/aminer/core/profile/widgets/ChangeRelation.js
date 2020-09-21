import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { isLogin } from 'utils/auth';
import { formatMessage } from 'locales';
import styles from './ChangeRelation.less'

@connect(({ auth }) => ({
  user: auth.user
}))
class ChangeRelation extends PureComponent {
  setRealtion = (type) => {
    const { cardID, personId, dispatch, renderData, infocardHide, user } = this.props;
    if (isLogin(user)) {
      dispatch({
        type: 'aminerPerson/setPersonRelModify',
        payload: { type, cardID, personId }
      }).then((res) => {
        if (res) {
          dispatch({ type: 'aminerPerson/getProfileEgoNet', payload: { personId } })
            .then(() => {
              infocardHide();
              renderData();
            })
        }
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  render() {
    return (
      <div className={styles.relationBtn}>
        <span onClick={() => { this.setRealtion(1) }} className='btn advisee'>{`${formatMessage({ id: 'aminer.person.advisee', defaultMessage: 'Advisee' })}`}</span>
        <span onClick={() => { this.setRealtion(2) }} className='btn coauthor'>{`${formatMessage({ id: 'aminer.person.coauthor', defaultMessage: 'Co-author' })}`}</span>
        <span onClick={() => { this.setRealtion(3) }} className='btn advisor'>{`${formatMessage({ id: 'aminer.person.advisor', defaultMessage: 'Advisor' })}`}</span>
      </div>
    )
  }
}
export default ChangeRelation
