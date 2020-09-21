import React from 'react';
import { classnames } from 'utils';
import { PersonItem } from 'aminer/components/expert/c';
import { IRecommendEntity } from 'aminer/p/user/notification_types';
import styles from './NAuthor.less';

interface IPropTypes {
  ndata: IRecommendEntity;
}

const NAuthor: React.FC<IPropTypes> = props => {
  const { ndata } = props;
  const { e_person } = ndata || {};
  return (
    <div className={classnames(styles.nauthor, 'notification_content')}>
      <PersonItem person={e_person} mode="v3" />
    </div>
  );
};

export default NAuthor;
