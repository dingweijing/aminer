/*
 * @Author: your name
 * @Date: 2019-12-05 14:13:04
 * @LastEditTime: 2019-12-09 11:15:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/aminer/p/conference/PersonVote.js
 */
import React from 'react';
import { component, connect } from 'acore';
import { Button, message } from 'antd';
import { FM } from 'locales';
import styles from './PersonVote.less';
import { formatMessage } from '@/locales';

const PersonVote = props => {
  const { pid, index, aid, dispatch, afterVote } = props;

  const votePerson = () => {
    dispatch({
      type: 'conference/AuthorsVote',
      payload: {
        pid, aid, index: index - 0
      }
    }).then(stat => {
      if (stat) {
        message.success(formatMessage({ id: 'aminer.common.vote.success', defaultMessage: 'Vote Success' }))
        // TODO: postmessage
        window.top.postMessage('votePersonTrue', '*');
        afterVote && afterVote(aid);
      }
    })
  }

  return (
    <Button onClick={votePerson}>
      <FM id="aminer.common.vote" defaultMessage="Vote" />
    </Button>
  )
}

export default component(connect())(PersonVote)
