import React, { useEffect, useState } from 'react';
import { page, connect, Link, withRouter } from 'acore';
import { loadD3v3 } from 'utils/requirejs';
import { Graph } from './Graph';
import { louvain } from './louvain';
import { classnames } from 'utils';
import { Spin } from 'aminer/components/ui';
import styles from './index.less';

let d3;
const Cooccurrence = props => {
  // hideText 隐藏x,y轴的text
  // style={width:xxx,height:xxx} 设置svg的大小
  // topn 返回合作者的人数
  const { match, dispatch, loading, personId, topn = 60 } = props;
  const { style = {}, hideText = false } = props;
  const {
    params: { id: pid },
  } = match;
  useEffect(() => {
    dispatch({ type: 'cooccurrence/getData', payload: { personId: personId || pid, topn } }).then(
      result => {
        console.log('resulte', result);
        if (!result || result.length <= 0) {
          return;
        }
        const graph = new Graph(
          result.persons.map((d, i) => i),
          result.relations.map(d => {
            return {
              a: d['f'],
              b: d['t'],
              score: d['w'] ? parseInt(d['w']) : 1,
            };
          }),
        );
        const cluster = louvain.modularity(graph);
        const temp = {};
        Object.entries(cluster.communities).map(([key, value]) => {
          value.map(v => {
            temp[v] = key;
          });
        });
        result.persons.map((item, index) => {
          item.group = temp[index];
        });

        getD3(result);
      },
    );
  }, []);
  const getD3 = miserables => {
    loadD3v3(ret => {
      d3 = ret;
      // 80
      const margin = {
        top: hideText ? 0 : 80,
        right: 0,
        bottom: 10,
        left: hideText ? 0 : 80,
      };
      const { width = 720, height = 720 } = style;
      // const width = 720;
      // const height = 720;
      const { relations } = miserables;
      const max_weight = relations && Math.max(...relations?.map(item => item.w));

      var x = d3.scale.ordinal().rangeBands([0, width]),
        z = d3.scale
          .linear()
          .domain([0, max_weight])
          .clamp(true),
        c = d3.scale.category20().domain(d3.range(20));

      var svg = d3
        .select('#co-occurrence')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .style("margin-left", -margin.left + "px")
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var matrix = [],
        nodes = miserables.persons,
        n = nodes.length;

      // Compute index per node.
      nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) {
          return { x: j, y: i, z: 0 };
        });
      });

      // Convert links to matrix; count character occurrences.
      miserables.relations.forEach(function(link) {
        matrix[link.f][link.t].z = link.w;
        matrix[link.t][link.f].z = link.w;
        matrix[link.f][link.f].z += link.w;
        matrix[link.t][link.t].z += link.w;
        nodes[link.f].count += 1;
        nodes[link.t].count += 1;
      });

      // Precompute the orders.
      var orders = {
        name: d3.range(n).sort(function(a, b) {
          return d3.ascending(nodes[a].name, nodes[b].name);
        }),
        i: d3.range(n).sort(function(a, b) {
          return d3.ascending(nodes[b].id - nodes[a].id);
        }),
        count: d3.range(n).sort(function(a, b) {
          return nodes[b].count - nodes[a].count;
        }),
        group: d3.range(n).sort(function(a, b) {
          return nodes[b].group - nodes[a].group;
        }),
      };

      console.log('orders', orders);
      // The default sort order.
      x.domain(orders.name);

      svg
        .append('rect')
        .attr('class', styles.background)
        .attr('width', width)
        .attr('height', height);

      var row = svg
        .selectAll('.row')
        .data(matrix)
        .enter()
        .append('g')
        .attr('class', 'row')
        .attr('transform', function(d, i) {
          return 'translate(0,' + x(i) + ')';
        })
        .each(row);

      row.append('line').attr('x2', width);

      if (!hideText) {
        row
          .append('text')
          .attr('x', -6)
          .attr('y', x.rangeBand() / 2)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .text(function(d, i) {
            return nodes[i].name;
          });
      }

      var column = svg
        .selectAll('.column')
        .data(matrix)
        .enter()
        .append('g')
        .attr('class', 'column')
        .attr('transform', function(d, i) {
          return 'translate(' + x(i) + ')rotate(-90)';
        });

      column.append('line').attr('x1', -width);

      if (!hideText) {
        column
          .append('text')
          .attr('x', 6)
          .attr('y', x.rangeBand() / 2)
          .attr('dy', '.32em')
          .attr('text-anchor', 'start')
          .text(function(d, i) {
            return nodes[i].name;
          });
      }

      function row(row) {
        var cell = d3
          .select(this)
          .selectAll('.cell')
          .data(
            row.filter(function(d) {
              return d.z;
            }),
          )
          .enter()
          .append('rect')
          .attr('class', classnames('cell', styles.cellHover))
          .attr('x', function(d) {
            return x(d.x);
          })
          .attr('width', x.rangeBand())
          .attr('height', x.rangeBand())
          .style('fill-opacity', function(d) {
            return z(d.z);
          })
          .style('fill', function(d) {
            return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null;
          })
          .on('mouseover', mouseover)
          .on('mouseout', mouseout);
      }

      function mouseover(p) {
        if (hideText) {
          var mouse = d3.mouse(this);
          console.log(x(p.y));
          const x_position = mouse[0] > 260 ? mouse[0] - 80 : mouse[0];
          const y_position = x(p.y) < 20 ? x(p.y) + 20 : x(p.y) - 10;
          svg
            .append('text')
            .attr('class', classnames('expertName', styles.expertNameHover))
            .attr('x', x_position)
            .attr('y', y_position)
            .attr('dy', '.32em')
            .attr('text-anchor', 'start')
            .text(function(d, i) {
              return `x: ${nodes[p.x].name}`;
            });
          svg
            .append('text')
            .attr('class', classnames('expertName', styles.expertNameHover))
            .attr('x', x_position)
            .attr('y', y_position + 10)
            .attr('dy', '.32em')
            .attr('text-anchor', 'start')
            .text(function(d, i) {
              return `y: ${nodes[p.y].name}`;
            });
        } else {
          d3.selectAll('.row text').classed(styles.active, function(d, i) {
            return i == p.y;
          });
          d3.selectAll('.column text').classed(styles.active, function(d, i) {
            return i == p.x;
          });
        }
      }

      function mouseout() {
        if (hideText) {
          d3.selectAll('text.expertName').remove();
        } else {
          d3.selectAll('text').classed(styles.active, false);
        }
      }

      d3.select('#order').on('change', function() {
        clearTimeout(timeout);
        order(this.value);
      });

      function order(value) {
        x.domain(orders[value]);

        var t = svg.transition().duration(2500);

        t.selectAll('.row')
          .delay(function(d, i) {
            return x(i) * 4;
          })
          .attr('transform', function(d, i) {
            return 'translate(0,' + x(i) + ')';
          })
          .selectAll('.cell')
          .delay(function(d) {
            return x(d.x) * 4;
          })
          .attr('x', function(d) {
            return x(d.x);
          });

        t.selectAll('.column')
          .delay(function(d, i) {
            return x(i) * 4;
          })
          .attr('transform', function(d, i) {
            return 'translate(' + x(i) + ')rotate(-90)';
          });
      }

      const timeout = setTimeout(function() {
        d3.selectAll('text.expertName').remove();
        order('group');
        {
          !hideText &&
            d3
              .select('#order')
              .property('selectedIndex', 1)
              .node()
              .focus();
        }
      }, 1000);
    });
  };
  return (
    <div className={styles.cooccurrence}>
      <Spin loading={loading} size="small" />
      {!loading && !hideText && (
        <div className={styles.legend}>
          <select id="order">
            <option value="name">by Name</option>
            <option value="group">by Cluster</option>
            <option value="count">by Frequency</option>
          </select>
        </div>
      )}
      <div id="co-occurrence" />
    </div>
  );
};

export default page(
  withRouter,
  connect(({ loading }) => ({ loading: loading.effects['cooccurrence/getData'] })),
)(Cooccurrence);
