import React, { useEffect, useState } from 'react';
import { page, connect, FormCreate } from 'acore';
import moment from 'moment';
import { formatMessage, FM } from 'locales';
import { message } from 'antd';
import { BasicForm } from './c';

const UpdateConfInfo = props => {
  const { conf, form, dispatch } = props;

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      const fields = {};
      if (!err) {
        Object.entries(values).map(([field, value]) => {
          // 时间组件返回的是数组
          if (field === 'date') {
            fields.begin_date = value[0];
            fields.end_date = value[1];
          } else if (field === 'year' || field === 'paper_count') {
            fields[field] = parseInt(value, 10);
          } else if (value) {
            fields[field] = value;
          }
        });
        fields.id = conf.id;
        // TODO:27号 不填会报错，以后删除掉
        fields.order = conf.order;
      }
      dispatch({
        type: 'aminerConf/UpdateConf',
        payload: fields,
      }).then(result => {
        if (result.succeed) {
          message.success('修改成功');
          dispatch({ type: 'modal/close' });
        }
      });
    });
  };
  useEffect(() => {
    // form.setFieldsValue({ is_public: false });
    const date = [];
    if (conf) {
      Object.entries(conf).map(([flag, value]) => {
        switch (flag) {
          case 'begin_date':
            date[0] = moment(value);
            break;
          case 'end_date':
            date[1] = moment(value);
            break;
          default:
            return form.setFieldsValue({ [flag]: value });
        }
      });
    }
    form.setFieldsValue({ date });
  }, []);
  return (
    <div>
      <BasicForm form={form} handleSubmit={handleSubmit} type="update" />
    </div>
  );
};
export default page(connect(), FormCreate())(UpdateConfInfo);
// const flags = ['is_public'];
// 'enable_xiaomai',
// 'enable_mrt',
// 'enable_knowledge_atlas',
// 'enable_relation',
// 'enable_report',
// 'enable_statistics',
