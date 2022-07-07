/* global driversData, constructorsData, raceNames, d3 */
import colors from '../../../common-client/colors';
import { formatOrdinals } from '../../../common-client/helpers';

function drawPositionsChart(id, data) {
	const chartData = data.slice(0).map((r, i) => ({ ...r, color: colors[i] }));
	const margin = { top: 30, right: 220, bottom: 100, left: 100 };
	const totalWidth = 900;
	const totalHeight = chartData.length * 35;
	const width = totalWidth - margin.left - margin.right;
	const height = totalHeight - margin.top - margin.bottom;
	const STROKE_WIDTH = 4;
	const DOT_RADIUS = 5;
	const LEGEND_ICON_WIDTH = 20;

	const svg = d3.select(id);

	svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

	const xDomain = raceNames.map((_, i) => i);
	const yDomain = chartData.map((_, i) => i + 1);

	const xScale = d3.scalePoint(xDomain, [0, width]);
	const yScale = d3.scalePoint(yDomain, [0, height]);

	/** BOTTOM AXIS *************************************************************/
	const bottomAxis = d3.axisBottom(xScale).ticks(raceNames.length);
	svg
		.append('g')
		.attr('class', 'bottom-axis')
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

	/** LEFT AXIS ***************************************************************/
	const leftAxis = d3
		.axisLeft(yScale)
		.ticks(chartData.length)
		.tickFormat(function (d) {
			return formatOrdinals(d);
		});
	svg
		.append('g')
		.attr('class', 'left-axis')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.call(leftAxis);

	/** RIGHT AXIS **************************************************************/
	const rightAxis = d3
		.axisRight(yScale)
		.ticks(chartData.length)
		.tickFormat(function (d) {
			return formatOrdinals(d);
		});
	svg
		.append('g')
		.attr('class', 'right-axis')
		.attr('transform', `translate(${margin.left + width}, ${margin.top})`)
		.call(rightAxis);

	/** GRIDS *******************************************************************/
	const gridG = svg
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	const xTicks = xDomain.map((d) => xScale(d));
	const yTicks = yDomain.map((d) => yScale(d));

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
			return d;
		})
		.attr('x2', width)
		.attr('y2', function (d) {
			return d;
		});

	/** LEGEND ******************************************************************/
	svg
		.append('g')
		.attr('class', 'legend')
		.attr('font-size', '10')
		.attr('transform', `translate(${margin.left + width + 50}, ${margin.top})`)
		.selectAll('.legend-row')
		.data(chartData)
		.enter()
		.append('g')
		.attr('class', 'legend-row')
		.each(function (d, i) {
			const g = d3.select(this);

			g.attr('transform', `translate(0, ${i * 25})`).attr('data-y', i);

			g.append('line')
				.attr('fill', 'none')
				.attr('stroke-width', STROKE_WIDTH)
				.attr('stroke', d.color)
				.attr('stroke-linejoin', 'round')
				.attr('stroke-linecap', 'round')
				.attr('x1', '0')
				.attr('y1', '0')
				.attr('x2', LEGEND_ICON_WIDTH)
				.attr('y2', '0');

			g.append('circle')
				.attr('cx', LEGEND_ICON_WIDTH / 2)
				.attr('cy', '0')
				.attr('r', DOT_RADIUS)
				.attr('fill', d.color);

			g.append('text')
				.attr('fill', 'currentColor')
				.attr('x', LEGEND_ICON_WIDTH + 10)
				.attr('y', 4)
				.text(d.label);
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
			svg.selectAll('.legend-row').each(function () {
				if (that !== this) {
					this.classList.add('legend-row-fade');
				}
			});
		})
		.on('mouseleave', mouseLeaveFromLine);

	/** DATA ********************************************************************/
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
		.each(function (d1) {
			const filteredData = d1.data
				.map((e, x) => (e ? { ...e, x } : e))
				.filter(Boolean);

			const g = d3.select(this);
			const points = g.selectAll('.point').data(filteredData).enter();

			points
				.append('circle')
				.attr('class', 'point')
				.attr('r', DOT_RADIUS)
				.attr('stroke', 'none')
				.attr('style', 'pointer-events: none;')
				.attr('fill', d1.color)
				.attr('cx', function (d2) {
					return xScale(d2.x);
				})
				.attr('cy', function (d2) {
					return yScale(d2.ps);
				});

			points
				.append('text')
				.attr('class', 'label')
				.attr('fill', 'currentColor')
				.attr('font-size', '10')
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
					return d1.color;
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
			svg.selectAll('.legend-row').each(function () {
				if (dataY !== this.getAttribute('data-y')) {
					this.classList.add('legend-row-fade');
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
		svg.selectAll('.legend-row-fade').each(function () {
			this.classList.remove('legend-row-fade');
		});
	}
}

drawPositionsChart('#driver-positions', driversData);
drawPositionsChart('#constructor-positions', constructorsData);
