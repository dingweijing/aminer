/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component, withRouter } from 'acore';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { loadECharts4 } from 'utils/requirejs';
import styles from './Trend.less';

const Trend = props => {
  const { dispatch, match } = props;
  const { ai10_female_data } = props;
  const { pub_num_trend, year_female_first_author_percentage } = ai10_female_data || {};
  const { trend_desc, trend_desc_zh } = ai10_female_data || {};
  console.log('ai10_female_data', ai10_female_data);
  useEffect(() => {
    if (!ai10_female_data) {
      dispatch({ type: 'aminerAI10/getFemaleOtherData' });
    }
  }, []);

  return (
    <section className={styles.trend}>
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(trend_desc, trend_desc_zh) }}
      />
      <div className="trend_chart">
        <TrendChart data={pub_num_trend} />
      </div>
      <div className="pre_chart">
        <PreChart data={year_female_first_author_percentage} />
      </div>
    </section>
  );
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(Trend);

const TrendChart = props => {
  const { data } = props;
  let trendChart;
  useEffect(() => {
    if (!data) {
      return;
    }
    const years = data.map(item => item.year);
    const totals = data.map(item => (item.total * 100).toFixed(1));
    const option = {
      title: {
        text: formatMessage({ id: 'ai2000.female.trend.pretitle' }),
        textStyle: {
          fontSize: 16,
        },
        padding: [10, 0, 0, 40],
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        // },
      },
      grid: {
        top: 80,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
        name: formatMessage({ id: 'aminer.paper.year' }),
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        name: formatMessage({ id: 'ai2000.female.trend.paperpre' }),
        axisLabel: {
          formatter: value => `${value.toFixed(1)}%`,
          // lineStyle: { color: '#333' },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          data: totals,
          type: 'line',
          label: {
            normal: {
              show: true,
              formatter: '{c}%',
              position: [5, -15],
            },
          },
        },
      ],
    };
    settrendChart(option);
  }, [data]);

  const settrendChart = option => {
    loadECharts4(echarts => {
      trendChart = echarts.init(document.getElementById('trend_chart'));
      trendChart.setOption(option);
    });
  };

  return <div id="trend_chart" style={{ height: '350px' }}></div>;
};

const PreChart = props => {
  const { data } = props;
  let trendChart;
  useEffect(() => {
    if (!data) {
      return;
    }
    const years = data.map(item => item.year);
    const totals = data.map(item => (item.precentage * 100).toFixed(2));
    const max = Math.ceil(Math.max(...totals) * 2);
    const option = {
      title: {
        text: formatMessage({ id: 'ai2000.female.trend.pretitle.first' }),
        textStyle: {
          fontSize: 16,
        },
        padding: [10, 0, 0, 40],
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        // },
      },
      grid: {
        top: 80,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
        name: formatMessage({ id: 'aminer.paper.year' }),
        axisLabel: {
          // lineStyle: { color: '#333' },
        },
        axisLine: {
          // lineStyle: { color: '#ccc' },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        name: formatMessage({ id: 'ai2000.female.trend.paperpre.first' }),
        axisLabel: {
          formatter: value => `${value.toFixed(1)}%`,
          // lineStyle: { color: '#333' },
        },
        axisLine: {
          // lineStyle: { color: '#ccc' },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
        max,
        // splitNumber: 2
      },
      series: [
        {
          data: totals,
          type: 'line',
          label: {
            normal: {
              show: true,
              formatter: '{c}%',
              position: [5, -15],
            },
          },
          markLine: {
            silent: true,
            data: [{ type: 'average', name: '平均值' }],
            symbol: 'none',
            lineStyle: {
              color: '#666',
            },
            label: {
              normal: {
                formatter: '{c} %',
              },
            },
          },
        },
      ],
    };
    setPreChart(option);
  }, [data]);

  const setPreChart = option => {
    loadECharts4(echarts => {
      trendChart = echarts.init(document.getElementById('pre_chart'));
      trendChart.setOption(option);
    });
  };

  return <div id="pre_chart" style={{ height: '350px' }}></div>;
};
