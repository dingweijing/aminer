/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component, withRouter } from 'acore';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { loadEchartsWithWordcloud } from 'utils/requirejs';
import styles from './Cloud.less';

const Cloud = props => {
  const { dispatch, match } = props;
  const { ai10_female_data } = props;
  const { keywords_male, keywords_female } = ai10_female_data || {};
  const { interest_desc, interest_desc_zh } = ai10_female_data || {};
  const { interest_desc1, interest_desc_zh1 } = ai10_female_data || {};
  console.log('ai10_female_data', ai10_female_data);
  useEffect(() => {
    if (!ai10_female_data) {
      dispatch({ type: 'aminerAI10/getFemaleOtherData' });
    }
  }, []);

  return (
    <section className={styles.cloud}>
      <div className="female">
        <div
          className="desc"
          dangerouslySetInnerHTML={{ __html: getLangLabel(interest_desc, interest_desc_zh) }}
        />
        <CloudChartFemale data={keywords_female} />
      </div>
      <div className="male">
        <div
          className="desc"
          dangerouslySetInnerHTML={{ __html: getLangLabel(interest_desc1, interest_desc_zh1) }}
        />
        <CloudChartMale data={keywords_male} />
      </div>
    </section>
  );
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(Cloud);

const CloudChartFemale = props => {
  const { data } = props;
  let cloudChart;
  useEffect(() => {
    window.addEventListener('resize', () => {
      cloudChart && cloudChart.resize();
    });
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    const option = {
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
              color: () => {
                return randomColor();
              },
              fontSize: 30,
              fontFamily: 'Impact',
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data,
        },
      ],
    };
    settrendChart(option);
  }, [data]);

  const settrendChart = option => {
    loadEchartsWithWordcloud(echarts => {
      cloudChart = echarts.init(document.getElementById('female_interest_chart'));
      cloudChart.setOption(option);
    });
  };

  return <div id="female_interest_chart" style={{ height: '350px' }}></div>;
};

const CloudChartMale = props => {
  const { data } = props;
  let cloudMaleChart;
  useEffect(() => {
    window.addEventListener('resize', () => {
      cloudMaleChart && cloudMaleChart.resize();
    });
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    const option = {
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
              color: () => {
                return randomColor();
              },
              fontSize: 30,
              fontFamily: 'Impact',
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data,
        },
      ],
    };
    settrendChart(option);
  }, [data]);

  const settrendChart = option => {
    loadEchartsWithWordcloud(echarts => {
      cloudMaleChart = echarts.init(document.getElementById('male_interest_chart'));
      cloudMaleChart.setOption(option);
    });
  };

  return <div id="male_interest_chart" style={{ height: '350px' }}></div>;
};

const randomColor = () => {
  const n = Math.round(Math.random() * 16 + 0);
  return colorItems[n];
};

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

// loadEchartsWithWordcloud(echarts => {
//   const cloudChart = echarts.init(wrap);

//   cloudChart.setOption(cloud);
// });
