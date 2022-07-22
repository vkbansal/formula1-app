import { h, type VNode } from 'preact';
import { useMemo } from 'preact/hooks';

import trophySvg from 'images/trophy.svg?raw';
import { Table } from 'components/Table';
import { formatOrdinals } from 'helpers/utils';
import type { ChartData, ChartPoint } from './common';

export interface LegendsData extends Omit<ChartData, 'data'>, ChartPoint {
	gain: number;
}

export interface PointsTableProps {
	legendLabel: string;
	data: ChartData[];
	activeRace: number;
}

function PositionCell(props: LegendsData): VNode {
	return (
		<div class="points-legend-position">
			<span>{props.position === Infinity ? '-' : formatOrdinals(props.position)}</span>
			{props.gain !== 0 ? (
				<span class="points-legend-position-gain">
					{props.gain / Math.abs(props.gain) === 1 ? (
						<span class="gain-up">▲</span>
					) : (
						<span class="gain-down">▼</span>
					)}
					<span>{Math.abs(props.gain)}</span>
				</span>
			) : null}
		</div>
	);
}

function LabelCell(props: LegendsData): VNode {
	return (
		<div class="points-legend-label">
			<span
				class="points-legend-label-color"
				style={{ '--legend-color': `var(--chart-color-${props.id})` }}
			>
				{props.label}
			</span>
			{props.podium ? (
				<span
					class={`trophy trophy-${props.podium}`}
					dangerouslySetInnerHTML={{ __html: trophySvg }}
				/>
			) : null}
		</div>
	);
}

// const getLegendColumns = (label: string): TableColumnProps<LegendsData>[] => [
// 	{
// 		id: 'ps',
// 		title: 'Position',
// 		data: (d) => (
//
// 		),
// 	},
// 	{
// 		id: 'd',
// 		title: label,
// 		data: (d) => (

// 		),
// 	},
// 	{
// 		id: 'pt',
// 		title: 'Points',
// 		data: 'points',
// 	},
// 	{
// 		id: 'w',
// 		title: 'Wins',
// 		data: 'wins',
// 	},
// ];

export function PointsTable(props: PointsTableProps): VNode {
	const { legendLabel, data, activeRace } = props;
	const legendsData = useMemo(() => {
		if (activeRace === -1) {
			return [];
		}

		return data
			.map<LegendsData>((row) => {
				const race = row.data[activeRace];
				const prevRace = row.data[activeRace - 1];

				return {
					id: row.id,
					label: row.label,
					...(race || { position: Infinity, points: 0, wins: 0, podium: null }),
					gain: prevRace && race ? prevRace.position - race.position : 0,
				};
			})
			.sort((a, b) => a.position - b.position);
	}, [activeRace, data]);

	return (
		<Table data={legendsData} rowId="id" small>
			<Table.Column<LegendsData> id="ps" title="Position" render={PositionCell} />
			<Table.Column<LegendsData> id="d" title={legendLabel} render={LabelCell} />
			<Table.Column<LegendsData> id="pt" title="Points" render="points" align="right" />
			<Table.Column<LegendsData> id="pt" title="Wins" render="wins" align="right" />
		</Table>
	);
}
