import React, { useEffect, useState } from 'react';
import { component, connect, } from 'acore';
import { classnames } from 'utils';
import { Tabs, Input, Button, message } from 'antd';
import { FM, formatMessage } from 'locales';
import Clipboard from 'clipboard';
import styles from './RelatedWork.less';

const { TabPane } = Tabs;

interface IPropTypes {
  dispatch: (config: { type: string; payload: { params: any } }) => Promise<any>;
  selected: string[];
}

const RelatedWork: React.FC<IPropTypes> = props => {
  const { downloadFiles, selected, dispatch } = props;
  let clipboard1 = null,
    clipboard2 = null;
  const [tab, setTab] = useState('relatedWork');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!clipboard1) {
      clipboard1 = new Clipboard('#related_word_copy_btn', {
        target: () => document.getElementById('related_work'),
      });
    }
    if (!clipboard2) {
      clipboard2 = new Clipboard('#related_work_word_copy_btn', {
        target: () => document.getElementById('related_work_word'),
      });
    }
  }, []);

  useEffect(() => {
    const payload = { ids: selected };
    if (tab === 'word') {
      payload.query = 'word';
    }
    dispatch({
      type: 'searchpaper/getPaperRelatedWork',
      payload,
    }).then(data => {
      let content = `${data.desc || ''}${data.article || ''}`;
      if (tab === 'word') {
        content = `${data.desc || ''}${data.word || ''}`;
      }
      setContent(content);
    });
  }, [tab]);

  const onTabChange = key => {
    setTab(key);
    setContent('');
  };

  const copySuccess = () => {
    message.success(
      formatMessage({ id: 'aminer.header.collector.copySuccess', defaultMessage: '复制成功' }),
    );
  };

  const downloadRelatedWork = () => {
    if (content && content.length) {
      downloadFiles('Related work.txt', content);
    } else {
      message.error(
        formatMessage({
          id: 'aminer.header.collector.downloadNull',
          defaultMessage: '没有下载内容',
        }),
      );
    }
  };

  const autoHeight =
    document && document.body && document.body
      ? document.getElementById('aminer_modal_content').offsetHeight - 180
      : 300;
  const renderContent = (content, setContent, copySuccess, download, textAreaId, btnId) => (
    <div>
      <Input.TextArea
        // autoSize={{ minRows: 2, maxRows: 18 }}
        style={{ height: autoHeight, maxHeight: autoHeight }}
        value={content}
        id={textAreaId}
        onChange={e => setContent(e.target.value)}
      />
      <div className="btnLine">
        <Button id={btnId} onClick={copySuccess} className="btn">
          <svg className={classnames('icon copyBtn')} aria-hidden="true">
            <use xlinkHref="#icon-niantie" />
          </svg>
          <FM id="aminer.header.collector.copy" defaultMessage="复制到剪切板" />
        </Button>
        <Button onClick={download} className="btn">
          <svg className={classnames('icon downloadBtn')} aria-hidden="true">
            <use xlinkHref="#icon-xiazai" />
          </svg>
          <FM id="aminer.paper.download" defaultMessage="Download" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.relatedwork}>
      <Tabs defaultActiveKey="relatedWork" onChange={onTabChange} animated={false}>
        <TabPane
          tab={formatMessage({
            id: 'aminer.header.collector.txtContent',
            defaultMessage: 'Bibtex 格式',
          })}
          key="relatedWork"
        >
          {renderContent(
            content,
            setContent,
            copySuccess,
            downloadRelatedWork,
            'related_work',
            'related_word_copy_btn',
          )}
        </TabPane>
        <TabPane
          tab={formatMessage({
            id: 'aminer.header.collector.wordContent',
            defaultMessage: 'Word 格式',
          })}
          key="word"
        >
          {renderContent(
            content,
            setContent,
            copySuccess,
            downloadRelatedWork,
            'related_work_word',
            'related_work_word_copy_btn',
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default component(connect())(RelatedWork);
