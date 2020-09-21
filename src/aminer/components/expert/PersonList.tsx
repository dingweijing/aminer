import React, { useEffect, useRef, useMemo } from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { useImageLazyLoad, useGetFollowsByID } from 'utils/hooks';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { IUser } from 'aminer/components/common_types';
import { PersonItem } from './c';
import styles from './PersonList.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  user: IUser;
  persons: ProfileInfo[];
  className: string;
  tagTarget: string;
  mode: 'v1' | 'v2' | 'v3' | 'table';
  withFollow: boolean;
}

const PersonList: React.FC<IPropTypes> = props => {
  useImageLazyLoad();
  const { dispatch, user, persons, className, mode = 'v1', withFollow = false, ...params } = props;
  // const { collectionMap } = props;

  useGetFollowsByID(dispatch, withFollow && isLogin(user), persons);

  return (
    <div
      className={classnames(
        styles.personList,
        styles[className],
        styles[mode],
        'person-list',
        mode,
      )}
    >
      {persons &&
        persons.map((person, index) => (
          <PersonItem
            key={person.id}
            person={person}
            mode={mode}
            person_index={index}
            {...params}
          />
        ))}
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(PersonList);
