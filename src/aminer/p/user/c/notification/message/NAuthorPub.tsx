import React from 'react';
import { classnames } from 'utils';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import { PersonItem } from 'aminer/components/expert/c';
import { IRecommendEntity } from 'aminer/p/user/notification_types';
import styles from './NAuthorPub.less';

interface IPropTypes {
  ndata: IRecommendEntity;
}

const NAuthorPub: React.FC<IPropTypes> = props => {
  const { ndata } = props;
  const { e_pub, e_person, tid } = ndata || {};
  return (
    <div className={classnames(styles.authorPub, 'notification_content')}>
      <PublicationList
        papers={e_pub}
        showInfoContent={[]}
        highlightAuthorIDs={[tid]}
        contentRightZone={[]}
      />
      <PersonItem person={e_person} mode="v3" />
    </div>
  );
};

export default NAuthorPub;
