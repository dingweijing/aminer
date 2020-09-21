import React, { Component, useMemo, useEffect, useRef } from 'react'
// import echarts from 'echarts';
import { loadECharts4 } from 'utils/requirejs';
// import ReactEcharts from 'echarts-for-react';
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper/';


/**
 * @description 配置图表
 * @returns
 * @memberof EchartsRadar
 */


const Radar = ({ onEvents = () => { }, isMobile = false, data = [0, 0, 0, 0, 0, 0] }) => {
  const ref = useRef()
  // const opts = useMemo(() => option(data), [data])

  const initChart = (myData) => {
    if (!myData || !myData.length) return;
    const wrap = document.getElementById('radarchart');
    return loadECharts4(echarts => {
      const chart = echarts.init(wrap);
      const option = {
        /*   title: {
            text: formatMessage({
              id: 'aminer.rank.radar',
              defaultMessage: 'Radar Map'
            }),
          }, */
        // 点击提示标签
        // tooltip: {},
        legend: {
          // 图例文字展示
          show: false
        },
        radar: {
          // 雷达图绘制类型，支持 'polygon' 和 'circle' [ default: 'polygon' ]
          shape: 'polygon',
          splitNumber: 3,
          center: ['50%', '50%'],
          radius: '65%',

          // 指示器名称和指示器轴的距离。[ default: 15 ]
          nameGap: 5,
          triggerEvent: true,

          name: {
            show: true,
          },
          textStyle: {
            backgroundColor: 'transparent'
            // borderRadius: 3,
            // padding: [3, 5]
          },
          // 设置雷达图中间射线的颜色
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
          indicator: [
            { name: getLangLabel('Basic Research Creativity Index', '基础研究创新指数'), max: 180, color: '#0e2a5d' },
            {
              name: getLangLabel('Rising Index', '上升指数'), max: 120, color: '#0e2a5d'
            },
            {
              name: getLangLabel('TK5 Index', 'TK5指数'), max: 180, color: '#0e2a5d'
            },
            { name: getLangLabel('Applied Research Creativity Index', '应用研究创新指数'), max: 180, color: '#0e2a5d' },
            { name: getLangLabel('H5 Index', 'H5指数'), max: 380, color: '#0e2a5d' },
            { name: getLangLabel('H5 Median', 'H5中位数'), max: 620, color: '#0e2a5d' },
          ],
          // 雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
          splitArea: {
            show: false,
            areaStyle: {
              color: 'rgba(255,0,0,0)', // 图表背景的颜色
            },
          }
        },
        series: [{
          name: '投诉统计',
          type: 'radar',
          // 显示雷达图选中背景
          areaStyle: { normal: {} },
          data: [
            {
              value: myData,
              // 设置区域边框和区域的颜色
              itemStyle: {
                normal: {
                  // 雷达图背景渐变设置
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0.5,
                    color: 'rgba(48,107, 231, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(73,168, 255, 0.7)'
                  }]),
                  // 去除刻度
                  opacity: 0,
                  // 雷达图边线样式
                  lineStyle: {
                    width: 0,
                    color: '#306BE7',
                  },
                },
              },
              name: '今日更新投诉量',
              id: 'jintian'
            },
          ]
        }]
      }
      chart.setOption(option);
    })
  }

  useEffect(() => {
    initChart(data)
  }, [data])

  return (
    /*  <ReactEcharts
       option={opts}
       notMerge
       lazyUpdate
       onEvents={onEvents}
       style={{ width: '500px', height: '500px' }}
     /> */

    <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
      <div id="radarchart" style={isMobile ? { width: '300px', height: '250px' } : { width: '500px', height: '500px' }}></div>
    </div>
  )
}

export default Radar
