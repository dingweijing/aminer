/**
 *  Created by BoGao on 2018-03-28;
 *  Refactor by BoGao on 2018-07-4;
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, FormCreate } from 'acore';
import { Modal, Button, Spin, Pagination, Form, Input, Icon } from 'antd';
import { PersonList } from 'components/person/index';
import styles from './PersonSelectorCandidates.less';

const FormItem = Form.Item;

// TODO focus.
const PageSize = 20;

@FormCreate()
@connect(({ loading }) => ({ loading }))
export default class PersonSelectorCandidates extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    personCandidates: null,
    name: null,
    org: null,
    pagination: {
      showSizeChanger: true, // no use
      showQuickJumper: true, // no use
      showTotal: total => `共 ${total} 条`, // no use
      current: 1,
      pageSize: PageSize,
      total: null,
    },
  };

  componentDidMount() {
    const { name, org, form } = this.props;
    if (name) {
      this.searchPersonCandidates(name, org, 1);
    }
    this.setState({ name, org });
    form.setFieldsValue({ name, org });
  }

  onSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && values.name) {
        const { name, org } = values;
        this.setState({ name, org });
        this.searchPersonCandidates(name, org, 1);
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.clearData();
  };

  onPageChange = (page) => {
    const { name, org } = this.state;
    this.searchPersonCandidates(name, org, page);
  };

  onSelectPerson = (e) => {
    const { onSelect } = this.props;
    const { person } = e || {};
    const { id } = person;
    if (onSelect) {
      onSelect(id, person);
    }
  };

  clearData = (personData) => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, total: null, offset: 0, current: 0 },
      personCandidates: personData,
    });
  };

  searchPersonCandidates = (name, org, page) => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    const { pageSize } = pagination;
    dispatch({
      type: 'person/choosePerson',
      payload: {
        name, org,
        offset: (page - 1) * pageSize,
        size: pageSize,
      },
    }).then((data) => {
      if (data && data.items) {
        const { total } = data;
        const offset = (page - 1) * pageSize;
        const current = Math.floor(offset / pageSize) + 1;
        this.setState({
          pagination: { ...pagination, total, offset, current },
          personCandidates: data.items,
        });
      } else {
        this.clearData([]);
      }
    });
  };

  selectPersonBtn = (person) => {
    return (
      <div key={100}>
        <Button onClick={this.onSelectPerson.bind(this, person)} size="small">选择</Button>
      </div>
    );
  };

  render() {
    const { loading, form } = this.props;
    const { personCandidates, name, org, pagination } = this.state;
    const { current, pageSize, total } = pagination;

    const emptyQuery = !(name || org);

    const { getFieldDecorator } = form;

    const load = loading.effects['person/choosePerson'];

    return (
      <Modal
        className={styles.personSelect}
        visible
        title="选择专家"
        onCancel={this.onCancel}
        maskClosable={false}
        footer={null}
        width="630px"
        bodyStyle={{ height: 'calc(78vh - 0px)', overflowY: 'scroll' }}
      >

        <Form onSubmit={this.onSearch}>
          <div className={styles.formWrap}>
            <div className={styles.formContainer}>
              <FormItem className={styles.inputName}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入姓名！' }],
                })(
                  <Input placeholder="姓名" autoComplete="off" />,
                )}
              </FormItem>
              <FormItem className={styles.inputOrg}>
                {getFieldDecorator('org')(
                  <Input placeholder="工作单位" autoComplete="off" />,
                )}
              </FormItem>
            </div>
            <Button
              className={styles.searchBtn}
              htmlType="submit" type="primary"
              onClick={this.onSearch}
            >
              <Icon type="search" /><span>搜索</span>
            </Button>
          </div>
        </Form>

        {emptyQuery && <div className={styles.notes}>请输入姓名或单位</div>}
        {!emptyQuery && (
          <Spin spinning={load}>
            <PersonList
              persons={personCandidates} type="tiny"
              PersonList_PersonLink_NewTab
              rightZoneFuncs={[this.selectPersonBtn]}
              showIndices={['h_index', 'citations', 'num_pubs']}
              emptyPlaceHolder={null}
            />
            {total && (
              <div style={{ textAlign: 'center' }}>
                <Pagination
                  showQuickJumper
                  current={current}
                  defaultCurrent={1}
                  defaultPageSize={pageSize}
                  total={total}
                  onChange={this.onPageChange}
                />
              </div>
            )}
          </Spin>
        )}

      </Modal>
    );
  }
}
