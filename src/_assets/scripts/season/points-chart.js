/* global driversData, constructorsData, raceNames, d3, Popper */
import colors from '../common/colors';
import { formatOrdinals } from '../common/utils';

function drawPointsChart(id, chartData) {
  const margin = { top: 30, right: 30, bottom: 100, left: 100 };
  const totalWidth = 900;
  const totalHeight = 900;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;
  const STROKE_WIDTH = 3;

  const svg = d3.select(id);

  svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

  const xDomain = raceNames.map((_, i) => i);
  const yMax = Math.max(
    ...chartData.map((d) =>
      Math.max(...d.data.filter(Boolean).map((r) => r.pt))
    )
  );
  const yDomain = Math.ceil(yMax / 10) * 10;

  const xScale = d3.scalePoint(xDomain, [0, width]);
  const yScale = d3.scaleLinear([0, yDomain], [height, 0]);

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
  const leftAxis = d3.axisLeft(yScale).ticks(yDomain / 20);
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(leftAxis);
  // .selectAll('.tick')
  // .on('mouseenter', function () {
  //   const that = this;
  //   const dataY = that.getAttribute('data-y');
  //   svg.selectAll('.line-group').each(function () {
  //     if (dataY !== this.getAttribute('data-y')) {
  //       this.classList.add('line-group-fade');
  //     } else {
  //       this.classList.add('line-group-focus');
  //     }
  //   });
  //   svg.selectAll('.tick-y').each(function () {
  //     if (this !== that) {
  //       this.classList.add('tick-fade');
  //     }
  //   });
  // });
  // .on('mouseleave', mouseLeaveFromLine);

  /* render grid lines axis */
  const gridG = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xTicks = xDomain.map((d) => xScale(d));
  const yTicks = leftAxis.scale().ticks();

  gridG
    .selectAll('.grid-line-x')
    .data(xTicks)
    .enter()
    .append('line')
    .attr('fill', 'none')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', 'currentColor')
    .attr('style', 'opacity: 0.2;')
    .attr('y1', 0)
    .attr('x1', function (d) {
      return d;
    })
    .attr('y2', height)
    .attr('x2', function (d) {
      return d;
    });

  gridG
    .selectAll('.grid-line-y')
    .data(yTicks)
    .enter()
    .append('line')
    .attr('fill', 'none')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', 'currentColor')
    .attr('style', 'opacity: 0.2;')
    .attr('x1', 0)
    .attr('y1', function (d) {
      return yScale(d);
    })
    .attr('x2', width)
    .attr('y2', function (d) {
      return yScale(d);
    });

  /* render data */
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
          return yScale(d.pt);
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
              return yScale(d.pt);
            })(filteredData)
        );
    });

  let prevClosest = 0;
  const MOUSE_OFFSET = 20;
  const TEMP_RANK = 9999;

  const mouseG = svg
    .append('g')
    .attr('class', 'mouse-over-effects')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  mouseG
    .append('line') // this is the vertical line to follow mouse
    .attr('class', 'mouse-line')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', '1')
    .attr('x1', '0')
    .attr('y1', '0')
    .attr('x2', '0')
    .attr('y2', height)
    .style('opacity', '0');
  mouseG
    .append('rect') // append a rect to catch mouse movements on canvas
    .attr('width', width + MOUSE_OFFSET) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('transform', `translate(-${MOUSE_OFFSET / 2}, 0)`)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function () {
      // on mouse out hide line, circles and text
      svg.select('.mouse-line').style('opacity', '0');
      tooltip.removeAttribute('data-show');
      // d3.selectAll(".mouse-per-line circle")
      //   .style("opacity", "0");
      // d3.selectAll(".mouse-per-line text")
      //   .style("opacity", "0");
    })
    .on('mouseover', function () {
      // on mouse in show line, circles and text
      svg.select('.mouse-line').style('opacity', '1');
      tooltip.setAttribute('data-show', '');
      // d3.selectAll(".mouse-per-line circle")
      //   .style("opacity", "1");
      // d3.selectAll(".mouse-per-line text")
      //   .style("opacity", "1");
    })
    .on('mousemove', function (e) {
      // mouse moving over canvas
      const [x] = d3.pointer(e, this);

      const closest = xTicks.reduce((prev, curr) => {
        return Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
      });

      if (prevClosest !== closest) {
        prevClosest = closest;
        const raceNum = xTicks.indexOf(closest);
        const driverResults = chartData
          .map((c, i) => ({
            label: c.label,
            result: c.data[raceNum] ? c.data[raceNum].ps : TEMP_RANK,
            color: colors[i]
          }))
          .sort((a, b) => a.result - b.result);
        const hasResults = driverResults.some((c) => c.result < TEMP_RANK);

        tooltipContent.innerHTML = hasResults
          ? [
              '<div class="points-tooltip">',
              ...driverResults.map((c) => {
                const content =
                  c.result === TEMP_RANK ? 'N/A' : formatOrdinals(c.result);

                return [
                  `<div class="color" style="color:${c.color};"></div>`,
                  `<div>${c.label}</div>`,
                  `<div>${content}</div>`
                ].join('\n');
              }),
              '</div>'
            ].join('\n')
          : 'No data available';

        svg.select('.mouse-line').attr('x1', closest).attr('x2', closest);
      }

      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
        e.clientX,
        e.clientY
      );
      popper.update();
    });

  const wrapper = svg.node().parentNode;
  const tooltip = document.querySelector(`${id}-tooltip`);
  const tooltipContent = tooltip.querySelector('.tooltip-content');

  function generateGetBoundingClientRect(x = 0, y = 0) {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x
    });
  }

  const virtualElement = {
    getBoundingClientRect: generateGetBoundingClientRect(),
    contextElement: wrapper
  };

  const popper = Popper.createPopper(virtualElement, tooltip, {
    placement: 'right',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 24]
        }
      },
      {
        name: 'arrow',
        options: {
          padding: 8
        }
      }
    ]
  });
}

drawPointsChart('#driver-points', driversData);
drawPointsChart('#constructor-points', constructorsData);
