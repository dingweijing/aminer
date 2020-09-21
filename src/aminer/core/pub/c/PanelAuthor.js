/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, Fragment } from 'react';
import { component, connect, Link } from 'acore';
import { Panel } from 'aminer/ui/panel';
import getPixels from 'get-pixels';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import classnames from 'classnames';
import display from 'utils/display';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import PubAuthorList from './PubAuthorList';
import styles from './PanelAuthor.less';
import consts from '@/consts';

const { Pub_Authors_FirstShow, Pub_Authors_ShowMore, Pub_Authors_TinyShow } = sysconfig

// * --------------------------------------------
// * Prepare Data.
// * --------------------------------------------
const getPanelAuthorsData = async ({ dispatch, authors }) => {
  if (!authors) {
    return;
  }

  const ids = authors.slice(0, Pub_Authors_ShowMore).filter(author => author.id).map(author => author.id)
  if (ids.length === 0) {
    return authors.slice(0, Pub_Authors_ShowMore);
  }

  const data = await dispatch({
    type: 'person/getPersons',
    payload: { mode: 'profile', pure: true, ids, schema: ['id', 'name', 'name_zh', 'avatar'] }
  });

  // Keep order
  const datamap = {}
  const newAuthors = []

  for (const a of data) {
    datamap[a.id] = a
  }
  for (const a of authors.slice(0, Pub_Authors_ShowMore)) {
    if (a.id && datamap[a.id]) {
      newAuthors.push({ ...datamap[a.id], name: a.name })
    } else {
      newAuthors.push(a)
    }
  }

  // TODO @xiaoxuan 改成能用的。使用umi-request 代替 http.
  if (!consts.IsServerRender()) {
    for (const author of newAuthors) {
      const avatar = author && display.personAvatar(author.avatar, 0);
      const extEndUrl = avatar.replace(/!.*\b/, '');
      try {
        const shape = await getImageType(extEndUrl);
        author.shape = shape;
      } catch (e) {
        console.warn(e);
      }
    }
  }
  
  return newAuthors;
}

// * --------------------------------------------
// * Component
// * --------------------------------------------
const PanelAuthor = props => {
  const { dispatch, pid, withPanel, authors, subStyle = 'normal', onUnfold } = props;

  const [syncPid, setSyncPid] = useState(props.syncPid);
  const [authorsData, setAuthorsData] = useState(props.authorsData);

  const [showNum, setShowNum] = useState(Pub_Authors_FirstShow);

  useEffect(() => {
    if (syncPid !== pid) {
      // if (!authorsData) {
      getPanelAuthorsData({ dispatch, authors }).then(newAuthors => {
        setSyncPid(pid)
        setAuthorsData(newAuthors)
      })
    }

    return () => {
      dispatch({ type: 'modal/close' });
    }
    // }
  }, [pid])

  const showModal = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.author.all', defaultMessage: 'All Author' }),
        content: <AllAuthors authors={authors} />
      }
    })
  }

  const showMore = () => {
    if (showNum === Pub_Authors_FirstShow) {
      setShowNum(Pub_Authors_ShowMore);
    }
    if (showNum === Pub_Authors_ShowMore) {
      showModal()
    }
  }

  const onUnfoldEvent = () => {
    if (onUnfold) {
      onUnfold('normal');
    }
  }
  console.log('showNum', showNum);
  const content = () => (
    <div className={styles.content}>
      {subStyle === 'tiny' && authorsData && (
        <div className={styles.authorTiny}>
          {authorsData.slice(0, Pub_Authors_TinyShow).map((author, index) => {
            const avatar = author && display.personAvatar(author.avatar, 0, 90);
            const authorlink = getProfileUrl(author.name, author.id)

            return (
              <div className={styles.imageBox} key={index}>
                <ExpertLink author={author}>
                  <a target="_black" href={authorlink}>
                    <img className={classnames({ [styles.autoWidth]: author.shape })} src={avatar} alt="" />
                  </a>
                </ExpertLink>
              </div>
            )
          })}
          {authors && authors.length > 0 && (
            <div className={styles.sqmore} onClick={onUnfoldEvent}>
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      )}

      {subStyle === 'normal' && (
        <>
          {authorsData && (
            <div>
              <PubAuthorList
                className="small"
                personList={authorsData.slice(0, showNum)}
                contentLeftZone={[]}
                contentRightZone={[]}
                contentBottomZone={[]}
                showViews={false}
                showBind={false}
              />
              {authors && authors.length < showNum && (
                <div className={styles.more} onClick={showMore}>
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  if (withPanel) {
    return (
      <Panel
        title={formatMessage({ id: 'aminer.paper.author', defaultMessage: 'Author' })}
        className={styles.x}
        subContent={content}
      // tiny="normal"
      />
    )
  }
  // const hide = false;
  // return content({ subStyle: hide ? 'tiny' : 'normal', onUnfold: () => { } });
  return content();
}

export default component(
  connect(({ auth }) => ({
    user: auth.user
  }))
)(PanelAuthor);

export { getPanelAuthorsData }

const AllAuthors = props => {
  const { authors } = props;
  return (
    <div className="paperPanelAuthor">
      <div className="inner">
        <div className="content">
          {authors && authors.map(author => {
            const { name, name_zh, id } = author;
            const authorlink = getProfileUrl(name, id)
            return (
              <Fragment key={id}>
                {id && (
                  <ExpertLink author={author}>
                    <Link className="name" to={authorlink}>{name || name_zh || ''}</Link>
                  </ExpertLink>
                )}
                {!id && (
                  <span className="name">{name || name_zh || ''}</span>
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
