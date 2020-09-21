import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import helper from 'helper';
import { FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { SetOrGetViews, Breadcrumb } from './c';
import { message, Button } from 'antd';
import Clipboard from 'clipboard';
import cookies from 'utils/cookie';
import styles from './Download.less';

// const id = '5ed7103c92c7f9be217bde2c';
const Download = props => {
  const [baiduyun, setBdy] = useState();

  const confInfo = JSON.parse(cookies.getCookie('conf')) || props.confInfo;
  const { org } = helper.parseMatchesParam(props, {}, ['org']);
  let clipboard;
  useEffect(() => {
    clipboard = new Clipboard('#foo');
    SetOrGetViews('click', props.dispatch, confInfo && confInfo.id ? confInfo.id : '');
  });

  useEffect(() => {
    if (confInfo && confInfo.config) {
      const { config } = confInfo;
      const { paper = {} } = typeof config === 'string' ? JSON.parse(config) : config;
      const bdLink =
        paper.download_org && paper.download_org.length > 0
          ? paper.download_org.filter(item => item.key === org)[0]
          : {};
      setBdy(bdLink);
    }
  }, [confInfo]);

  const copy = () => {
    message.success('复制成功');
    // clipboard.on('success', function (e) {
    //   console.log('1111');
    //   message.success('复制成功')
    //   e.clearSelection();
    // });

    // clipboard.on('error', function (e) {
    //   message.error('复制失败')
    // });
  };

  return (
    <Layout>
      <Breadcrumb
        routes={['confIndex', 'confInfo', 'download']}
        getConfInfo={confInfo && confInfo.short_name}
      />
      {org && baiduyun && (
        <div className={styles.Download}>
          <a href={`${baiduyun.link}`} target="_blank" rel="noopener noreferrer">
            <FM id={`aminer.conf.download`} default="下载链接" />
          </a>
          <div>
            <FM id={`aminer.conf.download.code`} default="提取码：" />
            {baiduyun.code}
          </div>
          <Button
            type="primary"
            id="foo"
            data-clipboard-text={baiduyun.code}
            onClick={copy}
            icon="copy"
            shape="circle"
            style={{ marginLeft: 20 }}
          />
        </div>
      )}
    </Layout>
  );
};

export default page(
  connect(({ aminerConf }) => ({
    confInfo: aminerConf.confInfo,
  })),
)(Download);

// const baiduyun = {
//   all: { link: 'https://pan.baidu.com/s/1HG3063D7pyyFJsS2PM0CaQ', code: '7xbs' },
//   st: { link: 'https://pan.baidu.com/s/1bOGF-GPakD_gIYB_3SvufA', code: 'u63q' },
//   ybx: { link: 'https://pan.baidu.com/s/1jI7UFCwWcmsQurL6tRfqFA', code: 'u8x3' },
//   wr: { link: 'https://pan.baidu.com/s/1aIH2eXL-ePFuqXqV0V3EPg', code: 'ju9h' },
//   tx: { link: 'https://pan.baidu.com/s/1LZ9Rg3VzZuCgV4KbkJVKQA', code: '8yhx' },
//   hw: { link: 'https://pan.baidu.com/s/1InCDF-OnnuJCLDlZFWFsbw ', code: 'fk9j' },
//   bd: { link: 'https://pan.baidu.com/s/1J9bH9cu7VvHGbos48UDAgw', code: 'tky4' },
//   meg: { link: 'https://pan.baidu.com/s/1kTBVJILZoAjhgVsLZjMcCQ', code: 'ju52' },
//   ks: { link: 'https://pan.baidu.com/s/185RZZZC7mzr6ZnARCMshFA', code: 'c9w9' },
//   jd: { link: 'https://pan.baidu.com/s/1zSRPK-hfmZMR1piGj2OydA', code: 'wfmr' },
//   qy: { link: 'https://pan.baidu.com/s/1cGe3fR4rUPJoB-xjO6JNRg', code: 'mtgt' },
// };
