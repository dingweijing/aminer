import React from 'react';
import { connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { parseMatchesParam, parseUrlParam } from "helper";


@connect()
export default class pname extends React.Component {

  componentWillMount() {
    const { name } = parseMatchesParam(this.props, {}, ['name']);
    const host = window && window.location ? window.location.origin : '';
    // const { host } = parseUrlParam(this.props, {}, ['host']);
    // const { name } = helper.getMatchParams(this.props);
    // const { host } = helper.getSearchParams(this.props);
    const { dispatch } = this.props;
    if (name) {
      dispatch({
        type: "person/getProfile",
        payload: { short_name: name },
      }).then((data) => {
        if (data) {
          window.location.href = `${host}/profile/${data.name}/${data.id}`;
          // window.location.href = `${window.location.protocol}//${host}/profile/${data.name}/${data.id}`;
        }
      });
    }

  }

  render() {
    return (
      <Layout searchZone={[]} showNavigator={false} logoZone={[]}>
      </Layout>
    );
  }
}
