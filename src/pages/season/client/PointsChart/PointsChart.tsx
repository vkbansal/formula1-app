import { h, type VNode } from 'preact';
import { useRef, useMemo, useState, useCallback } from 'preact/hooks';
import { scaleLinear, scaleBand } from 'd3-scale';

import type { ChartData, ChartPoint } from 'pages/season/season.11ty';
import { PointsTable } from './PointsTable';
import {
	CHART_HEIGHT,
	CHART_WIDTH,
	MARGIN,
	MOUSE_OFFSET,
	TOTAL_HEIGHT,
	TOTAL_WIDTH,
	Y_STEP,
} from './common';
import { XAxis, YAxis } from './Axes';
import { Grid } from './Grid';
import { DataPlot } from './DataPlot';

export interface PointsChartData {
	data: ChartData[];
	races: string[];
	limitX: number;
	legendLabel: string;
}

export function PointsChart(props: PointsChartData): VNode {
	const { data, races, limitX, legendLabel } = props;
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rectRef = useRef<SVGRectElement | null>(null);
	const [activeColumn, setActiveColumn] = useState(-1);
	const [activeRace, setActiveRace] = useState(limitX);

	const yMaxValue = useMemo(
		() =>
			Math.max(
				...data.map((d) =>
					Math.max(
						...(d.data.filter(Boolean) as ChartPoint[]).map((r) => r.pt),
					),
				),
			),
		[data],
	);
	const yMax = useMemo(
		() => Math.ceil(yMaxValue / Y_STEP) * Y_STEP,
		[yMaxValue],
	);
	const xDomain = useMemo(() => races.map((_, i) => i), [races]);
	const yDomain = useMemo(() => {
		const values: number[] = [];

		let y = 0;

		while (y <= yMax) {
			values.push(y);
			y += Y_STEP;
		}

		return values;
	}, [yMax]);
	const xScale = useMemo(() => scaleBand(xDomain, [0, CHART_WIDTH]), [xDomain]);
	const xStep = xScale.step();
	const yScale = useMemo(
		() => scaleLinear([0, yMax], [CHART_HEIGHT, 0]),
		[yMax],
	);
	const xTicks = useMemo(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		() => xDomain.map((d) => xScale(d)! + xStep / 2) as number[],
		[xDomain, xStep],
	);
	const yTicks = useMemo(() => yDomain.map((d) => yScale(d)), [yDomain]);

	const handleMouseLeave = useCallback(() => {
		setActiveColumn(-1);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent): void => {
			window.requestAnimationFrame(() => {
				if (
					!svgRef.current ||
					!rectRef.current ||
					rectRef.current !== e.target
				) {
					return;
				}

				const svgBox = svgRef.current.getBoundingClientRect();
				const rectBox = rectRef.current.getBoundingClientRect();
				const scale = TOTAL_WIDTH / svgBox.width;
				const x = (e.clientX - rectBox.x - MOUSE_OFFSET / 2) * scale;

				if (x < 0 || x > CHART_WIDTH) {
					return;
				}

				const closest = xTicks.reduce((prev, curr) => {
					return Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
				});
				const index = xTicks.indexOf(closest);

				setActiveColumn(index);
				setActiveRace(Math.min(index, limitX));
			});
		},
		[limitX, xTicks],
	);

	return (
		<div class="points-chart">
			<svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
				<XAxis xTicks={xTicks} races={races} />
				<YAxis yTicks={yTicks} yDomain={yDomain} />
				<Grid
					xTicks={xTicks}
					yTicks={yTicks}
					xStep={xStep}
					activeColumn={activeColumn}
				/>
				<DataPlot data={data} xTicks={xTicks} yScale={yScale} />
				<g
					class="mouse-over-effects"
					transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
				>
					<rect
						ref={rectRef}
						width={CHART_WIDTH + MOUSE_OFFSET}
						height={CHART_HEIGHT}
						transform={`translate(-${MOUSE_OFFSET / 2}, 0)`}
						fill="none"
						pointer-events="all"
						onMouseLeave={handleMouseLeave}
						onMouseMove={handleMouseMove}
					/>
				</g>
			</svg>
			<div class="points-legend">
				<div class="points-legend-race">
					Round {activeRace + 1}: {races[activeRace]}
				</div>
				<PointsTable
					legendLabel={legendLabel}
					data={data}
					activeRace={activeRace}
				/>
			</div>
		</div>
	);
}
