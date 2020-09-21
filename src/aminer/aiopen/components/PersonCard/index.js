import React, { Component } from 'react';
import { FM } from 'locales';
import { Text, Paragraph } from '../Text'
import styles from './style.less'

const defaultAvatar = require('../../../../../public/sys/aiopen/defaultAvatar.png')

const PersonCard = ({ avatar = defaultAvatar, name_zh, pos, introduction }) => (
  <div className={styles.PersonCard}>
    <img className="avatar" src={avatar} alt="" />
    <div className="card">
      <span className="name">{name_zh}</span>
      <Text label="职位" value={pos} />
      <Paragraph label="简介" value={introduction} />
    </div>
  </div>
)

export default PersonCard;
