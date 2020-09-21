import React, { } from 'react';
import { component, connect } from 'acore';
import styles from './PersonPassAway.less';

const PersonPassAway = props => {
  const { passawayData = {} } = props;
  const {
    is_passedaway,
    disable_candles,
    can_burncandles,
    userburned,
    n_candles,
    profile: passaway = {},
  } = passawayData || {};
  const { passaway_reason, passaway_year, passaway_month, passaway_day } = passaway || {};

  return (
    <>
      {is_passedaway && passaway_reason && (
        <div className={styles.personPassAway}>
          {(!!passaway_year || !!passaway_month || !!passaway_day) && (
            <div className="date">
              {!!passaway_year && passaway_year}
              {!!passaway_year && (!!passaway_month || !!passaway_day) && '-'}
              {!!passaway_month && passaway_month}
              {!!passaway_month && !!passaway_day && '-'}
              {!!passaway_day && passaway_day}
            </div>
          )}
          <div>
            <span dangerouslySetInnerHTML={{ __html: passaway_reason ? passaway_reason.replace(/\n/g, '<br>') : '' }} />
          </div>
        </div>
      )}
    </>
  )
}


export default component(connect(({ auth, editProfile }) => ({
  user: auth.user,
  roles: auth.roles,
  passawayData: editProfile.passawayData,
})))(PersonPassAway)
