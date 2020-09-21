import { MessageBoard } from 'aminer/components/common';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect, component, FormCreate } from 'acore';
import { Tooltip, Input, Icon, Form, Popconfirm } from 'antd';
// import { sysconfig } from 'systems';
import { Panel } from 'aminer/ui/panel';
import { formatMessage, FM } from 'locales';
import { isLogin, isAuthed } from 'utils/auth';
import moment from 'moment';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import LeftContent from './LeftContent';
import * as confUtils from '../utils/utils';
import { SetOrGetViews } from '../SetOrGetViews';
import styles from './Comments.less';

const Pub_Comment_PageSize = 20;
// const { Pub_Comment_PageSize } = sysconfig;
const { TextArea } = Input;

const trackType = 'iclr2020';
const Comments = props => {
  const { dispatch, form, user } = props;
  const { confInfo, pathname } = props;
  // const { confInfo.id = confInfo.id;
  const count = useRef();
  const page = useRef(1);

  const offset_GMT = useMemo(() => new Date().getTimezoneOffset() * 60 * 1000, []);

  const [commentList, setCommentList] = useState(null);

  const { getFieldDecorator, validateFields } = form;

  const textareaRef = useRef(null);
  let unmounted = false;

  const getComments = reset => {
    if (reset) {
      page.current = 1;
    }
    if (confInfo.id) {
      dispatch({
        type: 'aminerSearch/getPaperComments',
        payload: {
          id: confInfo.id,
          type: trackType,
          offset: (page.current - 1) * Pub_Comment_PageSize,
          size: Pub_Comment_PageSize,
        },
      }).then(pes => {
        if (!unmounted && pes) {
          count.current = pes.count;
          if (!commentList || reset) {
            setCommentList(pes.data || []);
          } else {
            const newList = commentList.concat(pes.data);
            setCommentList(newList);
          }
        }
      });
    }
  };
  useEffect(() => {
    getComments(true);

    return () => {
      unmounted = true;
    };
  }, [confInfo.id]);

  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  const deleteCommit = (id, index) => {
    const newList = [...commentList];
    dispatch({
      type: 'pub/deleteComment',
      payload: { id, type: trackType },
    }).then(({ status }) => {
      if (status && !unmounted) {
        newList.splice(index, 1);
        count.current -= 1;
        setCommentList(newList);
      }
    });
  };

  const onFocus = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      if (textareaRef && textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const like = comment => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (comment.is_liked) {
      dispatch({
        type: 'pub/pubUnlike',
        payload: { id: comment.id, type: trackType },
      }).then(() => {
        getComments(true);
      });
    } else {
      dispatch({
        type: 'pub/pubLike',
        payload: { id: comment.id, type: trackType, body: { type: trackType, id: comment.id } },
      }).then(() => {
        getComments(true);
      });
    }
  };

  const onCommit = e => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    confUtils.addRippleEffect(e);

    validateFields((err, values) => {
      const { commit } = values;
      if (!confInfo.id || !commit.trim()) {
        return;
      }
      dispatch({
        type: 'pub/commentPub',
        payload: {
          id: confInfo.id,
          type: trackType,
          body: { tlid: confInfo.id, channel: trackType, body: commit },
        },
      }).then(data => {
        const time = new Date(+new Date() + offset_GMT);
        if (data && data.status && !unmounted) {
          const newComment = {
            body: commit,
            is_liked: false,
            nlike: 0,
            ts: time,
            uid: user.id,
            user,
            id: data.cmid,
          };
          form.resetFields();
          count.current += 1;
          setCommentList([newComment, ...commentList]);
        }
      });
    });
  };

  const delTopic = (id, index) => {
    const newList = [...commentList];
    dispatch({
      type: 'pub/deleteComment',
      payload: { id, type: trackType },
    }).then(({ status }) => {
      if (status && !unmounted) {
        newList.splice(index, 1);
        count.current -= 1;
        setCommentList(newList);
      }
    });
  };

  return (
    <div
      className={classnames(styles.commented, {
        [styles.flexGrow]:
          confInfo.config && confInfo.config.right && confInfo.config.right.length === 0,
      })}
    >
      <div className="leftBlock desktop_device">
        <LeftContent confInfo={confInfo} />
      </div>
      <div className="centerBlock">
        <div className="submit_header_legend">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-comments" />
          </svg>
          <FM id="aminer.conf.tab.Comments" default="Comments" />
        </div>
        <div className="submitBlock">
          <Form>
            <Form.Item>
              {getFieldDecorator('commit', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'aminer.paper.comment.empty',
                      defaultMessage: 'Please enter a comment',
                    }),
                  },
                ],
              })(
                <TextArea
                  placeholder={formatMessage({
                    id: 'aminer.conf.addtopic',
                  })}
                  autoSize={{ minRows: 5, maxRows: 5 }}
                  onPressEnter={onCommit}
                  onClick={onFocus}
                />,
              )}
            </Form.Item>
          </Form>

          <div className="commit">
            <button type="button" onClick={onCommit}>
              {formatMessage({ id: 'aminer.common.submit', defaultMessage: 'Submit' })}
            </button>
          </div>
        </div>
        <div className={styles.commentsBox}>
          {commentList && commentList.length > 0 && (
            <ul className={styles.commentList}>
              {commentList.map((comment, index) => (
                <li className={styles.item} key={comment.id}>
                  <div className={styles.content}>
                    <div className={styles.topicMessage}>
                      <div className={styles.topicBlock}>
                        <div className={styles.left}>
                          {comment.user.aid && (
                            <a href={getProfileUrl(comment.user.name, comment.user.aid)}>
                              <img src={comment.user.avatar} alt={comment.user.name} />
                            </a>
                          )}
                          {!comment.user.aid && (
                            <img src={comment.user.avatar} alt={comment.user.name} />
                          )}
                        </div>
                        <div className={styles.right}>
                          <div className={styles.topic_right_top}>
                            <p className={styles.name}>
                              {comment.user.aid && (
                                <a href={getProfileUrl(comment.user.name, comment.user.aid)}>
                                  {comment.user.name}
                                </a>
                              )}
                              {!comment.user.aid && <span>{comment.user.name}</span>}
                            </p>
                            <p className={styles.text}>{comment.body}</p>
                          </div>
                          <div className={styles.topic_right_bottom}>
                            <div className={styles.time}>
                              {comment.ts
                                ? moment(
                                    new Date(+new Date(comment.ts) - offset_GMT),
                                    'YYYY-MM-DD HH:mm:ss',
                                  ).fromNow()
                                : ''}
                            </div>
                            <div className={styles.action}>
                              {user && (comment.uid === user.id || isAuthed(user.roles)) && (
                                <div className={styles.del}>
                                  <Popconfirm
                                    placement="leftBottom"
                                    title={formatMessage({
                                      id: 'aminer.paper.comment.delete',
                                      defaultMessage: 'Delete',
                                    })}
                                    onConfirm={() => {
                                      delTopic(comment.id, index);
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
                                    <span className={styles.outSvgBoard}>
                                      <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-delete-" />
                                      </svg>
                                    </span>
                                  </Popconfirm>
                                </div>
                              )}
                              <div className={styles.like} onClick={like.bind(null, comment)}>
                                {/* {!comment.is_liked && <Icon type="like" />}
                                {comment.is_liked && <Icon type="like" theme="filled" />} */}
                                <span
                                  className={classnames(styles.outSvgBoard, {
                                    [styles.active]: comment.is_liked,
                                  })}
                                >
                                  <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-dianzan" />
                                  </svg>
                                </span>
                                {/* <span className="label" onClick={like.bind(null, comment)}>
                                  {formatMessage({
                                    id: 'aminer.paper.comment.like',
                                    defaultMessage: 'Like',
                                  })}
                                </span> */}
                                <span className="num">{`${comment.nlike || 0}`}</span>
                              </div>
                              {/* TODO: 获取这个数量有点问题 */}
                              {/* <div className={styles.num_comment}>
                                <span className={styles.outSvgBoard}>
                                  <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-pinglun" />
                                  </svg>
                                </span>
                                100
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.childrenComment}>
                      <MessageBoard
                        trackType={trackType}
                        comment_id={comment.id}
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        message={formatMessage({
                          id: 'aminer.paper.addcomment',
                        })}
                        extraClickFun={e => confUtils.addRippleEffect(e)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {commentList && !!count.current && commentList.length < count.current && (
            <div className={styles.loadMore} onClick={getComments}>
              Load More
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
  FormCreate(),
)(Comments);
