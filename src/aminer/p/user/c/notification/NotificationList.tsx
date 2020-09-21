import React, { useEffect, useState, Fragment } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { FM } from 'locales';
import { INotificationItem, IRecommendEntity } from 'aminer/p/user/notification_types';
import { IUserInfo } from 'aminer/components/common_types';
import { getProfileUrl } from 'utils/profile-utils';
import { NPersonStat, NPub, NAuthorPub, NAuthor, NTopic } from './message';
import styles from './NotificationList.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  notifications: IRecommendEntity[];
  userinfo: IUserInfo;
}

const message_map = {
  0: NPersonStat,
  3: NPub,
  10: NAuthorPub,
  11: NPersonStat,
  12: NAuthor,
  13: NAuthor,
  14: NAuthorPub,
  15: NTopic,
};
const reason_map = {
  0: 'aminer.user.notification.res.inc',
  3: 'aminer.user.notification.epub',
  10: 'aminer.nreason.coauthor.pub',
  11: 'aminer.nreason.coauthor.stat',
  12: 'aminer.nreason.coauthor.feed',
  13: 'aminer.nreason.field.expert',
  14: 'aminer.nreason.field.expertpub',
};

const NotificationList: React.FC<IPropTypes> = props => {
  const { dispatch, notifications, type, userinfo } = props;

  return (
    <div className={styles.notification}>
      {notifications &&
        !!notifications.length &&
        notifications.map(notification => {
          const { name, mt, id: nid, t_name, tid } = notification || {};
          // const person_data = { ...target, avatar: target?.img };
          const Component = message_map[mt];
          // if (mt === 3) {
          //   console.log(mt, notification);
          // }
          if (!Component) {
            return <Fragment key={nid}></Fragment>;
          }
          return (
            <div className="notification_item" key={nid}>
              {/* <h4>{dayjs(t).format('YYYY-MM-DD HH:mm')}</h4> */}
              {/* <h4 className="time">{moment(new Date(t), 'YYYY-MM-DD HH:mm:ss').fromNow()}</h4> */}
              {reason_map[mt] && (
                <p className="recommend_reason">
                  {/* {mt} */}
                  <FM
                    id={reason_map[mt]}
                    values={{
                      name: name ? (
                        <Link target="_blank" to={getProfileUrl(name, tid)} className="name">
                          {name || ''}
                        </Link>
                      ) : (
                        ''
                      ),
                      field: t_name ? <span className="field">{t_name}</span> : '',
                    }}
                  />
                </p>
              )}
              <Component ndata={notification} type={type} tid={tid} userinfo={userinfo} />
            </div>
          );
          // return (
          //   <div className="pub" key={notification.id}>
          //     <PublicationItem
          //       paper={pub}
          //       showInfoContent={[]}
          //       additionalParams={person}
          //       contentLeftZone={[leftAuthorZone(person)]}
          //     />
          //   </div>
          // );
        })}
    </div>
  );
};

// Topic.propTypes = {

// }

export default component(
  connect(({ auth, social }) => ({
    user: auth.user,
    topic_ids: social.topic_ids,
    ntypes: social.ntypes,
  })),
)(NotificationList);
