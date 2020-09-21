import React, { Fragment } from 'react';
import { component, connect, Link } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { getLangLabel } from 'helper';
import { ExpertLink } from 'aminer/components/widgets';
import { authorInitialCap } from 'aminer/core/pub/utils';
import { PubInfo, PubAuthor } from 'aminer/components/pub/pub_type';
import PersonLink from 'aminer/components/pops/person/PersonLink.tsx';
import styles from './Authors.less';

const { PubList_Show_Authors_Max = 12 } = sysconfig;

interface Proptypes {
  // dispatch: (config: { type: string; payload: { params: any } }) => Promise<any>;
  paper: PubInfo;
  // titleLeftZone?: PaperListZoneType;
  // titleRightZone?: PaperListZoneType;
  // isShowPdfIcon?: boolean;
  highlightAuthorIDs?: string[];
  authorTarget?: string;
  // titleLinkDomain?: string | boolean;
  isAuthorsClick: boolean; // 作者是否可以点击
  showAuthorCard: boolean; // 作者是否可以点击
  onAuthorClick: (author: PubAuthor, paper: PubInfo) => void; // 点击作者执行的方法
  paper_index: number;
  showSearchWithNoId: boolean;
}

const PublicationAuthors = (props: Proptypes) => {
  const {
    paper,
    authorTarget = '_blank',
    isAuthorsClick = true,
    showAuthorCard = true,
    onAuthorClick,
    highlightAuthorIDs = [],
    paper_index,
    showSearchWithNoId = true,
    cardBottomZone
  } = props;
  const { authors } = paper;
  // const { pid, sid } = this.state;
  const handleAuthor = (author: PubAuthor) => {
    if (onAuthorClick) {
      onAuthorClick(author, paper);
    }
  };

  const onClickAuthor = (e: React.MouseEvent) => {
    if (!isAuthorsClick) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.authors} key={7}>
      <div className="authors">
        {authors &&
          authors.length > 0 &&
          authors.slice(0, PubList_Show_Authors_Max).map((author, index) => {
            let { name, name_zh } = author;
            name = authorInitialCap(name);
            const name_label = getLangLabel(name, name_zh);

            // const showUnderline = (author.id === sid) && (paper.id === pid);
            const aid = `${author.id || name_label.replace(' ', '_')}`;

            const params = {
              id: `sid_${aid}`,
              className: classnames('author link font-author', {
                highlight: highlightAuthorIDs && highlightAuthorIDs.includes(author.id),
              }),
              to: getProfileUrl(author.name, author.id),
              target: authorTarget,
              onClick: onClickAuthor,
            };

            const ele = (
              <>
                {author.id ? (
                  <span {...params}>
                    {showAuthorCard && <PersonLink author={author} authorTarget={authorTarget} cardBottomZone={cardBottomZone} paper_index={paper_index} paper_id={paper.id} />}
                    {!showAuthorCard && name_label}
                  </span>
                ) : (
                  <span className="no_id">
                    <span {...params} className="no_id_inner">
                      {' '}
                      {showAuthorCard && <PersonLink author={author} authorTarget={authorTarget} cardBottomZone={cardBottomZone} paper_index={paper_index} paper_id={paper.id} />}
                      {!showAuthorCard && name_label}
                      {/* {name_label} */}
                    </span>
                    {showSearchWithNoId && (
                      <Link
                        target="_blank"
                        to={`/search/person/?q=${name_label}`}
                        className="to_search"
                      >
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-search1" />
                        </svg>
                      </Link>
                    )}
                  </span>
                )}
              </>
            );
            return (
              <Fragment key={`${author.id || author.name}`}>
                <>
                  {isAuthorsClick && !onAuthorClick && (
                    <ExpertLink author={author} toLinkNoCover={authorTarget === '_blank'}>
                      {ele}
                      {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                        <span className="mr">,</span>
                      )}
                    </ExpertLink>
                  )}
                  {(!isAuthorsClick || onAuthorClick) && (
                    <span
                      {...params}
                      className={classnames('author font-author', {
                        nolink: !isAuthorsClick && !onAuthorClick,
                        link: !isAuthorsClick && onAuthorClick,
                      })}
                      onClick={handleAuthor.bind(null, author)}
                    >
                      {name_label}
                      {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                        <span className="mr">,</span>
                      )}
                    </span>
                  )}
                </>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default component(connect())(PublicationAuthors);
