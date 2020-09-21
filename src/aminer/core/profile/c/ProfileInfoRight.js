import React, { Component } from 'react';
import { injectIntl } from 'umi';
import { connect } from 'acore';
import { Tabs, Button, Icon } from 'antd';
import { formatMessage } from 'locales';
import ProfileSimilarAuthors from './ProfileSimilarAuthors';
import ProfileDcore from './ProfileDCore';
import ProfileEgoNetwork from './ProfileEgoNetwork';
import Cooccurence from 'aminer/p/co-occurrence'
import { classnames } from '@/utils';
import styles from './ProfileInfoRight.less'

@connect()
@injectIntl
class ProfileInfoRight extends Component {
  // state = {
  //   selected: 2,
  // };

  // onChangeTab = (key) => {
  //   this.setState({ selected: key });
  // };

  showTrajectory = () => {
    console.log("showTrajectory___________");
  };

  popCoOccurrence = () => {
    const { dispatch, pid } = this.props;
    dispatch({
      type: 'modal/open',
      payload: {
        title: 'Co-occurrence',
        height: '80vh',
        width: '50vw',
        content: <Cooccurence personId={pid} topn={60} />
      }
    });
  }

  render() {
    const { pid } = this.props
    return (
      <div className={styles.RightZone}>
        <div className={styles.Tabconnent}>
          <Tabs type="card"
            defaultActiveKey="1"
            onChange={this.onChangeTab}
          >
            {/* <Tabs.TabPane tab="Similar Authors" key="0">
              <ProfileSimilarAuthors personId={pid} />
            </Tabs.TabPane> */}
            <Tabs.TabPane tab={formatMessage({ id: 'aminer.person.ego_network' })} key="1">
              <ProfileEgoNetwork personId={pid} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="D-Core" key="2">
              <ProfileDcore personId={pid} />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="Co-occurrence" key="3">
              <svg className={classnames('icon', styles.expandIcon)} aria-hidden="true" onClick={this.popCoOccurrence.bind()}>
                <use xlinkHref="#icon-ai224" />
              </svg>
              <Cooccurence personId={pid} topn={20} style={{ width: 363, height: 363 }}  hideText={true}/>
            </Tabs.TabPane> */}
            {/* {panes.map((item) => {
              return (<TabPane tab={item.title} key={item.key} />);
            })} */}

          </Tabs>
          {/* <div className={styles.content_zone}>
            {Tabcontent[selected].content}
          </div> */}
        </div>
        {/* TODO 点击这里打开有一个地图 */}
        {/* <div onClick={this.showTrajectory} className={styles.showTrajectory}>
          <div>
            <img src="/public/images/aminer/show-trajectory.jpg" alt="" />
            <div className={styles.showTrajeText}>Show Trajectory</div>
          </div>
        </div> */}
      </div>
    );
  }
}
export default ProfileInfoRight;
