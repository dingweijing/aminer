import React, { Component, useState, useEffect } from 'react';
import moment from 'moment';
import { getLangLabel } from 'helper';
import { Checkbox, Row, Col, DatePicker, Radio, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import styles from './style.less';

// TODO xuan remove moment.

const FormItem = Form.Item;

const DEFAULT_DATE = {
  start: moment('1850-01-01'),
  end: moment(),
};

const SelectionList = props => {
  let submitData = null; // 最后提交的值

  const {
    options,
    selectedKeys = {},
    showDatePicker = false,
    form: { getFieldDecorator, getFieldsValue, setFieldsValue },
    onSelectChange = () => {},
  } = props;

  const [yearStart, setYearStart] = useState(DEFAULT_DATE.start);
  const [yearEnd, setYearEnd] = useState(DEFAULT_DATE.end);
  const [isOpen1, setOpen1] = useState(false);
  const [isOpen2, setOpen2] = useState(false);

  const onChange = (type, v, single = false) => {
    // onChange作用于setFields之前，由于没有提交事件，所以必须在这里处理最终值,single-是否为单选
    const obj = getFieldsValue();
    const { start, end } = obj;
    const prevValue = {
      ...obj,
    };
    if (showDatePicker) {
      prevValue.start = start.format('YYYY');
      prevValue.end = end.format('YYYY');
    }
    const values = JSON.parse(JSON.stringify(prevValue));
    if (type === 'start' || type === 'end') {
      // 处理时间
      values[type] = v.format('YYYY');
      submitData = values;
      onSelectChange(submitData, type);
      return;
    }

    if (single) {
      values[type] = v;
      submitData = values;
      onSelectChange(submitData, type);
      return;
    }

    const idx = values[type].indexOf(v);

    if (idx > -1) {
      // 有则删掉，没有则添加
      if (Array.isArray(values[type])) {
        values[type].splice(idx, 1);
      } else {
        // 不是数组直接删属性
        delete values[type];
      }
    } else if (Array.isArray(values[type])) {
      values[type].push(v);
    } else {
      values[type] = v;
    }
    submitData = values;
    onSelectChange(submitData, type);
  };

  const changeDate1 = date => {
    setYearStart(date);
    setOpen1(false);
    onChange('start', date);
  };

  const changeDate2 = date => {
    setYearEnd(date);
    setOpen2(false);
    onChange('end', date);
  };

  const onOpen = (type, status) => {
    if (type === 1) {
      setOpen1(status);
    } else {
      setOpen2(status);
    }
  };
  /* eslint-disable no-restricted-syntax */

  useEffect(() => {
    for (const key in selectedKeys) {
      if (selectedKeys[key]) {
        setFieldsValue({ [key]: selectedKeys[key] });
      }
    }
  }, [JSON.stringify(selectedKeys)]);

  return (
    <div className={styles.wrapper}>
      <Form>
        {options.map(opt => {
          const { title, title_cn, options, key, defaultValue, span = 4 } = opt;
          return (
            <Row key={key}>
              <Col span={4}>{getLangLabel(title, title_cn)}</Col>
              <Col span={20}>
                <FormItem>
                  {getFieldDecorator(key, {
                    initialValue: selectedKeys[key]
                      ? selectedKeys[key]
                      : defaultValue || [options[0] && options[0].value],
                  })(
                    opt.single ? (
                      <Radio.Group style={{ width: '100%' }}>
                        <Row>
                          {options.map(o => (
                            <Col span={span} key={o.value}>
                              <Radio
                                value={o.value}
                                onClick={e => onChange(key, e.target.value, opt.single)}
                              >
                                {getLangLabel(o.name, o.name_cn)}
                              </Radio>
                            </Col>
                          ))}
                        </Row>
                      </Radio.Group>
                    ) : (
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          {options.map(o => (
                            <Col span={span} key={o.value}>
                              <Checkbox
                                value={o.value}
                                onClick={e => onChange(key, e.target.value)}
                              >
                                {getLangLabel(o.name, o.name_cn)}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    ),
                  )}
                </FormItem>
              </Col>
            </Row>
          );
        })}

        {showDatePicker && (
          <Row key="year">
            <Col span={4}>{getLangLabel('year', '年份')}</Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('start', {
                  initialValue: yearStart,
                })(
                  <DatePicker
                    open={isOpen1}
                    style={{ width: '100%' }}
                    onOpenChange={status => onOpen(1, status)}
                    format="YYYY"
                    mode="year"
                    onPanelChange={changeDate1}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}>
              ~
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('end', {
                  initialValue: yearEnd,
                })(
                  <DatePicker
                    open={isOpen2}
                    style={{ width: '100%' }}
                    onOpenChange={status => onOpen(2, status)}
                    format="YYYY"
                    mode="year"
                    onPanelChange={changeDate2}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};

export default Form.create()(SelectionList);
