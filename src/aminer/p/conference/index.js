import React, { Component, useState, useEffect, useMemo } from 'react';
import { connect, history, withRouter, page } from 'acore';
import { Layout } from 'aminer/layouts';
import { formatMessage } from 'locales';
import helper from 'helper';
import cookies from 'utils/cookie';
import strings from 'utils/strings';
import { NE } from 'utils/compare';
import { Modal as AModal } from 'aminer/components/widgets';
import {
  SearchKnowledge,
  SearchPaperComponentDynamic as SearchPaperComponent,
  SearchComponentDynamic as SearchComponent,
  SearchGCTComponentDynamic as SearchGCTComponent,
  SearchNewsComponentDynamic as SearchNewsComponent,
} from 'aminer/core/search/c';

// import PersonList from 'pages/aminer/components/PersonList'
import { Tabs, Button } from 'antd';
import PersonVote from './PersonVote';
import styles from './index.less';

const timer = null;

const schema = [
  'id',
  'name',
  'name_zh',
  'name_zh',
  'avatar',
  'tags',
  'tags_translated_zh',
  'is_follow',
  'num_view',
  'num_follow',
  'is_upvoted',
  'num_upvoted',
  'is_downvoted',
  'bind',
  { profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh'] },
  {
    indices: [
      'hindex',
      'gindex',
      'pubs',
      'citations',
      'newStar',
      'risingStar',
      'activity',
      'diversity',
      'sociability',
    ],
  },
];

const SearchPage = props => {
  // const [type, setType] = useState(props.match.params.type || 'person');
  const type = props.match.params.type || '';
  const [queryObj, setQueryObj] = useState({
    query: '',
    advanced: null,
  });

  const { dispatch, topic, location } = props;

  const {
    match: {
      params: { pid, name },
    },
    location: {
      query: { index },
    },
  } = props;

  const [votes, setVotes] = useState([]);

  const GetUsrVoted = () => {
    dispatch({
      type: 'conference/GetUsrVoted',
      payload: {
        pid,
        index: index - 0,
      },
    }).then(res => {
      if (res) {
        setVotes(res);
      }
    });
  };

  useEffect(() => {
    GetUsrVoted();
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const query = {
      query: name,
      advanced: null,
    };
    setQueryObj(query);
  }, [name]);

  const params = {
    // query, TODO
    query: queryObj,
    showHeader: false,
    showFooter: false,
  };

  const afterVote = vote_aid => {
    const newVotes = [...votes];
    newVotes.push(vote_aid);
    setVotes(newVotes);
  };

  return (
    <Layout classNames={styles.layout} className="home" {...params}>
      <article className={styles.article}>
        <SearchComponent
          query={queryObj}
          schema={schema}
          className="aminer"
          listZone={{
            target: "_blank",
            contentLeftZone: [],
            contentBottomZone: [],
            contentRightZone: [
              ({ person, id }) => (
                <div key={person.id}>
                  {!votes.includes(person.id) && (
                    <PersonVote pid={pid} index={index} aid={person.id} afterVote={afterVote} />
                  )}
                  {votes.includes(person.id) && <></>}
                </div>
              ),
            ],
          }}
        />
      </article>
    </Layout>
  );
};

SearchPage.getInitialProps = async ({ isServer, history }) => {
  if (!isServer) { return }
  // eslint-disable-next-line consistent-return
  const { location } = history || {};
  return { location };
};

export default page(
  connect(({ search }) => ({
    topic: search.topic,
  })),
)(SearchPage);
