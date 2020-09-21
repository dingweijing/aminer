
import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import styles from './ExpandAndCollapseSwitch.less';

const ExpandAndCollapseSwitch = props => {
  const [icon, setIcon] = useState('subtraction')
  const { scheduleTypeToColor, schedule, ControlPaperModule, index, scheduleStatus } = props;
  useEffect(() => {
    setIcon(scheduleStatus === 'expand' ? 'subtraction' : 'add');
  }, [scheduleStatus])
  const switchIcon = () => {
    setIcon(icon === 'subtraction' ? 'add' : 'subtraction')
    ControlPaperModule(index);
  }
  return <div className={styles.action}
    style={{ backgroundColor: scheduleTypeToColor[schedule.type].icon }}
    onClick={switchIcon.bind()}>
    <svg className={classnames('icon')} aria-hidden="true">
      <use xlinkHref={`#icon-${icon}`} id={`arrow${index}`} />
    </svg>
  </div>
}
export default page(connect())(ExpandAndCollapseSwitch)
