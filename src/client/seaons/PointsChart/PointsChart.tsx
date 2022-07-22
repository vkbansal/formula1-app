import { h, type VNode } from 'preact';
import { useRef, useMemo, useState, useCallback } from 'preact/hooks';
import { scaleLinear, scaleBand } from 'helpers/chartUtils';
import type { Season, Round, DriverStanding, ConstructorStanding } from 'data/seasons/foo.yaml';

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
import { DataPlot, type ChartType } from './DataPlot';

type Point = DriverStanding & ConstructorStanding;

export interface PointsChartProps extends Season {
	type: ChartType;
}

export function PointsChart(props: PointsChartProps): VNode {
	const { rounds, type } = props;
	const dataKey: keyof Round = type === 'drivers' ? 'driverStandings' : 'constructorStandings';
	const limitX = useMemo(() => {
		const lastRoundWithNoPodiums = rounds.findIndex((round) => round.podium.length === 0);
		return lastRoundWithNoPodiums > -1 ? lastRoundWithNoPodiums : rounds.length;
	}, [rounds]);
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rectRef = useRef<SVGRectElement | null>(null);
	const [activeColumn, setActiveColumn] = useState(-1);
	const [activeRace, setActiveRace] = useState(limitX);

	const yMaxValue = useMemo(
		() =>
			Math.max(
				...rounds.flatMap((d) => (d[dataKey] as Point[]).filter(Boolean).map((r) => r.points)),
			),
		[rounds],
	);
	const yMax = useMemo(() => Math.ceil(yMaxValue / Y_STEP) * Y_STEP, [yMaxValue]);
	const xDomain = useMemo(() => rounds.map((_, i) => i), [rounds]);
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

				const closestIndex = xScale.ticks.findIndex((tick) => tick.start < x && x <= tick.end);

				setActiveColumn(closestIndex);
				setActiveRace(Math.min(closestIndex, limitX));
			});
		},
		[limitX, xScale],
	);

	return (
		<div class="points-chart">
			<svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
				<XAxis xTicks={xScale.ticks} rounds={rounds} />
				<YAxis yTicks={yTicks} yDomain={yDomain} />
				<Grid
					xTicks={xScale.ticks}
					yTicks={yTicks}
					xStep={xScale.step}
					activeColumn={activeColumn}
				/>
				<DataPlot {...props} xTicks={xScale.ticks} yScale={yScale} />
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
					Round {activeRace + 1}: {rounds[activeRace].name}
				</div>
				{/* <PointsTable legendLabel={legendLabel} data={data} activeRace={activeRace} /> */}
			</div>
		</div>
	);
}
