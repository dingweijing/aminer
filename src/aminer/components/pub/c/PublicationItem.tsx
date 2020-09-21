import React from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';

import { Hole } from 'components/core';
import {
  PaperMark,
  PaperVoteV2,
  PaperCollect,
  MustReadEdit,
  MustReadDelete,
} from 'aminer/core/search/c/widgets';
import { getLangLabel } from 'helper';
import pubHelper from 'helper/pub';
import { MarkPub } from 'aminer/components/widgets';
import { PubInfo, PubListZoneType, PubAuthor } from 'aminer/components/pub/pub_type';
import { CitedPart, BibtexPart, ViewPart, UrlPart, LabelPart } from 'aminer/core/pub/widgets/info';
import { highlight } from 'utils/hooks';
import { Title, Authors } from './index';
import styles from './PublicationItem.less';

interface Proptypes {
  // dispatch: (config: { type: string; payload: { params: any } }) => Promise<any>;
  paper: PubInfo;
  paper_index: number;
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
  showAuthorCard: boolean;
  authorTarget: string;
  onAuthorClick: (author: PubAuthor) => void;
  showSearchWithNoId: boolean;
  titleLinkDomain: string | boolean;
  titleLinkQuery: {
    query?: {
      [key: string]: string;
    };
    [param: string]: any;
  };
  titleTarget: string;
  onClickTitle: (paper: PubInfo) => void;
  isShowPdfIcon: boolean;
  additionalParams: object;
}

const PresetInfoLine = {
  cited_num: CitedPart,
  bibtex: BibtexPart,
  view_num: ViewPart,
  url: UrlPart,
  label: LabelPart,
  paper_vote: PaperVoteV2,
  paper_collect: PaperCollect,
  must_read_edit: MustReadEdit,
  must_read_delete: MustReadDelete,
};

const PublicationItem = (props: Proptypes) => {
  const { paper, itemClass, paper_index, additionalParams } = props;

  const { contentLeftZone, contentRightZone, abstractZone, keywordsZone, venueZone } = props || {};
  const {
    showInfoContent = ['cited_num', 'bibtex', 'view_num', 'url'],
    end,
    abstractLen = 280,
  } = props;
  const { infoRightZone, paper_highlight } = props;

  const { highlightWords } = props;

  const {
    authorsZone,
    highlightAuthorIDs,
    isAuthorsClick,
    authorTarget,
    onAuthorClick,
    showSearchWithNoId,
    showAuthorCard = true,
    cardBottomZone,
  } = props;

  const {
    titleLeftZone,
    titleRightZone,
    titleLinkDomain,
    titleLinkQuery,
    titleTarget,
    onClickTitle,
    isShowPdfIcon,
  } = props;

  return (
    <div
      className={classnames('paper-item', styles.paperItem, itemClass, {
        end: !!end,
        'paper-item-highlight': paper_highlight,
      })}
      id={`pid_${paper.id}`}
    >
      <Hole
        name="PaperList.contentLeftZone"
        fill={contentLeftZone}
        defaults={defaultZones.contentLeftZone}
        param={{ paper, index: paper_index, additionalParams }}
        config={{ containerClass: 'content-left' }}
      />

      <div className="content">
        <Title
          paper={paper}
          index={paper_index}
          titleLeftZone={titleLeftZone}
          titleRightZone={titleRightZone}
          isShowPdfIcon={isShowPdfIcon}
          highlightWords={highlightWords}
          titleLinkDomain={titleLinkDomain}
          titleLinkQuery={titleLinkQuery}
          titleTarget={titleTarget}
          onClickTitle={onClickTitle}
        />

        <Hole
          name="PaperList.authorsZone"
          fill={authorsZone}
          defaults={defaultZones.authorsZone}
          param={{
            paper,
            showAuthorCard,
            authorTarget,
            isAuthorsClick,
            onAuthorClick,
            highlightAuthorIDs,
            index: paper_index,
            showSearchWithNoId,
            cardBottomZone,
          }}
          config={{ containerClass: 'authors-zone' }}
        />

        {/* {!authorsZone && renderAuthors(paper)} */}

        {/* {showConfLine && renderConfLine()} */}
        <Hole
          name="PaperList.venueZone"
          fill={venueZone}
          defaults={defaultZones.venueZone}
          param={{ paper, index: paper_index }}
          config={{ containerClass: 'conf-info-zone' }}
        />

        <Hole
          name="PaperList.abstractZone"
          fill={abstractZone}
          defaults={defaultZones.abstractZone}
          param={{ paper, abstractLen, highlightWords, index: paper_index }}
          config={{ containerClass: 'abstract-zone' }}
        />

        <Hole
          name="PaperList.keywordsZone"
          fill={keywordsZone}
          defaults={[]}
          param={{ paper, index: paper_index }}
          config={{ containerClass: 'keywords-zone' }}
        />

        <div className="oprs">
          {showInfoContent &&
            showInfoContent.length > 0 &&
            showInfoContent.map((item, i) => {
              // showInfoContent
              let Component = null;
              let params = null;

              if (typeof item === 'string') {
                Component = PresetInfoLine[item];
              } else if (typeof item === 'object' && PresetInfoLine[item?.name]) {
                Component = PresetInfoLine[item?.name];
                params = item.props || {};
              } else {
                return item;
              }

              // else if (typeof item === 'function' && React.isValidElement(item())) {
              // }

              return <Component key={item.name || item} paper={paper} {...params} />;
            })}
          <Hole
            name="PaperList.infoRightZone"
            fill={infoRightZone}
            defaults={[]}
            param={{ paper, index: paper_index }}
            config={{ containerClass: 'info-right-zone' }}
          />
        </div>
      </div>

      <Hole
        name="PaperList.contentRightZone"
        fill={contentRightZone}
        defaults={defaultZones.contentRightZone}
        param={{ paper, index: paper_index }}
        config={{ containerClass: 'content-right' }}
      />
    </div>
  );
};

