import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect, component, FormCreate, withRouter } from 'acore';
import { Tooltip, Input, Icon, Form, Popconfirm } from 'antd';
import { sysconfig } from 'systems';
import { Panel } from 'aminer/ui/panel';
import { formatMessage } from 'locales';
import { isLogin, isRoster, isAuthed } from 'utils/auth';
import { getProfileUrl } from 'utils/profile-utils';
import dayjs from 'dayjs';
import { parseUrlParam, getLangLabel } from 'helper';
import PropTypes from 'prop-types';
import styles from './MessageBoard.less';

const { Pub_Comment_PageSize } = sysconfig;
const { TextArea } = Input;

// console.log('comment.ts', commentList && +new Date(commentList[0].ts))

// 不支持外面传递进来取好的值。
const MessageBoard = props => {
  const { dispatch, form, user, source } = props;
  const { linktocomment } = parseUrlParam(props, {}, ['linktocomment']);
  const { comment_id, pathname, trackType, message, autoSize, extraClickFun } = props;

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
    if (linktocomment && textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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

  const onCommit = e => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    extraClickFun && extraClickFun(e);

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

  const regexLinkText = str => {
    if (!str) {
      return null;
    }
    return str.replace(
      /([\[|【](.[^\]|^】]+)[\]|】][\(|（](.[^)|^）]+)[\)|）])/g,
      (rs, $1, $2, $3) => {
        $3 = $3 && $3.includes('http') ? $3 : `http://${$3}`;
        if (source === 'pubcomment') {
          $3 = $3 && $3.includes('?') ? `${$3}&from=comment` : `${$3}?from=comment`;
        }
        return `<a href="${$3}" target="_blank">${$2}</a>`;
      },
    );
  };

  const content = () => (
    <div className={styles.commented}>
      <div className="formBlock">
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
                placeholder={message}
                autoSize={autoSize}
                onPressEnter={onCommit}
                onClick={onFocus}
                ref={textareaRef}
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
      <div className="commentsBox">
        {commentList && commentList.length > 0 && (
          <ul className="commentList">
            {commentList.map((comment, index) => {
              const { id, user: newUser, body, is_liked, nlike, uid, ts } = comment;
              const { avatar, name, profile = {} } = newUser || {};
              return (
                <li className="item" key={id}>
                  <div className="content">
                    <div className="imageBox">
                      <img src={newUser.avatar} alt="" />
                      {newUser.aid && (
                        <a href={getProfileUrl(newUser.name, newUser.aid)}>
                          <img src={newUser.avatar} alt={newUser.name} />
                        </a>
                      )}
                      {!newUser.aid && <img src={newUser.avatar} alt={newUser.name} />}
                    </div>
                    <p className="name">
                      {newUser.aid && (
                        <a href={getProfileUrl(comment.user.name, comment.user.aid)}>
                          {getLangLabel(name || profile.name, profile.name_zh)}
                        </a>
                      )}
                      {!newUser.aid && (
                        <span> {getLangLabel(name || profile.name, profile.name_zh)}</span>
                      )}
                    </p>
                    <p className="text" dangerouslySetInnerHTML={{ __html: regexLinkText(body) }} />
                    <div className="infos">
                      <div className="btns">
                        <span className="btn">
                          {!is_liked && <Icon type="like" />}
                          {is_liked && <Icon type="like" theme="filled" />}
                          <span className="label" onClick={like.bind(null, comment)}>
                            {formatMessage({
                              id: 'aminer.paper.comment.like',
                              defaultMessage: 'Like',
                            })}
                          </span>
                          <span className="num">{`[${nlike || 0}]`}</span>
                        </span>
                        {user && (uid === user.id || isAuthed(user.roles)) && (
                          <Popconfirm
                            placement="leftBottom"
                            title={formatMessage({
                              id: 'aminer.paper.comment.delete',
                              defaultMessage: 'Delete',
                            })}
                            onConfirm={() => {
                              deleteCommit(id, index);
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
                              <span className="label">
                                {formatMessage({
                                  id: 'aminer.paper.comment.delete',
                                  defaultMessage: 'Delete',
                                })}
                              </span>
                            </span>
                          </Popconfirm>
                        )}
                      </div>
                      <span className="time">
                        {ts ? dayjs(new Date(+new Date(ts) - offset_GMT)).fromNow() : ''}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {commentList && !!count.current && commentList.length < count.current && (
          <div className="loadMore" onClick={getComments}>
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

MessageBoard.propTypes = {
  message: PropTypes.string,
  autoSize: PropTypes.object,
  // btn 点击效果
  extraClickFun: PropTypes.func,
};

MessageBoard.defaultProps = {
  message: '',
  autoSize: { minRows: 2, maxRows: 6 },
  extraClickFun: e => {},
};
export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
  FormCreate(),
  withRouter,
)(MessageBoard);
