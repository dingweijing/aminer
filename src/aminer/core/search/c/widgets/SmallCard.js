import React, { PureComponent } from 'react';
import { connect, Link } from 'acore';
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

@connect(({ loading }) => ({
  loading: loading.effects['aminerSearch/personInfocard']
}))
class SmallCard extends PureComponent {
  state = {
    personData: null
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) { onRef(this) }
  }

  componentDidUpdate(prevProps, prevState) {
    if (NE(prevProps, this.props, 'sid')) {
      this.getData();
    }
  }

  getItemData = () => {
    let data = this.card && this.card.dataset.item;
    data = JSON.parse(data);
    return data;
  };


  getData = () => {
    const { dispatch } = this.props;
    let { sid } = this.props;

    if (!sid) {
      sid = this.getItemData().id
    }

    const { copaper } = this.getItemData();
    if (copaper) {
      this.cardID = sid;
      this.setState({ copaper })
    }

    if (sid) {
      dispatch({ type: 'aminerSearch/personInfocard', payload: { id: sid } })
        .then(data => {
          this.setState({ personData: data });
        })
    }
  }

  tryHideCard = () => {
    const { click } = this.props;
    if (this.timerHandler) {
      clearTimeout(this.timerHandler);
    }
    this.hide = true;

    const time = click ? 0 : 200;
    this.timerHandler = setTimeout(() => {
      if (this.hide) {
        if (this.card) {
          this.card.style.visibility = 'hidden';
          this.card.style.top = '0px';
          const { cancelUnderline } = this.props;
          if (cancelUnderline) {
            cancelUnderline()
          }
        }
      }
    }, time);
  };

  cancelHide = () => {
    this.hide = false;
    if (this.timerHandler) {
      clearTimeout(this.timerHandler);
    }
  };

  renderNames = (name, nameZh) => {
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

  nothing = () => { };

  refCard = card => {
    this.card = card;
  };

  render() {
    const { id, loading, className, click, cardBottomZone } = this.props;
    const { personData, copaper } = this.state;
    const { nameBlock } = (personData && this.renderNames(personData.name, personData.name_zh)) || {}
    const avatar = personData && display.personAvatar(personData.avatar, 0, 80);
    // const avatar = `${imgPath}/default.jpg`;

    return (
      <div id={id} ref={this.refCard}
        className={classnames(styles.personSmallCard, styles[className])}
        onMouseOut={!click ? this.tryHideCard : this.nothing}
        onMouseEnter={this.cancelHide}
        onMouseOver={this.cancelHide}
        onFocus={this.nothing}
        onBlur={this.nothing}
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
            onMouseEnter={this.infocardShow} onMouseLeave={this.infocardHide}
          >
            {/* <Spin loading={loading} size='small' top='40px' /> */}
            {!loading && personData && (
              <div className="main-content">
                <div className="img-box">
                  <img src={avatar} alt="" />
                </div>
                <div className="content">

                  <h6 className="title">
                    <ExpertLink author={personData} toLinkNoCover>
                      <Link to={getProfileUrl(personData.name, personData.id)} target='_blank'>
                        <strong>{nameBlock}</strong>
                      </Link>
                    </ExpertLink>
                    {click && (
                      <span className="close">
                        <svg className={classnames('icon')} aria-hidden="true" onClick={this.tryHideCard}>
                          <use xlinkHref="#icon-modal_close" />
                        </svg>
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
                      <Hole fill={cardBottomZone} defaults={[]} param={{ cardID: this.cardID }} />
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
}
export default SmallCard
