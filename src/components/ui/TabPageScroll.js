import React, { useState, useEffect } from 'react';

const TabPageScroll = ({ children, nextIndex = 0, className = {} }) => {
  if (!children) return null
  const [currentIndex, setIndex] = useState(0)
  const [margin, setMargin] = useState({})

  const clearMargin = () => {
    setTimeout(() => {
      setMargin({})
    }, 0)
  }

  useEffect(() => {
    // compare Index
    const divide = nextIndex - currentIndex
    if (divide) {
      setIndex(nextIndex)
      setMargin({ marginLeft: `${divide * 100}%` })
      clearMargin()
    }
  }, [nextIndex])

  return (
    <div className={className}>
      {/* eslint-disable react/no-array-index-key */}
      {React.Children.map(children, (i, idx) => (<div className="child"
        key={idx}
        style={{
          width: '100%',
          display: currentIndex === idx ? 'block' : 'none',
          transition: 'margin-left ease .5s',
          ...margin

        }}
      >{i}</div>))}
    </div >
  )
}

export default TabPageScroll;
