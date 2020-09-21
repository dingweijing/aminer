import React, { useEffect, useState } from 'react';
import { FM } from 'locales';
import { page, history, connect } from 'acore';
import { classnames } from 'utils';
import consts from 'consts';
import { EmptyTip } from 'components/ui';
import PersonList from 'aminer/components/expert/PersonList.tsx';
import { SetOrGetViews, CountDown } from './c';
import AuthorBottomZone from './c/Author/AuthorPubs';
import HotTopicTrend from './c/HomePage/HotTopicTrend';
import CitePaperAndBestPaper from './c/HomePage/CitePaperAndBestPaper';
import styles from './HomePage.less';

// const id = '53a7256420f7420be8b4e0aa';

const LANGUAGE = { 1: 'chineseAuthors', 2: 'chineseStudent' };

const HomePage = props => {
  const [data, setData] = useState();
  const [chineseStudent, setChineseStudent] = useState();
  const { dispatch, confIntro, confInfo } = props;
  const homepageConfig = (confInfo && confInfo.config && confInfo.config.homepage) || {};

  const getPapers = ({ language, type }) => {
    dispatch({
      type: 'aminerConf/SearchAuthors',
      payload: {
        conf_id: confInfo && confInfo.id,
        offset: 0,
        size: 10,
        language,
      },
    }).then(res => {
      const { items: authors } = res;
      const temp = [];
      if (authors) {
        authors.forEach(item => {
          const { related_info, name } = item;
          temp.push({
            person: item || { name },
            related: related_info,
          });
        });
      }
      if (type === LANGUAGE['1']) {
        setData(temp);
      } else {
        setChineseStudent(temp);
      }
    });
  };

  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
      getPapers({ language: 1, type: LANGUAGE['1'] });
      getPapers({ language: 2, type: LANGUAGE['2'] });
    }
  }, [confInfo]);

  const contentRankZone = ({ index }) => {
    return (
      <div key={6} className={styles.personRanking}>
        {index <= 2 && (
          <div className={styles.top}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={`#icon-ai10_rank_${index + 1}`} />
            </svg>
          </div>
        )}
        {index > 2 && index <= 9 && (
          <div className={classnames(styles.no, styles.top)}>
            <span>{index + 1}</span>
          </div>
        )}
        {index > 9 && (
          <div className={styles.no}>
            <span>{index + 1}</span>
          </div>
        )}
      </div>
    );
  };

  const contentBottomZone = ({ params, experts, type }) => {
    return (
      <AuthorBottomZone
        {...params}
        others={{ related: experts.related }}
        confInfo={confInfo}
        type
        key={type}
      />
    );
  };

  const authorBlockClick = e => {
    e.preventDefault();
    dispatch(
      history.push({
        pathname: `/conf/${(confInfo && confInfo.short_name) || ''}/roster`,
      }),
    );
  };

  return (
    <div className={styles.homepage}>
      <div className="left_block">
        <HotTopicTrend
          confIntro={confIntro}
          confInfo={confInfo}
          topic_trend={homepageConfig.topic_trend}
        />

        {/* TODO:配置文件 */}
        {homepageConfig.best_paper_id && (
          <CitePaperAndBestPaper
            confInfo={confInfo}
            bestPaperId={homepageConfig.best_paper_id}
            SetOrGetViews={SetOrGetViews}
          />
        )}

        <div className="author_rank">
          <div className="scholar">
            <div className="children_legend">
              <FM id="aminer.conf.chinese-scholar.legend" />
              <span onClick={authorBlockClick.bind()} className="more_btn">
                <svg className="icon titleEditIcon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow" />
                </svg>
                <FM id="aminer.common.more" />
              </span>
            </div>
            <div className="authors_content">
              {data &&
                data.length > 0 &&
                data.map((experts, index) => {
                  return (
                    <PersonList
                      key={`authors_${index}`}
                      className=""
                      id="aminerPersonList"
                      target="_blank"
                      persons={[experts.person]}
                      tagZone={[]}
                      nameRightZone={[]}
                      rightZone={[() => contentRankZone({ index })]}
                      contentBottomZone={[
                        params => contentBottomZone({ params, experts, type: 'authors' }),
                      ]}
                    />
                  );
                })}
              {data && data.length === 0 && <EmptyTip />}
            </div>
          </div>
          <div className="student">
            <div className="children_legend chinese_first">
              <FM id="aminer.conf.chinese-first.legend" />
              <span onClick={authorBlockClick.bind()} className="more_btn">
                <svg className="icon titleEditIcon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow" />
                </svg>
                <FM id="aminer.common.more" />
              </span>
            </div>
            <div className="authors_content">
              {chineseStudent &&
                chineseStudent.length > 0 &&
                chineseStudent.map((experts, index) => (
                  <PersonList
                    key={`student_${index}`}
                    className=""
                    id="aminerPersonList"
                    target="_blank"
                    persons={[experts.person]}
                    tagZone={[]}
                    nameRightZone={[]}
                    rightZone={[() => contentRankZone({ index })]}
                    contentBottomZone={[
                      params => contentBottomZone({ params, experts, type: 'student' }),
                    ]}
                  />
                ))}
              {chineseStudent && chineseStudent.length === 0 && <EmptyTip />}
            </div>
          </div>
        </div>
      </div>
      {homepageConfig.ads && (
        <div className="right_block desktop_device">
          <div className="weChart">
            <FM
              id={
                confInfo?.short_name === 'kdd2020'
                  ? 'aminer.conf.activity'
                  : 'aminer.conf.contact.wechart'
              }
              values={{
                conf:
                  confInfo &&
                  confInfo.short_name &&
                  confInfo.short_name.split(' ')[0].toUpperCase(),
              }}
            />
            <img src={`${consts.ResourcePath}/data/conf/xiaomai.jpeg`} alt="xiaomai" />
          </div>
          {homepageConfig.nextConfName && (
            <CountDown
              startTime={homepageConfig.startTime}
              nextConfName={homepageConfig.nextConfName}
            />
          )}
        </div>
      )}
      {/* {homepageConfig.ads && ( */}
      {/* <div>
        <Statistics confInfo={confInfo} SetOrGetViews={SetOrGetViews} />
      </div> */}
      {/* )} */}
    </div>
  );
};

// HomePage.getInitialProps = async params => {
//   const { store, isServer } = params;
//   if (!isServer) {
//     return;
//   }
//   const { confInfo } = props;
//   const id = (confInfo && confInfo.config && confInfo.config.rankid) || '';
//   if (id) {
//     await store.dispatch({
//       type: 'rank/getConfRankItem',
//       payload: {
//         id,
//         year_begin: new Date().getFullYear(),
//         year_end: new Date().getFullYear(),
//       },
//     });
//   }
//   const { rank } = store.getState();
//   return { rank };
// };

export default page(connect())(HomePage);
