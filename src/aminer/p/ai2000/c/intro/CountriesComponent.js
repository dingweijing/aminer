import React, { Fragment } from 'react';
import { Link } from 'acore';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import consts from 'consts';

const { PlaceImagePath } = sysconfig;

const version = 'v2';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;

const CountriesComponent = props => {
  const { domains_countries, aiType, year } = props;

  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  return (
    <>
      {domains_countries && (
        <div id="countries_of_winners" className="part countries institutes">
          <FM id="ai2000.home.countries.title" defaultMessage="Countries of Winners" tagName="h2" />
          <ul className="list institutes_list">
            {domains_countries.map(country => {
              let flag = false;
              return (
                <li key={country.name} className="institutes_item">
                  <span>{country[langKey]}</span>
                  <ul className="single_institution">
                    {country.countries &&
                      country.countries.map((item, index) => {
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
                                  }/country/${encodeURIComponent(item.name)}`}
                                  target="_blank"
                                >
                                  <div className="img_box">
                                    <img
                                      data-src={`${orgPath}/${item.name}.png`}
                                      src={PlaceImagePath}
                                      alt={item.name}
                                    />
                                  </div>
                                  <p className="winner">{`${item.top100} ${
                                    item.top100 === 1 ? 'Scholar' : 'Scholars'
                                  }`}</p>
                                  <div className="mask">
                                    <span className="number">{index + 1}</span>
                                    <div className="texts">
                                      <p className="top10">{`${item.top10} Winners`}</p>
                                      <hr />
                                      <p className="top100">{`${item.top100 -
                                        item.top10} Nominees`}</p>
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

export default CountriesComponent;
