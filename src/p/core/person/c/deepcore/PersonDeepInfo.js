/**
 * Created by BoGao on 2019/5/27.
 */
import React from 'react';
// import { Form } from '@ant-design/compatible';
import { Form } from 'antd';
import styles from './PersonDeepInfo.less';

const UnsetBlock = <div className="unset">UNSET</div>;

// PersonDeepInfo
const PersonDeepInfo = props => {
  const { person } = props;

  if (!person) {
    return false;
  }

  return (
    <div className={styles.container}>
      <Form.Item label="names">
        {person.names === undefined && UnsetBlock}
        {person.names && person.names.map(name => `${name.n}(${name.w}); `)}
      </Form.Item>

      <Form.Item label="names_zh">
        {person.names_zh === undefined && UnsetBlock}
        {person.names_zh && person.names_zh.map(name => `${name.n}(${name.w}); `)}
      </Form.Item>

      <Form.Item label="name_sorted">
        {person.name_sorted === undefined ? UnsetBlock : person.name_sorted}
      </Form.Item>

      <Form.Item label="name_zh_sorted">
        {person.name_zh_sorted === undefined ? UnsetBlock : person.name_zh_sorted}
      </Form.Item>
    </div>
  );
};

export default PersonDeepInfo;
