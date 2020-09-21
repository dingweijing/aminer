/**
 *  Created by BoGao on 2017-06-15;
 */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon } from 'antd';
import { connect, P } from 'acore';
import { FM } from 'locales';
import { sysconfig } from 'systems';
import consts from 'consts'
import { classnames } from 'utils';
import { NE } from 'utils/compare';
import display from 'utils/display';
import { Hole, ListTristate } from 'components/core';
import { PersonIndices, PersonTags, ViewExpertInfo } from 'components/person/widgets';
import { theme } from 'themes';
import helper from 'helper';
// import DraggableAvatar from './DraggableAvatar';
import styles from './PersonList.less';

const DefaultRightZoneFuncs = [
  param => <ViewExpertInfo person={param.person} key="1" />,
];

@connect()
class PersonList extends Component {
  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    persons: PropTypes.array, // data comes here.
    type: PropTypes.string, // [small | large | normal | tiny ?]
    avatarType: PropTypes.string, // [default | normal_avatar | ]
    indicesType: PropTypes.string, // ["", text]
    expertBaseId: PropTypes.string, // 需要整理这个参数.
    showIndices: PropTypes.array,
    emptyPlaceHolder: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

    // zones
    titleRightBlock: PropTypes.func, // A list of function
    rightZoneFuncs: PropTypes.array,
    // content: PropTypes.array, // TODO...
    contentBottomZone: PropTypes.array,
    bottomZoneFuncs: PropTypes.array,

    // others:
    tagsLinkFuncs: PropTypes.func,
    UpdateHooks: PropTypes.array,
    // didMountHooks: PropTypes.array, TODO delete this.

    // plugins:
    plugins: PropTypes.any,

