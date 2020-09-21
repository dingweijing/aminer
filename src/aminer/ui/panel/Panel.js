import React, { useState } from 'react';
import { component } from 'acore';
import { Hole } from 'components/core';
import { classnames } from 'utils';
import styles from './Panel.less';

const Panel = props => {
  const { title, showHideArrow = true, arrowLeftZone, subContent, className } = props;
  // const { hide, tiny } = props;
  const [hide, setHide] = useState(props.hide)
  const [tiny, setTiny] = useState(props.tiny)

  // const defaultZones = {
  //   arrowLeftZone: []
  // }

  const toggleHide = () => {
    setHide(!hide)
  }

  const onUnfold = size => {
    setTiny(size);
    setHide(false)
  }

  return (
    <div className={classnames(styles.panel, className)}>
      {title && (
        <div className={styles.head}>
          <span>{title}</span>
          <span className={styles.oprs}>
            <Hole fill={arrowLeftZone} defaults={[]} param={{}} />
            {showHideArrow && (
              <i className={hide ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} onClick={toggleHide} />
            )}
          </span>
        </div>
      )}
      <div className={classnames(styles.body)}>
        {/* {tiny && <this.props.subContent subStyle={hide ? 'tiny' : 'normal'} onUnfold={this.onUnfold} {...subProps} />}
        {!tiny && (hide ? '' : <this.props.subContent {...subProps} />)} */}
        {/* tiny: 有值为需要缩略展示； hide: panel隐藏/显示 */}
        {tiny && subContent({ subStyle: hide ? 'tiny' : 'normal', onUnfold })}
        {!tiny && (hide ? '' : subContent({ subStyle: hide ? 'tiny' : 'normal' }))}
      </div>
    </div>
  )
}

export default component()(Panel);
