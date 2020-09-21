import React, { useState, useEffect, useRef } from 'react';
import { connect, component, FormCreate, withRouter } from 'acore';
import { MessageBoard } from 'aminer/components/common';
import { Tooltip, Input, Icon, Form, Popconfirm, message } from 'antd';
import { sysconfig } from 'systems';
import { Panel } from 'aminer/ui/panel';
import { parseUrlParam, getLangLabel } from 'helper';
import { formatMessage } from 'locales';
import { isLogin } from 'utils/auth';
import moment from 'moment';
import styles from './PanelComment.less';

const { Pub_Comment_PageSize } = sysconfig;
const { TextArea } = Input;

// 不支持外面传递进来取好的值。
const PanelComment = props => {
  const { dispatch, form, user } = props;
  const { withPanel, pid } = props;

  const [page, setPages] = useState(1)
  const [commentList, setCommentList] = useState()

  const { getFieldDecorator, validateFields } = form;

  const textareaRef = useRef(null);
  let unmounted = false;

  const { linktocomment } = parseUrlParam(props, {}, ['linktocomment']);

  useEffect(() => {
    if (linktocomment && textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const getComments = async () => {
    if (pid) {
      const pes = await dispatch({
        type: 'aminerSearch/getPaperComments',
        payload: { id: pid, type: 'pub', offset: (page - 1) * Pub_Comment_PageSize, size: Pub_Comment_PageSize }
      })
      if (!unmounted) {
        setCommentList((pes && pes.data) || []);
      }
    }
  }

  // useEffect(() => {
  //   getComments()

  //   return () => {
  //     unmounted = true;
  //   }
  // }, [pid])

  const deleteCommit = (id, index) => {
    const newList = [...commentList];
    dispatch({
      type: 'pub/deleteComment', payload: { id, type: 'pub' }
    }).then(({ status }) => {
      if (status && !unmounted) {
        newList.splice(index, 1);
        setCommentList(newList);
      }
    })
  }

  const onFocus = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' })
      if (textareaRef && textareaRef.current) {
        textareaRef.current.blur()
      }
    }
  }

  const like = comment => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (comment.is_liked) {
      dispatch({
        type: 'pub/pubUnlike', payload: { id: comment.id, type: 'pub' }
      }).then(() => {
        getComments();
      })
    } else {
      dispatch({
        type: 'pub/pubLike', payload: { id: comment.id, type: 'pub', body: { type: 'pub', id: comment.id } }
      }).then(() => {
        getComments();
      })
    }
  }

  const onCommit = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }

    validateFields((err, values) => {
      const commit = values.commit && values.commit.trim();
      if (!commit) { message.warning('can not be empty'); return }
      dispatch({
        type: 'pub/commentPub',
        payload: {
          id: pid, type: 'pub', body: { tlid: pid, channel: 'pub', body: commit }
        }
      }).then(data => {
        const time = new Date();
        if (data && data.status && !unmounted) {
          const newComment = {
            body: commit, is_liked: false, nlike: 0, ts: time, uid: user.id, user, id: data.cmid
          }
          form.resetFields();
          setCommentList([newComment, ...commentList])
        }
      })
    });
  }

  const content2 = () => (
    <div className={styles.commented}>
      <Form>
        <Form.Item>
          {getFieldDecorator('commit', {
            rules: [{ required: true, message: formatMessage({ id: 'aminer.paper.comment.empty', defaultMessage: 'Please enter a comment' }) }]
          })(
            <TextArea
              placeholder={formatMessage({ id: 'aminer.paper.addcomment', defaultMessage: 'I like this paper...' })}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={onCommit}
              onClick={onFocus}
              ref={textareaRef}
            />
          )}
        </Form.Item>
      </Form>

      <div className={styles.commit}>
        <button type="button" onClick={onCommit}>
          {formatMessage({ id: 'aminer.paper.comment.commit', defaultMessage: 'Commit' })}
        </button>
      </div>
      {commentList && commentList.length > 0 && (
        <ul className={styles.commentList}>
          {commentList.map((comment, index) => {
            const { id, user, body, is_liked, nlike, uid, ts } = comment;
            const { avatar, name, profile = {} } = user || {};
            return (
              <li className={styles.item} key={id}>
                <div className={styles.imageBox}>
                  <img src={avatar} alt="" />
                </div>
                <div className={styles.content}>
                  <p className={styles.name}>{getLangLabel(profile.name, profile.name_zh)}</p>
                  <p className={styles.text}>{body}</p>
                  <div className={styles.infos}>
                    <div className={styles.btns}>
                      <span className={styles.btn}>
                        {!is_liked && (
                          <Icon type="like" />
                        )}
                        {is_liked && (
                          <Icon type="like" theme="filled" />
                        )}
                        <span className={styles.label} onClick={like.bind(this, comment)}>
                          {formatMessage({ id: 'aminer.paper.comment.like', defaultMessage: 'Like' })}
                        </span>
                        <span className={styles.num}>{`[${nlike || 0}]`}</span>
                      </span>
                      {user && uid === user.id && (
                        <Popconfirm
                          placement="leftBottom"
                          title={formatMessage({ id: 'aminer.paper.comment.delete', defaultMessage: 'Delete' })}
                          onConfirm={() => { deleteCommit(id, index) }}
                          okText={formatMessage({ id: 'aminer.logout.confirm.ok', defaultMessage: 'Yes' })}
                          cancelText={formatMessage({ id: 'aminer.logout.confirm.cancel', defaultMessage: 'No' })}
                        >
                          <span className={styles.btn}>
                            <i className="fa fa-trash-o" />
                            <span className={styles.label}>
                              {formatMessage({ id: 'aminer.paper.comment.delete', defaultMessage: 'Delete' })}
                            </span>

                          </span>
                        </Popconfirm>

                      )}
                    </div>
                    <span className={styles.time}>
                      {ts ? moment(ts, 'YYYY-MM-DD HH:mm:ss').fromNow() : ''}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

  const content = () => (
    <div className={styles.commented}>
      <MessageBoard
        comment_id={pid}
        trackType='pub'
        source='pubcomment'
        autoSize={{ minRows: 1, maxRows: 6 }}
      />
    </div>
  )

  if (withPanel) {
    return (
      <Panel
        title={formatMessage({ id: 'aminer.paper.comment', defaultMessage: 'Comment' })}
        className={styles.comments}
        // arrowLeftZone={[() => (
        //   <Tooltip
        //     placement="leftBottom"
        //     title={(
        //       <div className="">
        //         <p style={{ margin: '0' }}>{formatMessage({ id: 'aminer.paper.comment.tip.data', defaultMessage: 'Use #data to add data (url) used in this work;' })}</p>
        //         <p style={{ margin: '0' }}>{formatMessage({ id: 'aminer.paper.comment.tip.code', defaultMessage: 'Use #code to add code (url) used in this work;' })}</p>
        //       </div>
        //     )}
        //     overlayClassName="commentTip"
        //     key="1"
        //   >
        //     <i className="fa fa-question-circle" />
        //   </Tooltip>
        // )]}
        subContent={content}
      />
    );
  }
  // const hide = false;
  // return content({ subStyle: hide ? 'tiny' : 'normal', onUnfold: () => { } });
  return content();
}

export default component(
  connect(({ auth }) => ({
    user: auth.user
  })),
  FormCreate(),
  withRouter,
)(PanelComment);
