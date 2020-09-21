import React, { useMemo, useState, useRef, useEffect } from 'react';
import { connect, Link, component } from 'acore';
import PropTypes from 'prop-types';
import { FM } from 'locales';
import display from 'utils/display';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import helper from 'helper';
import { NE } from 'utils/compare';
import { Hole } from 'components/core';
import smallcard from 'helper/smallcard';

import styles from './PersonPopupPreview.less';

// TODO finish this.
const SVGPlaceholder = (
  <svg width="13px" height="13px"
    viewBox="0 0 13 13" version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group-422" transform="translate(-403.000000, -17.000000)" fill="#333E53" fillRule="nonzero">
        <g id="Group-421">
          <g id="Group-419">
            <g id="Group-95" transform="translate(403.000000, 17.000000)">
              <g id="Group-52">
                <polygon id="Rectangle"
                  transform="translate(6.383603, 6.383603) rotate(-315.000000) translate(-6.383603, -6.383603) "
                  points="5.30026955 -1.56084156 7.46693622 -1.56084156 7.46693622 14.3280473 5.30026955 14.3280473"
                />
                <polygon id="Rectangle-Copy-11"
                  transform="translate(6.383603, 6.383603) rotate(-405.000000) translate(-6.383603, -6.383603) "
                  points="5.30026955 -1.56084156 7.46693622 -1.56084156 7.46693622 14.3280473 5.30026955 14.3280473"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)

const renderNames = (name, nameZh) => {
  const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
  const nameBlock = (
    <div>
      {mainName}
      {subName && (
        <span className={styles.sub}>
          {isDefaultLocale ? `（${subName}）` : `(${subName})`}
        </span>
      )}
    </div>
  );
  const nameText = isDefaultLocale
    ? `${mainName}（${subName}）`
    : `${mainName} (${subName})`;
  return { nameBlock, nameText };
};


// -------------------------------------------------------

const PersonPopupPreview = props => {
  const { id, loading, className, click, cardBottomZone, cancelUnderline, sid, onRef } = props;

  const [personData, setPersonData] = useState();
  const [copaper, setCopaper] = useState();
  // const { personData, copaper } = this.state;

  const refCard = useRef();
  const timer = useRef();
  const hide = useRef(true);
  // const card = useRef();
  const cardID = useRef();

  console.log('-----------', id, loading, className, click, cardBottomZone, cancelUnderline, sid);

  // const refCard = card => {
  //   refCard.current  =
  //   this.card = card;
  // };

  useEffect(() => {
    if (onRef) {
      onRef(this);
    }
  }, []);

  useEffect(() => {
    const getItemData = () => {
      const data = refCard.current && refCard.current.dataset.item;
      console.log('>>>>>> data:: ', data, ' - ', refCard.current);
      if (data) {
        return JSON.parse(data);
      }
      return data;
    };

    const getData = () => {
      const { dispatch } = props;
      let lssid = sid;
      // let { sid } = props;

      const itemData = getItemData() || {}
      if (!lssid) {
        lssid = itemData.id
      }

      if (itemData.copaper) {
        cardID.current = lssid;
        setCopaper(itemData.copaper);
        // this.setState({ copaper })
      }

      if (lssid) {
        dispatch({ type: 'aminerSearch/personInfocard', payload: { id: lssid } })
          .then(data => {
            setPersonData(data);
            // this.setState({ personData: data });
          });
      }
    }

    getData();
  }, [sid])

  // componentDidUpdate(prevProps, prevState) {
  //   if (NE(prevProps, this.props, 'sid')) {
  //     this.getData();
  //   }
  // }

  const { avatar, nameBlock } = useMemo(() => {
    const avatarData = personData && display.personAvatar(personData.avatar, 0, 80);
    const namesData = (personData && renderNames(personData.name, personData.name_zh)) || {}
    return {
      avatar: avatarData,
      nameBlock: namesData.nameBlock,
    }
  }, [personData]);

  const nothing = () => { };

  // methods

  const tryHideCard = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    hide.current = true;

    const time = click ? 0 : 200;
    timer.current = setTimeout(() => {
      if (hide) {
        if (refCard.current) {
          refCard.current.style.visibility = 'hidden';
          if (cancelUnderline) { // callback
            cancelUnderline()
          }
        }
      }
    }, time);
  };

  const cancelHide = () => {
    hide.current = false;
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };


  return (
    <div
      id={id} ref={refCard}
      className={classnames(styles.personSmallCard, styles[className])}
      onMouseOut={!click ? tryHideCard : nothing}
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
        // onMouseEnter={infocardShow} onMouseLeave={this.infocardHide}
        >
          {/* <Spin loading={loading} size='small' top='40px' /> */}
          {!loading && personData && (
            <div className="main-content">
              <div className="img-box">
                <img src={avatar} alt="" />
              </div>
              <div className="content">

                <h6 className="title">
                  <ExpertLink author={personData}>
                    <Link to={getProfileUrl(personData.name, personData.id)}>
                      <strong>{nameBlock}</strong>
                    </Link>
                  </ExpertLink>
                  {click && (
                    <span className="close" onClick={tryHideCard}>
                      <SVGPlaceholder />
                    </span>
                  )}

                </h6>

                {!copaper && (
                  <p className="stats-line">
                    <span><em>h</em>-index：</span>
                    <span className="statst">{personData.indices ? personData.indices.hindex : 0}</span>
                    <span className="split">|</span>
                    <span>
                      <FM id="aminer.common.paper" defaultMessage="#Paper" />：
                    </span>

                    <span className="statst">{personData.indices ? personData.indices.pubs : 0}</span>
                    <span className="split">|</span>
                    <span>
                      <FM id="aminer.common.citation" defaultMessage="#Citation" />：
                    </span>

                    <span className="statst">{personData.indices ? personData.indices.citations : 0}</span>
                  </p>
                )}
                {copaper && (
                  <>
                    <p className="stats-line">
                      <span><em>h</em>-index：</span>
                      <span className="statst">{personData.indices ? personData.indices.hindex : 0}</span>
                      <span className="split">|</span>
                      <span>
                        <FM id="aminer.common.paper" defaultMessage="#Paper" />：
                      </span>

                      <span className="statst">{personData.indices ? personData.indices.pubs : 0}</span>

                    </p>
                    <p className="stats-line">
                      <span>
                        <FM id="aminer.common.citation" defaultMessage="#Citation" />：
                      </span>
                      <span className="statst">{personData.indices ? personData.indices.citations : 0}</span>
                      <span className="split">|</span>
                      <span>
                        <FM id="aminer.common.copaper" defaultMessage="Co-paper" />：
                      </span>
                      <span className="statst">{copaper}</span>
                    </p>
                  </>
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
                    <Hole fill={cardBottomZone} defaults={[]} param={{ cardID: cardID.current }} />
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default component(
  connect(({ loading }) => ({
    loading: loading.effects['aminerSearch/personInfocard']
  }))
)(PersonPopupPreview);

export { smallcard };
