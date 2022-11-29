import { h, Fragment, type VNode } from 'preact';
import { Table } from 'components/Table';
import { Nationality } from 'components/Nationality';
import type { Round, SeasonDriver, SeasonConstructor } from 'helpers/data';

function CircuitCell(props: DataRow): VNode {
	return (
		<Fragment>
			<span>{props.circuit.name}</span>&nbsp;
			<span class="text-lighter text-scale-80">
				{props.circuit.location}, {props.circuit.country}
			</span>
		</Fragment>
	);
}

function WinnerCell(props: DataRow): VNode | null {
	const { driver, constructor } = props.winner;

	if (!driver) return null;

	return (
		<Fragment>
			<Nationality nationality={driver.nationality} />
			<a href={`/drivers/${driver.driverRef}`}>{driver.name}</a>
			{constructor ? <span>&nbsp;({constructor.name})</span> : null}
		</Fragment>
	);
}

export type DataRow = Omit<Round, 'driverStandings' | 'constructorStandings' | 'podium'> & {
	winner: {
		driver?: SeasonDriver;
		constructor?: SeasonConstructor;
	};
};

export interface RacesTableProps {
	data: DataRow[];
}

export function RacesTable(props: RacesTableProps): VNode {
	const { data } = props;
	return (
		<Table data={data} rowId="raceId">
			<Table.Column<Round> id="round" title="Round" render="round" />
			<Table.Column<Round> id="race" title="Race" render="name" />
			<Table.Column<Round> id="date" title="Date" render="date" />
			<Table.Column<Round> id="circuit" title="Circuit" render={CircuitCell} />
			<Table.Column<Round> id="winner" title="Winner" render={WinnerCell} />
		</Table>
	);
}
