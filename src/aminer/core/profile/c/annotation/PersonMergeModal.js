import React, { useEffect, useState, useMemo } from 'react';
import { connect, component } from 'acore';
import { message } from 'antd';
import { Loading } from 'components/ui';
import { ProfileBaseInfoEdit } from 'aminer/core/profile/c';
import { PersonMergeRefer } from './index';
import { getProfileInfo } from 'helper/profile';
import styles from './PersonMergeModal.less';

const outFeild = ['gender', 'name', 'name_zh', 'language']
const PersonMergeModal = props => {
  const { dispatch, pid, checkIds, loading } = props;
  const [person, setPerson] = useState({});

  useEffect(() => {
    if (pid) {
      dispatch({
        type: 'editProfile/getPerson',
        payload: { ids: [pid] }
      }).then((data) => {
        setPerson(data && data[0]);
      })
    }
  }, [pid]);

  const { indices = {}, profile } = person;
  const editInfo = useMemo(() => {
    if (profile) {
      return getProfileInfo(person);
    }
    return {}
  }, [profile])

  const onSubmitInfo = async (e) => {
    const result = await dispatch({
      type: 'editProfile/mergePerson',
      payload: {
        id: pid, // id: '53f642f2dabfaed4d80f3cfc',
        mids: checkIds
      }
    })
    return result;
  }

  const afterEdit = () => {
    dispatch({ type: 'modal/close' });
  }

  return (
    <div className={styles.personMergeModal}>
      <div className={styles.leftZone}>
        <div className={styles.title}>主
          {loading && (
            <span>
              <Loading />
              正在合并
            </span>)}
        </div>
        <ProfileBaseInfoEdit onSubmit={onSubmitInfo} afterEdit={afterEdit} pid={person.id} infoData={editInfo}
          names={{ name: person.name, name_zh: person.name_zh, }} />
      </div>
      <div className={styles.rightZone}>
        <div className={styles.title}>次</div>
        <PersonMergeRefer checkIds={checkIds} />
      </div>
    </div>
  );
}

export default component(connect(({ loading }) => ({
  loading: loading.effects['editProfile/mergePerson']
})))(PersonMergeModal)