export default component(connect())(PublicationItem);

const chop = (text: string, size: number) => {
  if (text) {
    return text.length > size ? `${text.substring(0, size)}...` : text;
  }
  return '';
};

const defaultZones = {
  contentLeftZone: [],
  contentRightZone: [
    ({ paper }: { paper: PubInfo }) => <MarkPub size="small" key={5} paper={paper} />,
  ],
  abstractZone: [
    ({
      paper,
      abstractLen,
      highlightWords,
    }: {
      paper: PubInfo;
      abstractLen: number;
      highlightWords: string[];
    }) => {
      const { abstract, abstract_zh } = paper;
      return (
        <div
          className="abstract"
          key={6}
          dangerouslySetInnerHTML={{
            __html: highlight(
              chop(getLangLabel(abstract, abstract_zh), abstractLen),
              highlightWords,
            ),
          }}
        ></div>
      );
    },
  ],
  authorsZone: [
    ({
      paper,
      showAuthorCard,
      authorTarget,
      isAuthorsClick,
      onAuthorClick,
      highlightAuthorIDs,
      index,
      showSearchWithNoId,
      cardBottomZone,
    }: {
      paper: PubInfo;
      authorTarget: HTMLElement;
      showAuthorCard: boolean;
      isAuthorsClick: boolean;
      showSearchWithNoId: boolean;
      onAuthorClick: () => void;
      highlightAuthorIDs: string[];
      index: number;
      cardBottomZone: PubListZoneType;
    }) => {
      return (
        <Authors
          key={16}
          paper={paper}
          paper_index={index}
          showAuthorCard={showAuthorCard}
          isAuthorsClick={isAuthorsClick}
          onAuthorClick={onAuthorClick}
          authorTarget={authorTarget}
          cardBottomZone={cardBottomZone}
          highlightAuthorIDs={highlightAuthorIDs}
          showSearchWithNoId={showSearchWithNoId}
        />
      );
    },
  ],
  venueZone: [
    ({ paper }: { paper: PubInfo }) => {
      const { venue, pages, year } = paper;

      const { venueName, venueNameAfter } = pubHelper.getDisplayVenue(venue, pages, year);
      return (
        <div className="venue-line" key={26}>
          {venueName}
          {venue && <span>{venueNameAfter}</span>}
        </div>
      );
    },
  ],
};
