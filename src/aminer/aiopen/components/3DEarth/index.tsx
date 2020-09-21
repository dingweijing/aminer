// 城市排名
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { page, connect, } from 'acore';
import { loadECharts4,loadECharts4GL,load3DEarth } from 'utils/requirejs';
import styles from './index.less'

const pic=require('../../public/earth1.jpg')

type pos=Array<number>
interface IPropTypes{
  nowPos:Array<pos>
}
const {clientWidth,clientHeight}=document.body



const options=(data=[[116,39
],[112,32]],isFocus=false)=>({
  // ...option,
  globe: {
    baseTexture: pic,
    heightTexture: pic,
    // globeRadius:700,
    shading: 'lambert',
    // right:'-20%',

    light: {
      ambient: {
        intensity: 1
    },
    main: {
        intensity: 0,
    }
    },

    viewControl: {
        autoRotate: false,
        targetCoord: data[0],
        animationEasingUpdate:'cubicInOutstring',
        animationDurationUpdate:800,
        distance:isFocus?20:150
    }
},
  series : [
    {
      type: 'scatter3D',
      coordinateSystem: 'globe',
      // symbol:'circle',
      symbol:"path://M512 0c-176.736 0-320 143.264-320 320 0 320 320 704 320 704s320-384 320-704c0-176.736-143.264-320-320-320zM512 512c-106.048 0-192-85.952-192-192s85.952-192 192-192 192 85.952 192 192-85.952 192-192 192z",
      symbolSize:20,
      itemStyle:{
        // color:'#001E59',
        color:'yellow',
        opacity:1,
        borderWidth:0,
      },
      emphasis: {
     /*    label: {
          show: true
        }, */
        itemStyle: {
          color: "rgba(1, 16, 31, 1)",
          opacity: 1
        }
      },
      data,
/*       label:{
        show:true,
        position:'bottom',
      }, */
      zlevel:10,
    }
],
  })


let myChart=null
const ThreeDEarth: React.FC<IPropTypes> = (props) => {
  const {nowPos}=props
  const eventHandlers=(chartInstance)=>{
      // console.log('chartInstance',chartInstance)
      chartInstance.off('click')
      chartInstance.on('click',p=>{
        console.log('p',p)
      })
  }

  const initEarth=()=>{
    loadECharts4GL(echarts=>{
      const canvas=document.getElementById('earth')
      const mapChart = echarts.init(canvas, null, {
        width: clientWidth*0.7, height:(clientHeight-73)*0.7
    });
    // this.dispatchAction=echarts.dispatchAction
    myChart=mapChart
    myChart.setOption(options(),{notMerge:true})
    eventHandlers(myChart)

      })
  }

  const sendAction=(pos)=>{
    if(myChart){
      myChart.setOption(options(pos,false))
      setTimeout(()=>{
      myChart.setOption(options(pos,true))
      },700)
    }
  }




  useEffect(()=>{initEarth();},[])
  useEffect(()=>{
    sendAction(nowPos)
  },[nowPos])
  return (<div className={styles.wrapper} id="earth" />)
}

export default ThreeDEarth
