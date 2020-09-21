import React, { useMemo, Fragment, useState, useRef } from 'react';
import { component, connect, Link, withRouter } from 'acore';
import { classnames } from 'utils';
import { getProfileUrl, getImageType } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { Hole } from 'components/core';
import { FM, formatMessage } from 'locales';
import PropTypes from 'prop-types';
import { sysconfig } from 'systems';
import display from 'utils/display';
import { Spin as ASpin } from 'aminer/components/ui';
import { Spin } from 'antd';
import styles from './DropDownData.less';

const DropDownData = props => {
  const { label, beforeDown, defaultCurrent } = props;
  const { dataZone, loading } = props;

  const [flag, setFlag] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState(null);
  const [cur_tab, setCutTab] = useState(defaultCurrent || '');
  const cur_down = useRef();

  const toggleShow = () => {
    if (beforeDown && dataZone.length === 0) {
      beforeDown();
    }
    setFlag(!flag);
  };

  const changeCur = key => {
    if (!cur_tab && beforeDown && cur_down.current !== key) {
      beforeDown({ key, reset: true });
    }
    setCutTab(key === cur_tab ? '' : key);
    // if (cur_down.current !== key && !key) {
    // }
    if (key !== cur_tab && beforeDown && cur_down.current !== key) {
      beforeDown({ key, reset: false });
    }
    cur_down.current = key;
  };

  return (
    <div className={styles.personTopPubs}>
      <div className={classnames('opr')}>
        {label && typeof label === 'string' && (
          <>
            <div className="pubBtn" onClick={toggleShow}>
              {label && <span>{label}</span>}
              {!flag && <i className="fa fa-angle-down" />}
              {flag && <i className="fa fa-angle-up" />}
            </div>
            {loading && <Spin spinning={loading} size="small" />}
          </>
        )}
        {label &&
          Array.isArray(label) &&
          label.length > 0 &&
          label.map(item => {
            const { text, key } = item;
            return (
              <div className="pub_btn_item" key={key}>
                <div
                  className={classnames('pubBtn', { active: cur_tab === key })}
                  onClick={changeCur.bind(null, key)}
                >
                  <span>{text}</span>
                  {!(cur_tab === key) && <i className="fa fa-angle-down" />}
                  {cur_tab === key && <i className="fa fa-angle-up" />}
                </div>
                <div className="loading_warp">
                  {loading && cur_tab === key && <Spin spinning={loading} size="small" />}
                </div>
              </div>
            );
          })}
      </div>

      {/* flag */}
      <div
        className={classnames('pubList', {
          hiddenList: !(flag || cur_tab),
          showList: flag || cur_tab,
        })}
      >
        {/* {loading && <ASpin loading={loading} />} */}
        {/* <FM id='aminer.person.similar.experts' defaultMessage='Similar Experts' /><span>:</span> */}
        <Hole
          name="PersonList.contentBottomZone"
          fill={dataZone}
          defaults={defaultZone.dataZone}
          param={{}}
          config={{ containerClass: 'contentBottomZone' }}
        />
      </div>
      {/* {flag && !data && <FM id="com.PersonList.message.noResults" defaultMessage="No Results" />} */}
    </div>
  );
};
DropDownData.propTypes = {
  // label: PropTypes.string,
};
DropDownData.defaultProps = {
  // label: formatMessage({ id: 'ai10.person.pub.select' }),
};
export default component(withRouter, connect())(DropDownData);

const defaultZone = {
  dataZone: [],
};
