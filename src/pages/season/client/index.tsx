import { h, Fragment, render } from 'preact';

import { Tabs, type Tab } from 'client/components/Tabs';
import { Table, type TableColumn } from 'client/components/Table';
import { Nationality } from 'client/components/Nationality';

import type { ChartData, TableData } from '../season.11ty';
import { PointsChart } from './PointsChart';

declare const racesData: TableData[];
declare const driversData: ChartData[];
declare const constructorsData: ChartData[];
declare const lastestRoundWithResults: number;

const races = racesData.map((r) => r.name);
const tableColums: TableColumn<TableData>[] = [
	{ id: 'round', title: 'Round', data: 'round' },
	{ id: 'race', title: 'Race', data: 'name' },
	{
		id: 'circuit',
		title: 'Circuit',
		data: (row) => (
			<Fragment>
				<span>{row.circuit.name}</span>&nbsp;
				<span class="circuit-location-cell">
					{row.circuit.location}, {row.circuit.country}
				</span>
			</Fragment>
		),
	},
	{ id: 'date', title: 'Date', data: 'date' },
	{
		id: 'winner',
		title: 'Winner',
		data: (row) =>
			row.winner.driver ? (
				<Fragment>
					<Nationality nationality={row.winner.driver.nationality} />
					<span>{row.winner.driver.name}</span>
					{row.winner.constructor ? (
						<span>&nbsp;({row.winner.constructor.name})</span>
					) : null}
				</Fragment>
			) : (
				''
			),
	},
];

const tabs: Tab[] = [
	{
		id: 'r',
		title: 'Races',
		content: <Table data={racesData} columns={tableColums} rowId="raceId" />,
	},
	{
		id: 'ds',
		title: 'Driver Standings',
		content: (
			<PointsChart
				data={driversData}
				races={races}
				limitX={lastestRoundWithResults - 1}
				legendLabel="Driver"
			/>
		),
	},
	{
		id: 'cs',
		title: 'Constructor Standings',
		content: (
			<PointsChart
				data={constructorsData}
				races={races}
				limitX={lastestRoundWithResults - 1}
				legendLabel="Constructor"
			/>
		),
	},
];

const target = document.getElementById('tabs-target');

if (target) {
	render(<Tabs defaultActiveTab="ds" tabs={tabs} />, target);
}
