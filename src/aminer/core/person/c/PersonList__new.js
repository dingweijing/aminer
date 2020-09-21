import React, { useRef } from 'react';
import { connect, component, Link, P, history } from 'acore';
// ---------
import PropTypes from 'prop-types';
import { FM, zhCN, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getSearchPathname } from 'utils/search-utils'
import { getProfileUrl } from 'utils/profile-utils';
import display from 'utils/display';
import { Hole, ListTristate } from 'components/core';
import helper from 'helper';
import smallcard from 'helper/smallcard';
import { Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { PersonVote, PersonFollow, SimilarPerson, SmallCard } from 'aminer/core/search/c/widgets';
import styles from './PersonList.less';


const PersonList = props => {
  const { persons, id } = props;
  const { imgSrcWidth, enableImgLazyLoad, showViews, showBind } = props;
  const { className, imgBoxStyle } = props;
  const { contentLeftZone, contentRightZone, contentBottomZone, plugins, special } = props;

  const cardRef = useRef(null);

  // console.log('person list render')
  // let { results: persons } = props;
  // const id = this.props.id || this.id;
  // const { personData } = this.state;

  // const text = [personData];
  const isZh = sysconfig.Locale === zhCN;

  return (
    <div
      id={`${id}_ROOT`} // TODO 干掉
      className={classnames(styles[className], styles.personList)}
    >
      <SmallCard id={id} ref={cardRef}
      // sid={sid} pid={pid}
      />

    </div>
  )
}

export default component()(PersonList);


// //////////////////////////////////////////////

@connect(({ searchperson, aminerSearch, auth }) => ({
  searchperson,
  results: searchperson.results,
  // topic: aminerSearch.topic,
  // infocards: aminerSearch.infocards,
  // user: auth.user,
}))
class PersonListrr {
  static propTypes = {
    showViews: PropTypes.bool,
    showBind: PropTypes.bool,
    imgSrcWidth: PropTypes.string,
    imgBoxStyle: PropTypes.object,
    enableImgLazyLoad: PropTypes.bool,
    plugins: PropTypes.any,
    contentLeftZone: PropTypes.array,
    contentRightZone: PropTypes.array,
    contentBottomZone: PropTypes.array,
  };

  static defaultProps = {
    showViews: true,
    showBind: true,
    imgSrcWidth: '240',
    imgBoxStyle: {
      width: '90px',
      minWidth: '90px',
      height: '90px'
    }
  };

  constructor(props) {
    // super(props);
    this.similars = {};
    this.id = Math.random()
  }

  state = {
    personData: null
  }

  componentDidMount() {
    const id = this.props.id || this.id;
    this.card = smallcard.init(id);
  }

  personSimilar = person => {
    const { dispatch } = this.props;
    dispatch({ type: 'aminerSearch/personSimilar', payload: { id: person.id } })
      .then(data => {
        this.similars[person.id] = data
      })
  }

  infocardShow = (target, sid) => {
    if (this.card) {
      this.card.show(target, sid, { x: 5, y: 60 })
    }
    if (this.smallCard) {
      this.smallCard.cancelHide();
      setTimeout(() => {
        this.smallCard.getData();
      }, 0)
    }
  }

  infocardHide = () => {
    if (this.smallCard) {
      this.smallCard.tryHideCard();
    }
  }

  defaultZones = {
    contentLeftZone: [({ person }) => (
      <PersonVote
        key={0}
        person={person}
        source={this.props.source}
      />
    )],
    contentRightZone: [({ person }) => (
      <PersonFollow
        key={5}
        person={person}
        source={this.props.source}
      />
    )],
    contentBottomZone: [({ person }) => (
      <SimilarPerson
        key={10}
        person={person}
        // personInfocard={this.personInfocard}
        infocardShow={this.infocardShow}
        infocardHide={this.infocardHide}
      />
    )]
  };

  onSearchQuery = query => {
    const { onSearchQuery } = this.props;
    const { source, stpye } = this.props;
    if (onSearchQuery) {
      onSearchQuery(query);
      return;
    }
    if (source === 'sogou' || source === 'true') {
      let url = '';
      if (stpye == 'wap') {
        url = `http://scholar.sogou.com/xueshu?keyword=${query}&TabMode=2`
      } else {
        url = `http://scholar.sogou.com/xueshu?ie=utf-8&keyword=${query}&TabMode=2`
      }
      window.open(url, '_top')
      return
    }
    const { dispatch } = this.props;
    dispatch({ type: 'searchperson/toggleAdvancedSearch', payload: true })
    history.push(getSearchPathname(query));
  }

  renderNames = (name, nameZh) => {
    const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
    const nameBlock = (
      <div className={styles.profileName}>
        <span className={styles.name}>
          {mainName}
        </span>
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

  showProfile = (name, id) => {
    const { source, stpye, dispatch } = this.props;
    let url = ''
    if (name && name.toLowerCase().match(/[a-zA-Z]+/g)) {
      url = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
    }
    if (source === 'sogou' || source === 'true') {
      window.top.postMessage(`aminerLink###profile/${url}/${id}`, '*')
      return
    }
    window.open(getProfileUrl(name, id));
  }

  onRef = card => {
    this.smallCard = card
  }

  render() {
    // console.log('person list render')
    let { results: persons } = this.props;
    const id = this.props.id || this.id;
    const { personList, imgSrcWidth, enableImgLazyLoad, showViews, showBind, className } = this.props;
    const { contentLeftZone, contentRightZone, contentBottomZone, plugins, special } = this.props;
    const { imgBoxStyle } = this.props;
    const { personData } = this.state;

    // const text = [personData];
    const isZh = sysconfig.Locale === zhCN;

    if (personList) {
      persons = personList;
    }
    // person.indices.hindex
    return (
      <div
        id={`${id}_ROOT`}
        className={classnames(styles[className], styles.personList)}
      >


        {persons && persons.map((person, index) => {
          const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);
          const imgprops = {
            src: enableImgLazyLoad ? display.DefaultAvatar : avatar,
          }

          const { nameBlock } = this.renderNames(person.name, person.name_zh);
          let { tags, tags_zh, tags_translated_zh } = person;
          tags_zh = tags_zh || tags_translated_zh;


          if (sysconfig.Locale === zhCN) {
            [tags, tags_zh] = [tags_zh, tags];
          }
          tags = tags && tags.length ? tags : tags_zh;
          tags = tags && tags.slice(0, 8);


          const { indices = {}, profile = {} } = person;
          const { hindex, citations, pubs } = indices;
          let { affiliation, affiliation_zh, position } = profile;
          if (isZh) {
            [affiliation, affiliation_zh] = [affiliation_zh, affiliation]
            // [position, position_zh] = [position_zh, position]
          }
          affiliation = affiliation || affiliation_zh;
          // position = position || position_zh;
          // const affiliation = isZh ? profile.affiliation_zh || profile.affiliation : profile.affiliation || profile.affiliation_zh


          return (
            <div className={styles.carousel} key={person.id} id={`pid_${person.id}`}>

              <Hole
                name="PersonList.contentLeftZone"
                fill={contentLeftZone}
                defaults={this.defaultZones.contentLeftZone}
                plugins={P.getHoles(plugins, 'PersonList.contentLeftZone')}
                param={{ person, index }}
                config={{ containerClass: styles.contentLeft }}
              />

              <div className={styles.imgBox} style={imgBoxStyle}>
                <div className={styles.img} onClick={this.showProfile.bind(this, person.name, person.id)}>
                  <img {...imgprops} alt={person.name} />
                </div>
                {showViews && (
                  <p className={styles.views}>
                    <Tooltip placement="top"
                      title={`${formatMessage({ id: 'aminer.common.views', defaultMessage: 'views' })}
                          ${formatMessage({ id: 'aminer.common.colon', defaultMessage: ': ' })}${person.num_viewed || 0}`}
                    >
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-eye" />
                      </svg>

                      {person.num_viewed || 0}
                    </Tooltip>
                  </p>
                )}


              </div>

              <div className={styles.content}>
                <div className={styles.title}>
                  {person.id && (
                    <span className={styles.titleName} onClick={this.showProfile.bind(this, person.name, person.id)}>
                      <strong>{nameBlock}</strong>
                    </span>
                  )}
                  {!person.id && (
                    <span>
                      <strong>{nameBlock}</strong>
                    </span>
                  )}

                  {showBind && (
                    <i className={classnames('fa fa-check-circle-o', { [styles.bind]: person.bind })} />
                  )}

                </div>

                {indices && (
                  <p className={styles.statsLine}>
                    <>
                      <span><em>h</em>-index</span>
                      <FM id="aminer.common.colon"
                        defaultMessage=": " />
                      <span className={styles.statst}>{hindex || 0}</span>
                    </>

                    <span className={styles.split} />

                    <>
                      <FM id="aminer.common.paper" defaultMessage="#Paper" />
                      <FM id="aminer.common.colon"
                        defaultMessage=": " />
                      <span className={styles.statst}>{pubs || 0}</span>
                    </>

                    <span className={styles.split} />

                    <>
                      <FM id="aminer.common.citation" defaultMessage="#Citation" />
                      <FM id="aminer.common.colon"
                        defaultMessage=": " />
                      <span className={styles.statst}>{citations || 0}</span>
                    </>
                  </p>
                )}


                {profile && profile.position && (
                  <p>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-bao" />
                    </svg>
                    <span>{profile.position}</span>
                  </p>
                )}

                {profile && affiliation && (
                  <p>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-lacale" />
                    </svg>
                    <span>{affiliation}</span>
                  </p>
                )}

                {tags && tags.length !== 0 && (
                  <p className={styles.tags}>
                    {tags.map((tag, index) =>
                      // console.log('tag', tag)
                      (
                        <button type="button" className={styles.tag} key={index}>
                          <span onClick={this.onSearchQuery.bind(this, tag)}>
                            {tag}
                          </span>
                        </button>
                      )
                    )}
                  </p>
                )}

                <Hole
                  name="PersonList.contentBottomZone"
                  fill={contentBottomZone}
                  defaults={this.defaultZones.contentBottomZone}
                  plugins={P.getHoles(plugins, 'PersonList.contentBottomZone')}
                  param={{ person }}
                  config={{ containerClass: styles.contentBottom }}
                />
              </div>

              <Hole
                name="PersonList.contentRightZone"
                fill={contentRightZone}
                defaults={this.defaultZones.contentRightZone}
                plugins={P.getHoles(plugins, 'PersonList.contentRightZone')}
                param={{ person, id: person.id }}
                config={{ containerClass: styles.contentRight }}
              />

            </div>

          );
        })}
      </div>
    )
  }
}
