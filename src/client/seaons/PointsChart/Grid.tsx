import { h, Fragment, type VNode } from 'preact';
import type { ScaleBand } from 'helpers/chartUtils';

import { CHART_HEIGHT, CHART_WIDTH, MARGIN } from './common';

export interface GridProps {
	xScale: ScaleBand<string>;
	yTicks: number[];
	activeColumn: number;
}

export function Grid(props: GridProps): VNode {
	const { xScale, yTicks, activeColumn } = props;

	return (
		<g class="grid" transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
			{xScale.ticks().map((xTick, i) => {
				return (
					<Fragment>
						<rect
							fill="currentColor"
							style={`opacity: ${activeColumn === i ? 0.1 : 0} `}
							class="grid-bar-x"
							x={xTick.start}
							y="0"
							width={xScale.step()}
							height={CHART_HEIGHT}
						/>
						<line
							class="grid-line-x"
							fill="none"
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke="currentColor"
							stoke-width="1"
							style="opacity: 0.2"
							x1={xTick.end}
							y1="0"
							x2={xTick.end}
							y2={CHART_HEIGHT}
						/>
					</Fragment>
				);
			})}
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
	);
}
