import React, { Dispatch } from 'react';
import { FormCreate, component, connect } from 'acore';
import { classnames } from 'utils';
import { Input, Button, Form, message } from 'antd';
import { formatMessage, FM } from 'locales';
import { FormComponentProps } from 'antd/lib/form/Form';
import styles from './WriteNote.less';

const { TextArea } = Input;

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  comments: string;
  pid: string;
  cid: string;
  loading: boolean;
  setVisible: Dispatch<boolean>;
  updatePubComment: (pid: string, comment: string) => void;
}

const WriteNote: React.FC<IPropTypes> = props => {
  const { dispatch, comments, form, pid, cid, setVisible, updatePubComment, loading } = props;

  const { getFieldDecorator } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const comment = values?.comments || '';
        // if (!comment) {
        //   return null;
        // }
        dispatch({
          type: 'collection/UpdateComments',
          payload: {
            id: pid,
            cat_id: cid,
            comments: comment,
          },
        }).then(res => {
          if (res) {
            message.success(formatMessage({ id: 'aminer.pub.collection.note.success' }));
            updatePubComment(pid, comment);
          }
          cancelPop();
        });
      }
    });
  };

  const cancelPop = () => {
    if (setVisible) {
      setVisible(false);
    }
  };

  return (
    <div className={classnames(styles.writeNote, 'write-note')}>
      <Form onSubmit={handleSubmit}>
        <Form.Item
          // labelCol={{ span: 3, offset: 3 }}
          // wrapperCol={{ span: 8 }}
          className="form_item"
        >
          {getFieldDecorator('comments', {
            initialValue: comments,
          })(
            <TextArea
              autoFocus
              className="default-input-style"
              placeholder={formatMessage({ id: 'aminer.pub.collection.note.input' })}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />,
          )}
        </Form.Item>

        <Form.Item className="btns">
          <Button size="small" className="cancel_btn" onClick={cancelPop}>
            <FM id="aminer.common.cancel"></FM>
          </Button>
          <Button size="small" className="confirm_btn" htmlType="submit" loading={loading}>
            <FM id="aminer.common.ok"></FM>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default component(
  FormCreate(),
  connect(({ loading }) => ({
    loading: loading.effects['collection/UpdateComments'],
  })),
)(WriteNote);
