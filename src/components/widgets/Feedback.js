/**
 * Created by yangyanmei on 17/11/23.
 */
import React from 'react';
import { Affix, Button, Popover, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'acore';
// import { Form } from '@ant-design/compatible';
import styles from './Feedback.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class Feedback extends React.Component {
  static propTypes = {
    offsetBottom: PropTypes.number,
    offsetRight: PropTypes.number,
  };

  static defaultProps = {
    offsetBottom: 25,
    offsetRight: 28,
  };

  state = {
    visible: false,
    formFocus: false,
    focus: false,
  };

  // componentDidUpdate(prevProps) {
  //   console.log('===========', prevProps.feedbackStatus);
  //   console.log('>>>>>>>>>>>>>>>>====', this.props.feedbackStatus);
  //   if (prevProps.feedbackStatus && prevProps.feedbackStatus !== this.props.feedbackStatus) {
  //     this.props.form.resetFields();
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.feedbackStatus && this.props.feedbackStatus !== nextProps.feedbackStatus) {
      this.props.form.resetFields();
    }
  }

  onfocus = () => {
    this.setState({ focus: true });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, user } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        dispatch({
          type: 'auth/setFeedback',
          payload: { ...data, user, url: window.location.href },
        });
      }
    });
  };

  closePopover = () => {
    this.props.form.setFieldsValue({
      email: '',
      content: '',
    });
    this.setState({ visible: false, focus: false });
  };

  openPopover = () => {
    this.setState({ visible: true, formFocus: false });
  };

  mouseLeave = () => {
    const values = this.props.form.getFieldsValue();
    if (!this.state.focus && !values.email && !values.content) {
      this.setState({ visible: false });
    }
  };

  setFormMouseOUt = () => {
    this.setState({ formFocus: true });
  };

  feedbackBtn = () => {
    setTimeout(() => {
      if (this.state.formFocus) {
        this.setState({ visible: true });
      } else {
        this.setState({ visible: false });
      }
    }, 200);
  };

  render() {
    const { form, offsetBottom, offsetRight } = this.props;

    const { getFieldDecorator, validateFieldsAndScroll } = form;

    const { formFocus } = this.state;
    const load = this.props.loading.effects['auth/setFeedback'];

    const content = (
      <Form
        onSubmit={this.handleSubmit}
        className={styles.feedbackForm}
        onMouseLeave={this.mouseLeave}
        onMouseOver={this.setFormMouseOUt}
      >
        <span>请输入您的email和问题或建议,我们会及时的处理你的宝贵意见：</span>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: '邮箱格式错误!' }],
          })(
            <Input
              placeholder="请输入您的email!"
              onFocus={this.onfocus}
              className={styles.inputBox}
              autoComplete="off"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator(
            'content',
            {},
          )(
            <TextArea
              rows={4}
              placeholder="请输入您的宝贵意见和建议!"
              onFocus={this.onfocus}
              required
            />,
          )}
        </FormItem>
        <FormItem className={styles.submitBtn}>
          <Button type="primary" htmlType="submit" size="small">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
    const title = (
      <div className={styles.titleBox}>
        <span>Feedback</span>
        <i className={classnames(styles.deleteBtn, 'fa', 'fa-times')} onClick={this.closePopover} />
      </div>
    );
    return (
      <Affix
        offsetBottom={offsetBottom}
        className={styles.affixFeedback}
        style={{ bottom: `${offsetBottom}px`, right: `${offsetRight}px` }}
      >
        <Popover placement="topLeft" content={content} title={title} visible={this.state.visible}>
          <Button
            icon="fa-smile-o"
            type="primary"
            loading={load}
            size="large"
            className={styles.fdBtn}
            onMouseOver={this.openPopover}
            onMouseOut={this.feedbackBtn}
          >
            {!load && (
              <span>
                <i className="fa fa-smile-o" style={{ fontWeight: 'bold' }} /> &nbsp;
              </span>
            )}
            <span style={{ marginRight: 10 }}>Feedback</span>
          </Button>
        </Popover>
      </Affix>
    );
  }
}

export default connect(({ auth, loading }) => ({
  user: auth.user,
  feedbackStatus: auth.feedbackStatus,
  loading,
}))(Form.create()(Feedback));
