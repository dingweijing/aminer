/**
 *  Created by NanGu on 2017-10-17;
 *  aminer在使用这个页面
 */
import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { Tabs } from 'antd';
import AminerPublications from './aminer-publications';
import Information from './PersonInfo';
import Education from './resume/PersonEducation';
import Experience from './resume/PersonExperience';
import Skills from './PersonSkills';
import Bio from './resume/PersonBio';
import AcmCitations from './resume/ACM_Citations';
import styles from './Tabzone.less';

const { TabPane } = Tabs;

const panes = [
  { title: 'Overview', key: '0' },
  { title: 'Papers', key: '1' },
  { title: 'Lectures', key: '2' },
  { title: 'Claim Achievement', key: '3' },
  { title: 'Merge', key: '4' },
  { title: 'Upload', key: '5' },
];

export default
@connect(({ aminerPerson, loading, publications }) => ({
  profile: aminerPerson.profile,
  loading, publications
}))
class TabZone extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  callback = (key) => {
    this.setState({ selected: key });
  };

  render() {
    const { profile } = this.props;
    const { selected } = this.state;
    const totalPubs = profile && profile.indices && profile.indices.num_pubs;
    const TabContent = [
      {
        key: '1',
        content: (
          <div className={styles.content_zone}>
            <div className={styles.left_region}>
              <div><Information profile={profile} /></div>
              <div style={{ marginTop: 20 }} />
              <div><AcmCitations profile={profile} /></div>
              <div style={{ marginTop: 20 }} />
              <div><Education profile={profile} /></div>
              <div style={{ marginTop: 20 }} />
              <div><Experience /></div>
            </div>
            <div className={styles.right_region}>
              <div><Skills profile={profile} /></div>
              <div style={{ marginTop: 20 }} />
              <div><Bio profile={profile} /></div>
            </div>
          </div>
        )
      },
      {
        key: '2',
        content: <AminerPublications personId={profile.id} totalPubs={totalPubs} />,
      },
      {
        key: '3',
        content: <div><p>hi</p></div>,
      },
      {
        key: '4',
        content: <div><p>hi</p></div>,
      },
      {
        key: '5',
        content: <div><p>hi</p></div>,
      },
      {
        key: '6',
        content: <div><p>hi</p></div>,
      },
    ];
    return (
      <div className={styles.tab_zone}>
        <div>
          <Tabs tabPosition="left"
            defaultActiveKey="0"
            onChange={this.callback}
          >
            {panes.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  <div className={styles.content_zone}>
                    <>{TabContent[selected].content}</>
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}

