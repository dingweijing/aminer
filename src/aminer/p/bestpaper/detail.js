import React, { Fragment, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { connect, Link, component, history } from 'acore';
import { Layout } from 'aminer/layouts';
import classnames from 'classnames';
import consts from 'consts';
import helper from 'helper';
import pubHelper from 'helper/pub';
import { isLogin } from 'utils/auth';
import { logtime } from 'utils/log';
import { PaperPackLink, ExpertLink } from 'aminer/components/widgets';
import { FM, formatMessage } from 'locales';
import { Spin } from 'aminer/components/ui';
import { getProfileUrl } from 'utils/profile-utils';

import smallcard from 'helper/smallcard';
import { SmallCard } from 'aminer/core/search/c/widgets';
import { CommitDataSource } from './c';
import styles from './detail.less';

const version = 'v1';
const rankPath = `${consts.ResourcePath}/sys/aminer/rank/${version}`;
const shape = 'square'; // circle  square oval

const MAP_url =
  'https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Mean_average_precision';

const getPaperData = async ({ dispatch, id }) => {
  if (id) {
    const data = await dispatch({
      type: 'rank/GetBestPapersById',
      payload: { ids: [id] },
    });
    const [item] = data || [];
    return item;
  }
};

let timer = null;

const BestPaper = props => {
  const { dispatch, loading, user, paper } = props;
  const {
    match: {
      params: { id },
    },
  } = props;
  const [ranks, setRanks] = useState(paper);
  const cardRef = useRef();

  const rootid = 'bestpaper';
  let thiscard = null;
  let authorHoverTarget = null;

  useEffect(() => {
    if (!id || (paper && paper.id === id)) {
      return;
    }
    getPaperData({ dispatch, id }).then(data => {
      setRanks(data);
    });
  }, [id]);

  const onRef = card => {
    cardRef.current = card;
  };

  const infocardShow = (target, sid, e) => {
    if (authorHoverTarget) {
      cancelUnderline();
    }
    authorHoverTarget = e.target;
    authorHoverTarget.classList.add('underline');
    if (!thiscard) {
      thiscard = smallcard.init(rootid);
    }
    if (thiscard) {
      thiscard.show(target, sid, { x: -5, y: 20 });
    }
    if (cardRef.current) {
      cardRef.current.cancelHide();
      timer = setTimeout(() => {
        cardRef.current.getData();
      }, 0);
    }
  };

  const cancelUnderline = () => {
    authorHoverTarget.classList.remove('underline');
  };

  const infocardHide = () => {
    // smallcard.preventShow();
    if (timer) {
      clearTimeout(timer);
    }
    if (cardRef.current) {
      cardRef.current.tryHideCard();
    }
  };

  const onCommitData = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({ id: 'aminer.bestpaper.new', defaultMessage: 'New bestpaper' }),
          content: <CommitDataSource />,
        },
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const onShowData = () => {
    if (isLogin(user)) {
      window.open('/bestpaper/my/data');
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  return (
    <Layout pageTitle={formatMessage({ id: 'aminer.bestpaper.title' })}>
      <article className={styles.paperRP}>
        <h1>
          <FM
            id="aminer.bestpaper.title"
            defaultMessage="Best Papers vs. Top Cited Papers in Computer Science (since 1996)"
          />
          <div className="right">
            <Link to="/ranks/conf" className={styles.toconfrank}>
              <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank"></FM>
            </Link>
            <Link to="/resources/awards-se.html" className={styles.toconfrank}>
              <span>自然科学类奖项</span>
            </Link>
          </div>
        </h1>

        <div className="desc">
          <p>
            <FM
              id="aminer.bestpaper.desc"
              defaultMessage="The score in the bracket after each conference represents its average MAP score."
              values={{
                average: (
                  <a
                    shape="rect"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={MAP_url}
                    className="map"
                  >
                    Mean Average Precision
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-y-" />
                    </svg>
                  </a>
                ),
              }}
            />
          </p>
          <div className="formula">
            <img src={`${rankPath}/formula.png`} alt="" />
            <FM
              id="aminer.bestpaper.provid"
              defaultMessage="We acknowledge Jeff Huang for providing the list of best paper awards"
              values={{
                paper_awards: (
                  <a
                    shape="rect"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://jeffhuang.com/best_paper_awards.html"
                  >
                    {formatMessage({
                      id: 'aminer.bestpaper.paperawards',
                      defaultMessage: 'best paper awards',
                    })}
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-y-" />
                    </svg>
                  </a>
                ),
              }}
            />
          </div>
        </div>

        <div className={styles.confs}>
          <span onClick={onCommitData} className="data_btn">
            {formatMessage({ id: 'aminer.bestpaper.new', defaultMessage: 'New bestpaper' })}
          </span>
          <span onClick={onShowData} className="data_btn">
            {formatMessage({ id: 'aminer.bestpaper.submit', defaultMessage: 'My Submit' })}
          </span>
        </div>

        {ranks && (
          <div className={styles.listContent}>
            <Spin loading={loading} />
            <div className={styles.header_legend}>
              <h2 className={styles.headTitle}>
                <span className={styles.name}>
                  {ranks.conference_name && ranks.conference_name.replace(/ ?\(.*\)/, '')}
                </span>
                <span>
                  {' '}
                  (
                  <a target="_blank" rel="noopener noreferrer" href={MAP_url}>
                    {' '}
                    Average MAP
                  </a>
                  : {formatMAP(ranks.ave_MAP)}){' '}
                </span>
                {/* <Link to="/ranks/conf" className={styles.toconfrank}>
                <FM id="aminer.home.rankings.conference_rank" defaultMessage="Conference Rank"></FM>
              </Link>
              <Link to="/resources/awards-se.html" className={styles.toconfrank}>
                <span>自然科学类奖项</span>
              </Link> */}
              </h2>
              {ranks.conference_name && ranks.conference_name.replace(/ ?\(.*\)/, '') === 'ACL' && (
                <Link
                  to={`/conf/${ranks.conference_name.replace(/ ?\(.*\)/, '').toLocaleLowerCase()}2020`}
                  className={styles.conf}
                >
                  ACL 2020
                </Link>
              )}
            </div>
            <div className={styles.rankslist} id={`${rootid}_ROOT`}>
              <SmallCard onRef={onRef} id={rootid} cancelUnderline={cancelUnderline} />
              {ranks.value &&
                ranks.value.length > 0 &&
                ranks.value.map((item, index) => (
                  <RankList
                    key={index}
                    data={item}
                    title={ranks.conference_name}
                    infocardHide={infocardHide}
                    infocardShow={infocardShow}
                  />
                ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
};

BestPaper.getInitialProps = async ({ store, route, isServer }) => {
  if (!isServer) {
    return;
  }
  logtime('getInitialProps::BestPaper init');
  const {
    params: { id },
  } = route;
  const paper = await getPaperData({ dispatch: store.dispatch, id });
  return { paper };
};

export default component(
  connect(({ report, loading, auth }) => ({
    report,
    user: auth.user,
    loading: loading.effects['rank/GetBestPapersById'],
  })),
)(BestPaper);

const formatMAP = num => {
  if (num === 0) {
    return '0.0';
  }
  if (!num) {
    return;
  }
  if (num === 1) {
    return '1.0';
  }
  return `${parseFloat(num.toFixed(4))}`;
};

const RankList = props => {
  const { data, title, infocardHide, infocardShow } = props;
  const onCardHide = () => {
    infocardHide && infocardHide();
  };
  const onCardShow = (sid, pid, e) => {
    const target = document.querySelector(`#pid_${pid} #sid_${sid}`);
    if (infocardShow) {
      infocardShow(target, sid, e);
    }
  };
  if (data.papers_info.length === 0) {
    return false;
  }
  return (
    <div className={styles.rankslistItem}>
      <h3 className={styles.rankTitle}>
        <div>
          <span className={styles.titleName}>
            {title.replace(/ ?\(.*\)/, '')} {data.year}
          </span>
          <span>
            「{' '}
            <a className={styles.map} target="_blank" rel="noopener noreferrer" href={MAP_url}>
              MAP
            </a>
            <span className={styles.score}>: {formatMAP(data.MAP)}</span> 」
          </span>
        </div>
        <div className={styles.rankLabel}>
          <span className={styles.rank}>
            <FM id="aminer.paper.rank" defaultMessage="Rank" />
            <em className={styles.webHide}>&</em>
          </span>
          <span className={styles.cityed}>
            <FM id="aminer.paper.cited" defaultMessage="Cited by" />
          </span>
        </div>
      </h3>
      <ul className={styles.paperlist}>
        {data.papers_info &&
          data.papers_info.length > 0 &&
          data.papers_info.map(paper => {
            let { authors, paper_id, title } = paper;
            authors = authors && authors.slice(0, 12);
            return (
              <li className={styles.paperlistItem} key={paper_id} id={`pid_${paper_id}`}>
                <div className={styles.itemPart1}>
                  {paper.isBest && (
                    <span className={styles[shape]}>
                      <em className={styles.best}>
                        <i>B</i>
                        <i>E</i>
                        <i>S</i>
                        <i>T</i>
                        {/* <i className={styles.webHide}>!</i> */}
                      </em>
                      <em className={styles.mobileHide}>PAPER!</em>
                    </span>
                  )}
                </div>
                <div className={styles.itemPart2}>
                  <p className={styles.paperTitle}>
                    <Link to={pubHelper.genPubTitle({ id: paper_id, title })}>
                      <PaperPackLink data={paper}>{title}</PaperPackLink>
                    </Link>
                  </p>
                  <div className={styles.paperAuthors}>
                    {authors &&
                      authors.length > 0 &&
                      authors.map((author, index) => (
                        <div key={author.id || index} className={styles.authorPart}>
                          {author.id && (
                            <ExpertLink author={author}>
                              <Link
                                to={getProfileUrl(author.name, author.id)}
                                target="_blank"
                                id={`sid_${author.id}`}
                                className={styles.paperAuthor}
                                onMouseEnter={e => {
                                  onCardShow(author.id, paper_id, e);
                                }}
                                onMouseLeave={() => {
                                  onCardHide();
                                }}
                              >
                                {author.name}
                              </Link>
                            </ExpertLink>
                          )}
                          {!author.id && <span className={styles.author}>{author.name}</span>}
                          {index + 1 !== authors.length && <span>,&nbsp;</span>}
                        </div>
                      ))}
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.itemPart4}>
                    {/* <span className={styles.label}>Rank</span> */}
                    <span
                      className={classnames(styles.rank, { [styles.normal]: paper.rank_cite > 3 })}
                    >
                      {paper.rank_cite}
                    </span>
                  </div>
                  <div className={styles.itemPart3}>
                    {/* <span className={styles.label}>Cited By</span> */}
                    <span className={styles.cited}>{paper.numCitations}</span>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
