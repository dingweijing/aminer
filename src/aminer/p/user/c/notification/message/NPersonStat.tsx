import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { PersonItem } from 'aminer/components/expert/c';
import { IRecommendEntity } from 'aminer/p/user/notification_types';
import styles from './NPersonStat.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  ndata: IRecommendEntity;
}

const stat_map = {
  activity: {
    en: 'Activity',
    zh: '学术活跃度',
  },
  citations: {
    en: '#Citation',
    zh: '引用数',
    is_int: true,
  },
  gindex: {
    en: 'G-index',
    zh: 'G指数',
    is_int: true,
  },
  hindex: {
    en: 'H-index',
    zh: 'H指数',
    is_int: true,
  },
  pubs: {
    en: '#Papers',
    zh: '论文数',
    is_int: true,
  },
  sociability: {
    en: 'Sociability',
    zh: '社交度',
  },
  diversity: {
    en: 'Diversity',
    zh: '研究领域的广泛性',
  },
  newStar: {
    en: 'New Star',
    zh: '领域新星',
  },
  // risingStar: {
  //   en: 'Rising Star',
  //   zh: '领域新星',
  // },
};

const PersonStat: React.FC<any> = props => {
  const { ndata, type } = props;
  const { data, e_person } = ndata || {};

  const params = {
    mode: 'v3',
    // showInfo: false,
    indicesZone: [],
    tagZone: [
      () => {
        return (
          <ul className="increase_list" key={8}>
            {!!data?.length &&
              data.map(item => {
                const { c, b, a } = item;
                const i = stat_map[c];
                const { is_int } = i;
                const before = is_int ? Math.floor(b) : b.toFixed(2) - 0;
                let after = is_int ? Math.ceil(a) : a.toFixed(2) - 0;
                if (before === after) {
                  after = (after * 100 + 1) / 100;
                }
                return (
                  <li className="increase_item" key={c}>
                    <span className="label">{i ? getLangLabel(i?.en, i?.zh) : c}</span>
                    <span className="number">
                      <span>
                        {!!b && (
                          <>
                            <span>{before}</span>
                            <svg className="icon" aria-hidden="true">
                              <use xlinkHref="#icon-xiangyou" />
                            </svg>
                          </>
                        )}
                        <span>{after}</span>
                      </span>
                    </span>
                  </li>
                );
              })}
          </ul>
        );
      },
    ],
  };

  if (type !== 'recommend') {
    params.rightZone = [];
  }

  return (
    <div className={classnames(styles.personStat, 'notification_content')}>
      <PersonItem
        person={e_person}
        {...params}
        // rightZone={[]}
      />
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
)(PersonStat);
