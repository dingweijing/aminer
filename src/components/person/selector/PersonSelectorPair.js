/**
 *  Created by BoGao on 2018-03-28;
 *  Refactor by BoGao on 2018-07-4;
 */
import React, { useState, useEffect } from 'react';
import { connect, component } from 'acore';
import PersonSelector from './PersonSelector';
import styles from './PersonSelectorPair.less';

const PersonSelectorPair = props => {
  const {
    id1, id2,
    onPersonSelect, // (left|right, id, person)
    onShoudAction, // 两个id都有值时调用。(id1, id2, person1, person2)
  } = props;


  const [stateId1, setStateId1] = useState(id1);
  const [stateId2, setStateId2] = useState(id2);
  const [person1, setPerson1] = useState();
  const [person2, setPerson2] = useState();

  // const loadPerson = (id1, id2, callback) => {

  // }

  useEffect(() => {
    const { dispatch } = props;
    if (stateId1 || stateId2) {
      // get data
      dispatch({ type: 'person/getPersonPair', payload: { id1: stateId1, id2: stateId2, pure: true } })
        .then(data => {
          const [p1, p2] = data;
          // setStateId1();
          // setStateId2();
          setPerson1(p1);
          setPerson2(p2);
          if (onShoudAction) {
            onShoudAction(stateId1, stateId2, p1, p2);
          }
        })
        .catch(error => {
          setPerson1(null);
          setPerson2(null);
          throw error;
        });
    }
  }, [stateId1, stateId2])

  // useEffect(() => {

  // }, [id1, id2])

  useEffect(() => {
    if (onPersonSelect) {
      onPersonSelect('left', id1, person1);
    }
  }, [setStateId1])

  useEffect(() => {
    if (onPersonSelect) {
      onPersonSelect('right', id2, person2);
    }
  }, [setStateId2])


  // * ---- Methods --------------------

  const onPersonSelectLeft = (id, person) => {
    if (id) {
      setStateId1(id);
      setPerson1(person);
    }
  };

  const onPersonSelectRight = (id, person) => {
    if (id) {
      setStateId2(id);
      setPerson2(person);
    }
  };


  const { className, middleSeparator } = props;
  // console.log('>>>>>>>>>>>>', person1, person2)

  return (
    <div className={styles.personSelectorPair}>
      <div className={styles.left}>
        <PersonSelector person={person1} onSelect={onPersonSelectLeft} />
      </div>

      <div className={styles.vs}>
        {middleSeparator}
      </div>

      <div className={styles.right}>
        <PersonSelector person={person2} onSelect={onPersonSelectRight} />
      </div>
    </div>
  );
}


export default component(
  connect()
)(PersonSelectorPair);
