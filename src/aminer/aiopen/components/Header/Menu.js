import React, { useState } from 'react';
import { FM } from 'locales';
import { classnames } from 'utils'
import styles from './menu.less'

const Menu = props => {
  const { onClick = () => { }, opts = [], className = '', defaultActiveIndex = 0 } = props
  const [activeIndex, setActive] = useState(defaultActiveIndex)
  const handleClick = (evt, idx, href) => {
    if (href && href !== '#') return;
    evt.preventDefault()
    setActive(idx)
    onClick(idx)
    evt.stopPropagation()
  }

  return (
    <div className={classnames(styles.menu, className)}>
      {opts.map(({ title, id, href }, index) => (
        <a className={classnames('menuItem', activeIndex === index ? 'active' : '')}
          onClick={evt => handleClick(evt, index, href)}
          key={title} href={href}
          target="_blank"
        >
          <FM id={id} defaultMessage={title} />
        </a>
      ))}
    </div>
  )
}

export default Menu
