import React from "react";
import { connect } from 'acore';
import { loadD3v3 } from 'utils/requirejs';
import { cloneDeep } from 'lodash';
import { NE } from 'utils/compare';

let d3;
let allD;
let allIN;
let allMI;
let allMO;
let allOUT;
let allVOL;
let authD;
let authIN;
let authOUT;
let flag;
let height;
let width;
let margin;

@connect(({ aminerPerson }) => ({
  profileDcore: aminerPerson.profileDcore
}))
class ProfileDcore extends React.Component {

  componentDidMount() {
    this.getProfileDcore()
    // window.onresize = () => {
    //   if (profileDcore) {
    //     this.fixLine(profileDcore.g);
    //   }
    // };
  }

  componentDidUpdate(prevProps) {
    if (NE(prevProps, this.props, 'personId')) {
      this.getProfileDcore()
    }
  }

  getProfileDcore = () => {
    const { dispatch, personId } = this.props;
    dispatch({ type: 'aminerPerson/getProfileDcore', payload: { aid: [personId] } })
      .then(() => {
        this.updateDcore();
      })
  }

  updateDcore = () => {
    const { profileDcore } = this.props;
    const data = cloneDeep(profileDcore)
    loadD3v3((ret) => {
      d3 = ret;
      margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 60,
      };
      // console.log(d3, margin, "---------------------");
      width = 350 - margin.left - margin.right;
      height = 350 - margin.top - margin.bottom;
      allMO = 0;
      allMI = 0;
      allVOL = 0;
      allD = [];
      allIN = [];
      allOUT = [];
      authD = [];
      authIN = [];
      authOUT = [];
      flag = false;
      // this.fixLine(data.g);
      this.authPlot(data);
    });
  };

  authPlot = APIdata => {
    allMI = APIdata.a[0].mi;
    allMO = APIdata.a[0].mo;
    allD = APIdata.a[0].f;
    authD = [];
    const maxAll = Math.max(allMI, allMO, 600);
    this.fixLine(APIdata.a[0]);
    authD = APIdata.a[0].f;
    const xx = d3.scale.linear().domain([0, maxAll]).range([0, width]);
    const yy = d3.scale.linear().domain([maxAll, 0]).range([height - 10, 0]);
    const xAxis = d3.svg.axis().scale(xx).orient('top').ticks(5);
    const yAxis = d3.svg.axis().scale(yy).orient('left').ticks(10);
    const mouseOut = () => {
      d3.select('#tooltip').remove();
    };
    const svg = d3.select('#modalT').append('svg')
      .attr('height', 322.2)
      .attr('width', 350)
      .on('mouseenter', this.coreHover)
      .on('mouseleave', mouseOut)
      .append('g')
      .attr('transform', () => `translate(${margin.left}, ${margin.top})`);
    svg.append('g').attr('class', 'x axis').call(xAxis);
    svg.append('g').attr('class', 'y axis').call(yAxis);
    svg.append('text').attr('class', 'x label').attr('text-anchor', 'end')
      .attr('x', width / 2)
      .attr('y', -25)
      .text('Out Citations');
    svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', -55)
      .attr('x', -width / 2)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('In Citations');
    // svg.selectAll('dot').data(allD).enter().append('circle')
    //   .attr('r', 2.5)
    //   .attr('fill', 'purple')
    //   .attr('cx', (d, i) => {
    //     return xx(allD[i][1]);
    //   })
    //   .attr('cy', (d, i) => {
    //     return yy(allD[i][0]);
    //   });
    svg.selectAll('dot').data(authD).enter().append('circle')
      .attr('r', 1.0)
      .attr('fill', 'black')
      .attr('cx', (d, i) => {
        return xx(authD[i][1]);
      })
      .attr('cy', (d, i) => {
        return yy(authD[i][0]);
      });
  };

  coreHover = (event) => {
    const Event = event || window.event;
    const element = `div`;
    const text = "D-core is a new influence metric representing jointly the authority and " +
      "collaborative attitude of an author as it is extracted from the densest" +
      "citation graph he/she participates.";
    d3.select('#modalT').style('position', 'relative')
      .append(element)
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .text(text);
    d3.select("#tooltip").style('top', `${Event.offsetX}px`)
      .style('left', `${Event.offsetY}px`)
      .style('position', 'absolute')
      .style("opacity", 1)
      .style("background-color", "#000")
      .style("color", "#fff")
      .style("padding", "5px");
  };

  fixLine = (document) => {
    let i;
    let maxYminX;
    let tl;
    let xt1;
    let xt2;
    let yt;
    document.f.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });
    if (document.f.length > 0) {
      maxYminX = document.f[document.f.length - 1];
      if (maxYminX.length > 0) {
        i = maxYminX[1];
        while (i >= 0) {
          document.f.push([maxYminX[0], i]);
          i -= 1;
        }
      }
      tl = document.f.length - 1;
      i = 0;
      while (i < tl) {
        xt1 = document.f[i][1];
        xt2 = document.f[i + 1][1];
        yt = document.f[i][0];
        while (xt1 - xt2 > 1) {
          xt1 = xt1 - 1;
          document.f.push([yt, xt1]);
        }
        i += 1;
      }
    }
  };

  render() {
    return (
      <div id="modalT" style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    );
  }

}

export default ProfileDcore
