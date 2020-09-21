import React, { useMemo, useEffect, useState, memo } from 'react';
import { FM, formatMessage } from 'locales';
import { Select, Form, Col, Checkbox, Icon } from 'antd';
import { classnames } from 'utils';
import styles from './FieldComponent.less'

const CheckboxGroup = Checkbox.Group;

const { Option } = Select;

const ScholarFilter = props => {
  const { isMultiDomain, jconfs,pathname } = props;
  const { sex, setSex } = props;
  const { country, setCountry } = props;
  const { authorOrder, setAuthorOrder } = props;
  const { isRecentVersion, setIsRecentVersion } = props;
  const { checkedList, setCheckedList } = props;
  const { activeChinese, setChineseType } = props

  const [indeterminate, setIndeterminate] = useState();
  const [checkAll, setCheckAll] = useState();
  const [showConfs, setShowConfs] = useState(false);

  useEffect(()=>{
    setChineseType('')
  },[pathname])
  useEffect(() => {
    setShowConfs(false)
    setCheckAll(false)
    setCheckedList([])
  }, [jconfs])

  const handleChangeSex = e => {
    if (sex === e) {
      return;
    }
    setSex(e);
    // filterScholars({ gender_filter: e });
  };
  const handleChangeCountry = e => {
    if (country === e) {
      return;
    }
    setCountry(e);
    // filterScholars({ country_filter: e });
  };
  const handleChangeAuthorOrder = e => {
    if (authorOrder === e) {
      return;
    }
    setAuthorOrder(e);
    // filterScholars({ index_filter: e });
  };
  const handleChangeRecentVersion = value => {
    if ((isRecentVersion && value === 'recent10') || (!isRecentVersion && value === 'history')) {
      return;
    }
    setIsRecentVersion(!isRecentVersion);
  };

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const toggleShowConfs = () => {
    setShowConfs(!showConfs);
    if (showConfs) {
      setCheckedList([]);
      setIndeterminate(false);
      setCheckAll(false);
    }
  };

  const handleChinese = chineseType => {
    if (!chineseType) return;
    setChineseType(chineseType === activeChinese ? '' : chineseType)
  };

  const plainOptions =
    jconfs &&
    jconfs.map(jconf => {
      const { full_name, short_name, name } = jconf;
      return name;
      // return `${full_name}${short_name ? `(${short_name})` : ''}`;
    });

  return (
    <div className="filter_line">
      <div className="filter_item">
        <Form layout="inline">
          <Col>
            <Form.Item
              label={formatMessage({ id: 'aminer.person.gender', defaultMessage: 'Gender' })}
            >
              <Select defaultValue="" style={{ width: 100 }} onChange={handleChangeSex}>
                <Option value="">
                  <FM id="aminer.common.all" defaultMessage="All" />
                </Option>
                <Option value="male">
                  <FM id="aminer.person.gender.male" defaultMessage="Male" />
                </Option>
                <Option value="female">
                  <FM id="aminer.person.gender.female" defaultMessage="Female" />
                </Option>
              </Select>
            </Form.Item>
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
            <Form.Item
              label={formatMessage({
                id: 'ai2000.feild.author',
                defaultMessage: 'Author',
              })}
            >
              <Select defaultValue="" style={{ width: 100 }} onChange={handleChangeAuthorOrder}>
                <Option value="">
                  <FM id="aminer.common.all" defaultMessage="All" />
                </Option>
                <Option value="first">
                  <FM id="ai2000.feild.author.first" defaultMessage="First" />
                </Option>
                <Option value="last">
                  <FM id="ai2000.feild.author.last" defaultMessage="Last" />
                </Option>
                <Option value="other">
                  <FM id="ai2000.feild.author.other" defaultMessage="Other" />
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={formatMessage({
                id: 'ai2000.version.time',
                defaultMessage: 'Time-Frame',
              })}
            >
              <Select
                defaultValue={isRecentVersion ? 'recent10' : 'history'}
                style={{ width: 150 }}
                onChange={handleChangeRecentVersion}
              >
                <Option value="recent10">
                  <FM id="ai2000.version.time.recent" defaultMessage="Recent" />
                </Option>
                <Option value="history">
                  <FM id="ai2000.version.time.history" defaultMessage="History" />
                </Option>
              </Select>
            </Form.Item>

            <div className={styles.chineseIconGroup}>
              <div className="chineseIcon" onClick={handleChinese.bind(null, 'China')} >
                <Icon type="star" theme={activeChinese === 'China' ? 'filled' : 'outlined'} style={{ color: 'red' }}></Icon>
                <FM id="ai2000.version.time.chinese" />
              </div>
              <div className="chineseIcon" onClick={handleChinese.bind(null, 'Oversea')} >
                <Icon type="star" theme={activeChinese === 'Oversea' ? 'filled' : 'outlined'} style={{ color: 'blue' }}></Icon>
                <FM id="ai2000.version.time.chinese.aboard" />
              </div>
            </div>
          </Col>
          {!isMultiDomain && (
            <div>
              <div className="show_multi">
                <span onClick={toggleShowConfs}>
                  {showConfs && (
                    <FM
                      id="ai2000.confs.multi.cancel"
                      defaultMessage="Cancel multi journal / conference"
                    />
                  )}
                  {!showConfs && (
                    <FM id="ai2000.confs.multi" defaultMessage="Multi journal / conference" />
                  )}
                  <span className={`arrow ${showConfs ? 'arrow_up' : ''}`} />
                </span>
              </div>
              {showConfs && (
                <Form.Item>
                  <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    >
                      {formatMessage({
                        id: 'aminer.paper.delete.checkall',
                        defaultMessage: 'Check All',
                      })}
                    </Checkbox>
                  </div>
                  <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
                </Form.Item>
              )}
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default memo(ScholarFilter);
