import React, { Fragment, useEffect } from 'react';
import { connect, Link, history, component } from 'acore';
import { classnames } from 'utils';
import { loadECharts4 } from 'utils/requirejs';
import { FM, formatMessage } from 'locales';
import styles from './statistics.less';

/**
 * Refactor by BoGao 2019-06-10
 * AMiner Homepage
 *   2019-06-10 - to hooks
 */
let barChart;
const Statistics = props => {
  useEffect(() => {
    window.onresize = () => {
      barChart && barChart.resize(); // echarts重新加载更新
    };
  });
  useEffect(() => {
    initBarChart({
      id: 'comparePapersResult',
      data: acceptanceRate,
    });
    initBarChart({
      id: 'acceptedPapersPerAuthor',
      data: acceptedPapersPerAuthor,
    });
    initBarChart({
      id: 'mostAcceptedPapers',
      data: mostAcceptedPapers,
    });
    initBarChart({
      id: 'authorsPerPaper',
      data: authorsPerPaper,
    });
    initBarChart({
      id: 'numberOfChinesePapers',
      data: numberOfChinesePapers,
    });
    initBarChart({
      id: 'numberOfPapersWrittenByChinese',
      data: numberOfPapersWrittenByChinese,
    });
    initBarChart({
      id: 'institutionsWithMostAcceptedPapers',
      data: institutionsWithMostAcceptedPapers,
    });
  });
  const initBarChart = ({ id, data }) => {
    const barChartId = document.getElementById(id);
    const { title, legend, dataset, series, type, yclick } = data;
    if (barChartId) {
      loadECharts4(echarts => {
        barChart = echarts.init(barChartId);
        const xAxis = [
          {
            type: type === 'col' ? 'category' : 'value',
          },
        ];
        const yAxis = {
          type: type === 'col' ? 'value' : 'category',
          triggerEvent: yclick,
          // axisLabel: {
          //   color: '#f00'
          // }
        };
        if (yclick) {
          yAxis.data = series[0].data.map(item => {
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
          },
          legend: {
            show: legend,
            top: '30px',
            orient: 'horizontal',
          },
          //   tooltip: {},
          dataset: dataset,
          series: series,
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
        // console.log('option', option)
        barChart.setOption(option);
        barChart.on('click', params => {
          // console.log('params', params)
          if (params.componentType === 'yAxis') {
            const name = params.value;
            const dataitem = series[0].data.filter(item => item.name === name);
            console.log('dataitem', dataitem);
            window.open(`https://www.aminer.cn/profile/${dataitem[0].id}`);
          }
        });
      });
    } else {
      return null;
    }
  };
  return (
    <div className={styles.confStats}>
      <div>
        {/* TODO:jianjie */}
        <div>
          <FM
            id="aminer.conference.nips.papersResult"
            defaultMessage="从图中可以看出，随着NeurIPS论文投稿量的逐年上升，论文接收量也逐渐提高，但是录取率近年来却有略微下降的趋势。随着机器学习的热度高涨，NeurIPS这类机器学习的顶会的论文录用难度也在逐年增加。"
          />
        </div>
        <div className={styles.chart}>
          <div id="comparePapersResult" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        <div>
          <FM
            id="aminer.conference.nips.papersPerAuthor"
            defaultMessage="从作者维度分析，NeurIPS2019接收录用的1427篇，共来自4423位作者。其中3692位作者有1篇入选，510位作者有2篇入选，132位作者有3篇入选，48位作者有4篇入选。超过5篇入选的作者共有44位。其中，有1位作者有12篇入选，他就是加州大学伯克利分校EECS助理教授Sergey Levine；其次是INRIA的大牛Francis Bach，共有10篇。接下来是伯克利大牛Pieter Abbeel和图灵奖得主Yoshua Bengio都有9篇入选。"
          />
        </div>
        <div className={styles.chart}>
          <div id="acceptedPapersPerAuthor" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        {/* <div>
          入选论文最多的荣誉属于UC伯克利的Sergey Levine，他署名投稿的论文，共有12篇被接收。
          其次是INRIA的大牛Francis Bach，共有10篇。
        </div> */}
        <div className={styles.chart}>
          <div id="mostAcceptedPapers" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        <div>
          <FM
            id="aminer.conference.nips.authorsPerPaper"
            defaultMessage="从每篇论文作者数量来看，NeurIPS2019接收的论文大多数都有3-4个作者，其中有3个作者的共有360篇，有4个作者的共有320篇。拥有10个作者以上的论文共有15篇，其中有1篇文章拥有21个作者。"
          />
        </div>
        <div className={styles.chart}>
          <div id="authorsPerPaper" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        <div>
          <FM
            id="aminer.conference.nips.numberOfChinesePapers"
            defaultMessage="从作者所属国籍来看，华人参与的论文共有656篇，占总论文数的46%。其中华人一作论文共有471篇，占华人参与论文数的71.8%，占总论文数的33%。"
          />
        </div>
        <div className={styles.chart}>
          <div id="numberOfChinesePapers" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        <div className={styles.chart}>
          <div id="numberOfPapersWrittenByChinese" className={styles.barChart}></div>
        </div>
      </div>
      <div>
        <div className={styles.explain}>
          <FM
            id="aminer.conference.nips.institutionsWithMostAcceptedPapers"
            defaultMessage="从论文所属机构来看，Google+DeepMind组合高居榜首，入选论文共计171篇。MIT排名第二，92篇论文入选。斯坦福大学、卡内基梅隆大学排名第三，都有85篇入选。国内高校清华大学入选论文最多，排在总榜的第13位；北京大学有25篇入选，排在总榜第19位。"
          />
        </div>
        <div className={styles.chart}>
          <div id="institutionsWithMostAcceptedPapers" className={styles.barChart}></div>
        </div>
      </div>
    </div>
  );
};

export default component(connect())(Statistics);

const acceptanceRate = {
  type: 'col',
  title: 'Statistics of acceptance rate NeurlIPS',
  legend: true,
  dataset: {
    dimensions: ['product', 'Papers submitted', 'Papers accepted', 'Acceptance rate'],
    source: [
      {
        product: 'NeurlIPS 2014',
        'Papers submitted': 1678,
        'Papers accepted': 414,
        'Acceptance rate': 24.7,
      },
      {
        product: 'NeurlIPS 2015',
        'Papers submitted': 1838,
        'Papers accepted': 403,
        'Acceptance rate': 21.9,
      },
      {
        product: 'NeurlIPS 2016',
        'Papers submitted': 2403,
        'Papers accepted': 569,
        'Acceptance rate': 23.6,
      },
      {
        product: 'NeurlIPS 2017',
        'Papers submitted': 3240,
        'Papers accepted': 678,
        'Acceptance rate': 20.9,
      },
      {
        product: 'NeurlIPS 2018',
        'Papers submitted': 4856,
        'Papers accepted': 1011,
        'Acceptance rate': 20.8,
      },
      {
        product: 'NeurlIPS 2019',
        'Papers submitted': 6743,
        'Papers accepted': 1427,
        'Acceptance rate': 21.2,
      },
    ],
  },
  series: [
    {
      type: 'bar',
      barGap: 0,
      label: {
        normal: {
          show: true,
          position: 'insideTop',
          rotate: -90,
          verticalAlign: 'middle',
          align: 'left',
        },
      },
    },
    {
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'insideTop',
        },
      },
    },
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
};
const acceptedPapersPerAuthor = {
  type: 'col',
  title: 'Number of accepted papers per author',
  legend: false,
  dataset: {
    dimensions: ['product', 'Papers submitted'],
    source: [
      { product: '1', 'Papers submitted': 3692 },
      { product: '2', 'Papers submitted': 510 },
      { product: '3', 'Papers submitted': 132 },
      { product: '4', 'Papers submitted': 48 },
      { product: '5', 'Papers submitted': 24 },
      { product: '6', 'Papers submitted': 10 },
      { product: '7', 'Papers submitted': 4 },
      { product: '8', 'Papers submitted': 2 },
      { product: '9', 'Papers submitted': 2 },
      { product: '10', 'Papers submitted': 1 },
      { product: '11', 'Papers submitted': 0 },
      { product: '12', 'Papers submitted': 1 },
    ],
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
};
const mostAcceptedPapers = {
  type: 'row',
  title: 'Authors with most accepted papers',
  legend: false,
  yclick: true,
  // dataset: {
  //   // dimensions: ['name', 'value', 'id'],
  //   source: ,
  // },
  series: [
    {
      type: 'bar',
      label: {
        normal: {
          show: false,
          // position: 'top',
        },
      },
      data: [
        { name: 'Tao Qin', value: 5, id: '53f49daedabfaebfa377b5f9' },
        { name: 'Tommi Jaakkola', value: 5, id: '53f4b985dabfaed83d77b4c9' },
        { name: 'Tie-Yan Liu', value: 5, id: '53f48d0fdabfaea7cd1d1196' },
        { name: 'Vahab Mirrokni', value: 5, id: '53f43122dabfaeb22f437c22' },
        { name: 'Simon S. Du', value: 5, id: '562e261a45cedb33990beecb' },
        { name: 'Sujay Sanghavi', value: 5, id: '5448c19edabfae87b7e74568' },
        { name: 'Tengyu Ma', value: 5, id: '53f46708dabfaec09f242380' },
        { name: 'Qiang Liu', value: 5, id: '54450e6bdabfae862da02fe4' },
        { name: 'Quoc V. Le', value: 5, id: '53f42a5ddabfaec09f0e59bc' },
        { name: 'Nathan Kallus', value: 5, id: '53f42d18dabfaedce54c0e00' },
        { name: 'Josh Tenenbaum', value: 5, id: '53f66220dabfae6a71b63777' },
        { name: 'Kun Zhang', value: 5, id: '560414b545cedb33962f28bb' },
        { name: 'Joan Bruna', value: 5, id: '53f451fcdabfaee2a1d62dce' },
        { name: 'Le Song', value: 5, id: '53f43b49dabfaec09f1acd5e' },
        { name: 'Inderjit S. Dhillon', value: 5, id: '53f64247dabfaed4c20f3cc2' },
        { name: 'Georgios Piliouras', value: 5, id: '53f390a5dabfae4b34a52c78' },
        { name: 'J. Zico Kolter', value: 5, id: '53f42f3fdabfaeb22f41ff94' },
        { name: 'Dale Schuurmans', value: 5, id: '53f4694ddabfaeb1a7c989d2' },
        { name: 'Cho-Jui Hsieh', value: 5, id: '53f43899dabfaeecd69739f1' },
        { name: 'Chelsea Finn', value: 5, id: '562c7aa945cedb3398c34e8a' },
        { name: 'Alexandros G. Dimakis', value: 5, id: '548eff29dabfaef989f0970d' },
        { name: 'Bernhard Schölkopf', value: 5, id: '53f48dbbdabfaea7cd1d41ee' },
        { name: 'Aaron Sidford', value: 5, id: '53f42f32dabfaec09f12ba45' },
        { name: 'Bo Dai', value: 5, id: '542aa3b8dabfae646d57ae4a' },
        { name: 'Yee Whye Teh', value: 6, id: '53f431a8dabfaedf4354caea' },
        { name: 'Zhaoran Wang', value: 6, id: '562d559f45cedb3398dcc279' },
        { name: 'Yuanzhi Li', value: 6, id: '562d325945cedb3398d85513' },
        { name: 'Stefano Ermon', value: 6, id: '53f4c9ecdabfaee57f78001f' },
        { name: 'Quanquan Gu', value: 6, id: '53f45b85dabfaee02ad6bbfa' },
        { name: 'Ping Li', value: 6, id: '54404552dabfae7d84b7caec' },
        { name: 'Max Welling', value: 6, id: '53f43418dabfaee43ec1909f' },
        { name: 'Lawrence Carin', value: 6, id: '53f58452dabfaeaca9f8045b' },
        { name: 'Zhao Song', value: 6, id: '563200ea45cedb3399f8dddb' },
        { name: 'Ilias Diakonikolas', value: 6, id: '544844badabfae87b7df9ed3' },
        { name: 'Zhuoran Yang', value: 7, id: '5447ec04dabfae7b271fa901' },
        { name: 'Shimon Whiteson', value: 7, id: '54871925dabfae8a11fb35f0' },
        { name: 'David Woodruff', value: 7, id: '53f42adedabfaeb22f3de2f9' },
        { name: 'Andreas Krause', value: 7, id: '53f48b19dabfaea6f277b55f' },
        { name: 'Russ R. Salakhutdinov', value: 8, id: '53f45816dabfaec09f20c9b7' },
        { name: 'Dacheng Tao', value: 8, id: '53f48c1fdabfaea7cd1ce3f8' },
        { name: 'Yoshua Bengio', value: 9, id: '53f4ba75dabfaed83977b7db' },
        { name: 'Pieter Abbeel', value: 9, id: '562d558345cedb3398dcbe5d' },
        { name: 'Francis Bach', value: 10, id: '53f4a126dabfaec3ba77b434' },
        { name: 'Sergey Levine', value: 12, id: '53f42828dabfaeb22f3ce756' },
      ],
    },
  ],
};

const authorsPerPaper = {
  type: 'col',
  title: 'Number of Authors per Paper',
  legend: false,
  dataset: {
    dimensions: ['name', 'value'],
    source: [
      { name: 1, value: 39 },
      { name: 2, value: 268 },
      { name: 3, value: 360 },
      { name: 4, value: 320 },
      { name: 5, value: 231 },
      { name: 6, value: 102 },
      { name: 7, value: 61 },
      { name: 8, value: 16 },
      { name: 9, value: 15 },
      { name: 10, value: 6 },
      { name: 11, value: 4 },
      { name: 12, value: 0 },
      { name: 13, value: 0 },
      { name: 14, value: 1 },
      { name: 15, value: 1 },
      { name: 16, value: 0 },
      { name: 17, value: 1 },
      { name: 18, value: 0 },
      { name: 19, value: 0 },
      { name: 20, value: 0 },
      { name: 21, value: 1 },
    ],
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
};

const numberOfChinesePapers = {
  type: 'col',
  title: '华人论文数量',
  legend: false,
  dataset: {
    dimensions: ['name', 'value'],
    source: [
      { name: '华人参与论文数', value: 656 },
      { name: '无华人参与论文', value: 771 },
    ],
  },
  series: [
    {
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
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
    },
  ],
};

const numberOfPapersWrittenByChinese = {
  type: 'col',
  title: '华人一作论文数量',
  legend: false,
  dataset: {
    dimensions: ['name', 'value'],
    source: [
      { name: '华人一作论文数', value: 471 },
      { name: '非华人一作论文数', value: 956 },
    ],
  },
  series: [
    {
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      label: {
        normal: {
          //   formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
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
              //   color: '#eee',
              //   backgroundColor: '#334455',
              padding: [2, 4],
              borderRadius: 2,
            },
          },
        },
      },
    },
  ],
};

const institutionsWithMostAcceptedPapers = {
  type: 'row',
  title: 'Institutions with most accepted papers',
  legend: false,
  dataset: {
    dimensions: ['name', 'value'],
    source: [
      { name: 'University of Edinburgh', value: 8 },
      { name: 'University of Alberta', value: 9 },
      { name: 'Texas A&M University', value: 9 },
      { name: 'Imperial College London', value: 9 },
      { name: 'Nanyang Technological University', value: 9 },
      { name: 'University of Tübingen', value: 10 },
      { name: 'Université Paris-Saclay', value: 10 },
      { name: 'University of Chinese Academy of Sciences', value: 11 },
      { name: 'Purdue University', value: 11 },
      { name: 'Boston University', value: 11 },
      { name: 'Zhejiang University', value: 11 },
      { name: 'University of Amsterdam', value: 12 },
      { name: 'Alibaba', value: 12 },
      { name: 'Université de Montréal', value: 13 },
      { name: 'University of California', value: 13 },
      { name: 'Rutgers University', value: 13 },
      { name: 'University of Minnesota', value: 13 },
      { name: 'University of Michigan', value: 14 },
      { name: 'Northeastern University', value: 14 },
      { name: 'University College London', value: 16 },
      { name: 'University of California, Los Angeles', value: 16 },
      { name: 'University of Southern California', value: 17 },
      { name: 'Tencent', value: 18 },
      { name: 'CNRS', value: 19 },
      { name: 'University of Pennsylvania', value: 19 },
      { name: 'Harvard University', value: 22 },
      { name: 'Duke University', value: 23 },
      { name: 'University of Cambridge', value: 23 },
      { name: 'University of Illinois at Urbana-Champaign', value: 23 },
      { name: 'Amazon', value: 23 },
      { name: 'Georgia Institute of Technology', value: 24 },
      { name: 'Peking University', value: 25 },
      { name: 'ETH Zurich', value: 25 },
      { name: 'University of Texas at Austin', value: 25 },
      { name: 'University of Toronto', value: 27 },
      { name: 'New York University', value: 29 },
      { name: 'Cornell University', value: 30 },
      { name: 'University of Washington', value: 30 },
      { name: 'IBM', value: 34 },
      { name: 'Tsinghua University', value: 35 },
      { name: 'University of Oxford', value: 40 },
      { name: 'Princeton University', value: 43 },
      { name: 'facebook', value: 44 },
      { name: 'Columbia University', value: 45 },
      { name: 'University of California, Berkeley', value: 49 },
      { name: 'Microsoft', value: 76 },
      { name: 'Stanford University', value: 85 },
      { name: 'Carnegie Mellon University', value: 85 },
      { name: 'MIT', value: 92 },
      { name: 'Google', value: 171 },
    ],
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
};
