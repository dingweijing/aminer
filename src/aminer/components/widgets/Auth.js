import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect, renderChildren } from 'acore';
import { Modal, Button } from 'antd';
import authutil from 'utils/auth';

@connect(({ auth }) => ({
  user: auth.user,
}))
class Auth extends PureComponent {
  static propTypes = {
    requireLogin: PropTypes.bool,
    visibility: PropTypes.bool,
    failed: PropTypes.any,
  }

  state = { visible: false }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) { onRef(this) }
  }


  // ----------------------------------------
  auth = params => {
    const { success } = params
    const { user } = this.props;
    const isUserLogin = authutil.isLogin(user);
    if (isUserLogin) {
      // call success function;
      if (success) {
        success()
      }
    } else {
      // false, open modal!
      this.showModal()
    }
  }
  // ----------------------------------------

  showModal = () => {
    console.log('>>> show modal')
    this.setState({
      visible: true,
    });
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  modalJsx = () => {
    const { visible } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open Modal</Button>
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }

  defaultUnauthedContent = (
    <div>您无权查看此内容，请登录</div>
  )

  render() {
    const { user, children } = this.props;
    const { requireLogin, visibility, onRef } = this.props;
    const { failed } = this.props;
    console.log(">>render modal ", this.state.visible)

    if (onRef) {
      return this.modalJsx()
    }

    if (requireLogin) {
      const isUserLogin = authutil.isLogin(user);
      if (isUserLogin) {
        return renderChildren(children)
      } 
        const final = failed || this.defaultUnauthedContent;
        return final;
      
    }
    return (
      <></>
    );
  }
}

export default Auth;
