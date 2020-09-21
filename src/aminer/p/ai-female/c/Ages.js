/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
import { loadECharts4 } from 'utils/requirejs';
import styles from './Ages.less';

const Ages = props => {
  const { dispatch } = props;
  const { ai10_female_data } = props;
  const { age_ave_pub_num, age_num } = ai10_female_data || {};
  const { age_desc, age_desc_zh } = ai10_female_data || {};
  const { age_desc1, age_desc_zh1 } = ai10_female_data || {};

  console.log('ai10_female_data', ai10_female_data);
  useEffect(() => {
    if (!ai10_female_data) {
      dispatch({ type: 'aminerAI10/getFemaleOtherData' });
    }
  }, []);

  return (
    <section className={styles.ages}>
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(age_desc1, age_desc_zh1) }}
      ></div>
      <AgesChart data={age_num} />
      <div
        className="desc"
        dangerouslySetInnerHTML={{ __html: getLangLabel(age_desc, age_desc_zh) }}
      ></div>
      <AgesAveChart data={age_ave_pub_num} />
      {/* <agesDownChart data={age_fall_pub_num} /> */}
    </section>
  );
};

export default component(
  connect(({ aminerAI10 }) => ({
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(Ages);

const AgesAveChart = props => {
  const { data } = props;
  let agesAveChart;
  useEffect(() => {
    window.addEventListener('resize', () => {
      agesAveChart && agesAveChart.resize();
    });
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    const ages = data.map(item => item.age);
    const female_nums = data.map(item => item.female_ave_pub_num);
    const male_nums = data.map(item => item.male_ave_pub_num);
    const option = {
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        // },
      },
      legend: {
        top: 42,
        data: [
          formatMessage({ id: 'aminer.person.gender.female' }),
          formatMessage({ id: 'aminer.person.gender.male' }),
        ],
      },
      grid: {
        top: 80,
        left: 100,
        right: 50,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ages,
        name: formatMessage({ id: 'aminer.person.age' }),
        axisLabel: {
          formatter: '{value}',
          // interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: formatMessage({ id: 'ai2000.female.avepaper' }),
        //   axisLabel: {
        //     formatter: '{value}人'
        // }
      },
      series: [
        {
          data: female_nums,
          name: formatMessage({ id: 'aminer.person.gender.female' }),
          type: 'line',
          label: {
            normal: {
              show: true,
              // position: 'top'
              position: [0, 10],
            },
          },
        },
        {
          data: male_nums,
          name: formatMessage({ id: 'aminer.person.gender.male' }),
          type: 'line',
          label: {
            normal: {
              show: true,
              position: [-15, -15],
              // position: 'top'
            },
          },
        },
      ],
    };
    setAgesChart(option);
  }, [data]);

  const setAgesChart = option => {
    loadECharts4(echarts => {
      agesAveChart = echarts.init(document.getElementById('ages_ave_chart'));
      agesAveChart.setOption(option);
    });
  };

  return <div id="ages_ave_chart" style={{ height: '500px' }}></div>;
};
const AgesChart = props => {
  const { data } = props;
  let agesChart;
  useEffect(() => {
    window.addEventListener('resize', () => {
      agesChart && agesChart.resize();
    });
  });
  useEffect(() => {
    if (!data) {
      return;
    }
    const ages = data.map(item => item.age);
    const percentage = data.map(item => (item.percentage * 100).toFixed(2));
    // const female_nums = data.map(item => item.female_ave_pub_num);
    // const male_nums = data.map(item => item.male_ave_pub_num);
    const option = {
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        // },
      },
      // legend: {
      //   top: 42,
      //   data: [
      //     formatMessage({ id: 'aminer.person.gender.female' }),
      //     formatMessage({ id: 'aminer.person.gender.male' }),
      //   ],
      // },
      grid: {
        top: 80,
        left: 100,
        right: 50,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ages,
        name: formatMessage({ id: 'aminer.person.age' }),
        axisLabel: {
          formatter: '{value}',
          // interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: formatMessage({ id: 'ai2000.female.percentage' }),
        axisLabel: {
          formatter: value => `${value.toFixed(1)}%`,
          // lineStyle: { color: '#333' },
        },
        //   axisLabel: {
        //     formatter: '{value}人'
        // }
      },
      series: [
        {
          data: percentage,
          // name: formatMessage({ id: 'aminer.person.gender.female' }),
          type: 'line',
          label: {
            normal: {
              show: true,
              // position: 'top'
              // position: [0, 10],
              formatter: '{c}%',
            },
          },
        },
      ],
    };
    setAgesChart(option);
  }, [data]);

  const setAgesChart = option => {
    loadECharts4(echarts => {
      agesChart = echarts.init(document.getElementById('ages_chart'));
      agesChart.setOption(option);
    });
  };

  return <div id="ages_chart" style={{ height: '500px' }}></div>;
};

// const AgesDownChart = props => {
//   const { data } = props;
//   let agesDownChart;
//   useEffect(() => {
//     window.addEventListener('resize', () => {
//       agesDownChart && agesDownChart.resize();
//     });
//   });
//   useEffect(() => {
//     if (!data) {
//       return;
//     }
//     const ages = data.map(item => item.age);
//     const female_nums = data.map(item => item.female_pub_num);
//     const male_nums = data.map(item => item.male_pub_num);
//     const option = {
//       tooltip: {
//         trigger: 'axis',
//         // axisPointer: {
//         //   type: 'shadow',
//         // },
//       },
//       legend: {
//         top: 42,
//         data: [
//           formatMessage({ id: 'aminer.person.gender.female' }),
//           formatMessage({ id: 'aminer.person.gender.male' }),
//         ],
//       },
//       grid: {
//         top: 80,
//         left: 40,
//         right: 50,
//       },
//       xAxis: {
//         type: 'category',
//         boundaryGap: false,
//         data: ages,
//         name: formatMessage({ id: 'aminer.person.age' }),
//         axisLabel: {
//           formatter: '{value}',
//           // interval: 0,
//           rotate: 45,
//         },
//       },
//       yAxis: {
//         type: 'value',
//         name: formatMessage({ id: 'ai2000.female.persontime' }),
//         //   axisLabel: {
//         //     formatter: '{value}人'
//         // }
//       },
//       series: [
//         {
//           data: female_nums,
//           name: formatMessage({ id: 'aminer.person.gender.female' }),
//           type: 'line',
//           label: {
//             normal: {
//               show: true,
//               // position: 'top'
//             },
//           },
//         },
//         {
//           data: male_nums,
//           name: formatMessage({ id: 'aminer.person.gender.male' }),
//           type: 'line',
//           label: {
//             normal: {
//               show: true,
//               position: [10, -10],
//               // position: 'top'
//             },
//           },
//         },
//       ],
//     };
//     setAgesChart(option);
//   }, [data]);

//   const setAgesChart = option => {
//     loadECharts4(echarts => {
//       agesDownChart = echarts.init(document.getElementById('ages_down_chart'));
//       agesDownChart.setOption(option);
//     });
//   };

//   return <div id="ages_down_chart" style={{ height: '500px' }}></div>;
// };
