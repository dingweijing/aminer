import React, { Component } from 'react';
import { FM } from 'locales';
import styles from './style.less'

interface IPropType{}

const EmojiWrapper: React.FC<IPropType> = (props) => (
  <div >
    {props.children}
    <span>1234</span>
      </div>
)

export default EmojiWrapper;
