import React, { useRef, useEffect, useMemo, Fragment } from 'react';
import { connect, Link, P, component } from 'acore';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import { FM, enUS, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import pubHelper from 'helper/pub';
import { authorInitialCap } from 'aminer/core/pub/utils';

import styles from './ProjectList.less';

const { PubList_Show_Authors_Max = 12 } = sysconfig;
const PresetTitleSize = {
  normal: 18,
};

// let timer = null;
// let card = null;
// let authorHoverTarget = null;
const ProjectList = props => {
  // const smallCard = useRef();
  // const cid = useRef(props.id || Math.random());
  const { dispatch } = props;
  const { projects, className, end } = props;

  const renderTitle = (lang, title, title_zh) => <p className="project_title">{lang === 'zh' ? title_zh || title : title || title_zh}</p>;

  const renderCategory = (lang, category, category_zh) => {
    const categorys = lang === 'zh' ? category_zh || category : category || category_zh;

    return (
      <p className="categorys">
        {categorys &&
          categorys.length > 0 &&
          categorys.slice(0, 5).map(item => (
            <span key={item} className="category">
              {item}
            </span>
          ))}
      </p>
    );
  };

  const renderInvestigators = investigators => {
    return (
      <p className="investigators">
        {investigators &&
          investigators.map((investigator, index) => {
            const { id } = investigator;
            let { name, name_zh } = investigator;
            const locale = sysconfig.Locale;
            const isDefaultLocale = locale === enUS;

            if (!isDefaultLocale) {
              [name, name_zh] = [name_zh, name];
            }

            name = authorInitialCap(name || name_zh);
            return (
              <Fragment key={`${name || name_zh}_${index}`}>
                {id && (
                  <ExpertLink author={investigator}>
                    <Link
                      className={classnames('investigator', { link: investigator.id })}
                      to={getProfileUrl(name, id)}
                    >
                      {name || name_zh || ''}
                    </Link>
                  </ExpertLink>
                )}
                {!id && <span className="investigator">{name || name_zh || ''}</span>}
                {index + 1 !== investigators.length && <span className="mr">,</span>}
              </Fragment>
            );
          })}
      </p>
    );
  };
  return (
    <div className={classnames(styles.projectList, styles[className], 'aminer-project-list')}>
      {projects &&
        projects.map((project, index) => {
          const { title, title_zh, investigators } = project;
          const { category_zh, category, lang } = project;
          const { register_number, amount, sponsor, start_year, end_year } = project;

          return (
            <div key={project.id} className={classnames('project-item', { ['end']: end })}>
              {/* <Hole
              name="PaperList.contentLeftZone"
              fill={contentLeftZone}
              defaults={defaultZones.contentLeftZone}
              param={{ paper, index }}
            /> */}

              <div className="content">
                {renderTitle(lang, title, title_zh)}

                {investigators && renderInvestigators(investigators)}

                {(category || category_zh) && renderCategory(lang, category, category_zh)}

                {/* 项目编号:  59872017项目经费:  110000项目资助者:  国家自然科学基金委员会立项时间:  1998 */}
                <p className="project-info">
                  {!!register_number && (
                    <span className="info-item">
                      <span className="item-label">
                        <FM id="aminer.person.projects.number" defaultMessage='项目编号：' />
                      </span>
                      <span>{register_number}</span>
                    </span>
                  )}
                  {!!amount && (
                    <span className="info-item">
                      <span className="item-label">
                        <FM id="aminer.person.projects.amount" defaultMessage='项目经费：' />
                      </span>
                      <span>{amount}</span>
                    </span>
                  )}
                  {!!sponsor && (
                    <span className="info-item">
                      <span className="item-label">
                        <FM id="aminer.person.projects.sponsor" defaultMessage='项目资助者：' />
                      </span>
                      <span>{sponsor}</span>
                    </span>
                  )}
                  {/* {!!sponsor && (
                    <span className="info-item">
                      <span className="item-label">Sponsor：</span>
                      <span>{sponsor}</span>
                    </span>
                  )} */}
                  {(start_year || end_year) && (
                    <span className="info-item">
                      <span className="item-label">
                      <FM id="aminer.person.projects.duration" defaultMessage='立项时间：' /></span>
                      {start_year && <span>{start_year}</span>}
                      {start_year && end_year && start_year !== end_year && <span>-</span>}
                      {end_year && start_year !== end_year && <span>{end_year}</span>}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

ProjectList.propTypes = {};

ProjectList.defaultProps = {};

export default component(connect())(ProjectList);
