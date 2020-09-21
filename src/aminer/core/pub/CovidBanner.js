import * as React from 'react';
import styles from './CovidBanner.less';

const MenuSvg = props => (
  <svg viewBox="0 0 1024 1024" width="300" height="200" {...props}>
    <defs>
      <style type="text/css"></style>
    </defs>
    <path d="M0 853.3504h1536V1024H0v-170.6496z m0-426.7008h1536v170.7008H0V426.6496zM0 0h1536v170.6496H0V0z"></path>
  </svg>
)

export default class CovidBanner extends React.Component {
  urls = [
    {
      url: 'https://covid-19.aminer.cn',
    },
    {
      url: 'https://2019-ncov.aminer.cn/data',
    },
    {
      url: 'https://2019-ncov.aminer.cn',
    },
    {
      url: 'https://www.aminer.cn/ncp-pubs',
    },
    {
      url: 'https://zhengce.aminer.cn/',
    },
    {
      url: 'https://www.newsminer.net/daily/',
      target: '_blank'
    },
    {
      url: 'https://aminerofficials.github.io/',
      target: '_blank'
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
      totalW: null,
    }

    this.openUrl = this.openUrl.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      totalW: document.body.offsetWidth
    })
  }

  handleMenuClick() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  handleMenuItemClick(index) {
    this.setState({ menuVisible: false });
    this.openUrl(index);
  }

  openUrl(index) {
    let url = this.urls[index];
    url.target ? window.open(url.url, url.target) : window.location.href = url.url;
  }

  render() {
    const main = this.props.main || false;
    const title = this.props.title;
    return (
      <div className={styles.covid_banner}>
        <div className="titlebar">
          {/* <img className="logo1" onClick={() => window.open('http://www.ckcest.cn/', '_blank')} src={require("./images/ckcest_home.png")} />
          <span className="logo_line"></span>
          <img className="logo2" onClick={() => window.open('http://aminer.cn', '_blank')} src={require("./images/aminer_logo.png")} /> */}
          <div className='menu'>
            <div className='menu_item' onClick={() => this.openUrl(0)}>首页</div>
            <div className='menu_item' onClick={() => this.openUrl(1)}>趋势预测</div>
            <div className='menu_item' onClick={() => this.openUrl(2)}>专家学者</div>
            <div className='menu_item' onClick={() => this.openUrl(3)}>学术成果</div>
            <div className='menu_item' onClick={() => this.openUrl(4)}>政策地图</div>
            <div className='menu_item' onClick={() => this.openUrl(5)}>疫情日报</div>
            <div className='menu_item' style={{ minWidth: '170px' }} onClick={() => this.openUrl(6)}>冠状/流感病毒知识集锦</div>
            {/* <div className='menu_item_highlight' onClick={() => this.openUrl(5)}>中医专题</div> */}
          </div>
          <div className='menu_m' onClick={this.handleMenuClick}>
            <MenuSvg className='menu_svg' />
          </div>
        </div>
        {
          this.state.menuVisible && (
            <div className='menu_box'>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(0)}><div>首页</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(1)}><div>趋势预测</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(2)}><div>专家学者</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(3)}><div>学术成果</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(4)}><div>政策地图</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(5)}><div>疫情日报</div></div>
              <div className='menu_box_item' onClick={() => this.handleMenuItemClick(6)}><div>冠状/流感病毒知识集锦</div></div>
              {/* <div className='menu_box_item' onClick={() => this.handleMenuItemClick(5)}><div>中医专题</div></div> */}
            </div>
          )
        }
        {/* <div className='banner'>
          <img
            className="banner_img"
            src={main ? require(totalW >= 560
              ? "./images/banner.jpg"
              : "./images/banner_mobile.jpg") : require('./images/banner_sub.jpg')}
          />
          {
            !main && (
              <div className='banner_content'>
                <div className='banner_text1'>AMiner疫情专题</div>
                <div className='banner_text2'>{title}</div>
              </div>
            )
          }
        </div> */}
      </div>
    )
  }
}
