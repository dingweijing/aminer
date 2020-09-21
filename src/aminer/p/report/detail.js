import React, { PureComponent } from 'react';
import { connect, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import { classnames } from 'utils';
import { logtime } from 'utils/log';
import { Helmet } from 'react-helmet';
import helper from 'helper';
import QRCode from 'qrcode.react';
import moment from 'moment';
import styles from './detail.less';

export default @connect(({ report }) => ({
  report: report.report,
}))

class ReportPage extends PureComponent {

  componentDidMount() {
    const { id } = helper.parseMatchesParam(this.props, {}, ['id']);
    // const { id } = helper.getMatchParams(this.props);
    const { dispatch, report } = this.props;
    if (!report && id) {
      dispatch({
        type: 'report/getReport',
        payload: { id },
      })
    }
    if (id) {
      dispatch({
        type: 'report/addViewById',
        payload: { id },
      })
    }
    // if (document && !document.getElementById('cnzz_stat_icon_1277666986')) {
    //   const cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://"); 
    //   document.write(unescape("%3Cspan id='cnzz_stat_icon_1277666986'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s23.cnzz.com/z_stat.php%3Fid%3D1277666986' type='text/javascript'%3E%3C/script%3E"));
    // }
  }

  render() {
    const { report } = this.props;
    console.log(report, '111')
    return (
      <Layout showHeader={true} showFooter={true} showSearch={false}
        pageTitle={(report && report.title) || 'AMiner'}
      >
        <article className={styles.reportPage}>
          {report && (
            <div className={styles.wrap}>
              <div className={styles.bread}>
                <a className={styles.back} href="/research_report/articlelist">
                  <span>所有文章</span>
                </a>
                <span> > </span> <span>正文</span>
              </div>
              <p className={styles.reportTitle}>{report.title}</p>
              {report.author && (
                <p className={styles.author}>作者: {report.author}</p>
              )}
              {report.created_time && (
                <p
                  className={styles.time}>时间: {moment(report.created_time).format('YYYY-MM-DD HH:mm')}
                </p>
              )}

              {report.keywords && report.keywords.length ? (
                <p className={styles.keywords}>关键词: {report.keywords.join('，')}</p>
              ) : ''}

              {report.abstract && (
                <div className={styles.abstract}>{report && report.abstract}</div>
              )}
              <section className={styles.reportContent}>
                {report.html && <span className={styles.braft_output_content}
                  dangerouslySetInnerHTML={{ __html: report.html }} />}
              </section>

              {report.wxlink && (
                // <Tooltip placement="left" overlayClassName="QRTooltip" title={

                // }>
                <div className={styles.qrfix}>
                  <div className={styles.qrcenter}>
                    <div className={styles.qrWrap}>
                      <QRCode className={styles.wxlink} value={report.wxlink} size={72} />
                      <span className={styles.wxlinkTip}>扫码微信阅读</span>
                    </div>
                  </div>
                </div>

              )}

              {report.is_download && report.pdfname && (
                <div className={styles.downfix}>
                  <div className={styles.downcenter}>
                    <a href={`https://static.aminer.cn/misc/pdf/${report.pdfname}`}
                      className={styles.pdflink}>下载报告</a>
                  </div>
                </div>
              )}

              {report.reco && !!report.reco.length && <div className={styles.footerReco}>
                <div className={styles.recommend}>
                  <span>推荐阅读</span>
                  <Link to="/research_report/articlelist" className={styles.recoMore}>更多</Link>
                </div>
                <div className={styles.recoList}>
                  {report.reco.map(report => {
                    return (
                      <div className={styles.reco} key={report._id}>
                        <a href={`/research_report/${report._id}`} target="_blank">
                          <div className={styles.recoImg}>
                            <img src={report.image} alt={report.title} />
                          </div>
                          <div className={styles.recoInfo}>
                            <div className={styles.recoTitle} style={{ WebkitBoxOrient: 'vertical' }}>{report.title}</div>
                            <div className={styles.recoBottom}>
                              <div className={styles.recoAuthor}>
                                <i className="fa fa-user"></i>
                                <span>{report.author}</span>
                              </div>
                              <div className={styles.recoView}>
                                <i className="fa fa-eye"></i>
                                <span>{report.view}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>}
            </div>
          )}
        </article>
      </Layout>
    )
  }
}


ReportPage.getInitialProps = async ({ store, isServer, match }) => {
  const { id } = match.params || {};
  if (!isServer) { return; }
  logtime('getInitialProps::ReportPage')

  if (id) {
    await store.dispatch({
      type: 'report/getReport',
      payload: { id }
    });
    logtime('getInitialProps::ReportPage Done')
    const { report: { report } } = store.getState();
    return { report };
  }
};
