import React, { useEffect, useMemo, useState, useRef } from 'react';
import { page } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
import { loadECharts4 } from 'utils/requirejs';
// import { RightZone } from 'layouts/aminer/headers';
import { getLangLabel } from 'helper/';
import styles from './index.less';



const BarChart: React.FC<{}> = (props) => {
  const ref = useRef()
  const {data, info}=props

  const initChart = (myData) => {
    // if (!myData || !myData.length) return;
    const wrap = document.getElementById('barChart');
    return loadECharts4(echarts => {
      const chart = echarts.init(wrap);
      const option = {
        dataset: {
            source: [
                ['value', 'domain'],
                ...myData
            ]
        },
        grid: {containLabel: true},
        xAxis: {name: getLangLabel('H5-Index', 'H5指数'), nameTextStyle:{
          fontWeight:'bold',
          fontSize:16
        }},
        yAxis: {name: (getLangLabel('Domain', '领域').split('/'))[0], type: 'category', nameTextStyle:{
          fontWeight:'bold',
          fontSize:16
        }},
        visualMap: {
           show:false,
            orient: 'horizontal',
            left: 'center',
            min: 20,
            max: 50,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            }
        },
        tooltip:{
          show:true,
          trigger:'item',
          formatter:p=>{
            const {data}=p
            const [val, name]=data
            return `${name}: ${val}`
          }

        },
        series: [
            {
                type: 'bar',
                barWidth:'20px',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'H5-index',
                    // Map the "product" column to Y axis
                    y: 'product'
                }, itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'right',
                      textStyle: { 
                        color: 'black',
                        fontSize: 12
                      }
                    }
                  }
                },
    
            }
        ]
    };
      chart.setOption(option);
    })
  }

  useEffect(()=>{
    initChart(data)
  })


  return (
    <div ref={ref} className={styles.wrapper} style={{ width: '100%', height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
      <div id="barChart" style={{width:'1000px', height:'500px'}}></div>
      {info&&<p>{info}</p>}
    </div>
  )
  

}

export default BarChart
