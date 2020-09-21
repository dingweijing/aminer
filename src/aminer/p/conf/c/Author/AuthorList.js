import React, { useEffect, useState, useRef } from 'react';
import { connect, Link, P, history, component } from 'acore';
import PropTypes from 'prop-types';
// import { FM, zhCN, formatMessage } from 'locales';
import { classnames } from 'utils';

// import { getProfileUrl } from 'utils/profile-utils';

// import display from 'utils/display';
// import { Hole } from 'components/core';
// import helper from 'helper';
// import smallcard from 'helper/smallcard-test';
// import smallcard from 'helper/smallcard';
// import { Tooltip }from 'antd';

import { useImageLazyLoad } from 'utils/hooks';
// import { PersonFollow, SimilarPerson, SmallCard } from 'aminer/core/search/c/widgets';
import SingleAuthor from './SingleAuthor';
import styles from './AuthorList.less';

const AuthorList = props => {
  useImageLazyLoad();
  // const smallCard = useRef();
  const cid = useRef(props.id || Math.random());
  const { onSearchQuery } = props;
  const { persons, dispatch } = props;

  const { showViews, showBind, className, showAuthorCard, scholarsDynamicValue, label } = props;
  const { personZone, contentRankZone, authorBlockClick } = props;

  return (
    <div id={`${cid.current}_ROOT`} className={classnames(styles[className], styles.personList)}>
      {/* {showAuthorCard && <SmallCard className="newTemp" onRef={onRef} id={cid.current} />} */}

      {persons &&
        persons.length > 0 &&
        persons.map((item, index) => {
          const { person, ...others } = item;

          if (!person) {
            return false;
          }
          // const dynamic = (scholarsDynamicValue && scholarsDynamicValue[person.id]) || {};

          return (
            <SingleAuthor
              key={person.id}
              index={index}
              person={person}
              others={others}
              personZone={personZone}
              authorBlockClick={authorBlockClick}
              contentRankZone={contentRankZone}
            />
          );
        })}
    </div>
  );
};
AuthorList.propTypes = {
  // showViews: PropTypes.bool,
  // showBind: PropTypes.bool,
  // imgSrcWidth: PropTypes.string,
  // showAuthorCard: PropTypes.bool,
  // enableImgLazyLoad: PropTypes.bool,
  // plugins: PropTypes.any,
  // contentLeftZone: PropTypes.array,
};
AuthorList.defaultProps = {
  // showViews: true,
  // showBind: true,
  // imgSrcWidth: '240',
  // showAuthorCard: true,
};

export default component(
  connect(({ auth, aminerAI10 }) => ({
    // searchperson,
    // results: searchperson.results,
    // infocards: aminerSearch.infocards,
    user: auth.user,
    scholarsDynamicValue: aminerAI10.scholarsDynamicValue,
  })),
)(AuthorList);
