import React, { useEffect, useRef, useMemo } from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { SmallCard } from 'aminer/components/widgets';
import smallcard from 'helper/smallcardv2';
import { FM } from 'locales';
import { useImageLazyLoad } from 'utils/hooks';
import { ProfileInfo, IframeSpecialType } from 'aminer/components/person/person_type';
import { CardRefType } from 'aminer/components/common_types.ts';
import { PersonFollow } from 'aminer/core/search/c/widgets';
import { Person, Tags, SimilarPerson } from './c';
import styles from './PersonList.less';

interface PropsType {
  persons: ProfileInfo[];
  className: string;
  tagTarget: string;
  mode: string;
  special: IframeSpecialType;
}

let timer: NodeJS.Timer;
const PersonList = (props: PropsType) => {
  useImageLazyLoad();
  const smallCard = useRef<typeof SmallCard>();
  const card_fun = useRef<CardRefType | undefined>();

  const { persons, className, special, mode = 'list', contentBottomZone, ...params } = props;

  const infocardShow = (
    { sid, e }: { sid: string; e: React.MouseEvent },
    position: object,
    _params: object,
  ) => {
    if (card_fun.current) {
      card_fun.current.show({ target: e.target, sid, position, params: _params });
    }

    if (smallCard.current) {
      smallCard.current.cancelHide();
      timer = setTimeout(() => {
        smallCard.current.getData();
      }, 0);
    }
  };

  const infocardHide = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (smallCard.current) {
      smallCard.current.tryHideCard();
    }
  };

  useEffect(() => {
    card_fun.current = smallcard.init(smallCard?.current?.card);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  let bottomZone;
  // const bottomZone = contentBottomZone
  //   ? contentBottomZone
  //   : mode === 'list'
  //   ? [
  //       ({ person }: { person: ProfileInfo }) => (
  //         <SimilarPerson
  //           key={10}
  //           person={person}
  //           // personInfocard={this.personInfocard}
  //           infocardShow={infocardShow}
  //           infocardHide={infocardHide}
  //         />
  //       ),
  //     ]
  //   : [];
  if (contentBottomZone) {
    bottomZone = contentBottomZone;
  } else {
    bottomZone =
      mode === 'list'
        ? [
          ({ person }: { person: ProfileInfo }) => (
            <SimilarPerson
              key={10}
              person={person}
              // personInfocard={this.personInfocard}
              infocardShow={infocardShow}
              infocardHide={infocardHide}
            />
          ),
        ]
        : [];
  }

  // const params = useMemo(() => {
  //   const showViews
  //   const showBind
  // }, [mode])
  const showViews = mode === 'list';
  const showBind = mode === 'list';

  const attrs = { showViews, showBind, ...params };

  return (
    <div
      className={classnames(
        styles[className],
        'common-person-list',
        styles.personList,
        styles[mode],
        mode,
      )}
    >
      <SmallCard
        ref={smallCard}
      // sid={sid} pid={pid}
      />
      {persons &&
        persons.map((person, index) => (
          <Person
            mode={mode}
            className={mode}
            key={person.id}
            person={person}
            index={index}
            contentBottomZone={bottomZone}
            {...attrs}
          />
        ))}
    </div>
  );
};

export default component(
  connect(({ aminerSearch, auth }) => ({
    COVIDHotExpert: aminerSearch.COVIDHotExpert,
    // infocards: aminerSearch.infocards,
    user: auth.user,
  })),
)(PersonList);
