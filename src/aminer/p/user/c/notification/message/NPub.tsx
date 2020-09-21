import React from 'react';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import { IRecommendEntity } from 'aminer/p/user/notification_types';
import { MarkPub } from 'aminer/components/widgets';
import { MarkPubInfo } from 'aminer/components/pub/pub_type';
import styles from './NPub.less';

interface IPropTypes {
  ndata: IRecommendEntity;
}

const NPub: React.FC<IPropTypes> = props => {
  const { ndata } = props;
  const { e_pub, tid } = ndata || {};

  return (
    <div className={styles.pub}>
      <PublicationList
        papers={e_pub}
        showInfoContent={[]}
        highlightAuthorIDs={[tid]}
        contentRightZone={[
          ({ paper }: { paper: MarkPubInfo }) => {
            return <MarkPub key={5} paper={{ ...paper }} is_starring={false} withNum={false} />;
          },
        ]}
      />
    </div>
  );
};

export default NPub;
