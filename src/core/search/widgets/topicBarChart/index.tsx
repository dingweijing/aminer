/**
 * Created by yangyanmei on 17/8/31.
 * Author: Elivoa, 2019-08-08, 2020-08-16
 * refactor by Bo Gao, 2019-08-08 Rewrite.
 */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { isBrowser } from 'acore';
import { loadECharts4 } from 'utils/requirejs';

export interface TopicBarChartProps {
  className?: string;
  kid?: any;
}

const TopicBarChart: React.FC<TopicBarChartProps> = (props) => {
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);


  if (!showChild && !isBrowser()) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <Child {...props} />;
}

function Child(props) {

  const { kid, topic } = props;

  let myChart;

  const initBarChar = () => {
    loadECharts4(echarts => {
      // init echarts.
      myChart = echarts.init(document.getElementById(`topic_${kid}`));
      window.addEventListener('resize', () => {
        myChart.resize();
      });

      // init.
      if (topic.label) {
        const xAxis = [] as any;
        const yAxis = [] as any;
        if (topic.freq) {
          for (let i = 0; i < topic.freq.length; i += 1) {
            xAxis.push(topic.freq[i].y);
            if (i === topic.freq.length - 1 && topic.freq.length > 3) {
              const newW = (topic.freq[i].w + topic.freq[i - 1].w + topic.freq[i - 2].w) / 3;
              yAxis.push(newW);
            } else {
              yAxis.push(topic.freq[i].w);
            }
          }
        }
        // for (const f of topic.freq) {
        //   xAxis.push(f.y);
        //   yAxis.push(f.w);
        // }
        const option = {
          color: ['#7ebc3c'],
          tooltip: { axisPointer: { type: 'shadow' } },
          grid: {
            x: 10,
            y: 10,
            x2: 10,
            y2: 30,
            left: '10px',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [{ type: 'category', data: xAxis, splitLine: { show: false } }],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              show: true,
              splitNumber: 8,
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ['rgba(250,250,250,0.05)', 'rgba(250,250,250,1)'],
                },
              },
            },
          ],
          series: [{ name: topic.label, type: 'bar', data: yAxis }],
        };
        myChart.setOption(option);
      }
    });
  };

  useLayoutEffect(() => {
    // This is where your layout effect logic can be
    initBarChar()
  });

  return (
    <div>
      <div id={`topic_${kid}`} style={{ height: '80px' }} />
    </div>
  );
}

export default TopicBarChart
