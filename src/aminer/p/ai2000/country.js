/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { connect, component, withRouter, Link } from 'acore';
import consts from 'consts';
import { FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { sysconfig } from 'systems';
import { logtime } from 'utils/log';
// import { BackTop } from 'antd';
import styles from './country.less';

const version = 'v2';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;
const { AI2000_Default_Year } = sysconfig;
// Components

const OrgPage = props => {
  const { match, location, orgHomeInfo, dispatch } = props;
  const {
    params: { country_name, year },
  } = match;
  const countryName = decodeURIComponent(country_name);
  const { pathname } = location;
  const aiType = useMemo(() => (pathname && pathname.startsWith('/ai2000') ? 'ai2000' : 'ai'), [
    pathname,
  ]);
  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);

  const nameLang = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  const isZh = !(sysconfig.Locale === 'en-US');

  const isRecent = useMemo(() => {
    return pathname.startsWith('/ai2000');
  }, [pathname]);

  useEffect(() => {
    if (!orgHomeInfo) {
      dispatch({
        type: 'aminerAI10/GetOrgHomeInfo',
        payload: {
          recent_10: isRecent,
          year: y,
          country_filter: countryName,
        },
      });
    }
  }, []);

  if (!orgHomeInfo) {
    return <></>;
  }

  const { domain_scholars, multiple_domains_scholars } = orgHomeInfo;
  console.log('domain_scholars', domain_scholars)
  return (
    <Layout pageTitle={countryName}>
      <article className={styles.orgPage}>
        <h1 className="org_title">{countryName}</h1>
        <div className="org_bg">
          <img className="bg" src={`${consts.ResourcePath}/sys/aminer/ai10/org_bg.png`} alt="" />
          <div className="org_info">
            <img src={`${orgPath}/${countryName}.png`} alt="" />
            <span className="country_name">{countryName}</span>
          </div>
        </div>

        <div className="org_list_part">
          {domain_scholars && (
            <div className="domains_part">
              <div className="appearances">
                <FM
                  id="ai2000.org.fields.title"
                  defaultMessage="Most Influential Scholars"
                  tagName="h2"
                />
                <ul className="multiple_list">
                  {domain_scholars.map((item, index) => {
                    const { scholars } = item;
                    let { name, name_zh } = item;
                    if (isZh) {
                      [name, name_zh] = [name_zh, name];
                    }

                    return (
                      <li className="multiple_item fields_item" key={name}>
                        <span className="award_name">
                          <Link
                            to={`/${aiType}${year ? `/year/${year}` : ''}/${item.id}`}
                            target="_black"
                          >
                            <strong>{name || name_zh || ''}</strong>
                          </Link>
                        </span>
                        <div className="award_ranks">
                          {scholars &&
                            scholars.map(scholar => {
                              const { person = {}, person_id, rank } = scholar;
                              if (!person) {
                                return false;
                              }
                              const { name: p_name, name_zh: p_name_zh } = person;
                              return (
                                <span key={person_id} className="rank_item">
                                  <span className="rank">{`#${rank}`}</span>
                                  <Link to={`/profile/${person_id}`} target="_black">
                                    {p_name}
                                    {isZh && p_name_zh && (
                                      <span className="sub">({p_name_zh})</span>
                                    )}
                                  </Link>
                                  {/* <span>{`${award[`domain_${nameLang}`]}`}</span> */}
                                </span>
                              );
                            })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
          {multiple_domains_scholars && (
            <div>
              <div className="part multiple">
                <FM
                  id="ai2000.home.multiple.title"
                  defaultMessage="Winners in Multiple Fields"
                  tagName="h2"
                />

                {/* <div className="desc">
                  <FM
                    id="ai2000.home.multiple.desc"
                    defaultMessage="Scholars may be named the AMiner most influential AI scholars in multiple sub-fields."
                  />
                </div> */}

                {multiple_domains_scholars['5'] && (
                  <div id="five_appearances" className="appearances">
                    <FM
                      id="ai2000.home.multiple.five"
                      defaultMessage="Five Appearances"
                      tagName="h3"
                    />
                    <ul className="multiple_list">
                      {multiple_domains_scholars['5'].map((item, index) => {
                        const { person = {}, awards, person_id } = item;
                        if (!person) {
                          return false;
                        }
                        const { name, name_zh } = person;
                        return (
                          <li className="multiple_item" key={person_id}>
                            <Link
                              className="award_name"
                              to={`/profile/${person_id}`}
                              target="_black"
                            >
                              <strong>
                                {name}
                                {isZh && name_zh && <span className="sub">({name_zh})</span>}
                              </strong>
                            </Link>
                            <div className="award_ranks">
                              {awards &&
                                awards.map(award => (
                                  <span key={award.domain_id} className="rank_item count5">
                                    <span className="rank">{`#${award.rank}`}</span>
                                    <span>{`${award[`domain_${nameLang}`]}`}</span>
                                  </span>
                                ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {multiple_domains_scholars['4'] && (
                  <div id="four_appearances" className="appearances">
                    <FM
                      id="ai2000.home.multiple.four"
                      defaultMessage="Four Appearances"
                      tagName="h3"
                    />
                    <ul className="multiple_list">
                      {multiple_domains_scholars['4'].map((item, index) => {
                        const { person = {}, awards, person_id } = item;
                        if (!person) {
                          return false;
                        }
                        const { name, name_zh } = person;
                        return (
                          <li className="multiple_item" key={person_id}>
                            <span className="award_name">
                              <Link to={`/profile/${person_id}`} target="_black">
                                <strong>
                                  {name}
                                  {isZh && name_zh && <span className="sub">({name_zh})</span>}
                                </strong>
                              </Link>
                            </span>
                            <div className="award_ranks">
                              {awards &&
                                awards.map(award => (
                                  <span key={award.domain_id} className="rank_item count4">
                                    <span className="rank">{`#${award.rank}`}</span>
                                    <span>{`${award[`domain_${nameLang}`]}`}</span>
                                  </span>
                                ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {multiple_domains_scholars['3'] && (
                  <div id="three_appearances" className="appearances">
                    <FM
                      id="ai2000.home.multiple.three"
                      defaultMessage="Three Appearances"
                      tagName="h3"
                    />
                    <ul className="multiple_list">
                      {multiple_domains_scholars['3'].map((item, index) => {
                        const { person = {}, awards, person_id } = item;
                        if (!person) {
                          return false;
                        }
                        const { name, name_zh } = person;
                        return (
                          <li className="multiple_item" key={person_id}>
                            <span className="award_name">
                              <Link to={`/profile/${person_id}`} target="_black">
                                <strong>
                                  {name}
                                  {isZh && name_zh && <span className="sub">({name_zh})</span>}
                                </strong>
                              </Link>
                            </span>
                            <div className="award_ranks">
                              {awards &&
                                awards.map(award => (
                                  <span key={award.domain_id} className="rank_item count3">
                                    <span className="rank">{`#${award.rank}`}</span>
                                    <span>{`${award[`domain_${nameLang}`]}`}</span>
                                  </span>
                                ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {multiple_domains_scholars['2'] && (
                  <div id="two_appearances" className="appearances">
                    <FM id="ai2000.home.multiple.two" defaultMessage="Two Appearances" tagName="h3" />
                    <ul className="multiple_list">
                      {multiple_domains_scholars['2'].map((item, index) => {
                        const { person = {}, awards, person_id } = item;
                        if (!person) {
                          return false;
                        }
                        const { name, name_zh } = person;
                        return (
                          <li className="multiple_item" key={person_id}>
                            <span className="award_name">
                              <Link to={`/profile/${person_id}`} target="_black">
                                <strong>
                                  {name}
                                  {isZh && name_zh && <span className="sub">({name_zh})</span>}
                                </strong>
                              </Link>
                            </span>
                            <div className="award_ranks">
                              {awards &&
                                awards.map(award => (
                                  <span key={award.domain_id} className="rank_item count2">
                                    <span className="rank">{`#${award.rank}`}</span>
                                    <span>{`${award[`domain_${nameLang}`]}`}</span>
                                  </span>
                                ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
      {/* <BackTop /> */}
    </Layout>
  );
};

// SSR时，服务端初次加载页面数据用这个方法。
// 这个例子数据存在model中，model数据会序列化在页面中，在客户端加载时还原到model中。
// 此组件在useEffect中通过判断model中是否有值来再次获取数据。
OrgPage.getInitialProps = async ({ store, history, isServer, match }) => {
  if (!isServer) {
    return;
  }
  const { location } = history || {};
  // mostinfluentialscholars.GetOrgHomeInfo

  logtime('getInitialProps::OrgPage init');
  const { pathname } = location;
  const { year, country_name } = match.params || {};
  const isRecent = pathname.startsWith('/ai2000');
  const countryName = decodeURIComponent(country_name);
  const y = year ? year - 0 : AI2000_Default_Year;

  if (countryName) {
    await store.dispatch({
      type: 'aminerAI10/GetOrgHomeInfo',
      payload: {
        recent_10: isRecent,
        year: y,
        country_filter: countryName,
      },
    });
  }
  logtime('getInitialProps::OrgPage Done');

  const { aminerAI10 } = store.getState();
  return { aminerAI10 };
  // 也可以直接使用下面方式返回。

  // return Promise.resolve({
  //   data: {
  //     ssr: 'http://127.0.0.1:7001',
  //     csr: 'http://127.0.0.1:8000',
  //   },
  // });
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    orgHomeInfo: aminerAI10.orgHomeInfo,
  })),
)(OrgPage);
