import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { connect, component, Link, withRouter } from 'acore';
import { classnames } from 'utils';
import { Icon } from 'antd';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import { Spin } from 'aminer/components/ui';
import { sysconfig } from 'systems';
import { AI2000PersonList as PersonList } from 'aminer/p/ai2000/component';
import Certificate from 'aminer/p/ai2000/component/Certificate';
import { DomainDesc, ScholarFilter } from './index';
import styles from './FieldComponent.less';

const { AI2000_Default_Year } = sysconfig;

const data_version = '20200116';
const conf_list_domains = ['5dc122672ebaa6faa962c006'];
// const conf_list_domains = [];
const conflist_enter_img = `${consts.ResourcePath}/data/ranks/iclr2020/iclr2020.jpg`;

const FieldPage = props => {
  const {
    scholarList: persons,
    showMenu,
    dispatch,
    loading,
    isRecent,
    year,
    dynamic_id,
    hasVersion,
    pageData = {},
  } = props;
  const { isMultiDomain, selectDomains, history } = props; // from Menu multi domains
  const [total, setTotal] = useState();
  const [sex, setSex] = useState('');
  const [authorOrder, setAuthorOrder] = useState('');
  const [country, setCountry] = useState('');
  const [isMultiConf, setIsMultiConf] = useState(false);
  const [activeChinese, setChineseType] = useState('')
  const [checkedList, setCheckedList] = useState([]);
  const [isOldVersion, setIsOldVersion] = useState(false);
  const [isRecentVersion, setIsRecentVersion] = useState(isRecent);
  const [jconfs, setJconfs] = useState();

  const preConfs = useRef([]);
  const { location } = history
  const { pathname } = location


  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);
  const { id: typeid } = pageData;
  const nameLang = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';

  const trackType = useMemo(() => (isRecent ? 'ai10' : 'ai'), [isRecent]);

  const top10_defaultContentRankZone = useMemo(
    () => [
      ({ person }) => {
        const { chinese } = person;
        return (
          <span key={16}>
            {chinese && (
              <Icon
              type="star"
              className="chinese_icon"
              theme="filled"
              style={{ color: chinese === "Oversea" ? "blue" : "red" }}
            />
            )}
          </span>
        );
      },
      ({ person }) => {
        const { rank } = person;
        return (
          <div key={6} className={styles.personRanking}>
            {rank <= 3 && (
              <div className={styles.top}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#icon-ai10_rank_${rank}`} />
                </svg>
              </div>
            )}
            {rank > 3 && rank <= 10 && (
              <div className={classnames(styles.no, styles.top)}>
                <span>{rank}</span>
              </div>
            )}
            {rank > 10 && (
              <div className={styles.no}>
                <span>{rank}</span>
              </div>
            )}
          </div>
        );
      },
    ],
    [],
  );

  useEffect(() => {
    if (!isMultiDomain) {
      dispatch({
        type: 'aminerAI10/CheckDomainsExist',
        payload: {
          domain: typeid,
          year: y,
        },
      }).then(res => {
        // console.log('jconfs', res);
        setJconfs(res);
      });
    }
  }, [typeid]);

  const filterScholars = (
    tip,
    {
      gender_filter = sex,
      country_filter = country,
      index_filter = authorOrder,
      version = isOldVersion,
    } = {},
  ) => {
    // console.log({ gender_filter, country_filter, index_filter, version, isRecentVersion });
    const params = {
      // domain: typeid,
      top_n: 100,
      // recent_10: isRecentVersion,
      year: y,
    };

    if (isMultiDomain) {
      params.switches = ['withpub'];
      params.domain_ids = selectDomains;
      params.type = isRecentVersion ? 'AI 2000' : 'AI ALL';
    } else if (checkedList && checkedList.length > 0) {
      const conf_ids = checkedList.map(checked =>
        // const conf_name = checked;
        name_map[checked]
      );
      params.switches = ['withpub'];
      params.domain_ids = conf_ids;
      params.type = isRecentVersion ? 'Jconf_10' : 'Jconf_ALL';
    } else {
      params.domain = typeid;
      params.type = isRecentVersion ? 'AI 2000' : 'AI ALL';
    }

    if (gender_filter) {
      params.gender_filter = gender_filter;
    }
    if (index_filter) {
      params.index_filter = index_filter;
    }
    if (country_filter) {
      params.country_filter = country_filter;
    }
    if (version) {
      params.version = data_version;
    }


    if (!isMultiDomain && (!checkedList || checkedList.length === 0)) {
      if (!tip || (tip && preConfs.current.length !== 0)) {
        dispatch({
          type: 'aminerAI10/GetDomainTopScholars',
          payload: { ...params, chineseType: activeChinese },
        });
      }
    } else {
      dispatch({
        type: 'aminerAI10/GetMultDomainsTopScholars',
        payload: { ...params, chineseType: activeChinese },
      });
    }

    preConfs.current = checkedList;
  };

  useEffect(() => {
    dispatch({
      type: 'aminerAI10/GetTrack',
      payload: {
        data: [
          {
            type: `${trackType}${y}`,
            target_type: pageData.name,
          },
        ],
      },
    }).then(total_num => {
      setTotal(total_num);
    });
  }, [typeid]);

  useEffect(() => {
    if (!persons) {
      return;
    }
    const ids = persons.map(item => item.person_id);
    dispatch({
      type: 'aminerAI10/GetScholarsDynamicValue',
      payload: { ids },
    });
  }, [dynamic_id]);

  useEffect(() => {
    if (isMultiDomain && selectDomains && selectDomains.length === 0) {
      dispatch({
        type: 'aminerAI10/setScholarList1',
        payload: {
          scholarList: null,
          domain_id: '',
        },
      });
      return;
    }
    filterScholars(false);
  }, [sex, country, activeChinese, authorOrder, isOldVersion, isRecentVersion, isMultiDomain, selectDomains]);

  useEffect(() => {
    if (isMultiDomain && selectDomains && selectDomains.length === 0) {
      dispatch({
        type: 'aminerAI10/setScholarList1',
        payload: {
          scholarList: null,
          domain_id: '',
        },
      });
      return;
    }
    filterScholars(true);
  }, [checkedList]);

  const handleChangeVersion = () => {
    const verson = !isOldVersion;
    setIsOldVersion(verson);
  };

  // const final_persons = useMemo(() => {
  //   return (
  //     persons &&
  //     persons.map(item => {
  //       const { person, ...params } = item;
  //       return { ...person, ...params };
  //     })
  //   );
  // }, [persons]);

  const top10 = useMemo(() => persons && persons.filter(item => item && item.rank <= 10), [
    persons,
  ]);

  const top100 = useMemo(() => persons && persons.filter(item => item && item.rank > 10), [
    persons,
  ]);

  const conflist_link = useMemo(() => {
    const { alias, conf_name = 'iclr2020' } = pageData || {};
    return `/${isRecent ? 'ai2000' : 'ai'}/${alias}/${conf_name}`;
  }, [pageData]);

  const renderTitle = () => (
    <div className="home_title">
      <svg className="icon menu_icon" aria-hidden="true" onClick={showMenu}>
        <use xlinkHref="#icon-menu1" />
      </svg>
      <h1>
        <FM
          id="ai2000.field.title"
          defaultMessage="Most Influential Scholars"
          values={{ field: pageData[nameLang] }}
        />
        {total && (
          <span className="views">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-eye" />
            </svg>
            <span>{total}</span>
          </span>
        )}
        {hasVersion && (
          <span
            className={classnames('change_version', { active: isOldVersion })}
            onClick={handleChangeVersion}
          >
            <FM
              id="ai2000.oldversion.change"
              defaultMessage="change version"
              values={{
                version: isOldVersion
                  ? formatMessage({
                    id: 'ai2000.version.new',
                    defaultMessage: 'New',
                  })
                  : formatMessage({
                    id: 'ai2000.version.old',
                    defaultMessage: 'Old',
                  }),
              }}
            />
          </span>
        )}
      </h1>
    </div>
  );

  const personListParams = useMemo(
    () => ({
      showAuthorCard: false,
      typeid,
      nameRightZone: top10_defaultContentRankZone,
      rightBottomZone: [
        '__DEFAULT_PLACEHOLDER__',
        ({ person }) => {
          const { award_path } = person;
          return <Certificate pid={person.id} award_path={award_path} />;
        },
      ]
    }),
    [typeid],
  );

  const name_map = useMemo(() => {
    const obj = {};
    if (jconfs) {
      jconfs.forEach(item => {
        const { name, id } = item;
        obj[name] = id;
      });
    }
    return obj;
  }, [jconfs]);

  return (
    <div className={styles.field_page}>
      {!isMultiDomain && renderTitle()}
      <div className="home_content">
        <Spin loading={loading} time={0} />
        {!loading && isRecent && conf_list_domains.includes(typeid) && (
          <div className="fix_box desktop_device">
            <div className="fix_inner">
              <Link to={conflist_link} target="_blank">
                <img src={conflist_enter_img} alt="" />
              </Link>
            </div>
          </div>
        )}
        {!isMultiDomain && (
          <DomainDesc isRecent={isRecent} y={y} pageData={pageData} nameLang={nameLang} />
        )}
        <ScholarFilter
          jconfs={jconfs}
          isMultiDomain={isMultiDomain}
          isMultiConf={isMultiConf}
          setIsMultiConf={setIsMultiConf}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          sex={sex}
          setSex={setSex}
          country={country}
          setCountry={setCountry}
          authorOrder={authorOrder}
          setAuthorOrder={setAuthorOrder}
          isRecentVersion={isRecentVersion}
          setIsRecentVersion={setIsRecentVersion}
          activeChinese={activeChinese}
          setChineseType={setChineseType}
          pathname={pathname}
        />

        {persons && persons.length > 0 && (
          <div>
            {(sex || authorOrder || country || isMultiDomain) && (
              <PersonList {...personListParams} persons={persons} />
            )}
            {!sex && !authorOrder && !country && persons && !isMultiDomain && (
              <div>
                <div className="top10_title">
                  <FM
                    id="ai10.field.top10"
                    defaultMessage="Top 10 Most Influential Scholars"
                    tagName="h2"
                  />
                </div>

                <PersonList {...personListParams} persons={top10} />

                <div className="top100_title">
                  <FM
                    id="ai10.field.top100"
                    defaultMessage="Top 100 Most Influential Scholars"
                    tagName="h2"
                  />
                </div>

                <PersonList enableImgLazyLoad persons={top100} {...personListParams} />
              </div>
            )}
          </div>
        )}
        {!loading && (!persons || persons.length === 0) && (
          <div className="noresults">
            <FM id="aminer.common.noresults" defaultMessage="No Results" />
          </div>
        )}
      </div>
    </div>
  );
};

export default component(withRouter,
  connect(({ loading, aminerAI10 }) => ({
    loading:
      loading.effects['aminerAI10/GetDomainTopScholars'] ||
      loading.effects['aminerAI10/GetMultDomainsTopScholars'],

    scholarsDynamicValue: aminerAI10.scholarsDynamicValue,
    dynamic_id: aminerAI10.dynamic_id,
    scholarList: aminerAI10.scholarList,
  })),
)(memo(FieldPage));

// [
//   {
//       "action":"mostinfluentialscholars.GetTopNScholars",
//       "parameters":{
//           "domain_id":"5dee1f3316f1663a63471ba9",
//           "recent_10":true,
//           "year":2019,
//           "top_n":100,
//           "index_filter":"first",
//           "gender_filter":"male"
//       }
//   }
// ]
