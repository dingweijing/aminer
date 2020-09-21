import React, { Component } from 'react';
// import echarts from 'echarts/lib/echarts';
import moment from 'moment'
// import 'echarts/lib/chart/bar';
import { Radio, DatePicker, Select, Form } from 'antd';
// import 'echarts/lib/chart/map';
// import './static/china'
import './static/world'
/* import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine'; */
// import COUNTRIES from 'consts/COUNTRIES'
import CityModal from './components/CityModal'
import { cityMap, linesData } from './cityData'
import styles from './cityChart.less'

const { Option } = Select
const { RangePicker } = DatePicker


const CityForm = ({ form, onFormChange }) => {
  const { getFieldDecorator, getFieldsValue } = form
  const onSubmit = () => {
    const vals = getFieldsValue()
    onFormChange(vals)
  }
  return (
    <Form className={styles.form} >
      <Form.Item >
        {getFieldDecorator('type', {
          initialValue: 'in'
        })(<Radio.Group buttonStyle="solid" onChange={onSubmit}>
          <Radio.Button value="in">迁入</Radio.Button>
          <Radio.Button value="out">迁出</Radio.Button>
        </Radio.Group>)}
      </Form.Item>
      <Form.Item >
        {getFieldDecorator('time')(<RangePicker onChange={onSubmit} />)}
      </Form.Item>
      <Form.Item >
        {getFieldDecorator('number', {
          initialValue: '10',
        })(<Select style={{ width: 120 }} onChange={onSubmit}>
          <Option value="10">10人</Option>
          <Option value="20">20人</Option>
          <Option value="30">30人</Option>
        </Select>)}
      </Form.Item>
    </Form>
  )
}


const CityFormInstance = Form.create({ onValuesChange: () => { console.log() } })(CityForm)

class CityChart extends React.PureComponent {
  constructor(props) {
    super(props)
    this.chart = null
    this.state = {
      showModal: false,
      modalData: {}
    }
  }

  addScript = () => {
    // 引入bmap
    const scriptElement = document.createElement('script')
    scriptElement.src = 'http://api.map.baidu.com/api?v=2.0&ak=ahHB9slnL044xEx2cAxtpU3AVgORUIxC'
    // scriptElement.appendChild(document.createTextNode(addScript))
    document.body.appendChild(scriptElement)
  }


  initEchart = () => {
    const ele = document.getElementById('cityMap')
    const { echarts } = window
    const _self = this
    if (!echarts) {
      setTimeout(() => {
        _self.initEchart()
      }, 300)
      return;
    }
    // loadECharts4(echarts => {
    const chart = echarts.init(ele)
    const pointArray = Object.keys(cityMap).map(key => {
      const { long, lat, in_num, out_num, id } = cityMap[key]
      return [lat, long, key, in_num, out_num, id]
    })
    chart.setOption({
      // 图表主标题
      title: {
        text: '', // 主标题文本，支持使用 \n 换行
        top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
        left: 'center', // 值: 'left', 'center', 'right' 同上
        textStyle: { // 文本样式
          fontSize: 24,
          fontWeight: 600,
          color: '#fff'
        }
      },
      // 提示框组件
      tooltip: {
        trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
        // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
        // 使用函数模板  传入的数据值 -> value: number | Array
        formatter(params) {
          const { componentSubType, data } = params
          if (componentSubType === 'lines') {
            return data ? `${data.fromName}-${data.toName}: ${data.value}` : ''
          }
          if (componentSubType === 'effectScatter') {
            const [a, b, name, in_num, out_num] = data
            return `${name}: \n 流入:${in_num} \n 流出:${out_num}`
          }
          return null
        }
      },
      // 视觉映射组件
      visualMap: {
        type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
        show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
        // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
        min: 0,
        max: 1000,
        // 文本样式
        textStyle: {
          fontSize: 14,
          color: '#fff'
        },
        realtime: true, // 拖拽时，是否实时更新
        calculable: true, // 是否显示拖拽用的手柄
        // 定义 在选中范围中 的视觉元素
        inRange: {
          color: ['yellow', 'red', 'blue', 'purple'], // 图元的颜色
          symbolSize: [8, 14, 20, 30],
        }
      },
      geo: {
        show: true, // 是否显示
        map: 'world',
        roam: true,
        label: {
          show: false,
          color: '#fff',
        },
        itemStyle: {
          areaColor: '#101431',
          borderColor: '#79D8FF',
          shadowColor: '#fff',
          shadowBlur: 2,
          curveness: 0.2
        },
      },
      backgroundColor: 'transparent',

      series: [
        {
          name: 'migration',
          type: 'lines',
          coordinateSystem: 'geo',
          geoIndex: 0,
          polyline: false,
          zlevel: 1,
          effect: {
            symbol: 'arrow',
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#000',
            symbolSize: 5
          },
          lineStyle: {

            normal: {
              width: 1,
              shadowColor: '#fff',
              shadowBlur: 5,
              curveness: 0.2
            }
          },
          data: linesData.map(obj => {
            const { fromName, toName, num } = obj
            const fromCity = cityMap[fromName]
            const toCity = cityMap[toName]
            return { fromName, toName, value: num, coords: [[fromCity.lat, fromCity.long], [toCity.lat, toCity.long]] }
          })
        },
        {
          name: '1990',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          // animation: true,
          rippleEffect: {
            brushType: 'fill',
            color: 'yellow'
          },
          symbol: 'circle',
          effectType: 'ripple',
          data: pointArray,
          //  data: geo.map(itemOpt => ({
          //    // name: itemOpt.name,
          //    value: [
          //      itemOpt.longitude,
          //      itemOpt.latitude,
          //      // itemOpt.value //数量
          //    ],
          //    label: {
          //      emphasis: {
          //        position: 'right',
          //        show: false
          //      }
          //    },
          //    itemStyle: {
          //      normal: {
          //        // color: itemOpt.color //色值
          //        color: 'red'
          //      }
          //    }
          //  })),
        }
      ]

    })
    this.chart = chart
    // });

  }

  // 位置转城市
  fetchData = arr => {

  }

  // 自定义弹窗内容

  handleEvents = () => {
    const { chart } = this
    if (chart) {
      chart.on('click', params => {
        const { componentType, componentSubType } = params
        if (componentType === 'series') {
          if (componentSubType === 'lines') {
            const { data = {} } = params
            this.setState({ showModal: true, modalData: data })
          } else if (componentSubType === 'effectScatter') {

          } else {
            this.onCloseModal()
          }
        }
      });
    }
  }

  componentDidMount() {
    // this.addScript()
    this.initEchart()
    this.handleEvents()
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  onValuesChange = val => {
    console.log('val', val)
  }

  onCloseModal = () => {
    this.setState({ showModal: false, modalData: {} })
  }

  render() {
    const { showModal, modalData } = this.state
    return (
      <div className={styles.cityChart}>
        <div className="topBar">
          <span className="title">学者迁徙图</span>
          <CityFormInstance onFormChange={this.onValuesChange} />
        </div>
        <div id="cityMap" style={{ width: '100%', height: '100%' }}></div>
        <CityModal visible={showModal} onClose={this.onCloseModal} {...modalData} />
      </div >
    )
  }
}


export default CityChart