    // dnd // TODO ...
    draggable: PropTypes.bool,
    checkable: PropTypes.bool,
    deleteable: PropTypes.bool,
    onChangeCheck: PropTypes.func,
  };

  static defaultProps = {
    showIndices: sysconfig.PersonList_ShowIndices,
    emptyPlaceHolder: (
      <FM id="com.KgSearchBox.placeholder" defaultMessage="请输入姓名或者搜索词" />
    ),
    rightZoneFuncs: theme && theme.PersonList_RightZone,
    draggable: false,
    checkable: false,
    deleteable: false,
  };

  constructor(props) {
    super(props);

    // Note 放到这里意思是不需要管更新的事情。
    this.DataReadyHooks = P.getHooks(props.plugins, P.Hookable.PersonList_DataReady);
  }

  // 暂时没用到
  componentDidMount() {
    this.callDataReadyHook(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return NE(this.props, nextProps, 'persons');
  }

  componentWillUpdate(nextProps) {
    // shouldComponentUpdate 限制了到这里的只能是person变化了。那么直接调用call.
    this.callDataReadyHook(nextProps);
  }

  // When key data be updated, call plugin's DataReadyHook.
  callDataReadyHook = props => {
    const { persons, dispatch, expertBaseId } = props;
    // Plugin: hooks 的 params 设计：参数，工具.
    P.callAllHooks(this.DataReadyHooks, { persons, expertBaseId }, { dispatch });
  };

  defaultZones = {
    contentBottomZone: [({ person }) => {
      const { tagsLinkFuncs } = this.props;
      return (
        <PersonTags
          key={0}
          className="tagZone"
          tags={person.tags || person.titles}
          tagsTranslated={person.tags_translated_zh}
          tagsLinkFuncs={tagsLinkFuncs}
          hideBorder
        />
      )
    }],
  };

  renderNames = (name, nameZh) => {
    const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
    const nameBlock = (
      <div>
        {mainName}
        {subName && (
          <span className="sub">
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

  onCheck = params => {
    const { onChangeCheck } = this.props;
    if (onChangeCheck) {
      onChangeCheck(params)
    }
  }

  render() {
    const {
      persons, indicesType, showIndices,
      currentBaseChildIds, expertBaseId,
      plugins, checkable, onChangeCheck, deleteable, deletePerson,
      type, avatarType, className, itemClassName, hideAff
    } = this.props;

    const { rightZoneFuncs, titleRightBlock, bottomZoneFuncs, afterTitleBlock } = this.props;
    const { contentBottomZone, emptyPlaceHolder } = this.props;
    const { draggable } = this.props;
    const showPrivacy = false;

    const avatarClass = (!avatarType || avatarType === 'default') ? '' : avatarType;

    return (
      <div className={classnames(styles.personList, className, styles[type], styles[avatarClass], 'person-list')}>

        <ListTristate
          condition={persons}
          init={<div className="empty">{emptyPlaceHolder}</div>}
          empty={(
            <div className="empty">
              <FM id="com.PersonList.message.noResults" defaultMessage="No Results" />
            </div>
          )}
        >
          {persons && persons.map(person => {
            const profile = person.profile || {};
            const { nameBlock, nameText } = this.renderNames(person.name, person.name_zh);
            const pos = display.localValue(sysconfig.Locale, profile.position, profile.position_zh);
            const aff = !hideAff && display.localValue(sysconfig.Locale, profile.affiliation || profile.org, profile.affiliation_zh);

            { // debug thgins;
              // const pos2 = profileUtils.displayPosition(person.pos)
              const aff2 = display.personDisplayAff(person);
              // if (pos != pos2) {
              //   console.log('||||| not equals:', pos, pos2)
              // }
              if (aff !== aff2) {
                console.log('||||| not equals:', aff, aff2)
              }
            }

            const phone = showPrivacy && profile.phone;
            const email = showPrivacy && profile.email;

            // go into
            const { indices } = person;
            const activity_indices = {}; // TODO use
            // const tags = profileUtils.findTopNTags(person, 8);

            const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
            const { PersonList_PersonLink_NewTab } = this.props;
            if (PersonList_PersonLink_NewTab === true || sysconfig.PersonList_PersonLink_NewTab === true) {
              personLinkParams.target = '_blank';
            }

            return (
              <div key={person.id}>
                <div className={classnames('person-item', itemClassName)}>
                  {checkable && (
                    <div className="checked">
                      <Checkbox onChange={onChangeCheck.bind(this, person.id)} />
                    </div>
                  )}

                  <div className="avatar_zone">
                    {/* {draggable && (
                      <DraggableAvatar
                        src={display.personAvatar(person.avatar, '', 160)}
                        className="avatar"
                        title={nameText}
                      />
                    )} */}

                    {!draggable && (
                      <img
                        src={display.personAvatar(person.avatar, '', 160)}
                        className="avatar"
                        alt={nameText} title={nameText}
                      />
                    )}
                  </div>

                  <div className="info_zone">
                    <div className="info_zone_detail">  {/* ?? */}
                      <div className="title_zone">
                        {nameBlock && (
                          <div className="title">
                            <h2>
                              {!sysconfig.Not_Allow_Click_Name_Link && (
                                <a {...personLinkParams}>{nameBlock}</a>
                              )}
                              {sysconfig.Not_Allow_Click_Name_Link && (
                                <span {...personLinkParams}>{nameBlock}</span>
                              )}
                            </h2>
                            {afterTitleBlock && afterTitleBlock({
                              param: { person, expertBaseId },
                            })}
                          </div>
                        )}

                        {/* ---- TitleRightBlock ---- */}
                        {titleRightBlock && titleRightBlock({
                          param: {
                            person,
                            expertBaseId,
                            currentBaseChildIds,
                          },
                        })}
                      </div>

                      {/* {this.personRightButton && this.personRightButton(person)} */}
                      <div className={classnames('zones', 'interestColumn')}>
                        <div className="contact_zone">
                          {/* Must Has order style! */}
                          <PersonIndices
                            indices={indices}
                            activity_indices={activity_indices}
                            showIndices={showIndices}
                            indicesType={indicesType}
                            style={{ order: 10 }}
                          />
                          {pos && (
                            <div style={{ order: 20 }}>
                              <i className="fa fa-briefcase fa-fw" /> {pos}
                            </div>
                          )}

                          {aff && (
                            <div style={{ order: 30 }}>
                              <i className="fa fa-institution fa-fw" /> {aff}
                            </div>
                          )}

                          {phone && (
                            <div style={{ order: 40, minWidth: '158px' }}>
                              <i className="fa fa-phone fa-fw" /> {phone}
                            </div>
                          )}

                          {email && (
                            <div className="email"
                              style={{
                                order: 50,
                                backgroundImage: `url(${consts.AMinerOldAPIDomain}/api${email})`,
                              }}
                            ><i className="fa fa-envelope fa-fw" />
                            </div>
                          )}

                          {false && person.num_viewed > 0 && (
                            <div style={{ order: 60 }} className="views"><i
                              className="fa fa-eye fa-fw" />{person.num_viewed}
                              <FM id="com.PersonList.label.views" defaultMessage="views" />
                            </div>
                          )}

                        </div>

                        {/* ---- Tags/others ---- */}
                        <Hole
                          name="PersonList.contentBottomZone"
                          fill={contentBottomZone}
                          defaults={this.defaultZones.contentBottomZone}
                          plugins={P.getHoles(plugins, 'PersonList.contentBottomZone')}
                          param={{ person, expertBaseId }}
                          config={{ containerClass: '' }}
                        />

                      </div>
                    </div>
                  </div>

                  {deleteable && (
                    <div onClick={deletePerson.bind(this, person.id)} className="delete">
                      <Icon className="icon" type="delete" />
                    </div>
                  )}

                  <Hole
                    name="PersonList.rightZoneFuncs"
                    fill={rightZoneFuncs}
                    defaults={DefaultRightZoneFuncs}
                    plugins={P.getHoles(plugins, 'PersonList.rightZoneFuncs')}
                    param={{ person, expertBaseId, currentBaseChildIds }}
                    config={{ containerClass: styles.person_right_zone }}
                  />

                </div>

                {/* ---- Bottom Zone ---- */}
                <Hole
                  name="PersonList.bottomZoneFuncs"
                  fill={bottomZoneFuncs}
                  plugins={P.getHoles(plugins, 'PersonList.bottomZoneFuncs')}
                  param={{ person, expertBaseId, user: null }}
                  config={{ containerClass: styles.personComment }}
                />

              </div>
            );
          })}

        </ListTristate>
      </div>
    );
  }
}

export default PersonList;
