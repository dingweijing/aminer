import React from 'react';
import { Input, Form, message } from 'antd';
import { Layout } from 'aminer/layouts';
import PersonSelector from "components/person/selector/PersonSelector";
import { FormCreate, history, connect } from "acore";
import { parseMatchesParam, parseUrlParam } from "helper";
import { Auth } from "acore/hoc";
import styles from "./index.less";

@connect()
@FormCreate()
@Auth
export default class SetUrl extends React.Component {

  state = {
    person1: null,
    value: '',
    succeed: false,
    // host: "", no use
  };

  componentDidMount() {
    const { id } = parseMatchesParam(this.props, {}, ['id']);
    // const { host } = parseUrlParam(this.props, {}, ['host']);
    // if (host) { this.setState({ host }); }
    this.getUrlPerson(id);
  }

  onSelectPerson = (id, person) => {
    const value = `${person.name || person.name_zh}`;
    this.setState({ value, person1: person });
    const { dispatch, form } = this.props;
    form.setFieldsValue({ short_name: value });
    history.push({
      pathname: `/set-url/${id}`,
    });
  };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  getUrlPerson = (id1) => {
    if (!id1) {
      return;
    }
    const { dispatch, form } = this.props;
    dispatch({
      type: "person/getProfile",
      payload: { aid: id1 },
    }).then((data) => {
      if (data && data.short_name) {
        this.setState({ value: data.short_name });
        form.setFieldsValue({ short_name: data.short_name });
      }
    });
    dispatch({
      type: 'person/getPersonPair',
      payload: { id1, pure: true },
    }).then((data) => {
      if (data) {
        const [person1] = data || [];
        if (person1) {
          const { name, name_zh } = person1;
          const value = `${name || name_zh}`;
          if (!this.state.value) {
            this.setState({ value });
            form.setFieldsValue({ short_name: value });
          }
          this.setState({ person1 });
        }
      }
    }).catch((error) => {
      this.setState({ person1: null });
    });
  };

  setSingleUrl = () => {
    const { value, person1 } = this.state;
    const regexp = /^[a-zA-Z0-9\u4e00-\u9fa5_+.\-=]*$/g.test(value);
    if (!regexp || value.length < 4) {
      message.error('请输入四位字符字母或者汉字, 下划线, 加号,等号, 减号等, 不允许空格');
      return;
    }
    const { dispatch } = this.props;
    if (value) {
      dispatch({
        type: "person/CheckShortName",
        payload: {
          short_name: value,
        },
      }).then((isExist) => {
        if (!isExist && person1) {
          dispatch({
            type: "person/setShortName",
            payload: {
              real_name: person1.name || person1.name_zh,
              short_name: value,
              aid: person1.id,
            },
          }).then((succeed) => {
            if (succeed) {
              this.setState({ succeed: true });
              message.success('设置短URL成功');
            }
          });
        } else if (isExist) {
          message.error('此短URL已经存在, 请重新输入');
        }
      });
    }
  };

  toLink = (link) => {
    window.location.href = link;
  };

  render() {
    const { person1, succeed, value } = this.state;
    const { getFieldDecorator } = this.props.form;
    const link = window && window.location ? `${window.location.origin}/p/` : '';
    const showlink = `${link}${value}`;
    // console.log('showlink', showlink);
    return (
      <Layout searchZone={[]} showNavigator={false} logoZone={[]}>
        <div className={styles.editContainer}>
          <h1>设置短URL</h1>
          <div className={styles.personInfo}>
            <PersonSelector person={person1} onSelect={this.onSelectPerson} />
          </div>
          {person1 && (
            <h2>设置&nbsp;{person1.name || person1.name_zh}&nbsp;的短URL
            </h2>)}
          <div className={styles.inputArea}>
            <Form>
              <Form.Item>
                {getFieldDecorator('short_name', {
                  rules: [{
                    min: 4,
                    message: "请输入至少四位以上字符!",
                  }, {
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_+.\-=]*$/g,
                    message: "可输入字母或者汉字, 下划线, 加号,等号, 减号等, 不允许空格",
                  }],
                })(
                  <Input.Search
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder="input short_name text"
                    addonBefore={link}
                    enterButton="确认"
                    onSearch={this.setSingleUrl}
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
          {succeed && <div>设置成功, 可访问: <a onClick={this.toLink.bind(this, showlink)}>{showlink}</a></div>}
        </div>
      </Layout>
    );
  }
}
