/**
 * Created by GaoBo on 2018/04/16.
 *
 * Experts' path-finding page.
 */
import React, { useState, useEffect } from 'react';
import { page, connect } from 'acore';
import { Layout } from 'layouts';
import helper from 'helper';

import { Button } from 'antd';
// import { formattedmessage as FM, FormattedDate as FD } from 'react-intl';
import { PersonSelectorPair } from 'components/person';
import { Loading } from 'components/ui';
import PersonPaths from 'components/person/path/PersonPaths';
import PersonPathSort from 'components/person/path/PersonPathSort';
import styles from './index.less';


// 53f46a3edabfaee43ed05f08 jie tang
// 560766c045cedb3396aa536d 扬子的朋友
// ?id1=53f46a3edabfaee43ed05f08&id2=560766c045cedb3396aa536d

const ThePage = props => {
  const { id1, id2 } = helper.parseUrlParam(props, {}, ['id1', 'id2'])

  const [conditions, setConditions] = useState({
    sortIndex: 0,
    sort: ['step_asc', 'hindex_desc'],
    count: 10,
  })

  console.log('object', id1, id2)

  const findPath = () => {
    const { sort, count } = conditions || {};
    if (id1 !== id2 && id1 && id2) {
      console.log('object0---------------------')
      props.dispatch({ type: 'personpath/findPath', payload: { id1, id2, n: count, sort } })
        .then(success => {
          if (success) {
            props.dispatch({ type: 'personpath/fillPersons' });
          }
        });
    }
  }

  useEffect(() => {
    findPath()
  }, [id1, id2, conditions])


  // * ---- Actions ---------------------------------------------

  // type is 'left' or 'right'
  const onPersonSelect = (type, id, person) => {
    console.log('debug: onPersonSelect', type, id, person);
  };

  // when any id changes and both has values, chagne url.
  const onShoudAction = (newid1, newid2, person1, person2) => {
    console.log(newid1, id1)
    console.log(newid2, id2)
    // TODO change to routeTo
    if (newid1 !== id1 || newid2 !== id2) {
      helper.routeTo(props, { id1: newid1, id2: newid2 }, null);
    }
  };

  const onChange = (sortIndex, count, sort) => {
    setConditions({ sortIndex, count, sort }); // after findPath()
  };

  const { personpath, load } = props;
  const { paths } = personpath;
  const { sortIndex, sort, count } = conditions || {};

  return (
    <Layout searchZone={[]} classNames2={['newskin']} contentClass={styles.personPath}>
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <h1>Finding Relations Between Experts</h1>
        </div>

        <PersonSelectorPair
          id1={id1} id2={id2}
          middleSeparator={<div className={styles.vs}> &gt; </div>}
          onPersonSelect={onPersonSelect}
          onShoudAction={onShoudAction}
        />

        <div>
          <PersonPathSort
            display={paths != null} count={count} sort={sortIndex} loading={load}
            onChange={onChange}
          />

          {load && <p>学者路径正在计算中，请耐心等候！</p>}
          {!paths && !load && <p>请选择需要查找的人!</p>}
          {paths && (
            <div className={styles.pathArea}>
              {load && <Loading />}
              <PersonPaths paths={paths} sortIndex={sortIndex} />
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}

// ThePage.getInitialProps = async ({ store, route, isServer, location, res, req }) => {
// }

export default page(
  connect(({ personpath, loading }) => ({
    personpath,
    load: loading.effects['personpath/findPath'],
  })),
)(ThePage);
