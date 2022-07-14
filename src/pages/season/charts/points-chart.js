/* global raceNames, d3, Popper */
import colors from '../../../common-client/colors';
import { formatOrdinals } from '../../../common-client/helpers';

const TEMP_RANK = 9999;

function getTooltipRowContent(row) {
	const color = `<div class="color" style="color:${row.color};"></div>`;
	const label = `<div>${row.label}</div>`;

	if (row.data.ps === TEMP_RANK) {
		return `
		<div class="points-row">
			${color}
			${label}
			<div>N/A</div>
			<div>N/A</div>
			<div>N/A</div>
		</div>`;
	}

	return `
	<div class="points-row">
		${color}
		${label}
		<div class="text-right">${row.data.pt}</div>
		<div class="text-right">${formatOrdinals(row.data.ps)}</div>
		<div class="text-right">${row.data.w}</div>
	</div>`;
}

export function drawPointsChart({ target: id, chartData, alpine }) {
	const margin = { top: 30, right: 30, bottom: 100, left: 100 };
	const totalWidth = 900;
	const totalHeight = 900;
	const width = totalWidth - margin.left - margin.right;
	const height = totalHeight - margin.top - margin.bottom;
	const longestName = Math.max(...chartData.map((d) => d.label.length));
	const STROKE_WIDTH = 4;
	const DOT_RADIUS = 5;
	const LEGEND_ICON_WIDTH = 20;
	const chartDataWithColors = chartData.map((d, i) => ({
		...d,
		color: colors[i]
	}));

	const xDomain = raceNames.map((_, i) => i);
	const yMax = Math.max(
		...chartData.map((d) =>
			Math.max(...d.data.filter(Boolean).map((r) => r.pt))
		)
	);
	const yDomain = Math.ceil(yMax / 10) * 10;

	const xScale = d3.scalePoint(xDomain, [0, width]);
	const yScale = d3.scaleLinear([0, yDomain], [height, 0]);

	const svg = d3.select(id);

	svg.attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
	/** BOTTOM AXIS *************************************************************/
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

	/** LEFT AXIS ***************************************************************/
	const leftAxis = d3.axisLeft(yScale).ticks(yDomain / 20);
	svg
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.call(leftAxis);

	/** GRIDS *******************************************************************/
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

	/** DATA ********************************************************************/
	svg
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.selectAll('.line')
		.data(chartDataWithColors)
		.enter()
		.append('g')
		.attr('class', 'line-group')
		.attr('data-y', function (d, y) {
			return y;
		})
		.each(function (d) {
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
				.attr('fill', d.color)
				.attr('cx', function (a) {
					return xScale(a.x);
				})
				.attr('cy', function (a) {
					return yScale(a.pt);
				});

			g.append('path')
				.attr('fill', 'none')
				.attr('class', 'line')
				.attr('stroke-width', STROKE_WIDTH)
				.attr('stroke-linejoin', 'round')
				.attr('stroke-linecap', 'round')
				.attr('stroke', d.color)
				.attr(
					'd',
					d3
						.line()
						.x(function (a) {
							return xScale(a.x);
						})
						.y(function (a) {
							return yScale(a.pt);
						})(filteredData)
				);
		});

	let prevClosest = 0;
	const MOUSE_OFFSET = 20;

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
				const columns = Math.ceil(chartDataWithColors.length / 30);
				const driverResults = chartDataWithColors
					.map((c) => {
						const d = c.data[raceNum];
						return {
							...c,
							data: d || { ps: TEMP_RANK, pt: 0, w: 0 }
						};
					})
					.sort((a, b) => a.data.ps - b.data.ps);

				const hasResults = driverResults.some((c) => c.data.ps < TEMP_RANK);

				alpine.updateData({ hasResults });

				// tooltipContent.innerHTML = hasResults
				// 	? [
				// 			`<div class="points-tooltip" style="columns:${columns};--longest-name:${longestName}ch;">`,
				// 			`<div class="race-name">${raceNames[raceNum]}</div>`,
				// 			`<div class="points-row points-header">`,
				// 			`<div></div>`,
				// 			`<div>${label}</div>`,
				// 			`<div class="text-right">Points</div>`,
				// 			`<div class="text-right">Position</div>`,
				// 			`<div class="text-right">Wins</div>`,
				// 			`</div>`,
				// 			...driverResults.map((c) => getTooltipRowContent(c)),
				// 			'</div>'
				// 	  ].join('\n')
				// 	: 'No data available';

				svg.select('.mouse-line').attr('x1', closest).attr('x2', closest);
			}

			virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
				e.clientX,
				e.clientY
			);
			popper.update();
		});

	const tooltip = document.querySelector(`${id}-tooltip`);
	// const tooltipContent = tooltip.querySelector('.tooltip-content');

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
		contextElement: document.body
	};

	const popper = Popper.createPopper(virtualElement, tooltip, {
		placement: 'top',
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
