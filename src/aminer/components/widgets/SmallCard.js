import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { component, connect, Link } from 'acore';
import PropTypes from 'prop-types';
import { FM } from 'locales';
import display from 'utils/display';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import helper from 'helper';
import { NE } from 'utils/compare';
import { Hole } from 'components/core';
// import consts from 'consts';
import styles from './SmallCard.less';

// const imgPath = `${consts.ResourcePath}/sys/aminer`;
const SmallCard = (props, ref) => {
  const [personData, setPersonData] = useState();

  const { dispatch, sid: _sid, cancelUnderline, trigger = 'hover' } = props;
  const { loading, className, cardBottomZone, authorLinkDomain } = props;

  const timerHandler = useRef();
  const sid = useRef(_sid);
  const hide = useRef();

  const cardRef = useRef();
  useImperativeHandle(ref, () => ({
    card: cardRef.current,
    getData,
    cancelHide,
    tryHideCard,
  }));

  const getItemData = () => {
    // console.log('cardRef.current', cardRef.current)
    let data = cardRef.current && cardRef.current.dataset.item;
    data = JSON.parse(data);
    return data;
  };

  const getData = () => {
    // if (!sid.current) {
    sid.current = getItemData().id;
    // }
    // console.log('sid.current', getItemData(), sid.current, sid.current.length)
    if (sid.current.match(/^[0-9a-fA-F]{24}$/)) {
      dispatch({ type: 'aminerSearch/personInfocard', payload: { id: sid.current } }).then(data => {
        setPersonData(data);
      });
    } else {
      setPersonData({ name: sid.current.replace('_', ' ') });
    }

    // if (sid.current.length === 24) {

    // } else {

    // }
  };

  const tryHideCard = () => {
    if (timerHandler.current) {
      clearTimeout(timerHandler.current);
    }
    hide.current = true;

    const time = trigger === 'click' ? 0 : 200;
    timerHandler.current = setTimeout(() => {
      if (hide.current) {
        if (cardRef.current) {
          cardRef.current.style.visibility = 'hidden';
          if (cancelUnderline) {
            cancelUnderline();
          }
        }
      }
    }, time);
  };

  const cancelHide = () => {
    hide.current = false;
    if (timerHandler.current) {
      clearTimeout(timerHandler.current);
    }
  };

  const renderNames = (name, nameZh) => {
    const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
    const nameBlock = (
      <div>
        {mainName}
        {subName && (
          <span className={styles.sub}>{isDefaultLocale ? `（${subName}）` : `(${subName})`}</span>
        )}
      </div>
    );
    const nameText = isDefaultLocale ? `${mainName}（${subName}）` : `${mainName} (${subName})`;
    return { nameBlock, nameText, mainName };
  };

  const nothing = () => {};

  const hrefDomain = useMemo(() => {
    let str = authorLinkDomain || '';
    if (typeof authorLinkDomain === 'boolean' && authorLinkDomain) {
      str = 'https://www.aminer.cn';
    }
    return str;
  }, []);

  // const refCard = card => {
  //   cardRef.current = card;
  // };
  const { nameBlock, mainName } =
    (personData && renderNames(personData.name, personData.name_zh)) || {};
  const avatar = personData && display.personAvatar(personData.avatar, 0, 80);
  return (
    <div
      ref={cardRef}
      className={classnames(styles.personSmallCard, styles[className])}
      onMouseOut={trigger !== 'click' ? tryHideCard : nothing}
      onMouseEnter={cancelHide}
      onMouseOver={cancelHide}
      onFocus={nothing}
      onBlur={nothing}
    >
      {loading && (
        <div className={styles.loadingDiv}>
          <div className={styles.imgBox} />
          <div className={styles.content}>
            <div className={classnames(styles.p, styles.p1)}>
              <p className={styles.loading} />
            </div>
            <div className={classnames(styles.p, styles.p2)}>
              <p className={styles.loading} />
            </div>
            <div className={classnames(styles.p, styles.p3)}>
              <p className={styles.loading} />
            </div>
          </div>
        </div>
      )}
      {personData && (
        <div
          className={classnames('small-card', { 'box-shadow': !loading })}
          // onMouseEnter={infocardShow}
          // onMouseLeave={infocardHide}
        >
          {!loading && personData && (
            <div className="main-content">
              <div className="img-box">
                <img src={avatar} alt="" />
              </div>
              <div className="card_content">
                <h6 className="title">
                  {personData.id ? (
                    <Link to={getProfileUrl(personData.name, personData.id)} target="_blank">
                      <strong>{nameBlock}</strong>
                    </Link>
                  ) : (
                    <strong>{nameBlock}</strong>
                  )}

                  {trigger === 'click' && (
                    <span className="close">
                      <svg className={classnames('icon')} aria-hidden="true" onClick={tryHideCard}>
                        <use xlinkHref="#icon-modal_close" />
                      </svg>
                    </span>
                  )}
                </h6>

                {personData && personData.id && (
                  <p className="stats-line">
                    <span>
                      <em>h</em>-index：
                    </span>
                    <span className="statst">
                      {personData.indices ? personData.indices.hindex : 0}
                    </span>
                    <span className="split">|</span>
                    <span>
                      <FM id="aminer.common.paper" defaultMessage="#Paper" />：
                    </span>

                    <span className="statst">
                      {personData.indices ? personData.indices.pubs : 0}
                    </span>
                    <span className="split">|</span>
                    <span>
                      <FM id="aminer.common.citation" defaultMessage="#Citation" />：
                    </span>

                    <span className="statst">
                      {personData.indices ? personData.indices.citations : 0}
                    </span>
                  </p>
                )}

                {personData && !personData.id && (
                  <p className="stats-line">
                    {!hrefDomain && (
                      <Link
                        className="search_person"
                        target="_blank"
                        to={`/search/person/?q=${mainName}`}
                      >
                        <FM id="aminer.conf.noNaSearch" />
                      </Link>
                    )}
                    {hrefDomain && (
                      <a
                        className="search_person"
                        target="_blank"
                        href={`${hrefDomain}/search/person/?q=${mainName}`}
                        rel="noopener noreferrer"
                      >
                        <FM id="aminer.conf.noNaSearch" />
                      </a>
                    )}
                  </p>
                )}

                {personData.profile && personData.profile.position && (
                  <p>
                    {/* <i className="fa fa-briefcase" /> */}
                    <span>{personData.profile.position}</span>
                  </p>
                )}

                {personData.profile && personData.profile.affiliation && (
                  <p className="black">
                    {/* <i className="fa fa-bank" /> */}
                    <span>{personData.profile.affiliation}</span>
                  </p>
                )}

                {cardBottomZone && (
                  <div className="card-bottom">
                    <Hole
                      fill={cardBottomZone}
                      defaults={[]}
                      param={{
                        person: personData,
                        ...getItemData(),
                      }}
                      config={{ containerClass: 'card-bottom-zone' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// SmallCard.propTypes = {
//   trigger: PropTypes.string
// }
// SmallCard.defaultProps = {
//   trigger: 'hover'
// }
export default component(
  connect(
    ({ loading }) => ({
      loading: loading.effects['aminerSearch/personInfocard'],
    }),
    null,
    null,
    { forwardRef: true },
  ),
  forwardRef,
)(SmallCard);
