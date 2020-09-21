// loading
import React, { useState } from 'react'
import { Spin, Skeleton } from 'antd'
import styles from './style.less'

// type: spin || skeleton
const withLoading = (WrappedComponent, type = 'spin', options = {}) => props => {
  if (!WrappedComponent || !props) return null
  const { loading, ...otherProps } = props
  if (typeof loading === 'undefined') return null
  if (type === 'spin') {
    return (
      <div className={styles.spinWrapper}>
        {loading ? <div className="spinWrapperInner">
          <Spin spinning={loading} {...options} />
        </div> : <WrappedComponent
            {...otherProps}
          />}

      </div>
    )
  }

  if (type === 'skeleton') {
    return <div className={styles.spinWrapper}>
      <Skeleton active loading={loading} {...options} >
        <WrappedComponent
          {...otherProps}
        />
      </Skeleton>
    </div>
  }

  return null
}

export default withLoading
