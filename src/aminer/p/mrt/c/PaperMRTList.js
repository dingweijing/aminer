import React, { } from 'react';
import { connect, Link, component, history } from 'acore';
import { Button, message } from 'antd';
import { isLogin } from 'utils/auth';
import pubHelper from 'helper/pub';

import styles from './PaperMRTList.less';

const PaperMRTList = props => {
  const { mrtList, user, dispatch, onChange } = props;

  if (!mrtList) return <></>; // TODO should return false?

  const getMRTStatus = (status, sponsors, requested) => {
    if (requested !== true) return `Seeking Sponsor (${sponsors.length}/3)`;
    if (requested === true && status === true) return 'Completed';
    if (requested === true && status === false) return 'Failed';
    return 'Calculating';
  }

  const isSponsored = mrtData => {
    if (mrtData && user && mrtData.sponsors.find(item => item === user.id)) return true;
    return false;
  }

  const joinInSponsor = id => {
    if (isLogin(user)) {
      if (id) {
        dispatch({
          type: 'mrt/addPaperMRTSponsor',
          payload: {
            id
          }
        }).then(data => {
          message.success('支持成功');
          history.push(`/mrt/${id}`);
        })
      }
    } else {
      dispatch({ type: 'modal/login' });
    }
  }

  return (
    <div className={styles.PaperMRTList}>
      {mrtList.map(item => {
        const venueName = pubHelper.getDisplayVenueName(item.publication.venue);
        return (
          <div className={styles.paperMRT} key={item.id} onClick={() => history.push(`/mrt/${item.id}`)}>
            {!isSponsored(item) && item.requested !== true && (
              <Button className={styles.sponsorBtn} onClick={(e) => {
                e.stopPropagation()
                joinInSponsor(item.id)}
              }>Sponsor</Button>
            )}
            <div className={styles.title}>
              <div id={`mrt-${item.id}`}>{item.publication.title || item.publication.title_zh}</div>
            </div>
            <div className={styles.authors}>
              {item.publication && item.publication.authors && item.publication.authors.map(author => (
                <span key={author.id || author.name || author.name_zh} className={styles.personName}>
                  {author.name_zh || author.name}
                </span>
              ))}
            </div>
            {venueName && <div className={styles.venueName}>{venueName}</div>}
            <div className={styles.mrtInfoBar}>
              {/* <span>Status: <span className={styles.infoValue}>{getMRTStatus(item.status, item.sponsors, item.requested)}</span></span>
              <span className={styles.split}>|</span> */}
              <span>Popularity: <span className={styles.infoValue}>{item.click_num}</span></span>
              <span className={styles.split}>|</span>
              <span>Likes: <span className={styles.infoValue}>{(item.likes && item.likes.length) || 0}</span></span>
              <span className={styles.split}>|</span>
              <span>Year: <span className={styles.infoValue}>{(item.publication && item.publication.year) || ''}</span></span>
              <span className={styles.split}>|</span>
              <span>Citation: <span className={styles.infoValue}>{(item.publication && item.publication.num_citation) || 0}</span></span>
            </div>
            {item.tree_data && item.tree_data.related_paper_titles &&
              <div className={styles.mrtRelatedPaperTitles}>
                <h4>Related Papers</h4>
                {item.tree_data.related_paper_titles.map((title, idx) => <p key={idx}>{`- ${title}`}</p>)}
              </div>
            }
            <div className={styles.graphAuthored}>
              {`MRT Authored By: `}
              {item.sponsor_list && item.sponsor_list.map(item => (
                <span key={`${item.id}`} className={styles.personName}>{item.name}</span>
              ))}
            </div>
            <div className={styles.status}>
              {(item.status === undefined)
                ? ((item.requested === true) ? 'Calculating...' : `Seeking Sponsor ${item.sponsors.length}/3...`)
                : (item.status === true) ? '' : 'Generate Failed.'
              }
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default component(
  connect(({ auth, loading }) => ({
    user: auth.user,
    loading: loading.effects['pub/getPaperMRTBySponsors'],
  }))
)(PaperMRTList);
