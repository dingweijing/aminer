import React, { useRef, useEffect } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { useGetFollowsByID, useGetCategoriesByID, useGetPubCollections } from 'utils/hooks';
import { PubInfo, PubListZoneType, PubAuthor } from 'aminer/components/pub/pub_type';
import { IUser } from 'aminer/components/common_types';
import { PublicationItem } from './c';
import styles from './PublicationList.less';

interface Proptypes {
  dispatch: (config: { type: string; payload: { params: any } }) => Promise<any>;
  papers: PubInfo[];
  className: string;
  highlight_item_id_index: string | number;
  titleLinkQuery: {
    query?: {
      [key: string]: string;
    };
    [param: string]: any;
  };
  user: IUser;
  authorLinkDomain: string;
  showAuthorCard: boolean;
  contentLeftZone: PubListZoneType;
  contentRightZone: PubListZoneType;
  abstractZone: PubListZoneType;
  keywordsZone: PubListZoneType;
  venueZone: PubListZoneType;
  authorsZone: PubListZoneType;
  cardBottomZone: PubListZoneType;
  infoRightZone: PubListZoneType;
  titleLeftZone: PubListZoneType;
  titleRightZone: PubListZoneType;
  itemClass: string;
  end: boolean;
  abstractLen: number;
  showInfoContent: any[];
  paper_highlight: boolean;
  highlightWords: string[];
  highlightAuthorIDs: string[];
  isAuthorsClick: boolean;
  authorTarget: string;
  onAuthorClick: (author: PubAuthor) => void;
  showSearchWithNoId: boolean;
  titleLinkDomain: string | boolean;
  titleTarget: string;
  onClickTitle: (paper: PubInfo) => void;
  isShowPdfIcon: boolean;
  withFollow: boolean;
  withCategory: boolean;
}

const PublicationList = (props: Proptypes) => {
  const {
    dispatch,
    className,
    papers,
    onAuthorClick,
    highlight_item_id_index,
    withFollow = false,
    withCategory = false,
    user,
    ...params
  } = props;

  const is_login = isLogin(user);

  useGetFollowsByID(dispatch, withFollow && is_login, papers);
  useGetCategoriesByID(dispatch, withCategory && is_login, papers);

  return (
    <div className={classnames(styles.aminerPaperList, className, 'publication_list')}>
      {papers &&
        papers.length > 0 &&
        papers.map((paper, index: number) => {
          return (
            <PublicationItem
              key={paper.id}
              {...params}
              paper={paper}
              paper_index={index}
              paper_highlight={
                highlight_item_id_index === paper.id || highlight_item_id_index === index
              }
            />
          );
        })}
    </div>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(PublicationList);
