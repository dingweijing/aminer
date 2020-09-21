/**
 *  Created by BoGao on 2018-04-17;
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'utils';
import H from 'helper';
import styles from './PersonCard.less';

export default class PersonCard extends PureComponent {
  static propTypes = {
    classname: PropTypes.string,
    id: PropTypes.string,
    person: PropTypes.object,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'small',
  };

  render() {
    const { classname, id, person, type } = this.props;
    const name = person && H.renderFirstLocalNames(person.name, person.name_zh);
    console.log(classname)
    return (
      <div className={classnames(styles.personCard, styles[classname], styles[type])}>
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>
            {(!person || !person.avatar) && (
              <div className={styles.imgDiv}>
                <img src="//static.aminer.cn/default/default.jpg" alt={person && person.id} />
              </div>
            )}
            {person && person.avatar && (
              <div className={styles.imgDiv}>
                <img src={person.avatar} alt={person.id} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.name}>
          {person && (
            <a target="_blank" rel="noopener noreferrer" href={`https://aminer.cn/profile/x/${id}`}>{name}</a>
          )}
        </div>
      </div>
    );
  }
}
