/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { connect, component, withRouter } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import helper, { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { Select, Form, Col } from 'antd';
import { Spin } from 'aminer/components/ui';
import { AI2000PersonList as PersonList } from 'aminer/p/ai2000/component';
import styles from './Female.less';

const { Option } = Select;

const Female = props => {
  const { dispatch, loading } = props;
  const { ai10_female_ranks, is_china } = props;
  const { ranks, desc, desc_zh, domains } = ai10_female_ranks || {};
  const [country, setCountry] = useState();
  // const [female_list, setFemaleList] = useState(ranks);
  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';

  useEffect(() => {
    if (!ranks) {
      return;
    }
    const ids = ranks.map(item => item.person_id);
    dispatch({
      type: 'aminerAI10/GetScholarsDynamicValue',
      payload: { ids },
    });
  }, [ranks]);

  useEffect(() => {
    if (!ranks) {
      getFemaleList();
    }
  }, []);

  const getFemaleList = () => {
    dispatch({ type: 'aminerAI10/getFemaleAwardRoster' });
  };

  const handleChangeCountry = e => {
    if (country === e) {
      return;
    }
    setCountry(e);
    // filterScholars({ country_filter: e });
  };

  const female_list = useMemo(() => {
    if (!ranks) {
      return null;
    }
    let temp = [...ranks];
    if (country) {
      temp = ranks.filter(item => item.country_type === country);
    }
    if (is_china) {
      temp = temp.filter(item => item.is_chinese);
    }
    return temp;
  }, [is_china, ranks, country]);

  const toggleFilter = () => {
    if (is_china) {
      helper.routeTo(
        props,
        null,
        {},
        {
          transferPath: [{ from: '/women-in-ai/:type', to: '/women-in-ai' }],
        },
      );
    } else {
      helper.routeTo(
        props,
        null,
        { type: 'chinese' },
        {
          transferPath: [{ from: '/women-in-ai', to: '/women-in-ai/:type' }],
        },
      );
    }
  };

  const nameRightZone = useMemo(
    () => [
      ({ person }) => {
        const { is_chinese } = person;
        return (
          <span key={16}>
            {is_chinese && (
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-china_star" />
              </svg>
            )}
          </span>
        );
      },
    ],
    [],
  );
  // -- actions
  return (
    <section className={styles.female}>
      <Spin loading={loading} />
      <div className="desc" dangerouslySetInnerHTML={{ __html: getLangLabel(desc, desc_zh) }} />

      {female_list && (
        <div className="filter">
          <div className="filter_item">
            <Form layout="inline">
              <Col>
                <Form.Item
                  label={formatMessage({
                    id: 'ai2000.feild.country',
                    defaultMessage: 'Country',
                  })}
                >
                  <Select defaultValue="" style={{ width: 130 }} onChange={handleChangeCountry}>
                    <Option value="">
                      <FM id="aminer.common.all" defaultMessage="All" />
                    </Option>
                    <Option value="China">
                      <FM id="ai2000.feild.country.china" defaultMessage="China" />
                    </Option>
                    <Option value="EU">
                      <FM id="ai2000.feild.country.eu" defaultMessage="European Union" />
                    </Option>
                    <Option value="United States">
                      <FM id="ai2000.feild.country.us" defaultMessage="United States" />
                    </Option>
                    <Option value="Other">
                      <FM id="ai2000.feild.country.other" defaultMessage="Other" />
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Form>
          </div>
          <span onClick={toggleFilter} className={classnames('filter_china', { active: is_china })}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-china_star" />
            </svg>
            <FM id="ai2000.female.chinese" />
          </span>
        </div>
      )}

      {female_list && female_list.length > 0 && (
        <PersonList
          // typeid={typeid}
          label={formatMessage({ id: 'ai2000.female.masterpiece', defaultMessage: 'Masterpiece' })}
          showAuthorCard={false}
          persons={female_list}
          nameRightZone={nameRightZone}
        />
      )}

      {!loading && ranks && (!female_list || female_list.length === 0) && (
        <div className="noresults">
          <FM id="aminer.common.noresults" defaultMessage="No Results" />
        </div>
      )}

      <div className="domain_desc">
        <div className="top">
          <FM id="ai2000.female.ranks.venues" />
        </div>
        <div>
          <FM id="ai2000.female.ranks.venues.desc" />
        </div>
      </div>

      {domains && (
        <ul className="list award_list">
          {domains.map((field, i) => (
            <li key={field.id} className="award_item">
              <span>{field[langKey]}</span>
              {/* <FM id={awards[i].id} defaultMessage={awards[i].defaultMessage} /> */}
              <div className="desc">
                {field.jconfs &&
                  field.jconfs.length > 0 &&
                  field.jconfs.map(jconf => (
                    <p key={jconf.full_name} className={classnames('jconf')}>
                      <span className="jconf_name">{`${jconf.full_name} ${
                        jconf.short_name ? `(${jconf.short_name})` : ''
                      }`}</span>
                    </p>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default component(
  withRouter,
  connect(({ loading, aminerAI10 }) => ({
    loading: loading.effects['aminerAI10/getFemaleAwardRoster'],
    ai10_female_ranks: aminerAI10.ai10_female_ranks,
  })),
)(Female);
