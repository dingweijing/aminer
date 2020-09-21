/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback, Fragment } from 'react';
import { connect, component, withRouter } from 'acore';
import consts from 'consts';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { FM, formatMessage, zhCN } from 'locales';
import { loadECharts4 } from 'utils/requirejs';
import { useChartResize } from 'utils/hooks';
import styles from './Country.less';

const version = 'v2';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;
const iconPath = `${consts.ResourcePath}/sys/aminer/ai10/v1`;

const Country = props => {
  const { dispatch, match } = props;
  const { ai10_female_data } = props;

  // console.log('ai10_female_data', ai10_female_data);
  useEffect(() => {
    if (!ai10_female_data) {
      dispatch({ type: 'aminerAI10/getFemaleOtherData' });
    }
  }, []);

  return (
    <section className={styles.country}>
      {/* <CounterDistribution data={countries} /> */}
      <CountryComponent data={ai10_female_data} />
      <OrgComponent data={ai10_female_data} />
      <GenderComponent data={ai10_female_data} />
    </section>
  );
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(Country);

const CountryComponent = props => {
  const { data } = props;
  const { countries } = data || {};
  const { country_desc, country_desc_zh } = data || {};
  return (
    <div className={styles.countryComponent}>
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(country_desc, country_desc_zh) }}
      />
      <div className="desc_title">
        <FM id="ai2000.female.country.country" />
      </div>
      <CountryLogo countries={countries} />
      <CountryChart data={countries} />
    </div>
  );
};

const CountryLogo = props => {
  const { countries } = props;
  return (
    <ul className="all_institutes_list">
      {countries &&
        countries.map((country, index) => {
          const { female, name } = country;
          return (
            <Fragment key={name}>
              {!!female && (
                <li className="org">
                  <span>
                    <div className="img_box">
                      <img src={`${orgPath}/${name}.png`} alt={name} />
                    </div>
                    <p className="winner">{`${female} ${female === 1 ? 'Scholar' : 'Scholars'}`}</p>
                  </span>
                </li>
              )}
            </Fragment>
          );
        })}
    </ul>
  );
};

const CountryChart = props => {
  const { data } = props;
  let countryChart;
  useEffect(() => {
    window.addEventListener('resize', () => {
      countryChart && countryChart.resize();
    });
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const female_precent = {};
    const country_names = data.map(country => {
      const { name, name_zh, female, male } = country;
      female_precent[name] = ((female / (female + male)) * 100).toFixed(1);
      female_precent[name_zh] = ((female / (female + male)) * 100).toFixed(1);
      return getLangLabel(name, name_zh);
    });
    const country_female = data.map(country => country.female);
    const country_male = data.map(country => country.male);
    const option = {
      title: {
        text: formatMessage({ id: 'ai2000.female.country.countrytitle' }),
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        padding: [10, 0, 0, 0],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        top: 42,
        data: [
          formatMessage({ id: 'aminer.person.gender.female' }),
          formatMessage({ id: 'aminer.person.gender.male' }),
        ],
      },
      grid: {
        top: 80,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        position: 'top',
        // boundaryGap: [0, 0.01],.
      },
      yAxis: {
        type: 'category',
        data: country_names.reverse(),
        axisLabel: {
          formatter: value => `${value} ${female_precent[value]}%`,
        },
      },
      series: [
        {
          name: formatMessage({ id: 'aminer.person.gender.female' }),
          type: 'bar',
          data: country_female.reverse(),
          label: {
            normal: {
              show: true,
              position: 'right',
            },
          },
        },
        {
          name: formatMessage({ id: 'aminer.person.gender.male' }),
          type: 'bar',
          data: country_male.reverse(),
          label: {
            normal: {
              show: true,
              position: 'right',
            },
          },
        },
      ],
    };
    setCountryChart(option);
  }, [data]);

  const setCountryChart = option => {
    loadECharts4(echarts => {
      countryChart = echarts.init(document.getElementById('coutry_chart'));
      countryChart.setOption(option);
    });
  };

  return <div id="coutry_chart" style={{ width: '100%', height: '1200px' }}></div>;
};

const OrgComponent = props => {
  const { data } = props;
  const { orgs } = data || {};
  const { country_conclusion, country_conclusion_zh } = data || {};
  return (
    <div className={styles.orgComponent}>
      {/* <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(country_desc, country_desc_zh) }}
      /> */}
      <div
        className="conclusion"
        dangerouslySetInnerHTML={{
          __html: getLangLabel(country_conclusion, country_conclusion_zh),
        }}
      />
      <div className="desc_title">
        <FM id="ai2000.female.country.org" />
      </div>
      <OrgLogo orgs={orgs} />
      {/* <div
        className="conclusion"
        dangerouslySetInnerHTML={{
          __html: getLangLabel(country_conclusion, country_conclusion_zh),
        }}
      /> */}
      <OrgChart data={orgs} />
    </div>
  );
};

