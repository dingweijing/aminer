/* eslint-disable no-param-reassign */
import React, { useMemo, useEffect } from 'react';
import { connect, component, withRouter } from 'acore';
import { Layout } from 'aminer/layouts';
import { logtime } from 'utils/log';

// Components

const ThePage = props => {
  const { dispatch, match, currentID } = props;

  const { params: { type, position } } = match;

  const data = useMemo(() => {
    console.log('** create data')
    return { a: 1, b: 2 };
  }, [type]);

  useEffect(() => {
    console.log('-------- page in');
    return () => {
      console.log('-------- page out');
    };
  }, [])


  console.log('+++++++++++ 我不应该再第一次刷新的时候出现在页面中。', type, position);
  // console.log('+++++++++++ match is ', match);
  // console.log('+++++++++++ location is ', props.location);

  return (

    <article>
      <section>
        abcsrstrstars
      </section>
    </article>

  );
};

ThePage.getInitialProps = async ({ store, route, isServer }) => {
  console.log('getInitialProps');
  return Promise.resolve({
    data: {
      title: 'Hello World',
    }
  })
}



export default (ThePage);
