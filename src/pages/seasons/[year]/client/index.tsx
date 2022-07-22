import { h, Fragment, type VNode } from 'preact';

import type { SeasonRound } from 'queries/season-rounds.sql';
import type { SeasonDriver } from 'queries/season-drivers.sql';
import { Tabs, type Tab } from 'components/Tabs';
import { Table, type TableColumn } from 'components/Table';
import { Nationality } from 'components/Nationality';

// import { PointsChart } from './PointsChart/PointsChart';
import { useMemo } from 'preact/hooks';

// type ChartData = any;
export interface TableData extends Omit<SeasonRound, 'winnerDriver' | 'winnerConstructor'> {
	winner: {
		driver: SeasonDriver | null;
	};
}

// declare const racesData: TableData[];
// declare const driversData: ChartData[];
// declare const constructorsData: ChartData[];
// declare const lastestRoundWithResults: number;

export interface ClientProps {
	racesData: TableData[];
}

export function Client(props: ClientProps): VNode {
	const { racesData } = props;
	const tabs = useMemo(() => {
		// const races = racesData.map((r) => r.name);
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
							{row.winner.constructor ? <span>&nbsp;({row.winner.constructor.name})</span> : null}
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
				panelClass: 'races-table-tab',
			},
			{
				id: 'ds',
				title: 'Driver Standings',
				content: (
					<div />
					// <PointsChart
					// 	data={driversData}
					// 	races={races}
					// 	limitX={lastestRoundWithResults - 1}
					// 	legendLabel="Driver"
					// />
				),
			},
			{
				id: 'cs',
				title: 'Constructor Standings',
				content: (
					<div />
					// <PointsChart
					// 	data={constructorsData}
					// 	races={races}
					// 	limitX={lastestRoundWithResults - 1}
					// 	legendLabel="Constructor"
					// />
				),
			},
		];

		return tabs;
	}, [racesData]);

	return <Tabs tabs={tabs} />;
}
