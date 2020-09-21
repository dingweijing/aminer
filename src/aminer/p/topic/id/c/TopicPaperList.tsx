import React from 'react';
import { FM } from 'locales';
import { page, connect, Link } from 'acore';
import pubHelper from 'helper/pub';
import PaperList from 'aminer/components/pub/PublicationList.tsx';
import {
  PaperVoteV2,
  PaperCollect,
  MustReadEdit,
  MustReadDelete,
} from 'aminer/core/search/c/widgets';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { PubInfo, PubListZoneType, PubAuthor } from 'aminer/components/pub/pub_type';
import { MustReadReason } from 'aminer/core/pub/widgets/info';
import styles from './TopicPaperList.less';

interface Proptypes {
  paperList: PubInfo[];
  paperItem?: PubInfo;
  topicInfo: object;
  user: object;
}

const TopicPaperList: React.FC<Proptypes> = props => {
  const { paperList, topicInfo, user } = props;

  const abstractZone = [
    ({ paper }: { paper: PubInfo }) => {
      return (
        <MustReadReason
          paper={{
            ...paper,
            reason: paper.headline || paper.abstract,
            img: '',
          }}
          showComment={false}
        />
      );
    },
  ];

  const onSharePaper = (text: string) => {
    const url = window.location.href;
    const openWeibo = () =>
      window.open(
        `http://service.weibo.com/share/share.php?title=${text}&url=${url}&source=bookmark&appkey=2992571369`,
      );
    if (/Firefox/.test(navigator.userAgent)) {
      setTimeout(openWeibo, 0);
    } else {
      openWeibo();
    }
  };
  const goToPub = (pub: PubInfo) => {
    window.open(pubHelper.genPubTitle({ id: pub.id, title: pub.title }));
  };

  // TODO: 不知道改写什么类型
  const checkError = e => {
    e.target.style.display = 'none';
  };

  const keywordsZone = [
    ({ paper }: { paper: PubInfo }) => {
      return (
        <div key={`${paper.id}_img`} className="keywordsZone">
          <div className="left">
            {paper.imgs ? (
              paper.imgs.map(img => {
                return (
                  <img
                    src={img}
                    key={img}
                    alt="Must Reading"
                    onClick={goToPub.bind(null, paper)}
                    onError={checkError}
                  />
                );
              })
            ) : (
              <img
                src="https://originalfileserver.aminer.cn/data/topic/default_img.jpeg"
                alt="default"
              />
            )}
          </div>
          <div className="right desktop_device">
            <Link
              className="right_comment"
              to={`${pubHelper.genPubTitle(paper)}?linktocomment=true`}
              target="_blank"
            >
              <div className="svg_outer">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-pinglun" />
                </svg>
              </div>
              <span className="legend">
                <FM id="aminer.paper.comment" />
              </span>
            </Link>

            <div
              className="right_weibo"
              onClick={onSharePaper.bind(null, paper.headline || paper.abstract || '')}
            >
              <div className="svg_outer">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-weibo1" />
                </svg>
              </div>
              <span className="legend">
                <FM id="aminer.paper.headline" defaultMessage="Wei bo" />
              </span>
            </div>

            {/* <div className="right_shopping desktop_device">
              <PaperCollect
                wrapClassName="paperCollects"
                wrapCollectBtn="wrapCollectBtn"
                paper={paper}
              />
            </div> */}
          </div>
        </div>
      );
    },
  ];

  const infoRightZone = [
    ({ paper }: { paper: PubInfo }) => {
      return (
        <div className="info_right_zone">
          <div>
            {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (
              <MustReadEdit
                topicInfo={topicInfo}
                paper={paper}
                editType="update"
                key="12"
                fmId="aminer.common.edit"
              />
            )}
            {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (
              <MustReadDelete topic={topicInfo} paper={paper} />
            )}
          </div>
          <div key={paper.id} className="infoRightZone desktop_device">
            <PaperVoteV2 paper={paper} />
          </div>
        </div>
      );
    },
  ];

  const venueZone = [
    ({ paper }: { paper: PubInfo }) => {
      return (
        <div className="rightZone desktop_device">
          {paper.have_method && (
            <div className="anchor_block_method">
              <Link
                to={pubHelper.genPubTitleAnchor({
                  id: paper.id,
                  title: paper.title,
                  anchor: 'methods',
                })}
                className="anchor"
                target="_blank"
              >
                <FM id="aminer.paper.analysis.methods" defaultMessage="方法" />
              </Link>
            </div>
          )}
          {paper.have_result && (
            <div className="anchor_block_result">
              <Link
                to={pubHelper.genPubTitleAnchor({
                  id: paper.id,
                  title: paper.title,
                  anchor: 'conclusion',
                })}
                className="anchor"
                target="_blank"
              >
                <FM id="aminer.paper.analysis.conclusion" defaultMessage="Conclusion" />
              </Link>
            </div>
          )}
        </div>
      );
    },
  ];
  return (
    <PaperList
      className={styles.paperList}
      papers={paperList}
      isShowPdfIcon
      abstractZone={abstractZone}
      venueZone={['__DEFAULT_PLACEHOLDER__', ...venueZone]}
      titleRightZone={[]}
      contentRightZone={[]}
      keywordsZone={keywordsZone}
      infoRightZone={infoRightZone}
    />
  );
};

export default page(connect())(TopicPaperList);
