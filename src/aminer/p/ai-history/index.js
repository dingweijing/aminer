import React, { useEffect, Fragment } from 'react';
import { page, component, connect } from 'acore';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { Button, message } from 'antd';
import { FM, formatMessage } from 'locales';
import Clipboard from 'clipboard';
import styles from './index.less';

const citeContent = `@INPROCEEDINGS{Tang:08KDD,
  AUTHOR = "Jie Tang and Jing Zhang and Limin Yao and Juanzi Li and Li Zhang and Zhong Su",
  TITLE = "ArnetMiner: Extraction and Mining of Academic Social Networks",
  pages = "990-998",
  YEAR = {2008},
  BOOKTITLE = "KDD'08",
}
`;

const AIHistoryPage = props => {
  const { dispatch, ai_history_data } = props;
  let clipboard = null;

  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (!ai_history_data) {
      dispatch({
        type: 'aminerAI10/getAIHistoryData',
      });
    }
  }, []);

  useEffect(() => {
    if (!clipboard) {
      clipboard = new Clipboard('#cite_paper_copy_btn', {
        text: () => citeContent,
      });
      clipboard.on('success', e => {
        message.success(
          formatMessage({
            id: 'aminer.header.collector.copySuccess',
            defaultMessage: 'Copied successfully',
          }),
        );
      });
    }
    return () => {
      clipboard.destroy();
    };
  }, []);

  return (
    <Layout showSearch>
      <article className={styles.wrapper}>
        <section className={styles.article}>
          <h1 className={styles.title}>Artificial Intelligence History</h1>

          <div className={styles.imgBox}>
            <img
              className={classnames(styles.imgWrap)}
              src="https://originalstatic.aminer.cn/misc/shaozhou/AI-history-tiny.jpg"
              alt="Artificial Intelligence History"
            />
            <a
              className={styles.showDetail}
              href="https://originalstatic.aminer.cn/misc/shaozhou/AI-history-new.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FM id="aminer.aihistory.original" defaultMessage="Original Image" />
            </a>
          </div>

          <div className={styles.citeTip}>
            <span className={styles.highLight}>* </span>
            <FM
              id="aminer.aiHistory.cite"
              defaultMessage="If you want to use this picture, please cite the following paper :"
            />
          </div>
          <div className={styles.paper}>
            Jie Tang, Jing Zhang, Limin Yao, Juanzi Li, Li Zhang, and Zhong Su.{' '}
            <a
              href="https://www.aminer.cn/pub/53e9a5afb7602d9702edacce/arnetminer-extraction-and-mining-of-academic-social-networks"
              target="_blank"
              rel="noopener noreferrer"
            >
              ArnetMiner: Extraction and Mining of Academic Social Networks.
            </a>{' '}
            In Proceedings of the Fourteenth ACM SIGKDD International Conference on Knowledge
            Discovery and Data Mining (SIGKDD'2008). pp.990-998.{' '}
            <a
              href="http://keg.cs.tsinghua.edu.cn/jietang/publications/KDD08-Tang-et-al-ArnetMiner.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              [PDF]
            </a>{' '}
            <a
              href="http://keg.cs.tsinghua.edu.cn/jietang/publications/KDD08-Tang-et-al-Arnetminer.ppt"
              target="_blank"
              rel="noopener noreferrer"
            >
              [Slides]
            </a>{' '}
            <a href="https://www.aminer.org/" target="_blank" rel="noopener noreferrer">
              [System]
            </a>{' '}
            <a
              href="http://arnetminer.org/RESTful_service"
              target="_blank"
              rel="noopener noreferrer"
            >
              [API]
            </a>
          </div>
          <div className={styles.citeWrap} id="cite_content">
            <pre className={styles.copyContent}>{citeContent}</pre>
            <Button type="link" id="cite_paper_copy_btn" className={styles.copyBtn}>
              <svg className={styles.copyIcon} aria-hidden="true">
                <use xlinkHref="#icon-fuzhi" />
              </svg>
              <FM id="aminer.header.collector.copy" defaultMessage="aminer.header.collector.copy" />
            </Button>
          </div>

          <div className="word_wrap" dangerouslySetInnerHTML={{ __html: ai_history_data }}></div>
        </section>
      </article>
    </Layout>
  );
};

AIHistoryPage.getInitialProps = async ({ isServer, store }) => {
  console.log('=============AIHistoryPage render');
  if (!isServer) {
    return;
  }

  await store.dispatch({
    type: 'aminerAI10/getAIHistoryData',
  });

  const { aminerAI10 } = store.getState();
  return { aminerAI10 };
};

export default page(
  connect(({ aminerAI10 }) => ({
    ai_history_data: aminerAI10.ai_history_data,
  })),
)(AIHistoryPage);
