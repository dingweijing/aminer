// getSchedule

import React, { useEffect, useState } from 'react';
import { Checkbox, Button } from 'antd';
import { page, connect, history } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import { ConfInfo } from 'aminer/p/ranks-conf/c';
import { Spin } from 'aminer/components/ui';
import { loadECharts4, loadEchartsWithWordcloud } from 'utils/requirejs';
import { setOrGetClickView } from 'services/aminer/conf';
import styles from './HotTopicTrend.less';

const topicTrendID = `topic_trend`;
let cloudChart;
const year = new Date().getFullYear();
const KeywordsList = props => {
  // const [keywordList, setKeywordsList] = useState([]);
  // 词云用的keywords
  const [keywords, setKeywords] = useState([]);

  const { confIntro, confInfo, topic_trend, confInfoByRank, keywordsModel, dispatch } = props;
  const id = (confInfo && confInfo.config && confInfo.config.rankid) || '';
  let topicTrendEle;

  // const homepageConfig = confInfo.config.homepage;

  useEffect(() => {
    if (id && (!confIntro || !confInfo)) {
      dispatch({
        type: 'rank/getConfRankDetail',
        payload: {
          id,
          year_begin: year,
          year_end: year,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (topic_trend) {
      const series = [];
      const legend = [];
      topic_trend.series.map(item => {
        legend.push(item.name);
        series.push({

          name: item.name,
          type: 'line',
          data: item.data,
        });
      });
      const option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legend,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: topic_trend.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: series,
      };

      drawPaperTrend(option);
    }
  }, []);
  const drawPaperTrend = option => {
    loadECharts4(echarts => {
      topicTrendEle = echarts.init(document.getElementById(topicTrendID));
      topicTrendEle.setOption(option);
    });
  };

  useEffect(() => {
    window.onresize = () => {
      topicTrendEle && topicTrendEle.resize(); // echarts重新加载更新
      cloudChart && cloudChart.resize();
    };
  });

  useEffect(() => {
    if (keywordsModel && keywordsModel.length > 0) {
      const keywordsTemp = [];
      keywordsModel.slice(0, 50).reduce((res, curr) => {
        if (curr.keywords.includes(' ') && !isBadKey.includes(curr.keywords.toLocaleLowerCase())) {
          res.push({ name: curr.keywords, value: curr.n });
        }
        return res;
      }, keywordsTemp);
      setKeywords(keywordsTemp);
    }
  }, [keywordsModel]);

  const eConsole = (param) => {
    history.push(`/conf/${confInfo.short_name}/papers`);
    // if (param.data && param.data.name) {
    //   dispatch({ type: 'aminerConf/updateFilters', payload: { keywords: param.data.name } });
    // }
  }
  const initCloud = () => {
    const wrap = document.getElementById('cloud');
    if (wrap) {
      loadEchartsWithWordcloud(echarts => {
        cloudChart = echarts.init(wrap);
        cloudChart.on('click', (param) => eConsole(param));

        const randomColor = () => {
          const n = Math.round(Math.random() * 16 + 0);
          return colorItems[n];
        };
        const cloud = {
          title: {
            text: '',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
            },
            padding: [10, 0, 0, 0],
          },
          tooltip: {
            show: false,
          },
          series: [
            {
              name: '',
              type: 'wordCloud',
              left: 'center',
              top: 'center',
              width: '100%',
              height: '100%',
              right: null,
              bottom: null,
              sizeRange: [20, 60],
              rotationRange: [0, 0],
              rotationStep: 45,
              gridSize: 8,
              drawOutOfBound: false,
              textStyle: {
                normal: {
                  color: () => randomColor(),
                  fontSize: 30,
                  fontFamily: 'Impact',
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#333',
                },
              },
              data: keywords,
            },
          ],
        };
        cloudChart.setOption(cloud);
      });
    }
  };
  useEffect(() => {
    if (keywords) {
      initCloud();
    }
  }, [keywords]);
  return (
    <div className={styles.topic_trend} id="keywords_list">
      {topic_trend ? (
        <div className="statsGraph">
          <FM id="aminer.conf.homepage.hotTopics" defaultMessage="热门选题" />
          <div id={topicTrendID} style={{ height: '230px' }}></div>
        </div>
      ) : (
          <>
            <div className="parent_legend">
              <FM id="aminer.conf.homepage.hotTopics" defaultMessage="热门选题" />
            </div>
            {/* <ConfInfo
            id={id}
            information={confIntro}
            hideSelectedYear
            hideAuthorList
            hidePublication
          /> */}
            <div id="cloud" className="cloud"></div>
          </>
        )}
    </div>
  );
};

export default page(
  connect(({ rank, aminerConf }) => ({
    confIntro: rank.confIntro,
    confInfoByRank: rank.confInfo,
    keywordsModel: aminerConf.KeywordsList,
  })),
)(KeywordsList);
const colorItems = [
  'rgb(255, 187, 120)',
  'rgb(44, 160, 44)',
  'rgb(152, 223, 138)',
  'rgb(214, 39, 40)',
  'rgb(255, 152, 150)',
  'rgb(148, 103, 189)',
  'rgb(140, 86, 75)',
  'rgb(196, 156, 148)',
  'rgb(227, 119, 194)',
  'rgb(247, 182, 210)',
  'rgb(127, 127, 127)',
  'rgb(188, 189, 34)',
  'rgb(219, 219, 141)',
  'rgb(23, 190, 207)',
  'rgb(158, 218, 229)',
  'rgb(31, 119, 180)',
  'rgb(255, 127, 14)',
];

const isBadKey = [
  'learning',
  'robustness',
  'networks',
  'adversarial',
  'via',
  'representations',
  'neural',
  'training',
  'generalization',
  'unsupervised',
  'generative',
  'deep',
  ': learning',
  'variational',
  'deep networks',
  'off-policy',
  'learned',
  'exploration',
  'understanding',
  'federated',
  'uncertainty',
  'quantization',
  'embeddings',
  'ensembles',
  'structured',
  'regularization',
  'discovery',
  'search',
  'equivariant',
  'generation',
  'convergence',
  'features',
  'learning of',
  'learn',
  'fast',
  'video',
  'based',
  'vium',
];
