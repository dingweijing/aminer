import React, { useState, useEffect, useMemo, useRef } from 'react';
import { connect, component, Link, FormCreate } from 'acore';
import { FM, formatMessage } from 'locales';
import { isLogin, isEditAI2000QA } from 'utils/auth';
import { Spin, Input, Form, Button, Popconfirm } from 'antd';
// import { Spin } from 'aminer/components/ui';
import styles from './QA.less';

const { TextArea } = Input;
const qa_id = '5e3a1be5fc6b5f8ef587254a';
const temp_page_size = 200;
const trackType = 'ai10';

const QAPage = props => {
  const { dispatch, loading, form } = props;
  const { showMenu } = props; // trackType
  const { user } = props;
  const count = useRef();
  const page = useRef(1);

  const [qaList, setQAList] = useState(null);

  const { getFieldDecorator, validateFields } = form;

  let unmounted = false;

  const getQA = body => {
    if (!body.match(/Q: (?<q>.*)A: (?<a>.*)/i)) {
      return null;
    }
    const { groups } = body.match(/Q: (?<q>.*)A: (?<a>.*)/i);
    return {
      question: (groups && groups.q) || '',
      answer: (groups && groups.a) || '',
    };
  };

  const getQAs = reset => {
    if (reset) {
      page.current = 1;
    }
    if (qa_id) {
      dispatch({
        type: 'aminerSearch/getPaperComments',
        payload: {
          id: qa_id,
          type: trackType,
          offset: (page.current - 1) * temp_page_size,
          size: temp_page_size,
        },
      }).then(pes => {
        if (!unmounted && pes) {
          count.current = pes.count;
          const list_data =
            pes &&
            pes.data.map(item => {
              const { body, ...params } = item;
              return {
                ...getQA(body),
                ...params,
              };
            });
          if (!qaList || reset) {
            const list = list_data.reverse();
            setQAList(list || []);
          } else {
            const temp = qaList.reverse();
            const newList = temp.concat(pes.data);
            const list = newList.reverse();
            setQAList(list);
          }
        }
      });
    }
  };

  useEffect(() => {
    getQAs(true);
    return () => {
      unmounted = true;
    };
  }, []);

  const onCommit = () => {
    validateFields((err, values) => {
      const { qa } = values;
      const question = qa.replace(/\r?\n/g, ' ');
      if (!getQA(question)) {
        return;
      }
      if (!question || !qa_id || !question.trim()) {
        return;
      }
      dispatch({
        type: 'pub/commentPub',
        payload: {
          id: qa_id,
          type: trackType,
          body: { tlid: qa_id, channel: trackType, body: question },
        },
      }).then(data => {
        // const time = new Date(+new Date() + offset_GMT);
        if (data && data.status && !unmounted) {
          const newQA = {
            ...getQA(question),
            uid: user.id,
            user,
            id: data.cmid,
          };
          form.resetFields();
          count.current += 1;
          setQAList([newQA, ...qaList]);
        }
      });
    });
  };

  const deleteQA = (id, index) => {
    const newList = [...qaList];
    dispatch({
      type: 'pub/deleteComment',
      payload: { id, type: trackType },
    }).then(({ status }) => {
      if (status && !unmounted) {
        newList.splice(index, 1);
        count.current -= 1;
        setQAList(newList);
      }
    });
  };

  const qaValidator = (rule, value, callback) => {
    const v = value.replace(/\r?\n/g, ' ');
    if (!getQA(v)) {
      callback('请填写正确的 QA');
    } else {
      callback();
    }
  };

  return (
    <div className={styles.qa_page}>
      <div className="home_title">
        <svg className="icon menu_icon mobile_device" aria-hidden="true" onClick={showMenu}>
          <use xlinkHref="#icon-menu1" />
        </svg>
        <h1>
          <span>Q & A</span>
        </h1>
        <div className="contact">
          <FM
            id="ai2000.qa.contact"
            values={{
              email: (
                <a className="email" href="mailto:award@aminer.org">
                  {' '}
                  award@aminer.org
                </a>
              ),
            }}
          />
        </div>
      </div>
      {loading && <Spin spinning={loading} size="small" />}
      <div className="center">
        {isEditAI2000QA(user) && (
          <Form onSubmit={onCommit}>
            <Form.Item>
              {getFieldDecorator('qa', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please enter QA',
                  },
                  {
                    validator: qaValidator,
                  },
                ],
              })(
                <TextArea
                  placeholder="Q:  A: "
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  // onPressEnter={onCommit}

                  // onClick={onFocus}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button onClick={onCommit} block>
                {formatMessage({ id: 'aminer.paper.comment.commit', defaultMessage: 'Commit' })}
              </Button>
            </Form.Item>
          </Form>
        )}
        {qaList && qaList.length > 0 && (
          <ul className="qa_list">
            {qaList.map((qa, index) => (
              <li className="qa_item" key={qa.id}>
                <div className="item_content">
                  <p className="q">
                    <span className="tip">Q</span>
                    <span>{qa.question}</span>
                  </p>
                  <p className="a">
                    <span className="tip">A</span>
                    <span>{qa.answer}</span>
                  </p>
                </div>
                <div className="del_btn">
                  {isEditAI2000QA(user) && (
                    <Popconfirm
                      placement="leftBottom"
                      title={formatMessage({
                        id: 'aminer.paper.comment.delete',
                        defaultMessage: 'Delete',
                      })}
                      onConfirm={() => {
                        deleteQA(qa.id, index);
                      }}
                      okText={formatMessage({
                        id: 'aminer.logout.confirm.ok',
                        defaultMessage: 'Yes',
                      })}
                      cancelText={formatMessage({
                        id: 'aminer.logout.confirm.cancel',
                        defaultMessage: 'No',
                      })}
                    >
                      <span className="btn">
                        <i className="fa fa-trash-o" />
                        {/* <span className={styles.label}>
                          {formatMessage({
                            id: 'aminer.paper.comment.delete',
                            defaultMessage: 'Delete',
                          })}
                        </span> */}
                      </span>
                    </Popconfirm>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
  FormCreate(),
)(QAPage);
