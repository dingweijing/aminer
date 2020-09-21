import React, { useEffect, useState, useMemo } from 'react';
import { loadD3v5 } from 'utils/requirejs';
import { component, connect, } from 'acore';
import styles from './PaperStatisticsCharts.less';

let d3, viz, series, width, height, barWidth, chartHeight, chartPadding, barChartsMargin, stackChartMargin,
barXScale, barYScale, stackXScale, stackYScale, stackChartColors, axis, authorStackChartSeries, venuesStackChartSeries;

const PaperStatisticsCharts = (props) => {
  const { statistics, tabActiveKey } = props;
  const { topAuthors, topVenues, top5Authors, top5Venues, paperOfYearsData, 
    authorStackBarChartData, venueStackBarChartData } = statistics || {};

  useEffect(() => {
    if (statistics) {
      loadViz('#statisticsCharts');
    }
  }, [statistics, tabActiveKey])


  const buildBase = (element) => {
    d3.select(element).select("svg").remove();
    viz = d3.select(element).append("svg:svg").attr("width", width).attr("height", height).attr("class", "vizSvg");
  };

  const setScales = (paperOfYearsData, stackChartData, series) => {
    barXScale = d3.scaleBand()
      .domain(paperOfYearsData.map(d => d.name))
      .range([barChartsMargin.left, width - barChartsMargin.right])
      .padding(chartPadding);

    axis = d3.axisBottom(barXScale);

    barYScale = d3.scaleLinear().domain([0, d3.max(paperOfYearsData, d => d.value)]).nice().range([chartHeight - barChartsMargin.bottom, 0]);

    stackXScale = d3.scaleBand()
      .domain(stackChartData.map(d => d.name))
      .range([stackChartMargin.left, width - stackChartMargin.right])
      .padding(chartPadding);

    stackYScale = d3.scaleLinear().range([stackChartMargin.top, height - stackChartMargin.bottom]);

    stackChartColors = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(['#4285f4', '#db4437', '#f4b400', '#ab47bc', '#00acc1'])
      .unknown("#ccc");
  }

  const loadViz = (element) => {
    loadD3v5((ret) => {
      d3 = ret;
      width = 280;
      barWidth = Math.min(220 / paperOfYearsData.length, 20);
      chartHeight = 80;
      chartPadding = 0.4;
      height = 160; // chartHeight * 2;
      barChartsMargin = {top: 0, right: 16, bottom: 4, left: 16};
      stackChartMargin = {top: chartHeight + 16, right: 16, bottom: 0, left: 16};
      authorStackChartSeries = d3.stack().keys(top5Authors.map((item, index) => `${item.label}${index}`)).offset(d3.stackOffsetExpand)(authorStackBarChartData);
      venuesStackChartSeries = d3.stack().keys(top5Venues.map((item, index) => `${item.label}${index}`)).offset(d3.stackOffsetExpand)(venueStackBarChartData);
      buildBase(element);
      if (tabActiveKey === 'author') {
        setScales(paperOfYearsData, authorStackBarChartData, authorStackChartSeries);
        drawStackCharts(element, authorStackChartSeries);
      } else if (tabActiveKey === 'venue') {
        setScales(paperOfYearsData, venueStackBarChartData, venuesStackChartSeries);
        drawStackCharts(element, venuesStackChartSeries);
      }
      drawBarCharts(paperOfYearsData);
      drawAxis(paperOfYearsData);
      drawBackGroundBarCharts(paperOfYearsData);
    });
  }

  const drawAxis = (paperOfYearsData) => {
    viz.append('g')
      .attr("transform", `translate(0, ${chartHeight - barChartsMargin.bottom})`)
      .call(axis)
      .call(g => g.selectAll('.tick').selectAll('text').attr('class', (d, i) => `axis`));

    viz.selectAll('.axis')
      .data(paperOfYearsData)
      .attr('class', (d, i) => `axis axis${i}`)
      .attr('opacity', '0')
      .attr('z-index', 1);
  }

  const drawBarCharts = (paperOfYearsData) => {
    viz.append("g")
      .selectAll("g")
      .data(paperOfYearsData)
      .enter()
      .append("g")
      .append("rect")
      .attr('class', (d, i) => `bar${i}`)
      .attr("x", (d, i) => barXScale(d.name) + (barXScale.bandwidth() - barWidth) / 2)
      .attr("y", (d, i) => barYScale(d.value))
      .attr("fill", "#9e9e9e")
      .attr("width", barWidth)
      .attr("height", (d, i) => barYScale(0) - barYScale(d.value))
  }

  const drawStackCharts = (element, stackChartSeries) => {
    d3.select(element).select(".stackBarChart").remove();
    viz.append("g")
      .attr("class", "stackBarChart")
      .selectAll(".test")
      .data(stackChartSeries)
      .enter().append("g")
      .attr("fill", d => stackChartColors(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr('class', (d, i) => `stack${i}`)
      .attr("x", (d, i) => stackXScale(d.data.name) + (stackXScale.bandwidth() - barWidth) / 2)
      .attr("y", d => stackYScale(d[0]))
      .attr("width", barWidth)
      .attr("height", d => stackYScale(d[1]) - stackYScale(d[0]) || 0);
  }

  const drawBackGroundBarCharts = (paperOfYearsData) => {
    const backgroundBar = viz.append("g")
      .selectAll("g")
      .data(paperOfYearsData)
      .enter()
      .append("g")
      .append("rect")
      .attr("x", (d, i) => barXScale(d.name) + (barXScale.bandwidth() - barWidth) / 2)
      .attr("y", 0)
      .attr("width", barWidth)
      .attr("height", height)
      .attr('opacity', 0);
    backgroundBar.on("mouseover", chartOnMouseover).on("mouseout", chartOnMouseout);
  }

  const chartOnMouseover = (d, i) => {
    viz.selectAll(`.bar${i}`).attr('opacity', 0.72);
    viz.selectAll(`.stack${i}`).attr('opacity', 0.72);
    viz.select(`.axis${i}`).attr('opacity', 1);
  }

  const chartOnMouseout = (d, i) => {
    viz.selectAll(`.bar${i}`).attr('opacity', 1);
    viz.selectAll(`.stack${i}`).attr('opacity', 1);
    viz.select(`.axis${i}`).attr('opacity', 0);
  };

  return (
    <div className={styles.statisticsCharts}>
      <div id='statisticsCharts' className={styles.barChartWrap} />
    </div>
  )
}

export default PaperStatisticsCharts;
