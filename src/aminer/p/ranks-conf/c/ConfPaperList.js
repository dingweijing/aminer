import React, { PureComponent, Fragment } from 'react';
import { component, connect, Link, P } from 'acore';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import { FM, enUS, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink, PaperPackLink } from 'aminer/components/widgets';
import { authorInitialCap } from 'aminer/core/pub/utils';

import pubHelper from 'helper/pub';
import { Hole, ListTristate } from 'components/core';
import smallcard from 'helper/smallcard';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import { Tooltip } from 'antd';
import { PaperVote, PaperMark, SmallCard } from 'aminer/core/search/c/widgets';
import { Bibtex } from 'aminer/core/pub/widgets';
import { CitedPart, BibtexPart, ViewPart, UrlPart, LabelPart } from 'aminer/core/pub/widgets/info';
import styles from './ConfPaperList.less';

const ConfPaperList = props => {
  const { papers, conference_name } = props;

  return (
    <div className={styles.confPaperList}>
      <PublicationList
        papers={papers}
        showInfoContent={[]}
        authorTarget="_self"
        titleTarget="_self"
        venueZone={[
          ({ paper }) => {
            const { year } = paper;
            return (
              <div className="foryear">
                <span className="name">{conference_name}</span>({year})
              </div>
            );
          },
        ]}
        contentLeftZone={[({ index }) => <span className="paper-index">{index + 1}</span>]}
        contentRightZone={[
          ({ paper }) => <CitedPart n_citation={paper && paper.n_citation} paper={paper} />,
        ]}
      />
    </div>
  );
};

export default component(connect())(ConfPaperList);
