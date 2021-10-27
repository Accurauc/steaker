<template>
  <div :id="`line-${this.index}`"></div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, watch } from 'vue';

export default {
  props: ['dataset', 'color', 'index'],
  setup(props) {
    function LineChart(data, {
      x = ([dx]) => dx, // given d in data, returns the (temporal) x-value
      y = ([, dy]) => dy, // given d in data, returns the (quantitative) y-value
      defined, // for gaps in data
      curve = d3.curveLinear, // method of interpolation between points
      marginTop = 0, // top margin, in pixels
      marginRight = 0, // right margin, in pixels
      marginBottom = 0, // bottom margin, in pixels
      marginLeft = 0, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      xType = d3.scaleLinear, // the x-scale type
      xDomain, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight], // [left, right]
      yType = d3.scaleLinear, // the y-scale type
      yDomain, // [ymin, ymax]
      yRange = [height - marginBottom, marginTop], // [bottom, top]
      // yFormat, // a format specifier string for the y-axis
      // yLabel, // a label for the y-axis
      color = 'currentColor', // stroke color of line
      strokeLinecap = 'round', // stroke line cap of the line
      strokeLinejoin = 'round', // stroke line join of the line
      strokeWidth = 1.5, // stroke width of line, in pixels
      strokeOpacity = 1, // stroke opacity of line
    } = {}) {
      // Compute values.
      const X = d3.map(data, x);
      const Y = d3.map(data, y);
      const I = d3.range(X.length);
      const newDefined = defined === undefined
        ? (d, i) => !Number.isNaN(X[i]) && !Number.isNaN(Y[i]) : defined;
      const D = d3.map(data, newDefined);

      // Compute default domains.
      const newXDomain = xDomain === undefined ? d3.extent(X) : xDomain;
      const newYDomain = yDomain === undefined ? d3.extent(Y) : yDomain;

      // Construct scales and axes.
      const xScale = xType(newXDomain, xRange);
      const yScale = yType(newYDomain, yRange);
      // const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
      // const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

      // Construct a line generator.
      const line = d3.line()
        .defined((i) => D[i])
        .curve(curve)
        .x((i) => xScale(X[i]))
        .y((i) => yScale(Y[i]));

      const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

      svg.append('g')
        .attr('transform', `translate(0,${height - marginBottom})`);

      svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1))
        .call((g) => g.append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start'));

      svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linecap', strokeLinecap)
        .attr('stroke-linejoin', strokeLinejoin)
        .attr('stroke-opacity', strokeOpacity)
        .attr('d', line(I));

      return svg.node();
    }
    function renderChart(data) {
      const el = document.querySelector(`#line-${props.index}`);
      if (el.hasChildNodes()) {
        el.removeChild(el.childNodes[0]);
      }
      const chart = LineChart(data, {
        x: (d, i) => i,
        y: (d) => d,
        yLabel: '',
        width: 164,
        height: 48,
        color: props.color,
      });
      el.append(chart);
    }
    onMounted(() => {
      renderChart(props.dataset);
    });

    watch(() => props.dataset, (first, second) => {
      renderChart(second);
    });
    return {
    };
  },
};
</script>

<style scoped lang='scss'>
</style>
