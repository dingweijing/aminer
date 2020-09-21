import React from 'react';
import { page, connect } from 'acore';
import { Tabs } from 'antd';
import { classnames } from 'utils';
// import { formatMessage, FM, enUS } from 'locales';
import { Spin } from 'aminer/components/ui';
import ConfPaperList from '../Paper/ConfPaperList';
import styles from './MostViewAndLike.less';

const { TabPane } = Tabs;
const SIZE = 10;
const MostViewAndLike = props => {
  // const [viewPubs, setViewPubs] = useState();
  // const [LikePubs, setLikePubs] = useState();
  const { LikePubs, dispatch, id, user, SetOrGetViews, confInfo } = props;

  // useEffect(() => {
  //   dispatch({ type: 'aminerConf/GetMostViewPubs', payload: { id, offset: 0, size: SIZE } }).then(
  //     result => {
  //       setViewPubs(result.data);
  //     },
  //   );
  //   dispatch({ type: 'aminerConf/GetMostLikePubs', payload: { id, offset: 0, size: SIZE } }).then(
  //     result => {
  //       setLikePubs(result);
  //     },
  //   );
  // }, [id]);

  const MostViewLeftZone = type => {
    return [
      ({ paper, index }) => (
        <div className={styles.leftZone} key={`${type}_22`}>
          <svg key="24" className={classnames('icon', styles.upArrow)} aria-hidden="true">
            <use xlinkHref="#icon-plus-shiftup" />
          </svg>
          {type === 'view' ? paper.num_viewed : paper.num_like}
        </div>
      ),
    ];
  };
  const callback = tab => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, id);
    }
    if (tab === '2' && !LikePubs) {
      dispatch({
        type: 'aminerConf/GetMostLikePubs',
        payload: { conf_id: id, offset: 0, size: SIZE },
      });
    }
  };
  return (
    <div className={classnames(styles.mostViewAndLike, 'desktop_device')}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane
          key="1"
          tab={
            <span>
              {/* <svg key="24" className={classnames('icon', styles.upArrow)} aria-hidden="true">
            <use xlinkHref="#icon-zan1" />
          </svg> */}
              Most views
            </span>
          }
        >
          {/* {viewPubs && viewPubs.map(pub => {
          return 
        })
        } */}
          <div className="outBlock">
            <Spin loading={props.loading_views} size="small" />
            <ConfPaperList
              pubs={props.viewPubs}
              user={user}
              showAbstract={false}
              showInfoContent={{}}
              contentLeftZone={[]}
              contentRightZone={MostViewLeftZone('view')}
              showTitleRightZone={false}
              isShowHeadline={false}
              isShowPdfDownload={false}
              confInfo={confInfo}
            />
          </div>
        </TabPane>
        <TabPane tab="Most likes" key="2">
          {/* {LikePubs && LikePubs.map(pub => {
          ;

        })
        } */}
          <div className="outBlock">
            <Spin loading={props.loading_views} size="small" />
            <ConfPaperList
              pubs={LikePubs}
              user={user}
              showAbstract={false}
              showInfoContent={{}}
              contentLeftZone={[]}
              contentRightZone={MostViewLeftZone('like')}
              showTitleRightZone={false}
              isShowHeadline={false}
              isShowPdfDownload={false}
              confInfo={confInfo}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default page(
  connect(({ loading, aminerConf }) => ({
    loading_views: loading.effects['aminerConf/GetMostViewPubs'],
    loading_like: loading.effects['aminerConf/GetMostViewPubs'],
    viewPubs: aminerConf.MostViewPubsData,
    LikePubs: aminerConf.GetMostLikePubsData,
  })),
)(MostViewAndLike);
