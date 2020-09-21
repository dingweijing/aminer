/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { connect } from 'acore';
import { sysconfig } from 'systems';
import { reflect } from 'utils';
import * as authUtil from 'utils/auth';
import * as debug from 'utils/debug';

const ENABLED = sysconfig.GLOBAL_ENABLE_HOC;

/**
 * 会根据 sysconfig.Auth_AllowAnonymousAccess 的值来判断是否进行登录权限判断。
 * @param ComponentClass
 * @returns {AuthHoc}
 * @constructor
 */
function Auth(ComponentClass) {
  @connect(({ auth }) => ({ user: auth.user }))
  class AuthHoc extends Component {
    constructor(props) {
      super(props);

      if (!ENABLED || sysconfig.Auth_AllowAnonymousAccess) { // 禁用Auth或者允许匿名登录时；
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        const name =
          ComponentClass.displayName ||
          ComponentClass.name ||
          reflect.GetComponentName(ComponentClass);
        if (debug.LogHOC) {
          console.log('%c@@HOC: @Auth on %s', 'color:orange', name);
        }
      }

      // aminer
      this.authenticated = false;
      const { user } = this.props;
      if (user) { // TODO other condition?
        this.authenticated = true;
      }
      if (!this.authenticated) {
        const { dispatch } = props;
        authUtil.dispatchToLogin(dispatch);
      }
      // old code

      // if (!hasAuthInfo(this.props)) {
      //   console.warn('Must connect `app` models when use @Auth! in component: ',
      //     reflect.GetComponentName(ComponentClass));
      // } else {
      //   const [user, roles] = Maps.getAll(this.props.app, 'user', 'roles');
      //   this.isLogin = authUtil.isLogin(user); // 必须是登录用户.
      //   this.isAuthed = authUtil.isAuthed(roles); // 必须有当前系统的角色.
      // }
      // this.authenticated = this.isLogin && this.isAuthed;
      // if (!this.authenticated) {
      //   authUtil.dispatchToLogin(this.props.dispatch);
      // }

      // ccf
      // const { currentUser } = this.props.auth;
      // if (currentUser && currentUser.user_name && currentUser.role.length > 0) {
      //   this.authenticated = true;
      // }
    }

    render() {
      if (!ENABLED || sysconfig.Auth_AllowAnonymousAccess || this.authenticated) {
        return <ComponentClass {...this.props} />;
      }
      return null;
    }
  }

  return AuthHoc;
}

function RequireAdmin(ComponentClass) {
  @connect(({ auth }) => ({ user: auth.user }))
  class Admin extends Component {
    constructor(props) {
      super(props);
      if (process.env.NODE_ENV !== 'production') {
        const name =
          ComponentClass.displayName ||
          ComponentClass.name ||
          reflect.GetComponentName(ComponentClass);
        if (debug.LogHOC) {
          console.log('%c@@HOC: @Auth on %s', 'color:orange', name);
        }
      }

      this.authenticated = false;
      const { user } = props;
      console.log('user', user)
      if (user && user.role.includes('admin')) {
        this.authenticated = true;
      }
      if (!this.authenticated) {
        authUtil.dispatchToLogin(props.dispatch);
      }
    }

    render() {
      if (this.authenticated) {
        return <ComponentClass {...this.props} />;
      }
      return null;
    }
  }

  return Admin;
}

export { Auth, RequireAdmin };
