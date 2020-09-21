/**
 *  Created by BoGao on 2018-03-28;
 *  Refactor by BoGao on 2018-07-4;
 */
import React, { useState } from 'react';
import { usePrevious } from 'helper/hooks';

import { component, connect, FormCreate } from 'acore';
import { Input, Form, Button, Icon } from 'antd';
import { classnames } from 'utils';
import { PersonList } from '@/components/person';
import PersonSelectorCandidates from './PersonSelectorCandidates';
import styles from './PersonSelector.less';

const PersonSelector = props => {
  const { form, person } = props;
  const { getFieldDecorator } = form;

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState();
  const [org, setOrg] = useState();
  // const [personInState, setPersonInState] = useState({});

  console.log('----))))>>> ', person);

  const onSearch = e => {
    e.preventDefault();
    setModalVisible(true);
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setName(values.name);
        setOrg(values.org);
      }
    });
    // TODO services没有这个方法>matchPerson
  };

  const onSelect = (id, selectedPerson) => {
    if (props.onSelect) {
      const result = props.onSelect(id, selectedPerson);
    }
    setModalVisible(false);
    // setPersonInState(selectedPerson);
  };

  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
    // close modal. TODO only close if success.
    setModalVisible(false);
  };

  const { className, hideSelectedPerson } = props;
  // console.log('---------------++', person, personInState, hideSelectedPerson);

  return (
    <div className={classnames(styles.personSelector, className)}>
      <Form onSubmit={onSearch}>
        <div className={styles.formWrap}>
          <div className={styles.formContainer}>
            <Form.Item className={styles.inputName}>
              {getFieldDecorator('name')(
                <Input placeholder="姓名" autoComplete="off" />,
              )}
            </Form.Item>
            <Form.Item className={styles.inputOrg}>
              {getFieldDecorator('org')(
                <Input placeholder="工作单位" autoComplete="off" />,
              )}
            </Form.Item>
          </div>
          <Button
            className={styles.searchBtn}
            htmlType="submit" type="primary"
            onClick={onSearch}>
            <span><Icon type="search" /></span>
          </Button>
        </div>
      </Form>

      <div className={styles.matched}>
        {/* TODO 重写这个组件 */}
        {person && !hideSelectedPerson && (
          <PersonList
            type="tiny"
            className={styles.personList}
            persons={[person]}
            rightZoneFuncs={[]}
          // user={this.props.app.user}
          // expertBaseId={expertBaseId}
          // afterTitleBlock={theme.PersonList_AfterTitleBlock}
          // titleRightBlock={}
          // bottomZoneFuncs={this.props.PersonList_BottomZone}
          // didMountHooks={sysconfig.PersonList_DidMountHooks}
          // UpdateHooks={this.props.PersonList_UpdateHooks}
          // tagsLinkFuncs={this.props.onSearchBarSearch}
          // currentBaseChildIds={currentBaseChildIds}
          // plugins={this.props.plugins}
          />
        )}
      </div>

      {modalVisible && (
        <PersonSelectorCandidates
          name={name} org={org}
          onSelect={onSelect}
          onCancel={onCancel}
        />
      )}

    </div>
  );
}

export default component(
  connect(), FormCreate(),
)(PersonSelector);
