import { Fragment, h, render, type VNode } from 'preact';
import type { DriverData } from 'pages/drivers/drivers.11ty';
import { Table, type SortableTableColumn } from 'client/components/Table';
import { Nationality } from 'client/components/Nationality';

// declare const currentSeason: number;
// declare const allDrivers: Record<'string', DriverData[]>;
declare const currentDrivers: DriverData[];

const columns: SortableTableColumn<DriverData>[] = [
	{
		id: 'name',
		title: 'Name',
		data: 'name',
	},
	{
		id: 'nationality',
		title: 'Nationality',
		data: (row) => (
			<Fragment>
				<Nationality nationality={row.nationality} />
				<span>{row.nationality}</span>
			</Fragment>
		),
		sorter: 'nationality',
	},
	{
		id: 'total',
		title: 'Total Races',
		data: 'totalRaces',
		align: 'right',
	},
	{
		id: 'wins',
		title: 'Race Wins',
		data: 'raceWins',
		align: 'right',
	},
	{
		id: 'w',
		title: 'Win%',
		data: (data) => `${data.winPct.toFixed(2)}%`,
		align: 'right',
		sorter: 'winPct',
	},
	{
		id: 'championships',
		title: 'Drivers Chanmpionships',
		data: 'championships',
		align: 'right',
	},
];

function DriversData(): VNode {
	return (
		<Fragment>
			<Table
				sortable
				data={currentDrivers}
				columns={columns}
				rowId="driverRef"
			/>
		</Fragment>
	);
}

const target = document.getElementById('table-target');

if (target) {
	render(<DriversData />, target);
}
