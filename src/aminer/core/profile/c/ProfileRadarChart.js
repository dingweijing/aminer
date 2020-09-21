import React, { useEffect } from 'react';
import { loadD3v3 } from 'utils/requirejs';
import { connect, component } from 'acore';
import { Spin } from 'aminer/components/ui';
import styles from './ProfileRadarChart.less';

let d3;
let category, data, flag, h, maxVal, minVal, radius, radiusLength, ruleColor, series, vizBody,
  vizPadding, w;
const defaultCategory = ["#Papers", "#Citation", "H-Index", "G-Index", "Sociability", "Diversity", "Activity"];

const ProfileRadarChart = (props) => {
  const { radarData, loading, personId, dispatch } = props;

  useEffect(() => {
    getProfileRadarChart();
  }, [personId]);

  useEffect(() => {
    if (radarData && radarData.axis) {
      loadViz("#chart", radarData);
    }
  }, [radarData]);

  const getProfileRadarChart = () => {
    dispatch({ type: 'aminerPerson/getProfileRadarChart', payload: { personId } })
  }

  const loadData = (axis, item) => {
    category = axis || defaultCategory;
    series = item || [Array(category.length).fill(0)];
    minVal = 0;
    maxVal = 1;
  };

  const buildBase = (element) => {
    d3.select(element).select("svg").remove();
    const viz = d3.select(element).append("svg:svg").attr("width", w).attr("height", h).attr("class", "vizSvg");
    viz.append("svg:rect").attr("id", "axis-separator").attr("x", 0).attr("y", 0).attr("width", 0).attr("height", 0);
    vizBody = viz.append("svg:g");
  };

  const setScales = () => {
    let centerXPos, centerYPos, circleConstraint, heightCircleConstraint, widthCircleConstraint;
    heightCircleConstraint = 0;
    widthCircleConstraint = 0;
    circleConstraint = 0;
    centerXPos = 0;
    centerYPos = 0;
    heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
    widthCircleConstraint = w - vizPadding.left - vizPadding.right;
    circleConstraint = d3.min([heightCircleConstraint, widthCircleConstraint]);
    radius = d3.scale.sqrt().domain([minVal, maxVal]).range([0, circleConstraint / 2]);
    radiusLength = radius(maxVal);
    centerXPos = widthCircleConstraint / 2 + vizPadding.left;
    centerYPos = heightCircleConstraint / 2 + vizPadding.top;
    vizBody.attr("transform", "translate(" + centerXPos + ", " + centerYPos + ")");
  };

  const addAxes = () => {
    let circleAxes, lineAxes, radialTicks;
    radialTicks = radius.ticks(5);
    circleAxes = 0;
    lineAxes = 0;
    vizBody.selectAll(".circle-ticks").remove();
    vizBody.selectAll(".line-ticks").remove();
    circleAxes = vizBody.selectAll(".circle-ticks").data(radialTicks).enter().append("svg:g").attr("class", "circle-ticks").append("svg:circle").attr("r", function (d, i) {
      return radius(d);
    }).attr("class", "circle").style("stroke", ruleColor).style("fill", "rgba(200, 200, 0, 0.1)");
    circleAxes.append("svg:text").attr("text-anchor", "middle").attr("dy", function (d) {
      return -1 * radius(d);
    }).text(String);
    lineAxes = vizBody.selectAll(".line-ticks").data(category).enter().append("svg:g").attr("transform", function (d, i) {
      return "rotate(" + ((i / category.length * 360) - 90) + ")translate(" + radius(maxVal) + ")";
    }).attr("class", "line-ticks").attr("popover", "detail").attr("popover-trigger", "mouseenter");
    lineAxes.append("svg:line").attr("x2", -1 * radius(maxVal)).style("stroke", ruleColor).style("fill", "none");
    lineAxes.append("svg:text").text(String).style("text-color", "grey").attr("class", "radar-label").attr("text-anchor", function (d, i) {
      if ((i / category.length * 360) < 180) {
        return "end";
      } else {
        return "start";
      }
    }).attr("transform", function (d, i) {
      if ((i / category.length * 360) < 180) {
        return null;
      } else {
        return "rotate(180)";
      }
    });
  };

  const draw = () => {
    let groups, lines;
    groups = 0;
    lines = 0;
    groups = vizBody.selectAll(".radar_series").data(series);
    groups.enter().append("svg:g").attr("class", "radar_series").style("fill", function (d, i) {
      return "grey";
    }).style("stroke", function (d, i) {
      return "grey";
    });
    groups.exit().remove();
    lines = groups.append("svg:path").attr("class", "line").attr("d", d3.svg.line.radial().radius(function (d) {
      return 0;
    }).angle(function (d, i) {
      if (i === category.length) {
        i = 0;
      }
      return (i / category.length) * 2 * Math.PI;
    })).style("stroke-width", 1).style("fill", "rgba(10, 150, 20, 0.5)");
    groups.selectAll(".curr-point").data(function (d) {
      return [d[0]];
    }).enter().append("svg:circle").attr("class", "curr-point").attr("r", 0);
    groups.selectAll(".clicked-point").data(function (d) {
      return [d[0]];
    }).enter().append("svg:circle").attr("r", 0).attr("class", "clicked-point");
    lines.attr("d", d3.svg.line.radial().radius(function (d) {
      return radius(d);
    }).angle(function (d, i) {
      if (i === category.length) {
        i = 0;
      }
      return (i / category.length) * 2 * Math.PI;
    }));
  };

  const loadViz = (element, _data) => {
    loadD3v3((ret) => {
      d3 = ret;
      series = 0;
      category = 0;
      minVal = 0;
      maxVal = 0;
      w = 180 * 0.99;
      h = 180 * 0.99;
      vizPadding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      radius = 0;
      radiusLength = 0;
      ruleColor = "#CCC";
      vizBody = 0;
      loadData(_data.axis, _data.normalize);
      buildBase(element);
      setScales();
      addAxes();
      draw();
    });
  };

  return (
    <div id="popover_radar" className={styles.profileRadar}>
      <div id="chart" className="radarChart">
        <Spin loading={loading} size="small" top="70px" withText />
        {/* <i className='fa fa-refresh' onClick={getProfileRadarChart} /> */}
      </div>
      <div className='content'>
        {radarData && radarData.axis && radarData.axis.map((item, index) => {
          return (
            <p key={item}>
              <span className='label'>{`${item}: `}</span>
              <span className='num'>{Math.round(radarData.statics[0][index])}</span>
            </p>
          )
        })}
      </div>
    </div>
  );
}
export default component(
  connect(({ aminerPerson, loading }) => ({
    radarData: aminerPerson.ProfileRadarChart,
    loading: loading.effects['aminerPerson/getProfileRadarChart'],
  })),
)(ProfileRadarChart)
