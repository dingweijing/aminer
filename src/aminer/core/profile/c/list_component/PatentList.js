import React, { useRef, useEffect, useMemo, Fragment } from 'react';
import { connect, Link, P, component } from 'acore';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import { FM, enUS, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import pubHelper from 'helper/pub';
import { authorInitialCap } from 'aminer/core/pub/utils'

import styles from './PatentList.less';


// const { PubList_Show_Authors_Max = 12 } = sysconfig;
// const PresetTitleSize = {
//   normal: 18
// }
const pantentType = ['不知道', '发明专利', '实用新型专利', '外观设计专利']

// let timer = null;
// let card = null;
// let authorHoverTarget = null;
const PatentList = props => {
  // const smallCard = useRef();
  // const cid = useRef(props.id || Math.random());
  const { dispatch } = props;
  const { patents, className, end, pid } = props;


  const renderTitle = patent => {
    const { id, title, title_zh } = patent
    return (
      <p className="patent_title">
        <Link to={`/patentarchive/${id}`}>
          {title || title_zh}
        </Link>
      </p>
    )
  }

  const renderPatentee = (lang, patentees, applicants) => {
    return (
      <p className="patentee-line">
        {patentees && patentees.length > 0 && (
          <>
            <span className="patentee-lable">
              <FM id="aminer.person.patent.patentee" defaultMessage="Patentee" />
              <FM id="aminer.common.colon" defaultMessage=": " />
            </span>
            <span className="patentees">
              {patentees.map(patentee => {
                return (
                  <span key={patentee} className="patentee">{patentee}</span>
                )
              })}
            </span>
          </>
        )}
        {applicants && applicants.length > 0 && applicants.map((author, index) => {
          const { name, name_zh, id } = author;
          const authorName = lang === 'zh' ? (name_zh || name) : name
          return (
            <span className="authors" key={`${name || name_zh}_${index}`}>
              {id && (
                <ExpertLink author={author}>
                  <Link
                    className={classnames('author', { link: !!id, highlight: id === pid })}
                    to={getProfileUrl(name, id)}
                  >
                    {authorName || ''}
                  </Link>
                </ExpertLink>
              )}
              {!id && (
                <span className="author">{authorName || ''}</span>
              )}
              {(index + 1) !== applicants.length && (<span className="mr">,</span>)}
            </span>
          )
        })}
      </p>
    )
  }

  return (
    <div
      className={classnames(styles.patentList, styles[className], 'aminer-patent-list')}
    >

      {patents && patents.map((patent, index) => {
        // console.log('patent', patent)
        const { title, title_zh, patentees, applicants, lang } = patent;
        const { abstract_zh, abstract } = patent;
        const { public_date, app_date, type, status, public_number
        } = patent;

        return (
          <div key={patent.id}
            className={classnames('patent-item', { ['end']: end })}
          >

            <div className="content">

              {renderTitle(patent)}

              {renderPatentee(lang, patentees, applicants)}

              {(abstract || abstract_zh) && (
                <p className="abstract">{abstract || abstract_zh}</p>
              )}

              <p className="patent-info">
                {!!public_date && (
                  <span className="info-item">
                    <span className="item-label">
                      <FM id="aminer.person.patent.patent" defaultMessage="Publication Patent Date" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                    </span>
                    <span>{public_date}</span>
                  </span>
                )}
                {!!app_date && (
                  <span className="info-item">
                    <span className="item-label">
                      <FM id="aminer.person.patent.application" defaultMessage="Application Date" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                    </span>
                    <span>{app_date}</span>
                  </span>
                )}
                {!!type && (
                  <span className="info-item">
                    <span className="item-label">
                      <FM id="aminer.person.patent.type" defaultMessage="Patent type" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                    </span>
                    <span>{pantentType[type]}</span>
                  </span>
                )}
                {!!status && (
                  <span className="info-item">
                    <span className="item-label">
                      <FM id="aminer.person.patent.legal" defaultMessage="Legal Status" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                    </span>
                    <span>{status}</span>
                  </span>
                )}
                {!!public_number && (
                  <span className="info-item">
                    <span className="item-label">
                      <FM id="aminer.person.patent.number" defaultMessage="Publication Patent Number" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                    </span>
                    <span>{public_number}</span>
                  </span>
                )}
              </p>
            </div>

          </div>
        )
      })}
    </div>
  );
}

PatentList.propTypes = {

};

PatentList.defaultProps = {

}

export default component(connect())(PatentList)
