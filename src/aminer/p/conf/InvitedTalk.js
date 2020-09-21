// getSchedule

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Tabs, Collapse } from 'antd';
import { formatMessage, FM } from 'locales';
import { useResizeEffect } from 'helper/hooks';
import { Spin } from 'aminer/components/ui';
import SingleAuthor from 'aminer/p/conf/c/Author/SingleAuthor';
import { KeynoteList } from './component';
import styles from './InvitedTalk.less';

const InvitedTalk = props => {
  const [invited_data, setInvitedData] = useState();

  const { dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'aminerConf/getInvitedTalk',
    }).then(data => {
      setInvitedData(data);
    });
  }, []);

  return (
    <div className={styles.invitedTalkPage}>
      <KeynoteList
        keynotes={invited_data}
        authorsZone={[
          ({ authors }) => {
            const person = authors && authors[0];
            if (!person) {
              return false;
            }
            if (person && !person.id && person.name) {
            return <div className="authors">{person.name}</div>
            }
            return <SingleAuthor className="invited_talk_item" person={person} enableImgLazyLoad={false} />;
          },
        ]}
      />
    </div>
  );
};

export default page(
  connect(({ auth }) => ({
    user: auth.user,
    roles: auth.roles,
  })),
)(InvitedTalk);
