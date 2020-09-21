/**
 *  File Created by BoGao on 2017-06-04;
 *  Moved form aminer-web, on 2017-06-04;
 *
 *  TODO 暂时不用这个模块，因此没有引入react-nvd3框架。
 */
import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { Tooltip } from 'antd';
import { formatMessage, FM } from 'locales';
import { loadD3v3, loadNvd3 } from 'utils/requirejs';
import { loadStyleSheet } from 'utils/requireCSS';
import { NE } from 'utils/compare';
import { logtime } from 'utils/log';
import { isLogin, isRoster } from 'utils/auth';
import { cloneDeep } from 'lodash';
import { Spin } from 'aminer/components/ui';
import EditInterest from './EditInterest';
import styles from './vis-research-interest.less';
import './nv.d3.less';

let d3;
let nv;
/**
 * @param disable_vis_chart - default:false
 *
 */
const VisResearchInterests = props => {
  const { dispatch, personId, user, loading } = props;
  const { researchInterest, oldResearchInterest } = props;
  const { setIsNewData, getInterestVisData } = props;
  const interestsData =
    (researchInterest && researchInterest.interests) ||
    (oldResearchInterest && oldResearchInterest.interests) ||
    {};

  const loadViz = () => {
    loadD3v3(ret => {
      d3 = ret;
      if (d3 && interestsData) {
        loadNvd3(nvd3 => {
          nv = nvd3;
          // loadStyleSheet('/lib/nv.d3.css');
          const interests = cloneDeep(
            (researchInterest && researchInterest.interests) || (oldResearchInterest && oldResearchInterest.interests),
          );
          // const colors = d3.scale.category20();

          let chart;
          nv.addGraph(() => {
            chart = nv.models
              .stackedAreaChart()
              .height(220)
              .x(d => d[0])
              .y(d => d[1])
              .showControls(false)
              .style('stream-center')
              .showXAxis(true)
              .showYAxis(false)
              .interpolate('basis')
              .showLegend(true)
              // .clipEdge(true)
              .interactive(false)
              .margin({ left: 15, right: 15, top: 0, bottom: 30 });

            // chart.legend.rightAlign(false)
            // chart.padding("40")
            // .useInteractiveGuideline(true)

            // .attr("transform", "translate(0,5)")
            // .xAxisTickFormat(function (d) { const format = d3.format('.0f'); format(d); })
            // .showTotalInTooltip(false)
            // .margin({left: '20',top: 0, bottom: '50', right: '25'})
            // .controlLabels({ stream: 'Stream' })
            // .duration(300);

            // chart.xAxis.tickFormat();
            chart.yAxis.tickFormat();

            d3.select('#chart1')
              .datum(interests)
              .transition()
              .duration(1000)

              .call(chart);
            // .each('start', function () {
            //   setTimeout(function () {
            //     d3.selectAll('#chart1 *').each(function () {
            //       if (this.__transition__)
            //         this.__transition__.duration = 1;
            //     })
            //   }, 0)
            // });

            // d3.select(".nv-legendWrap>g>g")
            //   .attr("transform", "translate(0, 5)");

            nv.utils.windowResize(chart.update);
            return chart;
          });
        });
      }
    });
  };

  useEffect(() => {
    getInterestVisData(personId);
  }, [personId]);

  useEffect(() => {
    if (
      (researchInterest && researchInterest.interests) ||
      (oldResearchInterest && oldResearchInterest.interests)
    ) {
      loadViz();
    }
  }, [researchInterest, oldResearchInterest]);

  return (
    <div className={styles.vis_research_interest}>
      <Spin loading={loading} size="small" top="70px" withText />
      {interestsData && <svg id="chart1" className={styles.stackedAreaChart} />}
      {/* {researchInterest !== null && !interestsData && !loading && (
        <div className="wait">
          <FM id="aminer.interest.wait" />
          <span className="retry" onClick={getInterestVisData}>
            <FM id="aminer.interest.retry" />
          </span>
        </div>
      )} */}
    </div>
  );
};

export default component(
  connect(({ visResearchInterest, auth, loading }) => ({
    user: auth.user,
    loading: loading.effects['visResearchInterest/GetPersonInterestsByYear'] || loading.effects['visResearchInterest/getInterestVisData'],
    oldResearchInterest: visResearchInterest.oldResearchInterest,
    researchInterest: visResearchInterest.researchInterest,
  })),
)(VisResearchInterests);
