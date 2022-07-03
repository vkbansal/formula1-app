/* global driversData, constructorsData, raceNames, d3 */
import colors from '../../../common-client/colors';
import { formatOrdinals } from '../../../common-client/helpers';

function drawPositionsChart(id, chartData) {
  const margin = { top: 30, right: 30, bottom: 100, left: 100 };
  const totalWidth = 900;
  const totalHeight = chartData.length * 45;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;
  const STROKE_WIDTH = 3;

  const svg = d3.select(id);

  svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

  const xDomain = raceNames.map((_, i) => i);
  const yDomain = chartData.map((_, i) => i + 1);

  const xScale = d3.scalePoint(xDomain, [0, width]);
  const yScale = d3.scalePoint(yDomain, [0, height]);

  /* render bottom axis */
  const bottomAxis = d3.axisBottom(xScale).ticks(raceNames.length);
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
    .call(bottomAxis)
    .selectAll('.tick')
    .each(function (d) {
      this.classList.add('tick-x');
      d3.select(this)
        .select('text')
        .attr('transform', 'translate(-30, 40) rotate(-45)')
        .text(raceNames[d]);
    });

  /* render left axis */
  const leftAxis = d3.axisLeft(yScale).ticks(chartData.length);
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(leftAxis)
    .selectAll('.tick')
    .each(function (data) {
      this.classList.add('tick-y');
      d3.select(this)
        .attr('data-y', data - 1)
        .select('text')
        .text(chartData[data - 1].label);
    })
    .on('mouseenter', function () {
      const that = this;
      const dataY = that.getAttribute('data-y');
      svg.selectAll('.line-group').each(function () {
        if (dataY !== this.getAttribute('data-y')) {
          this.classList.add('line-group-fade');
        } else {
          this.classList.add('line-group-focus');
        }
      });
      svg.selectAll('.tick-y').each(function () {
        if (this !== that) {
          this.classList.add('tick-fade');
        }
      });
    })
    .on('mouseleave', mouseLeaveFromLine);

  /* render grid lines axis */
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .selectAll('.grid-line')
    .data(chartData)
    .enter()
    .append('line')
    .attr('fill', 'none')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', 'currentColor')
    .attr('style', 'opacity: 0.2;')
    .attr('x1', 0)
    .attr('y1', function (d, i) {
      return yScale(i + 1);
    })
    .attr('x2', width)
    .attr('y2', function (d, i) {
      return yScale(i + 1);
    });

  /* render right axis */
  const rightAxis = d3
    .axisRight(yScale)
    .ticks(chartData.length)
    .tickFormat(function (d) {
      return formatOrdinals(d);
    });
  svg
    .append('g')
    .attr('transform', `translate(${margin.left + width}, ${margin.top})`)
    .call(rightAxis)
    .selectAll('.tick');

  /* render data axis */
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .selectAll('.line')
    .data(chartData)
    .enter()
    .append('g')
    .attr('class', 'line-group')
    .attr('data-y', function (d, y) {
      return y;
    })
    .attr('font-size', '12')
    .each(function (d, i) {
      const filteredData = d.data
        .map((e, j) => (e ? { ...e, x: j } : e))
        .filter(Boolean);

      const g = d3.select(this);
      const points = g.selectAll('.point').data(filteredData).enter();

      points
        .append('circle')
        .attr('class', 'point')
        .attr('r', STROKE_WIDTH + 1)
        .attr('stroke', 'none')
        .attr('style', 'pointer-events: none;')
        .attr('fill', function () {
          return colors[i];
        })
        .attr('cx', function (d) {
          return xScale(d.x);
        })
        .attr('cy', function (d) {
          return yScale(d.ps);
        });

      points
        .append('text')
        .attr('class', 'label')
        .attr('fill', 'currentColor')
        .attr('x', function (d) {
          return xScale(d.x);
        })
        .attr('y', function (d) {
          return yScale(d.ps);
        })
        .attr('dx', function (d, i) {
          const prev = filteredData[i - 1];
          const curr = filteredData[i];
          const next = filteredData[i + 1];

          if (!prev) {
            // first
            if (curr && next && curr.ps > next.ps) {
              return 8;
            }

            return -8;
          }

          if (!next) {
            // last
            return -8;
          }

          if (prev && curr && prev.ps > curr.ps && curr.ps > next.ps) {
            return 8;
          }

          return -8;
        })
        .attr('dy', function (d, i) {
          const prev = filteredData[i - 1];
          const curr = filteredData[i];
          const next = filteredData[i + 1];

          if (!prev) {
            // first
            return -8;
          }

          if (!next) {
            // last
            return -8;
          }

          if (prev && curr && prev.ps > curr.ps && curr.ps > next.ps) {
            return 8;
          }

          if (prev && curr && (prev.ps < curr.ps || curr.ps > next.ps)) {
            return 16;
          }

          return -8;
        })
        .text(function (d) {
          return formatOrdinals(d.ps);
        });

      g.append('path')
        .attr('fill', 'none')
        .attr('class', 'line')
        .attr('stroke-width', STROKE_WIDTH)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke', function () {
          return colors[i];
        })
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return xScale(d.x);
            })
            .y(function (d) {
              return yScale(d.ps);
            })(filteredData)
        );
    })
    .on('mouseenter', function () {
      const that = this;
      const dataY = that.getAttribute('data-y');
      svg.selectAll('.line-group').each(function () {
        if (that !== this) {
          this.classList.add('line-group-fade');
        } else {
          this.classList.add('line-group-focus');
        }
      });
      svg.selectAll('.tick-y').each(function () {
        if (dataY !== this.getAttribute('data-y')) {
          this.classList.add('tick-fade');
        }
      });
    })
    .on('mouseleave', mouseLeaveFromLine);

  function mouseLeaveFromLine() {
    svg.selectAll('.line-group-fade').each(function () {
      this.classList.remove('line-group-fade');
    });
    svg.selectAll('.line-group-focus').each(function () {
      this.classList.remove('line-group-focus');
    });
    svg.selectAll('.tick-fade').each(function () {
      this.classList.remove('tick-fade');
    });
  }
}

drawPositionsChart('#driver-positions', driversData);
drawPositionsChart('#constructor-positions', constructorsData);
