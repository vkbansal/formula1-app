import { h, type VNode } from 'preact';
import { useRef, useMemo, useState, useCallback } from 'preact/hooks';
import { scalePoint, scaleLinear } from 'd3-scale';

import { Table, type TableColumn } from 'client/components/Table';
import { formatOrdinals } from 'helpers/utils';
import type { ChartData, ChartPoint } from '../season.11ty';

const MARGIN = { top: 30, right: 30, bottom: 100, left: 50 };
const TOTAL_WIDTH = 900;
const TOTAL_HEIGHT = 600;
const CHART_WIDTH = TOTAL_WIDTH - MARGIN.left - MARGIN.right;
const CHART_HEIGHT = TOTAL_HEIGHT - MARGIN.top - MARGIN.bottom;
const STROKE_WIDTH = 3;
const Y_STEP = 20;
const MOUSE_OFFSET = 20;

const getLegendColumns = (label: string): TableColumn<LegendsData>[] => [
	{
		id: 'ps',
		title: 'Position',
		data: (d) => formatOrdinals(d.data.ps),
	},
	{
		id: 'd',
		title: label,
		data: (d) => d.label,
	},
	{
		id: 'pt',
		title: 'Points',
		data: (d) => d.data.pt,
	},
	{
		id: 'w',
		title: 'Wins',
		data: (d) => d.data.w,
	},
];

export interface PointsChartData {
	data: ChartData[];
	races: string[];
	limitX: number;
	legendLabel: string;
}

export interface LegendsData extends Omit<ChartData, 'data'> {
	data: ChartPoint;
}

export function PointsChart(props: PointsChartData): VNode {
	const { data, races, limitX, legendLabel } = props;
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rectRef = useRef<SVGRectElement | null>(null);
	const [mouseLineX, setMouseLineX] = useState(0);
	const [activeRace, setActiveRace] = useState(limitX);
	// const [selectedPoint, setSelectedPoint] = useState(-1);
	const [showMouseLine, setShowMouseLine] = useState(false);

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
	const yMax = useMemo(() => Math.ceil(yMaxValue / 10) * 10, [yMaxValue]);
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
	const xScale = useMemo(
		() => scalePoint(xDomain, [0, CHART_WIDTH]),
		[xDomain],
	);
	const yScale = useMemo(
		() => scaleLinear([0, yMax], [CHART_HEIGHT, 0]),
		[yMax],
	);
	const xTicks = useMemo(
		() => xDomain.map((d) => xScale(d)) as number[],
		[xDomain],
	);
	const yTicks = useMemo(() => yDomain.map((d) => yScale(d)), [yDomain]);
	const legendsData = useMemo(() => {
		if (activeRace === -1) {
			return [];
		}

		return data
			.map<LegendsData>((row) => {
				const race = row.data[activeRace];

				return {
					...row,
					data: race || { ps: Infinity, pt: 0, w: 0 },
				};
			})
			.sort((a, b) => a.data.ps - b.data.ps);
	}, [activeRace, data]);

	const legendColumns = useMemo(
		() => getLegendColumns(legendLabel),
		[legendLabel],
	);

	const handleMouseOut = useCallback(() => {
		setShowMouseLine(false);
		setActiveRace(limitX);
	}, [limitX]);

	const handleMouseEnter = useCallback(() => {
		setShowMouseLine(true);
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

				setMouseLineX(closest);
				setActiveRace(Math.min(xTicks.indexOf(closest), limitX));
			});
		},
		[limitX, xTicks],
	);

	return (
		<div class="points-chart">
			<svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
				<g
					class="bottom-axis"
					transform={`translate(${MARGIN.left}, ${CHART_HEIGHT + MARGIN.top})`}
					font-size="9"
					text-anchor="end"
				>
					{xTicks.map((x, i) => (
						<g class="tick tick-x" transform={`translate(${x}, 0)`}>
							<line
								fill="none"
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke="currentColor"
								stoke-width="1"
								y2="6"
							/>
							<text y="16" fill="currentColor" dx="-3" transform="rotate(-36)">
								{races[i]}
							</text>
						</g>
					))}
					<line
						fill="none"
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke="currentColor"
						stoke-width="1"
						x1="0"
						x2={CHART_WIDTH}
					/>
				</g>
				<g
					class="left-axis"
					transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
					font-size="9"
					text-anchor="end"
				>
					{yTicks.map((y, i) => (
						<g class="tick tick-y" transform={`translate(0, ${y})`}>
							<line
								fill="none"
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke="currentColor"
								stoke-width="1"
								x2="-6"
							/>
							<text x="-9" fill="currentColor" dy="0.32em">
								{yDomain[i]}
							</text>
						</g>
					))}
					<line
						fill="none"
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke="currentColor"
						stoke-width="1"
						y1="0"
						y2={CHART_HEIGHT}
					/>
				</g>
				<g class="grid" transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
					{xTicks.map((x) => (
						<line
							class="grid-line-x"
							fill="none"
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke="currentColor"
							stoke-width="1"
							style="opacity: 0.2"
							x1={x}
							y1="0"
							x2={x}
							y2={CHART_HEIGHT}
						/>
					))}
					{yTicks.map((y) => (
						<line
							class="grid-line-y"
							fill="none"
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke="currentColor"
							stoke-width="1"
							style="opacity: 0.2"
							x1="0"
							y1={y}
							x2={CHART_WIDTH}
							y2={y}
						/>
					))}
				</g>
				<g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
					{data.map((row, i) => {
						const points = row.data.reduce<Array<{ x: string; y: string }>>(
							(acc, curr, i) => {
								if (curr) {
									acc.push({
										x: xTicks[i].toFixed(2),
										y: yScale(curr.pt).toFixed(2),
									});
								}

								return acc;
							},
							[],
						);

						const d = points.reduce(
							(acc, curr, i) =>
								i === 0
									? `M${curr.x},${curr.y}`
									: `${acc} L${curr.x},${curr.y}`,
							'',
						);

						return (
							<g
								class="line-group"
								key={i}
								// onMouseEnter={(): void => setSelectedPoint(i)}
							>
								<path
									fill="none"
									stroke-linejoin="round"
									stroke-linecap="round"
									stroke={row.color}
									stroke-width={STROKE_WIDTH}
									d={d}
								/>
								{points.map(({ x, y }) => (
									<circle
										cx={x}
										cy={y}
										r={STROKE_WIDTH}
										stroke={row.color}
										stroke-width="1"
										fill={row.color}
									/>
								))}
							</g>
						);
					})}
				</g>
				<g
					class="mouse-over-effects"
					transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
				>
					<line
						class="mouse-line"
						stroke="currentColor"
						x1={mouseLineX.toFixed(2)}
						x2={mouseLineX.toFixed(2)}
						y1="0"
						y2={CHART_HEIGHT}
						style={`opacity:${showMouseLine ? '1' : '0'}`}
					/>
					<rect
						ref={rectRef}
						width={CHART_WIDTH + MOUSE_OFFSET}
						height={CHART_HEIGHT}
						transform={`translate(-${MOUSE_OFFSET / 2}, 0)`}
						fill="none"
						pointer-events="all"
						onMouseEnter={handleMouseEnter}
						onMouseOut={handleMouseOut}
						onMouseMove={handleMouseMove}
					/>
				</g>
			</svg>
			<div class="points-legend">
				<div class="points-legend-race">
					Round {activeRace + 1}: {races[activeRace]}
				</div>
				<Table data={legendsData} columns={legendColumns} rowId="id" small />
			</div>
		</div>
	);
}
