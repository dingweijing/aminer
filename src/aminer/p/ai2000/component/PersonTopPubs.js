import React, { useMemo, Fragment, useState } from 'react';
import { component, connect, Link, withRouter } from 'acore';
import { classnames } from 'utils';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { FM, formatMessage } from 'locales';
import PropTypes from 'prop-types';
import { sysconfig } from 'systems';
import display from 'utils/display';
// import { Spin } from 'aminer/components/ui';
import PaperList from 'aminer/components/pub/PublicationList.tsx';
import { Spin } from 'antd';
import styles from './PersonTopPubs.less';

const { AI2000_Default_Year } = sysconfig;

const PersonTopPubs = props => {
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pubs, setPubs] = useState(null);

  const { dispatch, location, match } = props;
  const { pubs: papers, label } = props;
  const { domain_id, pid, citation } = props;

  // const { pubs, label } = props;
  // const { pid, citation } = props;
  const { pathname } = location;

  const {
    params: { type, position, year },
  } = match;
  // console.log('papers', papers)
  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);
  const personPapers = papers || pubs;

  const searchType = useMemo(() => {
    return pathname.startsWith('/ai2000') ? 'AI 2000' : 'AI ALL';
  }, [pathname]);

  const getTopPubs = id => {
    if (!personPapers) {
      setLoading(true);
      dispatch({
        type: 'aminerAI10/GetAuthorPubs',
        payload: {
          domain: domain_id,
          // recent_10: pathname.startsWith('/ai2000'),d
          type: searchType,
          year: y,
          top_n: 100,
          // skipcache: true,
          authors: [pid],
        },
      }).then(data => {
        setPubs(data);
        setFlag(!flag);
        setLoading(false);
      });
    } else {
      setFlag(!flag);
    }
  };
  // console.log('pubs', pubs)
  return (
    <div className={styles.personTopPubs}>
      <div className={classnames('opr', { choose: !!pubs })}>
        <div className="pubBtn" onClick={getTopPubs.bind(null, pid)}>
          {!label && (
            <span>
              <FM id="ai10.person.pub.select" defaultMessage="Pubs" />
              <FM id="aminer.common.colon" defaultMessage=": " />
              {citation}
            </span>
          )}
          {label && <span>{label}</span>}
          {!flag && <i className="fa fa-angle-down" />}
          {flag && <i className="fa fa-angle-up" />}
        </div>
        <Spin spinning={loading} size="small" />
      </div>

      {flag && personPapers && personPapers.length > 0 && (
        <div className="pubList">
          {/* <FM id='aminer.person.similar.experts' defaultMessage='Similar Experts' /><span>:</span> */}
          <PaperList
            // className="profile"
            // showAuthorCard={false}
            className="ai10_author_list"
            id="ai10PersonTopPubs"
            papers={personPapers}
            showInfoContent={['cited_num']}
            contentRightZone={[]}
            highlightAuthorIDs={[pid]}
          />
        </div>
      )}
      {flag && pubs && pubs.length === 0 && (
        <FM id="com.PersonList.message.noResults" defaultMessage="No Results" />
      )}
    </div>
  );
};
PersonTopPubs.propTypes = {
  // label: PropTypes.string,
};
PersonTopPubs.defaultProps = {
  // label: formatMessage({ id: 'ai10.person.pub.select' }),
};
export default component(withRouter, connect())(PersonTopPubs);
