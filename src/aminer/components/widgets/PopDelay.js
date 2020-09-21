import React, { useRef } from 'react'
import { component } from 'acore'
import { useTriggerPopup } from 'amg/hooks'
import { classnames } from 'utils';
import styles from './PopDelay.less'

const PopDelay = props => {
  const { dropContent: Drop, iconContent: Icon } = props;

  const iconEl = useRef()
  const dropEl = useRef()

  // use customized hooks.
  useTriggerPopup(iconEl, dropEl)

  return (
    <div className={classnames(styles.popdelay)}>
      <div ref={iconEl}>
        {Icon}
      </div>
      <div ref={dropEl} className={classnames('dropcontent')}>
        {Drop}
      </div>
    </div>
  )
}

export default component()(PopDelay)
