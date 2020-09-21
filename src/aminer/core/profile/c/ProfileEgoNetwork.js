import React from "react";
import { connect } from "acore";
import { loadD3v3 } from 'utils/requirejs';
import { cloneDeep } from 'lodash';
import { formatMessage } from 'locales';
import { NE } from 'utils/compare';
import { isLogin } from 'utils/auth';
import smallcard from 'helper/smallcard';
import { SmallCard } from 'aminer/core/search/c/widgets';
import { Spin } from 'aminer/components/ui';
import { ChangeRelation } from '../widgets';

let d3;
let color;
let diagonal;
let div;
let flag;
let height;
let radii;
// let reloadView;
let render;
let width;
let element;


@connect(({ aminerPerson, auth, loading }) => ({
  user: auth.user,
  profileEgoNet: aminerPerson.profileEgoNet,
  loading: loading.effects['aminerPerson/getProfileEgoNet'],
}))
class ProfileEgoNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.infocard = {};
    this.cardId = 'EGO'
  }

  state = {
    info: {},
  };

  componentDidMount() {
    this.card = smallcard.initInSvg(this.cardId);
    this.getProfileEgoNet()
    // const { aminerPerson: { profileEgoNet } } = this.props;
    // if (profileEgoNet && profileEgoNet.nodes && profileEgoNet.nodes.length) {
    //   this.renderData(profileEgoNet);
    // }
    // window.onresize = () => {
    //   if (profileEgoNet) {
    //     this.renderData(profileEgoNet);
    //   }
    // };
  }

  componentDidUpdate(prevProps) {
    if (NE(prevProps, this.props, ['personId', 'user'])) {
      this.getProfileEgoNet()
    }
  }

  getProfileEgoNet = () => {
    const { dispatch, personId } = this.props;
    dispatch({ type: 'aminerPerson/getProfileEgoNet', payload: { id: personId, reloadcache: true } })
      .then(() => {
        this.renderData();
      })
  }

  renderData = () => {
    const { profileEgoNet } = this.props;
    if (!profileEgoNet || profileEgoNet.length === 0) {
      return
    }
    const data = cloneDeep(profileEgoNet)
    let boleColor;
    let currentSlideIndex;
    let DrawNetwork;
    let egonet;
    let i;
    let j;
    let json;
    let linkData;
    let linkValueArray;
    let network;
    // let networkBlankClick;
    // let sc;
    let showingThreadHold;
    let slidePath;
    let slider;
    let svg;
    let valueExist;
    const params = data;
    const r = 5;
    loadD3v3(ret => {
      d3 = ret;
      [element] = d3.select('#ego');
      width = 335.7;
      height = 335.7;
      // width = element[0].clientWidth * 0.90;
      // height = element[0].clientWidth * 0.90;
      radii = width / 2;
      color = d3.scale.category10();
      diagonal = d3.svg.diagonal.radial().projection(d => [d.y, d.x / 180 * Math.PI]);
      // div = d3.select('body').append('div')
      //   .attr('class', 'tooltip')
      //   .attr('id', 'tip')
      //   .style('opacity', 0);
      flag = false;

      d3.select(element[0]).select('svg').remove();

      d3.layout.egonet = () => {
        // debugger;
        let links;
        let nodes;
        let size;
        const egonet = {};
        size = [1, 1];
        nodes = [];
        links = [];
        egonet.layout = () => {
          // let delta;
          let n;
          let lindex;
          let maxValue;
          let minValue;
          let wei;
          const root = nodes[0];
          nodes[0].using = true;
          root.x = 0;
          root.y = 0;
          if (nodes.length === 1) {
            return;
          }
          maxValue = 0.0;
          minValue = 10000.0;
          n = 0;
          // console.log(links, "links-------------");
          while (n < links.length) {
            if (links[n].value > maxValue) {
              maxValue = links[n].value;
            }
            if (links[n].value < minValue) {
              minValue = links[n].value;
            }
            n += 1;
          }
          n = 1;
          while (n < nodes.length) {
            nodes[n].using = false;
            n += 1;
          }
          const delta = Math.PI * 2 / links.length;
          n = 0;
          while (n < links.length) {
            wei = (maxValue !== minValue ? (-0.5 * links[n].value + maxValue - minValue / 2) / (maxValue - minValue) : 1.0);
            lindex = (links[n].source === 0 ? links[n].target : links[n].source);
            nodes[lindex].x = (n * delta) * 180 / Math.PI;
            nodes[lindex].y = 0.6 * (radii * wei);
            nodes[lindex].using = true;
            n += 1;
          }
        };
        egonet.nodes = (x) => {
          // console.log(nodes, x, arguments, arguments.length, 'true nodes-------------');
          // if (!arguments.length) {
          //   return nodes;
          // }
          if (!x) {
            return nodes;
          }
          nodes = x;
          return egonet;
        };
        egonet.links = x => {
          // if (!arguments.length) {
          //   return links;
          // }
          links = x;
          return egonet;
        };
        egonet.size = x => {
          // if (!arguments.length) {
          //   return size;
          // }
          size = x;
          return egonet;
        };
        egonet.radius = x => {
          let radius;
          // if (!arguments.length) {
          //   return radius;
          // }
          radius = x;
          return egonet;
        };
        return egonet;
      };
      egonet = d3.layout.egonet().radius(radii);
      svg = d3.select(element[0]).append('svg')
        .attr('width', radii * 2)
        .attr('height', radii * 2)
        // .on("click", networkBlankClick)
        .append('g')
        .attr('transform', () => {
          return `translate(${radii}, ${radii})`;
        });
      // networkBlankClick = null;
      json = params;
      linkValueArray = [];
      linkData = [];
      i = 1;
      // console.log(json, "json--------------");
      if (!json || json === [] || (json && !json.nodes)) {
        return;
      }
      while (i < json.nodes.length) {
        linkData.push({
          source: i,
          relation: json.nodes[i].w,
          value: json.nodes[i].w,
          target: 0,
        });
        valueExist = false;
        j = 0;
        while (j < linkValueArray.length) {
          if (linkValueArray[j] === json.nodes[i].value) {
            valueExist = true;
            break;
          }
          j += 1;
        }
        if (!valueExist) {
          linkValueArray.push(Number(json.nodes[i].value));
        }
        i += 1;
      }
      linkValueArray.sort((x, y) => {
        return x - y;
      });
      showingThreadHold = 30;
      linkData.sort((x, y) => {
        return -(x.value - y.value);
      });
      currentSlideIndex = 0;
      if (linkData.length >= showingThreadHold) {
        i = 0;
        while (i < linkValueArray.length) {
          if (linkData[showingThreadHold - 1].value === linkValueArray[i]) {
            currentSlideIndex = i;
          }
          i += 1;
        }
      }
      linkData = [];
      i = 1;
      while (i < json.nodes.length) {
        linkData.push({
          source: i,
          relation: json.nodes[i].w,
          value: json.nodes[i].w,
          target: 0,
        });
        i += 1;
      }
      linkData.sort((x, y) => {
        const xindex = (x.target === 0 ? x.source : x.target);
        const yindex = (y.target === 0 ? y.source : y.target);
        const xvalue = json.nodes[xindex].boleCode * 100 + x.value;
        const yvalue = json.nodes[yindex].boleCode * 100 + y.value;
        return xvalue - yvalue;
      });
      boleColor = [];
      const sc = 0;
      boleColor.push('#B3CDE3');
      boleColor.push('#FBB4AE');
      boleColor.push('#CCEBC5');
      boleColor.push('#FED9A6');
      boleColor.push('#377EB8');
      boleColor.push('#E41A1C');
      boleColor.push('#4DAF4A');
      boleColor.push('#FF7F00');

      DrawNetwork = (svg, linkData, egonet) => {
        let fixed;
        let link;
        let mouseclick;
        let mouseoutAction;
        let node;
        let nodeData;
        let nodes;
        let timeout4hiderdd;
        const linkmouseover = d => {
          const nodeindex = (d.source === 0 ? d.target : d.source);
          mouseover(nodeindex, this);
        };
        const nodemouseover = (d, n) => {
          mouseover(n);
        };
        // const linkmouseclick = (d) => {
        //   const nodeindex = (d.source === 0 ? d.target : d.source);
        //   //mouseclick(nodeindex, this);
        // };
        const nodemouseclick = (d, n) => {
          window.event.returnValue = false;
          mouseclick(d, n, this);
        };
        const mouseover = (index) => {
          if (fixed) {
            return;
          }
          if (index === 0) {
            return;
          }
          if (typeof timeout4hiderdd !== "undefined" && timeout4hiderdd !== null) {
            clearTimeout(timeout4hiderdd);
            timeout4hiderdd = undefined;
          }
          // console.log(d3.selectAll("g.network_node")[0], "d3.select(\"g.network_node\")");
          d3.selectAll("g.network_node")[0].map((item) => {
            const nindex = d3.select(item).attr("node-index");
            const code = nodes[nindex].boleCode + 4;
            // console.log(nindex, item, boleColor[code], "item, num--------------", d3.select(item)[0][0]);
            d3.select(item).style("fill", boleColor[code]);
          });
          d3.selectAll("line.network_link")[0].map((item) => {
            const nindex = d3.select(item).attr("node-index");
            const code = nodes[nindex].boleCode + 4;
            d3.select(item).style("stroke", boleColor[code]);
          });
          const nodeobj = d3.select(`g.network_node[node-index='${index}']`);
          const linkobj = d3.select(`line.network_link[node-index='${index}']`);
          const fill = d3.select(nodeobj[0][0]).style('fill');
          const stroke = d3.select(linkobj[0][0]).style('stroke');
          d3.select(nodeobj[0][0]).style("fill", d3.rgb(fill).brighter());
          d3.select(linkobj[0][0]).style("stroke", d3.rgb(stroke).brighter());
        };
        const mouseout = (d, n) => {
          let code;
          let index;
          if (fixed) {
            return;
          }
          if (d.name == null) {
            index = (d.source === 0 ? d.target : d.source);
          } else {
            index = n;
          }
          code = nodes[index].boleCode;
          code += 4;
          const nodeobj = d3.select(`g.network_node[node-index='${index}']`);
          //console.log(nodeobj[0][0], boleColor[code], '-------00000-------------');
          const linkobj = d3.select(`line.network_link[node-index='${index}']`);
          d3.select(nodeobj[0][0]).style("fill", boleColor[code]);
          d3.select(linkobj[0][0]).style("stroke", boleColor[code]);
          if (typeof timeout4hiderdd === "undefined" || timeout4hiderdd === null) {
            timeout4hiderdd = setTimeout(mouseoutAction, 200);
          }
        };
        mouseoutAction = () => { };
        mouseclick = (d, index, thisobj) => {
          this.card.show(document.querySelector(`.network_node[node-index='${index}']`), {
            id: d.id, copaper: d.w
          });
          this.smallCard.getData();
        };
        egonet.nodes(json.nodes).links(linkData).layout();
        nodes = egonet.nodes();
        link = svg.selectAll("line.network_link").data(linkData).enter()
          .append("line")
          .attr("class", "network_link")
          .style("stroke-width", (d) => {
            return 2;
          })
          .attr("x1", 0)
          .attr("x2", (d) => {
            const dindex = (d.source === 0 ? d.target : d.source);
            // console.log(nodes, dindex, d.target, d.source, "egonet.nodes dindex-");
            // console.log('nodes[dindex]', nodes[dindex].y)
            return nodes[dindex].y;
          })
          .attr("y1", 0)
          .attr("y2", 0)
          .style("stroke", (d) => {
            const dindex = (d.source === 0 ? d.target : d.source);
            let code = nodes[dindex].boleCode;
            code += 4;
            return boleColor[code];
          })
          .attr("node-index", (d) => {
            if (d.source === 0) {
              return d.target;
            } else {
              return d.source;
            }
          })
          .attr("transform", (d) => {
            const dindex = (d.source === 0 ? d.target : d.source);
            return `rotate(${nodes[dindex].x - 90}) translate(${0}, ${0})`;
          })
          .on("mouseover", linkmouseover)
          // .on("click", linkmouseclick)
          .on("mouseout", mouseout);
        nodeData = [];
        i = 0;
        while (i < nodes.length) {
          if (nodes[i].using) {
            nodeData.push(nodes[i]);
          }
          i += 1;
        }
        node = svg.selectAll("g.network_node")
          .data(nodeData).enter()
          .append("g")
          .attr("class", "network_node")
          .style("fill", (d) => {
            let code;
            code = d.boleCode;
            code += 4;
            return boleColor[code];
          })
          .attr("node-index", (d, m) => {
            return m;
          })
          .attr("transform", (d) => {
            return `rotate(${d.x - 90}) translate(${d.y})`;
          })
          .on("mouseover", nodemouseover)
          .on("click", nodemouseclick)
          .on("mouseout", mouseout);
        node.append("circle").attr("r", r);
        node.append("text").attr("dy", ".31em")
          .attr("text-anchor", (d) => {
            if (d.x < 180) {
              return "start";
            } else {
              return "end";
            }
          })
          .attr("transform", (d, n) => {
            let trans;
            if (n !== 0) {
              trans = r * 2;
              if (d.x < 180) {
                return `translate(${trans})`;
              } else {
                return `rotate(${180}) translate(${-trans})`;
              }
            } else {
              return `rotate(${90}) translate(${-(d.name.length * 2.1)}, ${(r * 2 + 3)})`;
            }
          })
          .style("font-size", "10px")
          .style("cursor", "pointer")
          .append('a')
          .style("fill", (d) => {
            let code;
            code = d.boleCode;
            code += 4;
            return boleColor[code];
          })
          .attr("xlink:href", "#")
          .text((d) => {
            return d.name;
          })
        node.append("title").text((d) => {
          return d.name;
        });
        fixed = false;
        this.lostFix = () => {
          fixed = false;
        };
        timeout4hiderdd = undefined;
      };
      network = new DrawNetwork(svg, linkData, egonet);
      i = 0;
    });
  };

  onRef = card => {
    this.smallCard = card
  }

  infocardHide = () => {
    if (this.smallCard) {
      this.smallCard.tryHideCard();
    }
  }

  render() {
    const { personId, loading } = this.props;
    return (
      <section id="EGO_ROOT" style={{ position: 'relative' }}>
        <div id="ego" style={{ height: 360, display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        <Spin loading={loading} size="small" top="170px" withText />
        <SmallCard
          onRef={this.onRef} id={this.cardId} click
          cardBottomZone={[({ cardID }) => (
            <ChangeRelation key="3"
              cardID={cardID}
              personId={personId}
              renderData={this.renderData}
              infocardHide={this.infocardHide}
            />
          )]}
        />
      </section>
    );
  }
}

export default ProfileEgoNetwork;
