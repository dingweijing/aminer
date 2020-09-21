import React, { useEffect, useState } from 'react';
import { component, connect } from 'acore';
import { Row, Col, Icon, Tabs, Spin, Form, Select, Button, message } from 'antd';
import { BasicTable } from 'amg/ui/table';
import { FM, formatMessage } from 'locales';
import { loadECharts4, loadEchartsWithWordcloud } from 'utils/requirejs';
import { ConfPaperList, ConfYearPaper } from './index';
import styles from './ConfInfo.less';

const yearItems = [];
const getYearList = () => {
  const nowYear = new Date().getFullYear();
  const initYear = 1900;
  for (let i = initYear; i < nowYear + 1; i++) {
    yearItems.unshift(i);
  }
};
getYearList();
let cloudChart;
const ConfInfo = props => {
  const [tabKey, setTabkey] = useState('clit');
  const [year_begin, setBegin] = useState(2015);
  const [year_end, setEnd] = useState(new Date().getFullYear());

  const { information, dispatch, id } = props;
  const loading = !!props.loading;
  const {
    yearlyInfo,
    female,
    male,
    country_prop,
    top_cited_papers,
    conference_name,
    language_prop,
    top_cited_authors,
    top_cited_affiliations,
    maleAuthors,
    keywords,
    femaleAuthors,
    country_authors,
    language_authors,
  } = information || {};

  const { hideSelectedYear = false, hideAuthorList = false, hidePublication = false } = props;

  useEffect(() => {
    keywords && initCloud();
  }, [keywords]);

  useEffect(() => {
    window.onresize = () => {
      cloudChart && cloudChart.resize(); // echarts重新加载更新
    };
  });

  useEffect(() => {
    initChart('Gender', 'gender', [
      { value: female, name: 'female' },
      { value: male, name: 'male' },
    ]);
  }, [male, female]);

  useEffect(() => {
    initChart('Nation/Area', 'nationality', structObjToArr(country_prop));
  }, [country_prop]);

  useEffect(() => {
    initChart('Language', 'language', structObjToArr(language_prop));
  }, [language_prop]);

  const initCloud = () => {
    const wrap = document.getElementById('cloud');
    if (wrap) {
      loadEchartsWithWordcloud(echarts => {
        cloudChart = echarts.init(wrap);
        const randomColor = () => {
          const n = Math.round(Math.random() * 16 + 0);
          return colorItems[n];
        };
        const cloud = {
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
                  color: () => randomColor(),
                  fontSize: 30,
                  fontFamily: 'Impact',
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#333',
                },
              },
              data: keywords,
            },
          ],
        };
        cloudChart.setOption(cloud);
      });
    }
  };

  const structObjToArr = items => {
    const arr = [];
    for (const k in items) {
      arr.push({
        name: k,
        value: items[k],
      });
    }
    return arr;
  };

  const readData = (id, type) => {
    let tipItems = [];
    switch (id) {
      case 'gender':
        tipItems = type === 'male' ? maleAuthors : femaleAuthors;
        break;
      case 'nationality':
        tipItems = country_authors[type];
        break;
      case 'language':
        tipItems = language_authors[type];
        break;
      default:
    }
    return tipItems && tipItems.slice(0, 5);
  };

  const initChart = (title, id, data) => {
    if (!data || (data && !data.length)) {
      return;
    }
    const wrap = document.getElementById(id);
    loadECharts4(echarts => {
      const chart = echarts.init(wrap);
      const option = {
        title: {
          text: title,
          subtext: '',
          x: 'center',
        },
        color: [
          '#97CCF6',
          '#EE865C',
          '#6F93E6',
          '#67CA4D',
          '#ffdb5c',
          '#9fe6b8',
          '#e7bcf3',
          '#1d9dff',
          '#fb7293',
          '#8378ea',
          '#1890ff',
          '#F75000',
          '#CA8EFF',
          '#FF359A',
          '#2894FF',
          '#A8FF24',
          '#FFD306',
        ],
        tooltip: {
          trigger: 'item',
          formatter: (a, b) => {
            const { name, percent, data } = a || {};
            const tipData = readData(id, data && data.name);
            let str = `<b style="font-size: 16px">${name}:  ${percent}%</b>` + '<table>';
            str += '<tr><td>Author_Name</td>';
            str += '<td>Paper_num</td>';
            str += '<td>Citations</td></tr>' + '</thead>' + '<tbody>';
            for (let i = 0; i < tipData.length; i++) {
              const { paper_num, name, citations } = tipData[i];
              str +=
                `${'<tr>' +
                '<td>'}${
                name
                }</td>` +
                `<td>${
                paper_num
                }</td>` +
                `<td>${
                citations
                }</td>` +
                '</tr>';
            }
            str += '</table>';
            return str;
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            magicType: {
              show: false,
              type: ['pie', 'funnel'],
            },
            restore: { show: false },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      chart.setOption(option);
    });
  };

  const tabConfig = {
    clit: {
      key: 'clit',
      tab: 'Top Clited',
      content: () => (
        <>
          <div className={styles.clittitle}>
            <div className={styles.bgimg}></div>
            <span className={styles.titleby}>Browse by Citation</span>
          </div>
          <ConfPaperList
            className=""
            id="aminerPaperList"
            papers={top_cited_papers}
            conference_name={conference_name}
            contentLeftZone={[]}
            contentRightZone={[]}
          />
        </>
      ),
    },
    authors: {
      key: 'authors',
      tab: 'Authors',
      content: () => <BasicTable rowKey="id" data={top_cited_authors || []} columns={authorscolumns} />,
    },
    affiliations: {
      key: 'affiliations',
      tab: 'Affiliations',
      content: () => (
        <BasicTable rowKey="name" data={top_cited_affiliations || []} columns={authorscolumns} />
      ),
    },
  };

  const onChangeTab = k => {
    setTabkey(k);
  };

  const onQuery = () => {
    if (year_begin > year_end) {
      message.error(formatMessage({ id: 'aminer.conference.yearerr' }));
      return;
    }
    dispatch({
      type: 'rank/getConfRankDetail',
      payload: {
        id,
        year_begin,
        year_end,
      },
    });
  };

  return (
    <div className={styles.confInfo}>
      {!hideSelectedYear && (
        <Form layout="inline" className={styles.form}>
          <Form.Item>
            <Select
              onChange={e => {
                setBegin(e);
              }}
              value={year_begin}
              className={styles.select}
            >
              {yearItems &&
                yearItems.map(year => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              onChange={e => {
                setEnd(e);
              }}
              value={year_end}
              className={styles.select}
            >
              {yearItems &&
                yearItems.map(year => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={onQuery}>
              Search
            </Button>
          </Form.Item>
        </Form>
      )}
      {/* TODO: hole */}
      <Spin spinning={loading}>
        <div id="cloud" className={styles.colud}></div>
      </Spin>
      {/* TODO: hole */}
      <h2>
        <FM id="aminer.conf.rank.authorRank" defaultMessage="Author Distribution" />
      </h2>
      <Spin spinning={loading}>
        <div className={styles.threeCharts}>
          <div id="gender" className={styles.chartg} />
          <div id="nationality" className={styles.chartn} />
          <div id="language" className={styles.chartl} />
        </div>
      </Spin>
      {!hideAuthorList && (
        <>
          <h2>
            Top Authors (
            <span className={styles.titlenote}> author's name : number of papers / citations </span>
            )
          </h2>
          <Spin spinning={loading}>
            <ConfYearPaper items={yearlyInfo} />
          </Spin>
        </>
      )}
      {!hidePublication && (
        <>
          <br />
          <h2>Publications</h2>
          <Tabs size="small" activeKey={tabKey} onChange={onChangeTab}>
            {Object.values(tabConfig).map(n => <Tabs.TabPane key={n.key} tab={n.tab} />)}
          </Tabs>
          {tabConfig[tabKey].content()}
        </>
      )}
    </div>
  );
};

export default component(
  connect(({ loading }) => ({
    loading: loading.effects['rank/getConfRankItem'] || loading.effects['rank/getConfRankInfo'],
  })),
)(ConfInfo);

const authorscolumns = [
  {
    Header: 'Name',
    accessor: 'name',
    disableSorting: false,
  },
  {
    Header: 'Paper',
    accessor: 'paper_num',
    disableSorting: false,
    width: 80,
    align: 'center',
  },
  {
    Header: 'Citations',
    accessor: 'citations',
    disableSorting: false,
    width: 100,
  },
];

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
