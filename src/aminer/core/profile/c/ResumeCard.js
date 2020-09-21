import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { formatMessage } from 'locales';
import { classnames } from 'utils';
import styles from './ResumeCard.less'

const ResumeCard = props => {
  const { enableEdit, title, children, className, leftIcon,
    toggleEdit, condition, edit, rightIconType = 'edit' } = props;
  // const [edit, setEdit] = useState(false);


  const renderChildren = () => {
    // const childs = React.Childen.toArray(children)
    // console.log('childs', childs);
    // const c = childs.map(child => child);
    const c = React.Children.map(children, child => child);
    return c || false;
  };

  const handleEdit = () => {
    if ((typeof condition === 'function' && condition()) ||
      (typeof condition !== 'boolean' && !condition)) {
      if (toggleEdit) {
        toggleEdit()
      }
    }
    // if ((condition && condition()))
  }


  return (
    <section className={classnames(styles.resumeCard, styles[className])}>
      <div className="card_title">
        <span className='title_text'>
          {leftIcon && <span className='left_icon'>{leftIcon}</span>}
          {title}
        </span>
        {
          <div className="title_right">
            {enableEdit && (
              <span className="edit desktop_device">
                {!edit && (
                  <Tooltip placement="top" title={rightIconType === 'edit' ?
                    formatMessage({
                      id: 'aminer.common.edit',
                      defaultMessage: 'Edit'
                    }) : formatMessage({
                      id: 'com.bole.AddButton',
                      defaultMessage: 'Add'
                    })}>
                    <svg className="icon" aria-hidden="true" onClick={handleEdit}>
                      <use xlinkHref={`#icon-${rightIconType}`} />
                    </svg>
                  </Tooltip>
                )}
                {edit && (
                  <Tooltip placement="top" title={formatMessage({
                    id: 'aminer.common.cancel',
                    defaultMessage: 'Cancel'
                  })}>
                    <svg className="icon" aria-hidden="true" onClick={handleEdit}>
                      <use xlinkHref="#icon-modal_close" />
                    </svg>
                  </Tooltip>
                )}
              </span>
            )}
          </div>
        }

      </div>
      <div className="card_content">
        {/* <span>{children}</span> */}
        {renderChildren()}
      </div>
    </section>
  )
}

ResumeCard.propTypes = {
  enableEdit: PropTypes.bool,
  // title: PropTypes.string,
  children: PropTypes.any.isRequired
};

ResumeCard.defaultProps = {
  enableEdit: true,
  // title: ''
}

export default ResumeCard
