import { h, type VNode } from 'preact';
import { useMemo } from 'preact/hooks';

import type {
	Season,
	Driver,
	Constructor,
	DriverStanding,
	ConstructorStanding,
} from 'data/seasons/foo.yaml';
import type { Band, ScaleLinear } from 'helpers/chartUtils';
import { MARGIN, STROKE_WIDTH } from './common';

export type ChartType = 'drivers' | 'constructors';

export interface ChartData {
	ref: string;
	data: Array<{ position: number; points: number; wins: number } | null>;
}

export interface DataPlotProps extends Season {
	type: ChartType;
	xTicks: Band[];
	yScale: ScaleLinear;
}

export function DataPlot(props: DataPlotProps): VNode {
	const { rounds, drivers, constructors, type, xTicks, yScale } = props;

	const chartData = useMemo(() => {
		function mapper(row: Driver | Constructor): ChartData {
			const refKey = type === 'drivers' ? 'driverRef' : 'constructorRef';
			const ref = (row as any)[refKey];
			const data = rounds.map((round): ChartData['data'][number] => {
				const source: Array<DriverStanding | ConstructorStanding> =
					type === 'drivers' ? round.driverStandings : round.constructorStandings;
				const result = source.find((d) => (d as any)[refKey] === ref);

				return result || null;
			});

			return { ref, data };
		}

		return type === 'drivers' ? drivers.map(mapper) : constructors.map(mapper);
	}, [rounds, drivers, constructors, type]);

	return (
		<g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
			{chartData.map((row, i) => {
				const points = row.data.reduce<Array<{ x: string; y: string }>>((acc, curr, i) => {
					if (curr) {
						acc.push({
							x: xTicks[i].start.toFixed(2),
							y: yScale(curr.points).toFixed(2),
						});
					}

					return acc;
				}, []);

				const d = points.reduce(
					(acc, curr, i) => (i === 0 ? `M${curr.x},${curr.y}` : `${acc} L${curr.x},${curr.y}`),
					'',
				);
				const color = `var(--${type}-color-${row.ref})`;

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
