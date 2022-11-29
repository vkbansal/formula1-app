import { h, type VNode } from 'preact';

import type { ScaleBand, ScaleLinear } from 'helpers/chartUtils';
import { type ChartData, MARGIN, STROKE_WIDTH } from './common';

export type ChartType = 'drivers' | 'constructors';

export interface DataPlotProps {
	data: ChartData[];
	xScale: ScaleBand<string>;
	yScale: ScaleLinear;
}

export function DataPlot(props: DataPlotProps): VNode {
	const { data, xScale, yScale } = props;
	const xTicks = xScale.ticks();

	return (
		<g class="data" transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
			{data.map((row, i) => {
				const points = row.data.reduce<Array<{ x: string; y: string }>>((acc, curr, i) => {
					if (curr) {
						acc.push({
							x: xTicks[i].mid.toFixed(2),
							y: yScale(curr.points).toFixed(2),
						});
					}

					return acc;
				}, []);

				const d = points.reduce(
					(acc, curr, i) => (i === 0 ? `M${curr.x},${curr.y}` : `${acc} L${curr.x},${curr.y}`),
					'',
				);
				const color = `var(--chart-color-${row.id})`;

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
							stroke={color}
							stroke-width={STROKE_WIDTH}
							d={d}
						/>
						{points.map(({ x, y }) => (
							<circle cx={x} cy={y} r={STROKE_WIDTH} stroke={color} stroke-width="1" fill={color} />
						))}
					</g>
				);
			})}
		</g>
	);
}
