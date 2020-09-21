import React, { useEffect, useState } from 'react';
import { component, connect } from 'acore';
import { loadECharts4 } from 'utils/requirejs';
import { FM, formatMessage } from 'locales';
import TinyPlayer from 'aminer/components/video/tinyPlayer';
import styles from './Statistics.less';

// let barChart;
const Statistics = props => {
  const [statisticsData, setStatisticsData] = useState();
  const [statisticsKey, setStatisticsKey] = useState();
  const { confInfo, SetOrGetViews, dispatch } = props;

  const initBarChart = ({ id, data, autoData }) => {
    const barChartId = document.getElementById(id);
    const { title, legend, dataset, series, type, yclick } = data;
    if (barChartId) {
      loadECharts4(echarts => {
        const barChart = echarts.init(barChartId);
        const xAxis = [
          {
            type: type === 'col' ? 'category' : 'value',
          },
        ];
        const yAxis = {
          type: type === 'col' ? 'value' : 'category',
          triggerEvent: yclick,
        };
        if (yclick) {
          yAxis.data = autoData[id].map(item => {
            const p = { value: item.name };
            if (item.id) {
              p.textStyle = {
                color: 'red',
              };
            }
            return p;
          });
        }
        const option = {
          title: {
            text: title,
            x: 'center',
            textStyle: {
              fontSize: 14,
            },
            padding: [8, 5, 0, 5],
          },
          legend: {
            show: legend,
            top: '30px',
            orient: 'horizontal',
          },
          dataset: { ...dataset, source: autoData[id] },
          series,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
        };

        if (series && series[0].type !== 'pie') {
          option['xAxis'] = xAxis;
          option['yAxis'] = yAxis;
        }
        barChart.setOption(option);
        barChart.on('click', params => {
          if (params.componentType === 'yAxis') {
            const name = params.value;
            const dataitem = series[0].data.filter(item => item.name === name);
            window.open(`https://www.aminer.cn/profile/${dataitem[0].id}`);
          }
        });
      });
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (confInfo?.id) {
      dispatch({
        type: 'aminerConf/getInterpretation',
        payload: { id: confInfo && confInfo.id, type: 'statistics', directReturnData: true },
      }).then(data => {
        setStatisticsData(data);
        setStatisticsKey(Object.keys(data));
        Object.keys(data).map(key => {
          if (!key.includes('Statistics')) {
            initBarChart({
              id: key,
              data: basicChartData[key],
              autoData: data,
            });
          }
        });
      });
    }
  }, [confInfo]);

  return (
    <div className={styles.confStats}>
      <div className={styles.videoAdv}>
        {statisticsData?.videoStatistics.map(video => {
          return (
            <TinyPlayer
              src={video.imgLink}
              video={{ url: video.videoLink }}
              SetOrGetViews={SetOrGetViews}
              confInfo={confInfo}
              type="help"
              modalStyle={{ width: '1010px', height: '556px' }}
              openMethod="modal"
            />
          );
        })}
        {/* <TinyPlayer
          src="https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020.jpg"
          video={{ url: 'https://originalstatic.aminer.cn/misc/confvideo/playlist.m3u8' }}
          SetOrGetViews={SetOrGetViews}
          confInfo={confInfo}
          type="help"
          modalStyle={{ width: '1000px', height: '556px' }}
        />
        <TinyPlayer
          src="https://originalfileserver.aminer.cn/sys/aminer/conf/iclr2020_video.jpg"
          video={{ url: 'https://originalstatic.aminer.cn/misc/confvideo/iclr/iclr.m3u8' }}
          SetOrGetViews={SetOrGetViews}
          confInfo={confInfo}
          type="advertise"
          modalStyle={{ width: '1200px', height: '675px' }}
        /> */}
      </div>
      {statisticsKey?.includes('acceptedPapersPerAuthor') && (
        <div className={styles.chartItem}>
          <div className={styles.text}>
            <FM
              id="aminer.conf.statistics.papersPerAuthor"
              values={{
                ...statisticsData?.acceptedPapersPerAuthorStatistics,
              }}
            />
          </div>
          <div className={styles.chart}>
            <div id="acceptedPapersPerAuthor" className={styles.barChart}></div>
          </div>
        </div>
      )}
      {statisticsKey?.includes('mostAcceptedPapers') && (
        <div className={styles.chartItem}>
          <div className={styles.text}>
            <FM
              id="aminer.conf.statistics.mostAcceptedPapers"
              values={{
                ...statisticsData?.mostAcceptedPapersStatistics,
              }}
            />
          </div>
          <div className={styles.chart}>
            <div id="mostAcceptedPapers" className={styles.barChart}></div>
          </div>
        </div>
      )}
      {statisticsKey?.includes('authorsPerPaper') && (
        <div className={styles.chartItem}>
          <div className={styles.text}>
            <FM
              id="aminer.conf.statistics.authorsPerPaper"
              values={{
                ...statisticsData?.authorsPerPaperStatistics,
              }}
            />
          </div>
          <div className={styles.chart}>
            <div id="authorsPerPaper" className={styles.barChart}></div>
          </div>
        </div>
      )}
      {statisticsKey?.includes('numberOfChinesePapers') && (
        <div className={styles.chartItem}>
          <div className={styles.text}>
            <FM
              id="aminer.conf.statistics.paperDistribution"
              defaultMessage=""
              values={{
                ...statisticsData?.numberOfChinesePapersStatistics,
              }}
            />
          </div>
          <div className={styles.chart}>
            <div id="numberOfChinesePapers" className={styles.barChart}></div>
          </div>
          <div className={styles.chart}>
            <div id="numberOfPapersWrittenByChinese" className={styles.barChart}></div>
          </div>
        </div>
      )}
      {statisticsKey?.includes('institutionsWithMostAcceptedPapers') && (
        <div>
          <div className={styles.explain}>
            <FM
              id="aminer.conf.statistics.institutionsWithMostAcceptedPapers"
              values={{
                ...statisticsData?.institutionsWithMostAcceptedPapersStatistics,
              }}
            />
          </div>
          <div className={styles.chart}>
            <div id="institutionsWithMostAcceptedPapers" className={styles.barChart}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default component(connect())(Statistics);

const basicChartData = {
  acceptedPapersPerAuthor: {
    type: 'col',
    title: 'Number of accepted papers per author',
    legend: false,
    dataset: {
      dimensions: ['product', 'Papers submitted'],
    },
    series: [
      {
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
      },
    ],
  },

  mostAcceptedPapers: {
    type: 'row',
    title: 'Authors with most accepted papers',
    legend: false,
    yclick: true,
    series: [
      {
        type: 'bar',
        label: {
          normal: {
            show: false,
          },
        },
      },
    ],
  },

  authorsPerPaper: {
    type: 'col',
    title: 'Number of Authors per Paper',
    legend: false,
    dataset: {
      dimensions: ['name', 'value'],
    },
    series: [
      {
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
      },
    ],
  },

  institutionsWithMostAcceptedPapers: {
    type: 'row',
    title: 'Institutions with most accepted papers',
    legend: false,
    dataset: {
      dimensions: ['name', 'value'],
    },
    series: [
      {
        type: 'bar',
        label: {
          normal: {
            show: false,
            position: 'top',
          },
        },
      },
    ],
  },

  numberOfChinesePapers: {
    type: 'col',
    title: '华人论文数量',
    legend: false,
    dataset: {
      dimensions: ['name', 'value'],
    },
    series: [
      {
        type: 'pie',
        radius: '48%',
        center: ['50%', '60%'],
        startAngle: 0,
        label: {
          normal: {
            formatter: a => {
              return ` {a|${a.name}: }\n {b|${a.value.value}} {per| ${a.percent}%} `;
            },
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center',
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
              },
              per: {
                padding: [2, 4],
                borderRadius: 2,
              },
            },
          },
        },
        labelLine: {
          length: 8,
          length2: 4,
        },
      },
    ],
  },

  // // 完成
  numberOfPapersWrittenByChinese: {
    type: 'col',
    title: '华人一作论文数量',
    legend: false,
    dataset: {
      dimensions: ['name', 'value'],
    },
    series: [
      {
        type: 'pie',
        radius: '48%',
        center: ['50%', '60%'],
        startAngle: 360,
        label: {
          normal: {
            formatter: a => {
              return ` {a|${a.name}: }\n {b|${a.value.value}} {per| ${a.percent}%} `;
            },
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center',
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
              },
              per: {
                padding: [2, 4],
                borderRadius: 2,
              },
            },
          },
        },
        labelLine: {
          length: 8,
          length2: 4,
        },
      },
    ],
  },
};