const OrgLogo = props => {
  const { orgs } = props;
  return (
    <ul className="all_institutes_list">
      {orgs &&
        orgs.map((country, index) => {
          const { female, name } = country;
          return (
            <Fragment key={name}>
              {!!female && (
                <li className="org">
                  <span>
                    <div className="img_box">
                      <img src={`${orgPath}/${name}.png`} alt={name} />
                    </div>
                    <p className="winner">{`${female} ${female === 1 ? 'Scholar' : 'Scholars'}`}</p>
                  </span>
                </li>
              )}
            </Fragment>
          );
        })}
    </ul>
  );
};

const OrgChart = props => {
  const { data } = props;
  let orgChart;

  useEffect(() => {
    window.addEventListener('resize', () => {
      orgChart && orgChart.resize();
    });
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const female_precent = {};
    const org_names = data.map(country => {
      const { name, name_zh, female, male } = country;
      female_precent[name] = ((female / (female + male)) * 100).toFixed(1);
      female_precent[name_zh] = ((female / (female + male)) * 100).toFixed(1);
      return getLangLabel(name, name_zh);
    });
    const org_female = data.map(country => country.female);
    const org_male = data.map(country => country.male);
    const option = {
      title: {
        text: formatMessage({ id: 'ai2000.female.country.orgtitle' }),
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
        },
        padding: [10, 0, 0, 0],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        top: 42,
        data: [
          formatMessage({ id: 'aminer.person.gender.female' }),
          formatMessage({ id: 'aminer.person.gender.male' }),
        ],
      },
      grid: {
        top: 80,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        position: 'top',
        // boundaryGap: [0, 0.01],.
      },
      yAxis: {
        type: 'category',
        data: org_names.reverse(),
        axisLabel: {
          formatter: value => `${value} ${female_precent[value]}%`,
        },
      },
      series: [
        {
          name: formatMessage({ id: 'aminer.person.gender.female' }),
          type: 'bar',
          data: org_female.reverse(),
          label: {
            normal: {
              show: true,
              position: 'right',
            },
          },
        },
        {
          name: formatMessage({ id: 'aminer.person.gender.male' }),
          type: 'bar',
          data: org_male.reverse(),
          label: {
            normal: {
              show: true,
              position: 'right',
            },
          },
        },
      ],
    };
    setOrgChart(option);
  }, [data]);

  const setOrgChart = option => {
    loadECharts4(echarts => {
      orgChart = echarts.init(document.getElementById('org_chart'));
      orgChart.setOption(option);
    });
  };

  return <div id="org_chart" style={{ width: '100%', height: '500px' }}></div>;
};

const GenderComponent = props => {
  const { data } = props;
  const { domain_gender } = data || {};
  const { country_conclusion1, country_conclusion_zh1 } = data || {};
  return (
    <div className={styles.genderComponent}>
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(country_conclusion1, country_conclusion_zh1) }}
      />
      <div className="desc_title">
        <FM id="ai2000.female.country.gender" />
      </div>
      <DomainDistribution data={domain_gender} />
    </div>
  );
};
const DomainDistribution = props => {
  const { data } = props;
  return (
    <div className={styles.domainDistribution}>
      <ul className="list gender_list">
        {data &&
          data.map((item, i) => {
            const { name, name_zh, female, male } = item;

            return (
              <li key={name}>
                {/* <FM id={awards[i].id} defaultMessage={awards[i].defaultMessage} /> */}
                <span>{getLangLabel(name, name_zh)}</span>
                <div className="gender">
                  <div className="candidates heads">
                    <div className="candidates_right head">
                      <img src={`${iconPath}/female_portrait.png`} alt="" />
                      <span className="label">Female</span>
                      <span className="number">{`${(female * 100).toFixed(0)}%`}</span>
                    </div>
                    <div className="candidates_left head">
                      <span className="label">Male</span>
                      <span className="number">{`${(male * 100).toFixed(0)}%`}</span>
                      <img src={`${iconPath}/male_portrait.png`} alt="" />
                    </div>
                  </div>
                  <div className="lines">
                    <div className="lines_right" style={{ width: `${female * 100}%` }} />
                    <div className="lines_left" style={{ width: `${male * 100}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const CounterDistribution = props => {
  const { data } = props;
  return (
    <div className={styles.counterDistribution}>
      <ul className="list gender_list">
        {data &&
          data.map((item, i) => {
            const { country, female, male } = item;
            const male_percent = male / (male + female);
            const female_percent = female / (male + female);

            return (
              <li key={country}>
                {/* <FM id={awards[i].id} defaultMessage={awards[i].defaultMessage} /> */}
                <span>{country}</span>
                <div className="gender">
                  <div className="candidates heads">
                    <div className="candidates_left head">
                      <img src={`${iconPath}/male_portrait.png`} alt="" />
                      <span className="label">Male</span>
                      {/* <span className="number">{`${(male_percent * 100).toFixed(0)}%`}</span> */}
                      <span className="number">{male}</span>
                    </div>
                    <div className="candidates_right head">
                      <span className="label">Female</span>
                      {/* <span className="number">{`${(female_percent * 100).toFixed(0)}%`}</span> */}
                      <span className="number">{female}</span>
                      <img src={`${iconPath}/female_portrait.png`} alt="" />
                    </div>
                  </div>
                  <div className="lines">
                    <div className="lines_left" style={{ width: `${male_percent * 100}%` }} />
                    <div className="lines_right" style={{ width: `${female_percent * 100}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
