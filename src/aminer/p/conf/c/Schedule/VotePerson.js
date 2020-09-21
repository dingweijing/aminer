import React, { Fragment, useEffect, useState } from 'react';
import { connect, Link, history, FormCreate, component } from 'acore';
import { Form, Input, Button, Popconfirm, message, Pagination } from 'antd';
import * as auth from 'utils/auth';
import { formatMessage, FM } from 'locales';
import { SearchComponentDynamic as SearchComponent } from 'aminer/core/search/c';
import styles from './VotePerson.less';

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

const VotePerson = props => {
  const [votes, setVotes] = useState([]);
  const [queryObj, setQueryObj] = useState({
    query: '',
    advanced: null,
  });
  const { name, pid, index, dispatch } = props;
  const GetUsrVoted = () => {
    dispatch({
      type: 'aminerConf/GetUsrVoted',
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

  const votePersonFun = ({ pid, aid }) => {
    dispatch({
      type: 'conference/AuthorsVote',
      payload: {
        pid, aid, index: index - 0
      }
    }).then(stat => {
      if (stat) {
        message.success(formatMessage({ id: 'aminer.common.vote.success', defaultMessage: 'Vote Success' }))
        const newVotes = [...votes];
        newVotes.push(aid);
        setVotes(newVotes);
      }
    })
  }
  return (
    <div className={styles.votePerson}>
      <p>There are many <span style={{ color: "#0095ff" }}>{name}</span> we found. You can vote on the following scholars to choose the right author.</p>
      <p> When more than 10 users choose a scholar as the author of the paper, the system will confirm that the scholar is the author of the paper.</p>
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
                  <Button onClick={votePersonFun.bind(null, { pid, aid: person.id })}>
                    <FM id="aminer.common.vote" defaultMessage="Vote" />
                  </Button>
                )}
                {votes.includes(person.id) && <></>}
              </div>
            ),
          ],
        }}
      />
    </div>
  );
};

export default component(connect())(VotePerson);
