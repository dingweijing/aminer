import React, { Component } from 'react';
import { connect, FormCreate } from 'acore';
import { Modal, Form, Input, Button, message, Icon, Radio, InputNumber, Tag } from 'antd';
import styles from './AddEBMenuItem.less';
import PropTypes from 'prop-types';
import { sysconfig } from 'systems';

// TODO 需要可以配置创建的时候弹出的是哪个控件。

@FormCreate()
@connect(({ expertbaseTree }) => ({ expertbaseTree })) // TODO
export default class AddEBMenuItem extends Component {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.string,
    onGetData: PropTypes.func,
  };

  static defaultProps = {
    label: 'Create',
    icon: 'plus',
  };

  state = { // TODO
    data: null,
    visible: false,
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  handleOk = () => {
    const { dispatch } = this.props;

    // TODO dispatch 提交数据
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const parent = this.state.data ? [this.state.data.id] : [];
        const data = {
          name: values.name || '',
          name_zh: values.name_zh || '',
          desc: values.desc || '',
          desc_zh: values.desc_zh || '',
          is_public: values.isPublic !== '1',
          order: values.order,
          logo: values.logo || '',
          price: values.price ? parseInt(values.price) : 0
        };

        const { tags } = this.state;
        if (tags.length > 0) {
          const labels = tags.map((item) => {
            return {
              label_type: "global",
              value: item
            }
          });
          data.labels = labels;
        }

        const node = data;
        if (data.name.length > 0 || data.name_zh.length > 0) {
          if (this.props.type === 'edit') {
            data.id = this.state.data.id || '';
            this.handleCancel();
            dispatch({
              type: 'expertbaseTree/UpdateExperBaseByID',
              payload: { data },
            }).then((info) => {
              if (info.succeed) {
                dispatch({ type: 'expertbaseTree/updateNode', payload: { node } });
                message.success('更新成功');
                this.handleCancel();
              } else {
                message.error('更新失败');
              }
            });
          } else {
            data.parents = parent || [];
            dispatch({
              type: 'expertbaseTree/createExpertBase',
              payload: { data },
            }).then((info) => {
              if (info && info.succeed) {
                node.id = info.items && info.items[0];
                dispatch({
                  type: 'expertbaseTree/getExperBaseByID',
                  payload: { ids: [node.id] || [] },
                }).then((data = {}) => {
                  dispatch({
                    type: 'expertbaseTree/addNode',
                    payload: {
                      node: data,
                      id: this.state.data ? this.state.data.id : 'root'
                    },
                  });
                  message.success('添加成功');
                  this.handleCancel();
                });
              } else {
                message.error('添加失败');
              }
            });
          }
        } else {
          message.error('请填写智库名称！');
        }
      }
    }
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  changeVisible = () => {
    const { dispatch, form, type, onGetData, expertbaseTree } = this.props;
    form.setFieldsValue({ isPublic: '1' });
    const data = onGetData && onGetData();
    const id = data && data.id;
    if (id) {
      const { treeIndex } = expertbaseTree;
      const newData = treeIndex && treeIndex[id];
      this.setState({ visible: true, data: newData });
    } else {
      this.setState({ visible: true });
    }
    if (type === 'edit') {
      dispatch({
        type: 'expertbaseTree/getExperBaseByID',
        payload: { ids: [data.id] || [] },
      }).then((newData = {}) => {
        const name = newData.name ? newData.name.toString() : '';
        form.setFieldsValue({
          name,
          name_zh: newData.name_zh || '',
          desc: newData.desc || '',
          desc_zh: newData.desc_zh || '',
          isPublic: newData.is_public ? '2' : '1',
          order: newData.order,
          logo: newData.logo,
          price: newData.price || 0,
          // address: data.address || '',
        });
        const tags = newData && newData.labels && newData.labels.map(item => item.value) || [];
        this.setState({ tags });
      });
    }
    this.props.callbackParent && this.props.callbackParent();
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  saveInputRef = input => this.input = input;

  render() {
    const { label, icon, className, type } = this.props;
    const { visible, data, inputVisible, tags, inputValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { name } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const showPriceItem = sysconfig.Show_price;
    const showLabelItem = sysconfig.Show_label;

    return [
      <div key={0} className={className} onClick={this.changeVisible}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref={`#${icon}`} />
        </svg>
        <span>{label}</span>
      </div>,
      <Modal key={1}
        className={styles.addEbMenuItem}
        visible={visible}
        title={name}
        style={{ top: 20 }}
        wrapClassName="orgtreemodal"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        zIndex={1000}
        footer={[
          <Button key="back" onClick={this.handleCancel}>返回</Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            提交
               </Button>,
        ]}>
        <Form onSubmit={this.handleOk}>
          {type !== 'edit' && <Form.Item
            {...formItemLayout}
            label="创建的智库为:"
          >
            {data ? <h5>{data.name_zh || data.name} 子智库</h5> : <h5>根智库</h5>}
          </Form.Item>}
          {type === 'edit' && <Form.Item
            {...formItemLayout}
            label="修改的智库为:"
          >
            {data ? <h5>{data.name_zh || data.name}</h5> : <h5></h5>}
          </Form.Item>}
          <Form.Item
            {...formItemLayout}
            label="英文名称:"
          >
            {getFieldDecorator('name', {
              rules: [{ required: false, message: '请输入英文名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="中文名称:"
          >
            {getFieldDecorator('name_zh', {
              rules: [{ required: false, message: '请输入中文名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="英文简介:"
          >
            {getFieldDecorator('desc', {
              rules: [{ required: false, message: '请输入英文简介' }],
            })(<Input.TextArea rows={4} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="中文描述:"
          >
            {getFieldDecorator('desc_zh', {
              rules: [{ required: false, message: '请输入中文描述' }],
            })(<Input.TextArea rows={4} />)}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="LOGO:"
          >
            {getFieldDecorator('logo', {
              rules: [{ required: false, message: '请输入智库logo' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="顺序:"
          >
            {getFieldDecorator('order', {
              rules: [{ required: false, message: '请输入序号' }],
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="是否公开:"
          >
            {getFieldDecorator('isPublic', {})(<Radio.Group>
              <Radio value="1">不公开</Radio>
              <Radio value="2">公开</Radio>
            </Radio.Group>)}
          </Form.Item>
          {showPriceItem && <Form.Item
            {...formItemLayout}
            label="价格:"
          >{getFieldDecorator('price', {
            rules: [{ required: true, message: '请输入价格' }],
          })(<Input />)}</Form.Item>}
          {showLabelItem && <Form.Item
            {...formItemLayout}
            label="智库label"
          >
            {tags.map((tag) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} color="#108ee9" closable
                  afterClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 200 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag
                onClick={this.showInput}
                style={{ background: '#1890ff', borderStyle: 'solid', color: 'white' }}
              >
                <Icon type="plus" />添加label
              </Tag>
            )}
          </Form.Item>}
        </Form>
      </Modal>,
    ];
  }
}
