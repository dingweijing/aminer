import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect, component, FormCreate } from 'acore';
import { Tooltip, Input, Icon, Form, Popconfirm } from 'antd';
import { sysconfig } from 'systems';
import { Panel } from 'aminer/ui/panel';
import { formatMessage } from 'locales';
import { isLogin } from 'utils/auth';
import moment from 'moment';
import styles from './MessageBoard.less';

const { Pub_Comment_PageSize } = sysconfig;
const { TextArea } = Input;

// console.log('comment.ts', commentList && +new Date(commentList[0].ts))

// 不支持外面传递进来取好的值。
const MessageBoard = props => {
  const { dispatch, form, user } = props;
  const { comment_id, pathname, trackType, message = '' } = props;
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
    if (comment_id) {
      dispatch({
        type: 'aminerSearch/getPaperComments',
        payload: {
          id: comment_id,
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
  }, [comment_id]);

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

  const onCommit = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }

    validateFields((err, values) => {
      const { commit } = values;
      if (!comment_id || !commit.trim()) {
        return;
      }
      dispatch({
        type: 'pub/commentPub',
        payload: {
          id: comment_id,
          type: trackType,
          body: { tlid: comment_id, channel: trackType, body: commit },
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

  const renderTime = (time) => {
    if (!time) {
      return ''
    }

    const ts = new Date(+new Date(time) - offset_GMT)
    console.log('offset_GMT', ts, moment(ts));
    return moment(ts).fromNow()
  }

  const content = () => (
    <div className={styles.commented}>
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
              // placeholder={formatMessage({
              // id: 'aminer.paper.addcomment',
              //   defaultMessage: 'I like this paper...',
              // })}
              placeholder={message}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={onCommit}
              onClick={onFocus}
            />,
          )}
        </Form.Item>
      </Form>

      <div className={styles.commit}>
        <button type="button" onClick={onCommit}>
          {formatMessage({ id: 'aminer.common.submit', defaultMessage: 'Submit' })}
        </button>
      </div>
      <div className={styles.commentsBox}>
        {commentList && commentList.length > 0 && (
          <ul className={styles.commentList}>
            {commentList.map((comment, index) => (
              <li className={styles.item} key={comment.id}>
                <div className={styles.content}>
                  <div className={styles.imageBox}>
                    <img src={comment.user.avatar} alt="" />
                  </div>
                  <p className={styles.name}>{comment.user.name}</p>
                  <p className={styles.text}>{comment.body}</p>
                  <div className={styles.infos}>
                    <div className={styles.btns}>
                      <span className={styles.btn}>
                        {!comment.is_liked && <Icon type="like" />}
                        {comment.is_liked && <Icon type="like" theme="filled" />}
                        <span className={styles.label} onClick={like.bind(null, comment)}>
                          {formatMessage({
                            id: 'aminer.paper.comment.like',
                            defaultMessage: 'Like',
                          })}
                        </span>
                        <span className={styles.num}>{`[${comment.nlike || 0}]`}</span>
                      </span>
                      {user && comment.uid === user.id && (
                        <Popconfirm
                          placement="leftBottom"
                          title={formatMessage({
                            id: 'aminer.paper.comment.delete',
                            defaultMessage: 'Delete',
                          })}
                          onConfirm={() => {
                            deleteCommit(comment.id, index);
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
                          <span className={styles.btn}>
                            <i className="fa fa-trash-o" />
                            <span className={styles.label}>
                              {formatMessage({
                                id: 'aminer.paper.comment.delete',
                                defaultMessage: 'Delete',
                              })}
                            </span>
                          </span>
                        </Popconfirm>
                      )}
                    </div>
                    <span className={styles.time}>
                      {console.log('----------------- new Date(+new Date(comment.ts) - offset_GMT)', typeof new Date(+new Date(comment.ts) - offset_GMT).toJSON(),)}
                      {comment && comment.ts
                        ? renderTime(comment.ts)
                        : ''}
                    </span>
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
  );

  // const hide = false;
  // return content({ subStyle: hide ? 'tiny' : 'normal', onUnfold: () => { } });
  return content();
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
  FormCreate(),
)(MessageBoard);
