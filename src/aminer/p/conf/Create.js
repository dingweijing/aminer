import React, { useEffect, useState } from 'react';
import { page, connect, Link, FormCreate, history } from 'acore';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { Spin } from 'aminer/components/ui';
import { formatMessage, FM } from 'locales';
import cookies from 'utils/cookie';
import { isLogin, isAuthed } from 'utils/auth';
import { BasicForm, Breadcrumb } from './c';
import styles from './Create.less';

const Create = props => {
  const { form, dispatch } = props;

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      const fields = {};
      if (!err) {
        Object.entries(values).map(([field, value]) => {
          if (field === 'date') {
            fields.begin_date = value[0];
            fields.end_date = value[1];
          } else if (field === 'year' || field === 'paper_count') {
            fields[field] = parseInt(value, 10);
          } else if (value) {
            fields[field] = value;
          }
        });
        // order 会议的排序
        fields.order = 0;
      }
      dispatch({
        type: 'aminerConf/CreateConf',
        payload: fields,
      }).then(result => {
        if (result.succeed) {
          window.location.reload()
        }
      });
    });
  };

  useEffect(() => {
    form.setFieldsValue({ is_public: false });
  }, []);
  return (
    <Layout>
      <div className={styles.createBlock}>
        <Breadcrumb routes={['confIndex', 'create']} />
        <div className={styles.createConf}>
          <BasicForm form={form} handleSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default page(
  connect(({ auth }) => ({ user: auth.user, roles: auth.roles })),
  FormCreate(),
)(Create);
// const flags = ['is_public'];
// , "enable_xiaomai", "enable_mrt", "enable_knowledge_atlas", "enable_relation", "enable_report", "enable_statistics"
