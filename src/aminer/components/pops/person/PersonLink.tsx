import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'acore';
// import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import display from 'utils/display';
import { getLangLabel } from 'helper';
import { getElementTop, getElementPosition } from 'helper/smallcardv2';
import { authorInitialCap } from 'aminer/core/pub/utils';
import { PubAuthor, PubListZoneType } from 'aminer/components/pub/pub_type';
import PopPerson from './PopPerson';
import styles from './PersonLink.less';

interface IPosition {
  top?: number;
  left?: number;
}
interface IPropTypes {
  author: PubAuthor;
  trigger?: string;
  authorTarget?: string;
  position?: {
    x?: number;
    y?: number;
  };
  cardBottomZone?: PubListZoneType;
  paper_index?: number;
  paper_id?: string;
  showAvatar: boolean;
  withEnName: boolean;
}
// let authorHoverTarget: HTMLElement;

const defaultOffset = {
  name: {
    x: 8,
    y: 20,
  },
  avatar: {
    x: 20,
    y: 40,
  },
};

const PersonLink = (props: IPropTypes) => {
  const {
    author,
    trigger = 'hover',
    authorTarget = '_blank',
    position: offset,
    cardBottomZone,
    paper_index,
    paper_id,
    showAvatar,
    withEnName
  } = props;
  const [show, setShow] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const [position, setPosition] = useState<IPosition>();

  let { name } = author;
  const { name_zh, id: aid } = author;
  name = authorInitialCap(name);
  const name_label = getLangLabel(name, name_zh);

  const timerHandler = useRef<NodeJS.Timer>();
  // const cancelHandler = useRef<NodeJS.Timer>();
  useEffect(() => {
    return () => {
      if (timerHandler.current) {
        clearTimeout(timerHandler.current);
      }
    };
  }, []);

  const infocardHide = () => {
    // setShow(false);
    const time = trigger === 'click' ? 0 : 200;
    if (timerHandler.current) {
      clearTimeout(timerHandler.current);
    }
    timerHandler.current = setTimeout(() => {
      setShow(false);
    }, time);
  };
  const infocardShow = () => {
    // setHide(false);
    const time = trigger === 'click' ? 0 : 50;
    if (timerHandler.current) {
      clearTimeout(timerHandler.current);
    }
    timerHandler.current = setTimeout(() => {
      setShow(true);
    }, time);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const elementPosition = getElementPosition(e.target);
    const { scrollTop } = getElementTop(e.target);
    const site = defaultOffset[showAvatar ? 'avatar' : 'name'];

    const top =
      elementPosition.actualTop + ((offset && offset.y) || site?.y || 20) - scrollTop || 0;
    let left = elementPosition.actualLeft + ((offset && offset.x) || site?.x || 8);

    if (left + 384 + 17 > document.body.clientWidth) {
      left = document.body.clientWidth - 384 - 17;
    }

    setPosition({ top, left });

    if (!show) {
      const eles = document.querySelectorAll('.pop-person-card');
      const authors = document.querySelectorAll('.author_label');
      eles.forEach(ele => {
        ele.classList.remove('hide');
        ele.classList.add('hidden');
      });
      authors.forEach(ele => {
        ele.classList.remove('underline');
      });
    }
    infocardShow();
  };

  const similarAvatar = display.personAvatar(author.img || author.avatar, 0, 80);
  const content = showAvatar ? (
    <img alt="" src={similarAvatar} className={classnames('image', { autoWidth: author.shape })} />
  ) : (
    <span>{withEnName ? name : name_label}</span>
  );

  const params = {
    // id: `sid_${aid}`,
    className: classnames('author_label', {
      underline: show,
    }),
    to: getProfileUrl(author.name, author.id),
    target: authorTarget,
    // onClick: onClickAuthor,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: infocardHide,
  };

  return (
    <span className={classnames(styles.personLink, { [styles.avatar]: showAvatar })}>
      {author?.id && <Link {...params}>{content}</Link>}
      {!author?.id && <span {...params}>{content}</span>}
      {show && (
        <PopPerson
          sid={aid}
          name={author.name}
          position={position}
          className={hide ? 'hide' : ''}
          infocardShow={infocardShow}
          infocardHide={infocardHide}
          paper_index={paper_index}
          paper_id={paper_id}
          cardBottomZone={cardBottomZone}
        />
      )}
    </span>
  );
};

export default PersonLink;
