import React, { useEffect, useState, useRef } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink, FollowBtn } from 'aminer/components/widgets';
import { Spin } from 'aminer/components/ui';
import PersonList from 'aminer/components/expert/PersonList.tsx';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { TopicTags } from 'aminer/p/user/components';
import { IFollow } from 'aminer/p/user/notification_types';
import styles from './FollowsExperts.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  pageSize?: number;
  loading: boolean;
}

const FollowsExperts: React.FC<IPropTypes> = props => {
  const { dispatch, pageSize = 20, loading } = props;
  const [experts, setExperts] = useState<ProfileInfo[]>();
  const page = useRef<number>(1);
  const experts_count = useRef<number>(0);
  const end = useRef<boolean>(false);

  const getFollows = () => {
    // TODO: xenaluo -- collection/
    dispatch({
      type: 'collection/GetFollows',
      payload: {
        includes: ['e'],
        offset: (page.current - 1) * pageSize,
        size: pageSize,
      },
    }).then((result: IFollow) => {
      const { person, person_count } = result || {};
      if (!person) {
        return;
      }
      page.current += 1;
      if (person_count) {
        experts_count.current = person_count;
      }
      const persons = person.map(item => {
        const { tags, ...params } = item;
        const new_tags = tags && Array.from(new Set(tags));
        return {
          ...params,
          tags: new_tags && new_tags.slice(0, 5),
          is_following: true,
        };
      });
      let new_experts = persons;
      if (experts) {
        new_experts = experts.concat(persons);
      }
      if (new_experts.length >= person_count) {
        end.current = true;
      }
      setExperts(new_experts);
    });
  };

  const onLoadMore = () => {
    getFollows();
  };

  useEffect(() => {
    getFollows();
  }, []);
  // TODO: xenaluo -- 中英文 tags
  return (
    <div className={classnames(styles.followsExperts, 'follows-experts')}>
      {/* <h4 className="type_title">
        <div className="title_inner">
          <span className="title">
            <FM id="aminer.follows.experts.title" />
          </span>
          <span className="count">{experts_count.current}</span>
        </div>
      </h4> */}
      {/* <Spin loading={loading} /> */}
      {!!experts?.length && (
        <div className={classnames('follow_list experts', { end: end.current })}>
          <PersonList
            // mode={mode}
            persons={experts}
            mode="v3"
            contentBottomZone={[
              ({ person }: { person: ProfileInfo }) => {
                return (
                  <Link
                    key={20}
                    className="show_recent_pub"
                    to={`${getProfileUrl(person.name, person.id)}?anchor=menu_paper`}
                    target="_blank"
                  >
                    <FM id="aminer.user.pub.recent" defaultMessage="" />
                  </Link>
                );
              },
            ]}
            isTagClick={false}
            // tagZone={[({ person }: { person: ProfileInfo }) => <TopicTags key={1} topics={person.tags} />]}
            // withFollow
            rightZone={[
              ({ person }: { person: ProfileInfo }) => (
                <FollowBtn
                  key={5}
                  type="e"
                  entity={person}
                  withNum={false}
                  // personId={person.id}
                  is_following
                  // numFollowed={person.num_followed}
                />
              ),
            ]}
          />
        </div>
      )}
      {!end.current && !!experts?.length && (
        <div className="loadmore">
          <span className="loadmore_btn" onClick={onLoadMore}>
            <FM id="aminer.common.loadmore" defaultMessage="Load More" />
          </span>
        </div>
      )}
    </div>
  );
};

export default component(
  connect(({ loading }) => ({
    loading: loading.effects['social/GetFollows'],
  })),
)(FollowsExperts);
