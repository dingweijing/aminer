import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { connect, component, Link } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { Row, Col } from 'antd';
import ProfileInfoItem from './ProfileInfoItem';
import styles from './PersonMergeRefer.less';

const PersonMergeRefer = props => {
  const { checkIds, dispatch } = props;
  const [persons, setPersons] = useState();

  useEffect(() => {
    if (checkIds && checkIds.length) {
      dispatch({
        type: 'editProfile/getPerson',
        payload: { ids: checkIds }
      }).then((data) => {
        setPersons(data);
      })
    }
  }, [checkIds]);

  const renderGender = (v) => {
    return v === 'male' ? '男' : '女';
  }

  const renderItems = useCallback((person) => {
    const { profile = {}, name, name_zh } = person;
    const { bio, edu, work, org, org_zh, ...params } = profile;
    if (!params) { return null };
    const items = Object.keys(params);
    if (name) { items.unshift('name') }
    if (name_zh) { items.unshift('name_zh') }
    return (
      <Row>
        {items.map((n) => {
          if ((n === 'name' && person[n]) || (n === 'name_zh' && person[n])) {
            return (
              <Fragment key={n}>
                <Col className={classnames(styles.label, { [styles.title]: n.includes('name') })} span={3}>
                  {formatMessage({ id: `aminer.person.${n}`, defaultMessage: n === 'name' ? '姓名' : '中文名', })}：</Col>
                <Col className={classnames(styles.text, { [styles.title]: n.includes('name') })} span={8}>{person[n]}</Col>
              </Fragment>
            )
          }
          else if (params[n]) {
            return (
              <Fragment key={n}>
                <Col className={styles.label} span={3}>
                  {formatMessage({ id: `aminer.person.${n}`, defaultMessage: n })}：</Col>
                <Col className={styles.text} span={8}>{n === 'gender' ? renderGender(params[n]) : params[n]}</Col>
              </Fragment>
            )
          }
        })}
      </Row>
    )
  }, []);

  return (
    <div className={styles.personMergeRefer}>
      {persons && persons.map((n) => {
        return (
          <div key={n.id} className={styles.item}>
            {/* {renderItems(n)} */}
            <ProfileInfoItem data={n} />
          </div>
        )
      })}
    </div>
  )
}

export default component(connect())(PersonMergeRefer)
