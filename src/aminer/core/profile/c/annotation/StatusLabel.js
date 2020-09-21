import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { component, connect } from 'acore';
import { Form, Checkbox, Input, Button, message, Radio } from 'antd';
import { classnames } from 'utils';
import { formatMessage } from 'locales';
// import { Form } from 'amg/ui/form2';
import styles from './StatusLabel.less';

const { TextArea } = Input;

const StatusLabel = props => {
  const [status, setStatus] = useState(true);
  const [err_message, setErrorMessage] = useState('');
  const [base, setBase] = useState();

  const { dispatch, pid, passawayData } = props;

  // const [is_candles, setIsCandles] = useState(can_burncandles);
  // const [isPassedaway, setIsPassedaway] = useState(is_passedaway);
  // console.log('passawayData', passawayData);
  const { is_passedaway, disable_candles, profile } = passawayData || {};
  const [passaway, setPassaway] = useState(profile || {});
  const { passaway_reason, passaway_year, passaway_month, passaway_day } = passaway || {};
  const { birth_year, birth_month, birth_day } = passaway || {};

  useEffect(() => {
    // passaway.current = (props.passawayData && props.passawayData.profile) || {};
    setPassaway((props.passawayData && props.passawayData.profile) || {});
  }, [passawayData]);

  // const toggleStatus = () => {
  //   setStatus(!status);
  // };

  useEffect(() => {
    dispatch({
      type: 'editProfile/GetBaseNum',
      payload: { id: pid },
    }).then(res => {
      setBase(res);
    });
  }, []);

  const commit = ({ field, value }) => {
    const fields = [
      {
        field,
        value,
      },
    ];
    dispatch({
      type: 'editProfile/UpsertPersonAnnotation',
      payload: {
        id: pid,
        fields,
        force_update: true,
      },
    }).then(res => {
      if (res) {
        message.success('修改成功');
        dispatch({
          type: 'editProfile/updatePassawayInfo',
          payload: { field, value },
        });
        // dispatch({
        //   type: 'editProfile/GetPassawayInfo',
        //   payload: { id: pid },
        // });
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    });
  };

  const onChangeDeath = () => {
    commit({ field: 'is_passedaway', value: !is_passedaway });
  };

  const onChangeReason = e => {
    // passaway.current.passaway_reason = e.target.value;
    if (passaway_reason === e.target.value) {
      return;
    }
    commit({ field: 'profile.passaway_reason', value: e.target.value });
  };

  const checkNumber = () => {
    const reg = /^[\d]+$/;
    if (
      (passaway.current.passaway_year && !reg.test(passaway.current.passaway_year)) ||
      (passaway.current.passaway_month && !reg.test(passaway.current.passaway_month)) ||
      (passaway.current.passaway_day && !reg.test(passaway.current.passaway_day)) ||
      (passaway.current.birth_year && !reg.test(passaway.current.birth_year)) ||
      (passaway.current.birth_month && !reg.test(passaway.current.birth_month)) ||
      (passaway.current.birth_day && !reg.test(passaway.current.birth_day))
    ) {
      setErrorMessage('年、月、日只能填写数字');
    } else {
      setErrorMessage('');
    }
  };
  const checkValue = value => {
    const reg = /^[\d]+$/;
    if (value && !reg.test(value)) {
      message.error('只能填写数字');
      return false;
    }
    return true;
  };

  const onChangeDate = (field, e) => {
    if (passaway[field] === e.target.value - 0) {
      return;
    }
    if (!checkValue(e.target.value)) {
      return;
    }
    commit({ field: `profile.${field}`, value: e.target.value - 0 });
  };

  const onBlueBase = e => {
    if (!checkValue(e.target.value)) {
      return;
    }
    dispatch({
      type: 'editProfile/SetBaseNum',
      payload: { id: pid, base: e.target.value - 0 },
    }).then(res => {
      if (res) {
        message.success('修改成功');
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    });
  };
  const onChangeBase = e => {
    setBase(e.target.value);
  };

  const onChangeCandle = () => {
    dispatch({
      type: `editProfile/${disable_candles ? 'ForceBurnCandle' : 'DisableBurnCandle'}`,
      payload: {
        id: pid,
      },
    }).then(res => {
      if (res) {
        message.success('修改成功');
        // setIsCandles(!is_candles);
        // dispatch({
        //   type: 'editProfile/setCandlesInfo',
        //   payload: {
        //     value: !disable_candles,
        //   },
        // });
        if (!disable_candles) {
          dispatch({
            type: 'editProfile/setCandlesInfo',
            payload: {
              value: !disable_candles,
            },
          });
        } else {
          dispatch({
            type: 'editProfile/GetPassawayInfo',
            payload: { id: pid },
          });
        }
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!err_message) {
      const fields = [
        {
          field: 'is_passedaway',
          value: isPassedaway,
        },
      ];
      const reason =
        passaway.current.passaway_reason &&
        passaway.current.passaway_reason.trim().replace(/\n/g, '<br>');
      if (isPassedaway) {
        fields.push(
          {
            field: 'profile.passaway_reason',
            value: reason || '',
          },
          {
            field: 'profile.passaway_year',
            value: passaway.current.passaway_year ? passaway.current.passaway_year - 0 : 0,
          },
          {
            field: 'profile.passaway_month',
            value: passaway.current.passaway_month ? passaway.current.passaway_month - 0 : 0,
          },
          {
            field: 'profile.passaway_day',
            value: passaway.current.passaway_day ? passaway.current.passaway_day - 0 : 0,
          },
          {
            field: 'profile.birth_year',
            value: passaway.current.birth_year ? passaway.current.birth_year - 0 : 0,
          },
          {
            field: 'profile.birth_month',
            value: passaway.current.birth_month ? passaway.current.birth_month - 0 : 0,
          },
          {
            field: 'profile.birth_day',
            value: passaway.current.birth_day ? passaway.current.birth_day - 0 : 0,
          },
        );
      }

      dispatch({
        type: 'editProfile/UpsertPersonAnnotation',
        payload: {
          id: pid,
          fields,
          force_update: true,
        },
      }).then(res => {
        if (res) {
          message.success('修改成功');
          dispatch({
            type: 'editProfile/GetPassawayInfo',
            payload: { id: pid },
          });
        }
      }).catch((error) => {
        message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
      });
    }
  };

  // const { passaway_reason, passaway_year, passaway_month, passaway_day } = passaway.current;
  // const { birth_year, birth_month, birth_day } = passaway.current;

  return (
    <div className={classnames('specialzone_annotate', styles.statusLabel)}>
      <div className="top_lable">
        <span>状态标注</span>
        {/* <span
          onClick={toggleStatus}
          className={classnames('arrow', `arrow_${status ? 'up' : 'down'}`)}
        /> */}
      </div>
      {status && (
        <div className="form">
          <Form>
            <div className="form_item">
              <span className="label">是否死亡:</span>
              <Checkbox checked={is_passedaway} onChange={onChangeDeath} />
            </div>
            {is_passedaway && (
              <>
                <div className="form_item base">
                  <span className="label">基数:</span>
                  <Input
                    size="small"
                    value={base || ''}
                    onChange={onChangeBase}
                    onBlur={onBlueBase}
                  />
                </div>
                <div className="form_item">
                  <span className="label">出生年月日:</span>
                  <div className="date">
                    <Input
                      size="small"
                      defaultValue={birth_year || ''}
                      onBlur={onChangeDate.bind(null, 'birth_year')}
                    />
                    <span className="text">年</span>
                    <Input
                      size="small"
                      defaultValue={birth_month || ''}
                      onBlur={onChangeDate.bind(null, 'birth_month')}
                    />
                    <span className="text">月</span>
                    <Input
                      size="small"
                      defaultValue={birth_day || ''}
                      onBlur={onChangeDate.bind(null, 'birth_day')}
                    />
                    <span className="text">日</span>
                  </div>
                </div>
                <div className="form_item">
                  <span className="label">死亡年月日:</span>
                  <div className="date">
                    <Input
                      size="small"
                      defaultValue={passaway_year || ''}
                      onBlur={onChangeDate.bind(null, 'passaway_year')}
                    />
                    <span className="text">年</span>
                    <Input
                      size="small"
                      defaultValue={passaway_month || ''}
                      onBlur={onChangeDate.bind(null, 'passaway_month')}
                    />
                    <span className="text">月</span>
                    <Input
                      size="small"
                      defaultValue={passaway_day || ''}
                      onBlur={onChangeDate.bind(null, 'passaway_day')}
                    />
                    <span className="text">日</span>
                  </div>
                </div>
                <div className="form_item">
                  <span className="label">死亡原因:</span>
                  <TextArea
                    defaultValue={passaway_reason ? passaway_reason.replace(/<br>/g, '\n') : ''}
                    size="small"
                    autoSize
                    onBlur={onChangeReason}
                  />
                </div>
                <p className="error">{err_message}</p>
              </>
            )}
            <div className="btn">
              {/* <Button htmlType="submit" type="primary" size="small">
                确定
              </Button> */}
              {is_passedaway && (
                <div className="candles">
                  <Checkbox checked={disable_candles} onChange={onChangeCandle} />
                  <span className="text">禁止为其点蜡烛</span>
                </div>
              )}
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

StatusLabel.propTypes = {
  passawayData: PropTypes.object.isRequired,
};

export default component(
  connect(({ editProfile }) => ({ passawayData: editProfile.passawayData })),
)(StatusLabel);
