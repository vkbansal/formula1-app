import 'preact/debug';
import { h, Fragment, type VNode } from 'preact';

import { Tabs } from 'components/Tabs';
import { Table } from 'components/Table';
import { Nationality } from 'components/Nationality';
import type { Round, Driver, Constructor } from 'data/seasons/1950.yaml';
import { PointsChart } from './PointsChart/PointsChart';
import { useMemo } from 'preact/hooks';
import type { ChartData, ChartPoint } from './PointsChart/common';

function CircuitCell(props: Round): VNode {
	return (
		<Fragment>
			<span>{props.circuit.name}</span>&nbsp;
			<span class="text-lighter text-scale-80">
				{props.circuit.location}, {props.circuit.country}
			</span>
		</Fragment>
	);
}

function WinnerCell(props: Round & Omit<ClientProps, 'rounds'>): VNode | null {
	const driver = props.podium[0]
		? props.drivers.find((driver) => driver.driverRef === props.podium[0].driverRef)
		: null;
	const constructor = props.podium[0]
		? props.constructors.find((c) => c.constructorRef === props.podium[0].constructorRef)
		: null;

	if (!driver) return null;

	return (
		<Fragment>
			<Nationality nationality={driver.nationality} />
			<span>{driver.name}</span>
			{constructor ? <span>&nbsp;({constructor.name})</span> : null}
		</Fragment>
	);
}

export interface ClientProps {
	rounds: Round[];
	drivers: Driver[];
	constructors: Constructor[];
}

export function SeasonsClient(props: ClientProps): VNode {
	const { rounds, drivers, constructors } = props;
	const driversChartData = useMemo((): ChartData[] => {
		return drivers.map((driver) => {
			const data = rounds.map((round): ChartPoint | null => {
				const result = round.driverStandings.find((d) => d.driverRef === driver.driverRef);
				const podium = round.podium.find((d) => d.driverRef === driver.driverRef);

				return result
					? {
							points: result.points,
							position: result.position,
							wins: result.wins,
							podium: podium ? podium.position : null,
					  }
					: null;
			});

			return {
				id: driver.driverRef,
				label: driver.name,
				data,
			};
		});
	}, [rounds, drivers]);

	const constructorsChartData = useMemo((): ChartData[] => {
		return constructors.map((constructor_) => {
			const data = rounds.map((round): ChartPoint | null => {
				const result = round.constructorStandings.find(
					(c) => c.constructorRef === constructor_.constructorRef,
				);
				const podium = round.podium.find((c) => c.driverRef === constructor_.constructorRef);

				return result
					? {
							points: result.points,
							position: result.position,
							wins: result.wins,
							podium: podium ? podium.position : null,
					  }
					: null;
			});

			return {
				id: constructor_.constructorRef,
				label: constructor_.name,
				data,
			};
		});
	}, [rounds, constructors]);

	const lastCompletedRound = useMemo(() => {
		const lastRoundWithNoPodiums = rounds.findIndex((round) => round.podium.length === 0) - 1;
		return lastRoundWithNoPodiums > -1 ? lastRoundWithNoPodiums : rounds.length - 1;
	}, [rounds]);

	const chartLabels = useMemo(() => rounds.map((r) => r.name), [rounds]);

	return (
		<Tabs defaultActiveTab={1}>
			<Tabs.Panel id="r" title="Races" class="races-table-panel">
				<Table data={rounds} rowId="raceId">
					<Table.Column<Round> id="round" title="Round" render="round" />
					<Table.Column<Round> id="race" title="Race" render="name" />
					<Table.Column<Round> id="date" title="Date" render="date" />
					<Table.Column<Round> id="circuit" title="Circuit" render={CircuitCell} />
					<Table.Column<Round, Omit<ClientProps, 'rounds'>>
						id="winner"
						title="Winner"
						render={WinnerCell}
						extraProps={{ drivers, constructors }}
					/>
				</Table>
			</Tabs.Panel>
			<Tabs.Panel id="ds" title="Driver Standings">
				<PointsChart
					data={driversChartData}
					lastCompletedRound={lastCompletedRound}
					labels={chartLabels}
					legendLabel="Driver"
				/>
			</Tabs.Panel>
			<Tabs.Panel id="cs" title="Constructor Standings">
				<PointsChart
					data={constructorsChartData}
					lastCompletedRound={lastCompletedRound}
					labels={chartLabels}
					legendLabel="Constructor"
				/>
			</Tabs.Panel>
		</Tabs>
	);
}
