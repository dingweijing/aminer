import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { component, connect, Link } from 'acore';
import { FM } from 'locales';
import display from 'utils/display';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import helper from 'helper';
import { PubListZoneType } from 'aminer/components/pub/pub_type';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { Hole } from 'components/core';
// import consts from 'consts';
import styles from './PopPerson.less';

// const imgPath = `${consts.ResourcePath}/sys/aminer`;
interface IProptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  trigger?: string;
  sid?: string;
  name?: string;
  className?: string;
  authorLinkDomain?: string;
  infocardShow: () => void;
  infocardHide: () => void;
  loading: boolean;
  position: {
    left?: number;
    top?: number;
  };
  cardBottomZone?: PubListZoneType;
  paper_index?: number;
  paper_id?: string;
  profile?: ProfileInfo;
  isAuthorClick?: boolean;
  onClickCard: (profile: ProfileInfo) => {};
}
const PopPerson = (props: IProptypes, ref: any) => {
  const [personData, setPersonData] = useState<ProfileInfo>();

  const { dispatch, sid: _sid, name, trigger = 'hover' } = props;
  const {
    profile,
    loading,
    className,
    cardBottomZone,
    authorLinkDomain,
    position,
    paper_index,
    paper_id,
    isAuthorClick = true,
    onClickCard,
  } = props;
  const { infocardShow, infocardHide } = props;

  const getData = () => {
    if (_sid) {
      dispatch({ type: 'aminerSearch/personInfocard', payload: { id: _sid } }).then(
        (data: ProfileInfo) => {
          setPersonData(data);
        },
      );
    } else {
      setPersonData({ name });
    }
  };

  useEffect(() => {
    if (profile) {
      setPersonData(profile);
    } else {
      getData();
    }
  }, []);

  const tryHideCard = () => { };
  const onMouseEnter = () => {
    if (infocardShow) {
      infocardShow();
    }
  };
  const onMouseLeave = () => {
    if (infocardHide) {
      infocardHide();
    }
  };

  const onClick = () => {
    if (onClickCard) {
      onClickCard(personData as ProfileInfo);
    }
  };

  const renderNames = (name: string, nameZh: string) => {
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

  const nothing = () => { };

  const hrefDomain = useMemo(() => {
    let str = authorLinkDomain || '';
    if (typeof authorLinkDomain === 'boolean' && authorLinkDomain) {
      str = 'https://www.aminer.cn';
    }
    return str;
  }, []);

  const { nameBlock, mainName } =
    (personData && renderNames(personData.name, personData.name_zh)) || {};
  const avatar = personData && display.personAvatar(personData.avatar, 0, 80);

  return (
    <div
      style={{ ...position }}
      className={classnames(styles.popPerson, styles[className], 'pop-person-card', {
        show: !!profile,
        click: !!onClickCard,
      })}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      // onMouseOver={onMouseOver}
      onFocus={nothing}
      onBlur={nothing}
    // onClick={onClick}
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
                  {personData.id && isAuthorClick ? (
                    <ExpertLink author={personData}>
                      <Link to={getProfileUrl(personData.name, personData.id)} target="_blank">
                        <strong>{nameBlock}</strong>
                      </Link>
                    </ExpertLink>
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
                  <p className="position">
                    {/* <i className="fa fa-briefcase" /> */}
                    <span>{personData.profile.position}</span>
                  </p>
                )}

                {personData.profile && personData.profile.affiliation && (
                  <p className="black affiliation">
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
                        index: paper_index,
                        pid: paper_id,
                        // ...getItemData(),
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
)(PopPerson);
