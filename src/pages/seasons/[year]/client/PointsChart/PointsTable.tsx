import { h, type VNode } from 'preact';
import { useMemo } from 'preact/hooks';

// import type { ChartData, ChartPoint } from 'pages/season/season.11ty';
import { Table, type TableColumn } from 'components/Table';
import { formatOrdinals } from 'helpers/utils';

const getLegendColumns = (label: string): TableColumn<LegendsData>[] => [
	{
		id: 'ps',
		title: 'Position',
		data: (d) => (
			<div class="points-legend-position">
				<span>{d.position === Infinity ? '-' : formatOrdinals(d.position)}</span>
				{d.gain ? <span data-gain={d.gain / Math.abs(d.gain)}>{Math.abs(d.gain)}</span> : null}
			</div>
		),
	},
	{
		id: 'd',
		title: label,
		data: (d) => (
			<div class="points-legend-label" style={{ '--legend-color': d.color }}>
				{d.label}
			</div>
		),
	},
	{
		id: 'pt',
		title: 'Points',
		data: 'points',
	},
	{
		id: 'w',
		title: 'Wins',
		data: 'wins',
	},
];

export interface LegendsData extends Omit<ChartData, 'data'>, ChartPoint {
	gain: number | null;
}

export interface PointsTableProps {
	legendLabel: string;
	data: ChartData[];
	activeRace: number;
}

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
					color: row.color,
					...(race || { position: Infinity, points: 0, wins: 0 }),
					gain: prevRace && race ? prevRace.position - race.position : null,
				};
			})
			.sort((a, b) => a.position - b.position);
	}, [activeRace, data]);

	const legendColumns = useMemo(() => getLegendColumns(legendLabel), [legendLabel]);

	return <Table data={legendsData} columns={legendColumns} rowId="id" small />;
}
