import { h, type VNode } from 'preact';
import type { ScaleLinear } from 'd3-scale';

import { MARGIN, STROKE_WIDTH } from './common';
import type { ChartData } from 'pages/season/season.11ty';

export interface DataPlotProps {
	data: ChartData[];
	xTicks: number[];
	yScale: ScaleLinear<number, number, never>;
}

export function DataPlot(props: DataPlotProps): VNode {
	const { data, xTicks, yScale } = props;
	return (
		<g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
			{data.map((row, i) => {
				const points = row.data.reduce<Array<{ x: string; y: string }>>(
					(acc, curr, i) => {
						if (curr) {
							acc.push({
								x: xTicks[i].toFixed(2),
								y: yScale(curr.points).toFixed(2),
							});
						}

						return acc;
					},
					[],
				);

				const d = points.reduce(
					(acc, curr, i) =>
						i === 0 ? `M${curr.x},${curr.y}` : `${acc} L${curr.x},${curr.y}`,
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
	);
}
