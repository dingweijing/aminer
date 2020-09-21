import React, { Fragment } from 'react';
import { Link } from 'acore';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import consts from 'consts';

const { PlaceImagePath } = sysconfig;

const version = 'v2';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;

let org_flag = false;

const OrgsComponent = props => {
  const { multiple_domains_orgs, domains_topn_orgs, aiType, year } = props;

  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  return (
    <>
      {(multiple_domains_orgs || domains_topn_orgs) && (
        <div id="institutes_of_winners" className="part institutes">
          <FM id="ai2000.home.institutes.title" defaultMessage="Awards By Fields" tagName="h2" />

          <ul className="all_institutes_list">
            {multiple_domains_orgs &&
              multiple_domains_orgs.map((institution, index) => {
                if (!institution.name) {
                  org_flag = true;
                  return false;
                }
                return (
                  <Fragment key={institution.name}>
                    {(index < 10 || (index === 10 && org_flag)) && (
                      <li className="org">
                        <Link
                          to={`/${aiType}${
                            year ? '/year/2019' : ''
                          }/organization/${encodeURIComponent(institution.name)}`}
                          target="_blank"
                        >
                          <div className="img_box">
                            <img
                              src={`${orgPath}/${institution.name}.png`}
                              alt={institution.name}
                            />
                          </div>
                          <p className="winner">{`${institution.top100_scholars_num}  ${
                            institution.top100_scholars_num === 1 ? 'Scholar' : 'Scholars'
                          }`}</p>
                          <div className="mask">
                            <span className="number">{index + 1}</span>
                            <div className="texts">
                              <p className="top10">{`${institution.top10_scholars_num} Winners`}</p>
                              <hr />
                              <p className="top100">{`${institution.top100_scholars_num -
                                institution.top10_scholars_num} Nominees`}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    )}
                  </Fragment>
                );
              })}
          </ul>

          <ul className="list institutes_list">
            {domains_topn_orgs &&
              domains_topn_orgs.map(field => {
                let flag = false;
                return (
                  <li key={field.name} className="institutes_item">
                    <span>{field[langKey]}</span>
                    <ul className="single_institution">
                      {field.orgs &&
                        field.orgs.map((item, index) => {
                          if (!item.name) {
                            flag = true;
                            return false;
                          }
                          return (
                            <Fragment key={item.name}>
                              {(index < 5 || (index === 5 && flag)) && (
                                <li className="org">
                                  <Link
                                    to={`/${aiType}${
                                      year ? '/year/2019' : ''
                                    }/organization/${encodeURIComponent(item.name)}`}
                                    target="_blank"
                                  >
                                    <div className="img_box">
                                      <img
                                        data-src={`${orgPath}/${item.name}.png`}
                                        src={PlaceImagePath}
                                        alt={item.name}
                                      />
                                    </div>
                                    <p className="winner">{`${item.top100_scholars_num} ${
                                      item.top100_scholars_num === 1 ? 'Scholar' : 'Scholars'
                                    }`}</p>
                                    <div className="mask">
                                      <span className="number">{index + 1}</span>
                                      <div className="texts">
                                        <p className="top10">{`${item.top10_scholars_num} Winners`}</p>
                                        <hr />
                                        <p className="top100">{`${item.top100_scholars_num -
                                          item.top10_scholars_num} Nominees`}</p>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              )}
                            </Fragment>
                          );
                        })}
                    </ul>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </>
  );
};

export default OrgsComponent;
