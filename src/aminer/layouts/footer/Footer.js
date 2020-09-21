/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { Link } from 'acore';
import { Layout } from 'antd';
import { FM } from 'locales';
import consts from 'consts';
import { classnames } from 'utils';
import styles from './Footer.less';

const version = 'v1';
const homeSprites = `${consts.ResourcePath}/sys/aminer/layout/${version}/home_sprites.png`;
const wechatPath = `${consts.ResourcePath}/sys/aminer/wechat.jpg`;
const Footer = props => {
  const { className, showTop } = props;

  return (
    <div className={classnames(styles.footerBg, styles[className])}>
      <Layout.Footer className="footer">
        {showTop && (
          <div className="top">
            <dl>
              <dt>关注AMiner</dt>
              <dd>
                <img src="https://static.aminer.cn/misc/recomail/aminerrss/xstt.jpg" alt="qrcode" />
              </dd>
            </dl>
            <dl>
              <dt>导航</dt>
              <dd>
                <a href="https://map.aminer.cn/geo/trajectory/touch-screen/group-overview?domain=55e6573845ce9da5c99535a9&personSuffix=%E9%99%A2%E5%A3%AB&province=&domainConfigs=&hideTitle=&language=" target="_blank" rel="noopener noreferrer">Trajectory</a>
              </dd>
              {/* <dd>
                <a href="https://csrankings.aminer.cn/" target="_blank" rel="noopener noreferrer">CSRankings</a>
              </dd> */}
              <dd>
                <a href="/ai-history" target="_blank">AI History</a>
              </dd>
              <dd>
                <a href="/open-academic-graph" target="_blank">Open Academic Graph</a>
              </dd>
              <dd>
                <a href="/event" target="_blank">Academic Events</a>
              </dd>
              <dd>
                <a href="https://trend.aminer.cn/" target="_blank" rel="noopener noreferrer">Trend</a>
              </dd>
            </dl>
            <dl>
              <dt>项目</dt>
              <dd>
                <a href="/research_report/articlelist" target="_blank">Reports</a>
              </dd>
              <dd>
                <a href="" target="_blank">AI Labs</a>
              </dd>
              <dd>
                <a href="" target="_blank">Academic Rankings</a>
              </dd>
              <dd>
                <a href="https://reco.aminer.cn/" target="_blank" rel="noopener noreferrer">RECO</a>
              </dd>
            </dl>
            <dl>
              <dt>产品</dt>
              <dd>
                <a href="" target="_blank">科研推荐</a>
              </dd>
              <dd>
                <a href="" target="_blank">GCT</a>
              </dd>
              <dd>
                <a href="" target="_blank">智库</a>
              </dd>
              <dd>
                <a href="http://open.aminer.cn/" target="_blank" rel="noopener noreferrer">AMinerOpen</a>
              </dd>
              <dd>
                <a href="http://reports.aminer.cn/" target="_blank" rel="noopener noreferrer">THU AI TR</a>
              </dd>
            </dl>
            <dl>
              <dt>合作伙伴</dt>
              <dd>
                <a href="" target="_blank">Wendy Hall</a>
              </dd>
              <dd>
                <a href="" target="_blank">Microsoft</a>
              </dd>
              <dd>
                <a href="" target="_blank">ACM</a>
              </dd>
              <dd>
                <a href="" target="_blank">Irwin King (CUHK)</a>
              </dd>
              <dd>
                <a href="" target="_blank">AI2</a>
              </dd>
              <dd>
                <a href="" target="_blank">Engineering</a>
              </dd>
            </dl>
            <span className={styles.dlsplit} />
            <dl>
              <dt>咨询热线</dt>
              <dd>010-82152508</dd>
              <dd>地址：清华大学FIT楼1-308，</dd>
              <dd>海淀区中关村东路1号院6号楼科建大厦六层</dd>
              <dd>电子邮件：info@aminer.cn</dd>
            </dl>
          </div>
        )}
        <div className="bottom">
          <ul className="links">
            <li>
              <p>
                <FM
                  id="aminer.footer.label.copyright"
                  defaultMessage="2005 - 2019 © AMiner. All Rights Reserved"
                />
                <a className={styles.record} target="_blank" href="http://www.beian.miit.gov.cn/" >京ICP备17059297号-2</a>
              </p>
            </li>

            <li>
              <Link to="/contact" target="_blank">
                <FM id="aminer.footer.link.contact" defaultMessage="Contact" />
              </Link>
            </li>
            <li>
              <Link to="/introduction" target="_blank">
                <FM id="aminer.footer.link.introduction" defaultMessage="Introduction" />
              </Link>
            </li>
            <li>
              <Link to="/joinus" target="_blank">
                <FM id="aminer.footer.link.joinUs" defaultMessage="Join-us" />
              </Link>
            </li>
            <li>
              <a href="//reco.aminer.cn/" target="_blank" rel="noopener noreferrer">
                <FM id="aminer.footer.link.recommendation" defaultMessage="Reader-recommendation" />
              </a>
            </li>
          </ul>
          <ul className="supports" >
            <li>
              <a
                href="//www.wjx.top/jq/19719234.aspx"
                aria-label="rss"
                target="_blank" rel="noopener noreferrer"
                className="bgRss"
                style={{ backgroundImage: `url(${homeSprites})` }}
              />
            </li>
            <li>
              <a href="//weibo.com/arnetminer"
                aria-label="weibo"
                target="_blank" rel="noopener noreferrer"
                className="bgWeibo"
                style={{ backgroundImage: `url(${homeSprites})` }}
              />
            </li>
            <li>
              <span
                className="bgWechat"
                style={{ backgroundImage: `url(${homeSprites})` }}
              />
              <div className="RQcode">
                <img src={wechatPath} alt="RQcode" />
              </div>
            </li>
          </ul>
        </div>
      </Layout.Footer>
    </div>
  );
};

export default Footer;
/* eslint-enable jsx-a11y/anchor-has-content */
