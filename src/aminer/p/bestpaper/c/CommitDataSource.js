import React from 'react';
import { component, FormCreate, connect } from 'acore';
import { classnames } from 'utils';
import { isAuthed, parseRoles, haveRole } from 'utils/auth';
import { formatMessage } from 'locales';
import { Button, Row, Form, Input, Checkbox, Select, Modal, message } from 'antd';
import styles from './CommitDataSource.less'

const CommitDataSource = props => {
  const { form, form: { getFieldDecorator }, dispatch, user } = props;
  const { dataSource } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (errors, values) => {
      if (!errors) {
        const { conference_name, urls, status } = values;

        // console.log('url_array', url_array)
        // const params = 

        if (dataSource && dataSource.id) {
          updateDataSource({
            conference_name, url: urls, status: status || 'submit'
          })
        } else {
          let url_array = urls.split(';');
          url_array = url_array.map(item => item.trim());
          commitDataSource({
            conference_name, urls: url_array
          })
        }
      }
    });
  }

  const updateDataSource = (params) => {
    dispatch({
      type: 'rank/UpdateBestPaperSubmitByUid',
      payload: { id: dataSource.id, ...params }
    }).then(res => {
      const { onCommitFinish } = props;
      message.success('success');
      dispatch({ type: 'modal/close' });
      if (onCommitFinish) {
        onCommitFinish()
      }
    })
  }

  const commitDataSource = (params) => {
    dispatch({
      type: 'rank/SaveBestPaperSubmit',
      payload: params
    }).then(res => {
      res && message.success('success');
      dispatch({ type: 'modal/close' })
    })
  }

  return (
    <div className={styles.dataForm}>
      <Form layout='vertical' onSubmit={handleSubmit}>
        <Form.Item className={styles.formItem} label='Conference Name'>
          {getFieldDecorator('conference_name', {
            initialValue: dataSource && dataSource.conference_name || ''
          })(
            <Input />
          )}
        </Form.Item>
        {(!dataSource || !dataSource.id) && (
          <Form.Item className={styles.formItem} label='Urls (Separate urls with ; please)'>
            {getFieldDecorator('urls', {
              rules: [
                { required: true, message: 'Please input urls' },
              ],
            })(
              <Input.TextArea />
            )}
          </Form.Item>
        )}
        {dataSource && dataSource.id && (
          <Form.Item className={styles.formItem} label='Url'>
            {getFieldDecorator('urls', {
              rules: [
                { required: true, message: 'Please input url' },
                // {
                //   message: formatMessage({
                //     id: 'aminer.regiest.email.right',
                //     defaultMessage: 'Please enter vaild email address'
                //   }),
                //   pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
                // }
              ],
              
              initialValue: dataSource && dataSource.url || ''
            })(
              <Input />
            )}
          </Form.Item>
        )}
        {(isAuthed(parseRoles(user)) || haveRole(parseRoles(user), 'roster_editor')) && (
          <Form.Item className={styles.formItem} label='Status'>
            {getFieldDecorator('status', {
              initialValue: dataSource && dataSource.status || 'submit'
            })(
              <Select
                style={{ width: '100%' }}
                placeholder='submit'

              >
                <Select.Option value="submit">
                  submit
                </Select.Option>
                <Select.Option value="checked">
                  checked
                </Select.Option>
                <Select.Option value="finished">
                  finished
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item className={styles.formItem}>
          <Button className={classnames(styles.loginBtn)} htmlType="submit">
            {formatMessage({id: 'aminer.common.submit', defaultMessage: 'Submit'})}
          </Button>
        </Form.Item>
      </Form>
    </div>

  )
}

export default component(FormCreate(), connect(({ auth }) => ({
  user: auth.user
})))(CommitDataSource);