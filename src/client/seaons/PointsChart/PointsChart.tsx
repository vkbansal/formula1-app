import { h, type VNode } from 'preact';
import { useRef, useMemo, useState, useCallback } from 'preact/hooks';
import { scaleLinear, scaleBand } from 'helpers/chartUtils';

import { PointsTable } from './PointsTable';
import {
	type ChartPoint,
	type ChartData,
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

export interface PointsChartProps {
	data: ChartData[];
	lastCompletedRound: number;
	labels: string[];
	legendLabel: string;
}

export function PointsChart(props: PointsChartProps): VNode {
	const { data, lastCompletedRound, labels, legendLabel } = props;
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rectRef = useRef<SVGRectElement | null>(null);
	const [activeColumn, setActiveColumn] = useState(-1);
	const [activeRace, setActiveRace] = useState(lastCompletedRound);
	const yMaxValue = useMemo(
		() =>
			Math.max(
				...data.flatMap((d) => (d.data.filter(Boolean) as ChartPoint[]).map((r) => r.points)),
			),
		[data],
	);
	const yMax = useMemo(() => {
		const max = Math.ceil(yMaxValue / Y_STEP) * Y_STEP;
		const remainder = (max - yMaxValue) % Y_STEP;

		return remainder < Y_STEP / 2 ? max + Y_STEP : max;
	}, [yMaxValue]);
	const yDomain = useMemo(() => {
		const values: number[] = [];

		let y = 0;

		while (y <= yMax) {
			values.push(y);
			y += Y_STEP;
		}

		return values;
	}, [yMax]);
	const xScale = useMemo(() => scaleBand(labels, [0, CHART_WIDTH]), [labels]);
	const yScale = useMemo(() => scaleLinear([0, yMax], [CHART_HEIGHT, 0]), [yMax]);
	const yTicks = useMemo(() => yDomain.map((d) => yScale(d)), [yDomain]);

	const handleMouseLeave = useCallback(() => {
		setActiveColumn(-1);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent): void => {
			window.requestAnimationFrame(() => {
				if (!svgRef.current || !rectRef.current || rectRef.current !== e.target) {
					return;
				}

				const svgBox = svgRef.current.getBoundingClientRect();
				const rectBox = rectRef.current.getBoundingClientRect();
				const scale = TOTAL_WIDTH / svgBox.width;
				const x = (e.clientX - rectBox.x - MOUSE_OFFSET / 2) * scale;

				if (x < 0 || x > CHART_WIDTH) {
					return;
				}

				const closestIndex = xScale.ticks().findIndex((tick) => tick.start < x && x <= tick.end);

				setActiveColumn(closestIndex);
				setActiveRace(Math.min(closestIndex, lastCompletedRound));
			});
		},
		[lastCompletedRound, xScale],
	);

	return (
		<div class="points-chart">
			<svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
				<XAxis scale={xScale} labels={labels} />
				<YAxis yTicks={yTicks} yDomain={yDomain} />
				<Grid xScale={xScale} yTicks={yTicks} activeColumn={activeColumn} />
				<DataPlot data={data} xScale={xScale} yScale={yScale} />
				<g class="mouse-over-effects" transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
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
				<div class="h4">
					Round {activeRace + 1}: {labels[activeRace]}
				</div>
				<PointsTable legendLabel={legendLabel} data={data} activeRace={activeRace} />
			</div>
		</div>
	);
}