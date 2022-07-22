import { h, type VNode } from 'preact';
import type { ScaleBand } from 'helpers/chartUtils';
import { CHART_HEIGHT, CHART_WIDTH, MARGIN } from './common';

export interface XAxisProps {
	scale: ScaleBand<string>;
	labels: string[];
}

export function XAxis(props: XAxisProps): VNode {
	const { labels, scale } = props;

	return (
		<g
			class="bottom-axis"
			transform={`translate(${MARGIN.left}, ${CHART_HEIGHT + MARGIN.top})`}
			font-size="9"
			text-anchor="end"
		>
			{labels.map((label, i) => {
				const band = scale(label);
				return (
					<g class="tick tick-x" key={i} transform={`translate(${band.mid}, 0)`}>
						<line
							fill="none"
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke="currentColor"
							stoke-width="1"
							x1="0"
							x2="0"
							y1="0"
							y2="6"
						/>
						<text x="0" y="16" fill="currentColor" dx="-3" transform="rotate(-36)">
							{label}
						</text>
					</g>
				);
			})}
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
	);
}

export interface YAxisProps {
	yTicks: number[];
	yDomain: number[];
}

export function YAxis(props: YAxisProps): VNode {
	const { yDomain, yTicks } = props;

	return (
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
	);
}
