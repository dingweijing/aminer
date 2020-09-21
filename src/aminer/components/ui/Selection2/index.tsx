/* eslint-disable import/no-unresolved */
import React, { Component, useState, useEffect, useMemo, useRef } from 'react';
import { getLangLabel } from 'helper';
import { Form, Checkbox, Row, Col, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { IOptions, IOpts, ISubOpts } from './interface';
import styles from './style.less';

interface IProps extends IOptions {
  form: WrappedFormUtils;
}
let scrollTop = 0;

// 当窗口小于xxx的时候显示一个展开按钮
const Selection = (props: IProps) => {
  let submitData = null; // 最后提交的值
  const myRef = useRef();

  const {
    options,
    selectedKeys = {},
    form: { getFieldDecorator, getFieldsValue },
    onSelectChange = () => {},
    isMobile = false,
    isFold = true,
    setFoldState = () => {},
    openCallback = () => {},
  } = props;

  useEffect(() => {
    if (isMobile) {
      const el = myRef.current;
      el.scrollTop = scrollTop;
    }
  }, []);

  const onChange = (type: string, v: any, single: boolean = false, o: any, e: any) => {
    // onChange作用于setFields之前，由于没有提交事件，所以必须在这里处理最终值,single-是否为单选
    const obj = getFieldsValue();
    const prevValue = {
      ...obj,
    };

    const values = JSON.parse(JSON.stringify(prevValue));

    // 记住当前滚动位置
    if (isMobile) {
      const el = myRef.current;
      scrollTop = el.scrollTop;
    }

    if (single) {
      values[type] = v;
      submitData = values;
      onSelectChange(submitData, type, o);
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
    onSelectChange(submitData, type, o);
    e.stopPropagation();
  };

  const onFoldBtnClick = (state: boolean) => {
    if (typeof state === 'boolean') {
      if (!state) {
        openCallback();
      }
      setFoldState(state);
    }
  };

  const lang = sysconfig.Locale;

  return (
    <div
      ref={myRef}
      style={{
        width: isMobile ? (isFold ? '50px' : lang.includes('zh') ? '70%' : '83%') : '330px',
        display: isMobile ? (isFold ? 'flex' : 'unset') : 'unset',
        justifyContent: 'center',
        alignItems: 'center',
        height: isMobile ? (isFold ? '35px' : '430px') : 'auto',
        overflowY: isMobile ? (isFold ? 'hidden' : 'scroll') : 'unset',
        transition: 'all ease .4s',
        overflowX: 'hidden',
        backgroundColor: isMobile ? '#fff' : '',
        paddingLeft: isMobile ? (isFold ? '' : '5px') : '',
      }}
      className={styles.selection}
    >
      {
        isMobile && (
          <div
            className="foldBtn"
            style={{ top: isMobile ? (isFold ? 'unset' : '4px') : 'unset' }}
            onClick={onFoldBtnClick.bind(null, !isFold)}
          >
            <svg
              t="1596768879146"
              className={isFold ? 'icon' : 'icon solid'}
              viewBox="0 0 1638 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9048"
              width="48"
              height="48"
            >
              <path
                d="M152 62h1260c54 0 90 36 90 90s-36 90-90 90H152c-54 0-90-36-90-90s36-90 90-90z m0 360h1260c54 0 90 36 90 90s-36 90-90 90H152c-54 0-90-36-90-90s36-90 90-90z m0 360h1260c54 0 90 36 90 90s-36 90-90 90H152c-54 0-90-36-90-90s36-90 90-90z"
                p-id="9049"
                fill="#cdcdcd"
              ></path>
            </svg>
          </div>
        )
        /*  <div
            className="closeBtn"
            style={{ marginLeft: sysconfig.Locale.includes('en') ? '75%' : '63%' }}
            onClick={onFoldBtnClick.bind(null, true)}
          >
            <svg
              t="1597026458058"
              className="icon"
              viewBox="0 0 1088 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9048"
              width="48"
              height="48"
            >
              <path
                d="M922.624 9.152L1043.2 129.92 158.272 1014.848 37.632 894.08z"
                p-id="9049"
                fill="#cdcdcd"
              ></path>
              <path
                d="M37.632 129.856L158.272 9.152l884.992 884.992-120.64 120.704z"
                p-id="9050"
                fill="#cdcdcd"
              ></path>
            </svg>
          </div> */
      }
      <Form className="myForm">
        {(isMobile ? !isFold : true) &&
          options.map((item: IOpts) => {
            const { label, label_zh, key, opts, single, direction } = item;
            return (
              <div className="formItem" key={key}>
                <Form.Item label={getLangLabel(label, label_zh)}>
                  {getFieldDecorator(key, {
                    initialValue: selectedKeys[key] || [(opts && opts[0] && opts[0].value) || ''],
                  })(
                    single ? (
                      <Radio.Group
                        className={direction === 'row' ? 'myRadioGroup' : 'myRadioVertical'}
                      >
                        <Row>
                          {opts.map(o => (
                            <Col key={o.value}>
                              <Radio
                                className={
                                  o.value === selectedKeys[key]
                                    ? styles.radioChecked
                                    : styles.unChecked
                                }
                                key={o.value}
                                value={o.value}
                                onClick={e => onChange(key, e.target.value, single, o, e)}
                              >
                                {getLangLabel(o.label, o.label_zh)}
                              </Radio>
                            </Col>
                          ))}
                        </Row>
                      </Radio.Group>
                    ) : (
                      <Checkbox.Group
                        className={direction === 'row' ? 'myCheckGroup' : 'myCheckboxVertical'}
                      >
                        <Row>
                          {opts.map(o => (
                            <Col key={o.value}>
                              <Checkbox
                                value={o.value}
                                onClick={e => onChange(key, e.target.value, single, o, e)}
                              >
                                {getLangLabel(o.label, o.label_zh)}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    ),
                  )}
                </Form.Item>
              </div>
            );
          })}
      </Form>
    </div>
  );
};

export default Form.create()(Selection);
