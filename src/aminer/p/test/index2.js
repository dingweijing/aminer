import * as React from 'react';
import { connect, history } from 'acore';

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/queryRests'],
}))
class Home extends React.Component {
  state = {
    address: '当前地址',
  };

  // client and server both call
  static getInitialProps = async ({ store, route, isServer }) => {
    console.log('.... home getInitialProps');
    // new dva ins
    await store.dispatch({
      type: 'home/queryRests',
      payload: {
        offset: 0,
        limit: 8,
        extras: ['activities', 'tags'],
        extra_filters: 'home',
        rank_id: '',
        terminal: 'h5',
      },
      // umi-history not patch server location, will fix
    });
  }

  onSearch = value => {
    console.log('onSearch', value);
  };

  onEndReached = () => {
    const { loading, rank_id } = this.props;
    if (!loading) {
      this.loadRestaurantData(rank_id);
    }
  };

  getImage = hash => {
    const path = `${hash[0]}/${hash.substr(1, 2)}/${hash.substr(3)}`;

    let type = 'jpeg';
    if (path.indexOf('png') > -1) {
      type = 'png';
    }
    return `http://fuss10.elemecdn.com/${path}.${type}`;
  };

  getTypeData = () => {
    try {
      return this.state.headerData[0].entries.map(type => ({
        icon: this.getImage(type.image_hash),
        text: type.name,
      }));
    } catch (error) {
      return [];
    }
  };

  /**
   * 初始化
   * @param {Coordinates} coords 坐标
   */
  init() {
    console.log('------- home.init()')
    this.loadTypeData();
    this.loadPoiData();
    this.loadRestaurantData();
  }

  rests = [];


  /**
   * 加载分类数据
   * @param {Coordinates} coords 坐标
   */
  loadTypeData() {
    const { latitude, longitude } = this.props;
    fetch(
      `/restapi/shopping/openapi/entries?latitude=${latitude}&longitude=${longitude}&templates[]=main_template&templates[]=favourable_template&templates[]=svip_template`,
    )
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({
              headerData: data,
            });
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  /**
   * 加载地理数据
   * @param {Coordinates} coords 坐标
   */
  loadPoiData() {
    const { latitude, longitude } = this.props;
    // poi数据
    fetch(`/restapi/bgs/poi/reverse_geo_coding?latitude=${latitude}&longitude=${longitude}`)
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({
              address: data.name,
            });
          });
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  /**
   * 加载餐厅数据
   * @param {Coordinates} coords 坐标
   * @param {number} rank_id rank id
   */
  loadRestaurantData(rank_id) {
    const { dispatch, rests } = this.props;
    console.log('---rests-', rests);
    dispatch({
      type: 'home/queryRests',
      payload: {
        offset: 0,
        limit: 8,
        extras: ['activities', 'tags'],
        extra_filters: 'home',
        rank_id,
        terminal: 'h5',
      },
    });
  }

  gotoDetail = data => {
    const { coords } = this.props;
    history.push({
      pathname: '/shop',
      query: {
        id: data.id,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  };

  render() {
    // console.log('.........+++++++++++ 我不应该再第一次刷新的时候出现在页面中。')
    return (
      <div>
        ABC-----------
      </div>
    );
  }
}

export default Home;
