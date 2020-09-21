// getSchedule

import React, { useEffect, useState } from 'react';
import { Checkbox, Button } from 'antd';
import { page, connect, Link } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import { Spin } from 'aminer/components/ui';
import { setOrGetClickView } from 'services/aminer/conf';
import { ExpertLink } from 'aminer/components/widgets';
import { getProfileUrl } from 'utils/profile-utils';
import ConfPaperList from '../Paper/ConfPaperList';
import styles from './CitePaperAndBestPaper.less';
import { addViewById } from 'services/aminer/report';

const SIZEPERPAGE = 3;
// const id = '53a727fe20f7420be8ba4825';
const CitePaperAndBestPaper = props => {
  const [citePaper, setCitePaper] = useState();
  const [bestPaper, setBestPaper] = useState();
  const { dispatch, confInfo, bestPaperId, SetOrGetViews } = props;

  useEffect(() => {
    dispatch({
      type: 'aminerConf/SearchPubs',
      payload: {
        conf_id: confInfo.id,
        offset: 0,
        size: SIZEPERPAGE,
        sort: 'citation',
      },
    }).then(result => {
      const { items } = result || {};
      setCitePaper(items);
    });

    dispatch({
      type: 'rank/GetBestPapersById',
      payload: { ids: [bestPaperId] },
    }).then(data => {
      setBestPaper(data[0].value);
    });
  }, []);
  const addView = type => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'homepage',
        payload: JSON.stringify({ more: type }),
      },
    });
  };
  return (
    <div className={styles.citePaperAndBestPaper}>
      <div className="cite_paper">
        <div className="header">
          <span className="legend">
            <FM id="aminer.conf.homepage.citedPapers" defaultMessage="引用量 Top 3 入选论文" />
          </span>
          <Link to="papers" className="more_btn">
            <span onClick={addView.bind(null, 'cited_paper')}>
              <svg className="icon titleEditIcon" aria-hidden="true">
                <use xlinkHref="#icon-arrow" />
              </svg>
              <FM id="aminer.common.more" />
            </span>
          </Link>
        </div>
        <ConfPaperList
          pubs={citePaper}
          confInfo={confInfo}
          contentRightZone={[]}
          infoRightZone={[]}
        />
      </div>
      {/* TODO: best paper 有id 53a727fe20f7420be8ba4825 */}
      <div className="history_paper">
        <div className="header">
          <span className="legend">
            <FM id="aminer.conf.homepage.bestPapers" defaultMessage="历年 ACL best paper" />
          </span>
          <Link to={`/bestpaper/${bestPaperId}`} className="more_btn" target="_blank">
            <svg className="icon titleEditIcon" aria-hidden="true">
              <use xlinkHref="#icon-arrow" />
            </svg>
            <FM id="aminer.common.more" />
          </Link>
        </div>
        {bestPaper &&
          bestPaper.length > 0 &&
          bestPaper.slice(0, 5).map(papers => {
            return (
              <div className="timeline" key={papers.year}>
                <div className="content">
                  <span className="year">{papers.year}</span>
                  {papers.papers_info.map(paper => {
                    const { authors } = paper;
                    if (paper.isBest) {
                      return (
                        <div key={paper.id} className="paper">
                          <span className="paperTitle">
                            <Link to={`/pub/${paper.paper_id}?conf=acl2020`} target="_blank">
                              {paper.title}
                            </Link>
                          </span>
                          <div className="paperAuthors">
                            {authors &&
                              authors.length > 0 &&
                              authors.map((author, index) => (
                                <div key={author.id || index} className="authorPart">
                                  {author.id && (
                                    <ExpertLink author={author}>
                                      <Link
                                        to={getProfileUrl(author.name, author.id)}
                                        target="_blank"
                                        id={`sid_${author.id}`}
                                        className="author"
                                      >
                                        {author.name}
                                      </Link>
                                    </ExpertLink>
                                  )}
                                  {!author.id && <span className="author">{author.name}</span>}
                                  {index + 1 !== authors.length && <span>,&nbsp;</span>}
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }
                    return;
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default page(connect())(CitePaperAndBestPaper);
