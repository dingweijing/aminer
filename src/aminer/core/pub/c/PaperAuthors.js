import React, { useState, Fragment } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { isLogin } from 'utils/auth';
import { useGetFollowsByID } from 'utils/hooks';
import { getProfileUrl } from 'utils/profile-utils';
import display from 'utils/display';
import { ExpertLink, FollowBtn } from 'aminer/components/widgets';
import { PersonFollow } from 'aminer/core/search/c/widgets';
import styles from './PaperAuthors.less';

const showMaxSize = 12;
const PaperAuthors = props => {
  const [more, setMore] = useState(false);
  const { dispatch, user, authorsData, imgSrcWidth = '80' } = props;

  const seeMore = () => setMore(!more);

  useGetFollowsByID(dispatch, isLogin(user), authorsData);

  const renderAuthor = (items, last = false) => {
    return (
      items &&
      items.length > 0 &&
      items.map((person, index) => {
        const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);
        const { name, name_zh, id, profile } = person;
        const nameText = name && name_zh ? `${name} (${name_zh})` : `${name || name_zh || ''}`;
        const { position } = profile || {}; // affiliation
        const authorlink = getProfileUrl(name, id);
        if (!nameText) {
          return null;
        }
        const nameBlock = (
          <>
            {id && (
              <ExpertLink author={person}>
                <Link to={authorlink}>{nameText}</Link>
              </ExpertLink>
            )}
            {!id && (
              <>
                <span className={styles.noIdProfile}>
                  {nameText}
                  <Link
                    target="_blank"
                    to={`/search/person/?q=${nameText}`}
                    className={styles.toSearch}
                  >
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-search1" />
                    </svg>
                  </Link>
                </span>
              </>
            )}
          </>
        );
        if (last) {
          return (
            more && (
              <Fragment key={person.id || nameText}>
                {nameBlock} {index + 1 === items.length ? '. ' : ', '}
              </Fragment>
            )
          );
        }
        return (
          <div className={styles.item} key={person.id || nameText}>
            <img className={styles.avatar} src={avatar} alt={nameText} />
            <div className={styles.right}>
              <div className={styles.title}>{nameBlock}</div>
              {id && <FollowBtn withIcon key={5} entity={person} type="e" />}
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className={styles.paperAuthors}>
      <div className={styles.content}>
        {authorsData && authorsData.length > 0 && renderAuthor(authorsData.slice(0, showMaxSize))}
      </div>
      {authorsData && authorsData.length > showMaxSize && (
        <>
          {renderAuthor(authorsData.slice(showMaxSize), true)}
          <div className={styles.more}>
            <a onClick={seeMore}>
              {more ? (
                <FM id="aminer.common.less" defaultMessage="Less" />
              ) : (
                <FM id="aminer.common.more" defaultMessage="more" />
              )}
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(PaperAuthors);
