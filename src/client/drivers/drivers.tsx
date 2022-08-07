import { h, type VNode } from 'preact';
import { useMemo } from 'preact/hooks';
import type { Driver } from 'helpers/data';
import { CharNav, CHARS } from 'components/CharNav';
import { useHashChange } from 'client/hooks/useHashChange';
import { Table } from 'components/Table';
import { Nationality } from 'components/Nationality';

function NationalityCell(props: Driver): VNode {
	return (
		<div class="flex-center-y">
			<Nationality nationality={props.nationality} />
			<span>{props.nationality}</span>
		</div>
	);
}

function championshipSorter(a: Driver, b: Driver, sortAsc: boolean): number {
	const wonA = (a.championshipStandings || []).filter((c) => c.position === 1);
	const wonB = (b.championshipStandings || []).filter((c) => c.position === 1);

	return sortAsc ? wonA.length - wonB.length : wonB.length - wonA.length;
}

function ChampionshipCell(props: Driver): VNode {
	const standings = props.championshipStandings || [];
	const won = standings.filter((c) => c.position === 1).map((c) => c.year);

	return won.length > 0 ? (
		<details>
			<summary>{won.length}</summary>
			{won.join(', ')}
		</details>
	) : (
		<span>0</span>
	);
}

function TotalLapsCell(props: Driver): VNode {
	return <span>{typeof props.totalLaps === 'number' ? props.totalLaps : 'n/a'}</span>;
}

function LapsLeadCell(props: Driver): VNode {
	return <span>{typeof props.lapsLead === 'number' ? props.lapsLead : 'n/a'}</span>;
}

function totalLapsSorter(a: Driver, b: Driver, sortAsc: boolean): number {
	if (typeof a.totalLaps === 'number' && typeof b.totalLaps === 'number') {
		return sortAsc ? a.totalLaps - b.totalLaps : b.totalLaps - a.totalLaps;
	}

	if (typeof a.totalLaps === 'number' && b.totalLaps === null) {
		return -1;
	}

	if (typeof b.totalLaps === 'number' && a.totalLaps === null) {
		return 1;
	}

	return 0;
}

function lapsLeadSorter(a: Driver, b: Driver, sortAsc: boolean): number {
	if (typeof a.lapsLead === 'number' && typeof b.lapsLead === 'number') {
		return sortAsc ? a.lapsLead - b.lapsLead : b.lapsLead - a.lapsLead;
	}

	if (typeof a.lapsLead === 'number' && b.lapsLead === null) {
		return -1;
	}

	if (typeof b.lapsLead === 'number' && a.lapsLead === null) {
		return 1;
	}

	return 0;
}

export interface DriversProps {
	drivers: Driver[];
	currentSeason: number;
	currentDrivers: string[];
}

export function Drivers(props: DriversProps): VNode {
	const { drivers, currentSeason, currentDrivers } = props;
	const hash = useHashChange();
	const [groupedData, driversRefsIndexMap] = useMemo(() => {
		const grouped: Record<string, string[]> = {};
		const map: Record<string, number> = {};
		drivers.forEach((driver, i) => {
			const key = driver.name.charAt(0).normalize('NFD').toUpperCase();

			if (!Array.isArray(grouped[key])) {
				grouped[key] = [];
			}

			grouped[key].push(driver.driverRef);
			map[driver.driverRef] = i;
		}, {} as Record<string, number[]>);

		return [grouped, map];
	}, [drivers]);
	const disabledChars = useMemo(() => {
		const charsToDisable = CHARS.slice(0);

		for (let i = 0; i < charsToDisable.length; i++) {
			if (charsToDisable[i] in groupedData) {
				charsToDisable.splice(i, 1);
				i--;
			}
		}

		return charsToDisable;
	}, [groupedData]);
	const tableData = useMemo(() => {
		const dataKey = hash.slice(0, 1);

		if (dataKey === '@') return drivers;

		const data = dataKey in groupedData ? groupedData[dataKey] : currentDrivers;

		return data.map((ref) => {
			const index = driversRefsIndexMap[ref];

			return drivers[index];
		});
	}, [hash, drivers, driversRefsIndexMap]);

	return (
		<div class="drivers-data">
			<CharNav
				currentSeason={currentSeason}
				active={hash.slice(0, 1)}
				disabledChars={disabledChars}
			/>
			<Table data={tableData} rowId="driverRef" stickyHeader="var(--char-nav-height)" fixedLayout>
				<Table.Column<Driver> id="name" title="Driver" render="name" sortBy="name" />
				<Table.Column<Driver>
					id="country"
					title="Nationality"
					render={NationalityCell}
					sortBy="nationality"
				/>
				<Table.Column<Driver>
					id="total-races"
					title="Total Races"
					render="totalRaces"
					align="right"
					sortBy="totalRaces"
				/>
				<Table.Column<Driver>
					id="races-won"
					title="Races Won"
					render="raceWins"
					align="right"
					sortBy="raceWins"
				/>
				<Table.Column<Driver>
					id="total-laps"
					title="Total Laps"
					render={TotalLapsCell}
					align="right"
					sorter={totalLapsSorter}
				/>
				<Table.Column<Driver>
					id="laps-lead"
					title="Laps Lead"
					render={LapsLeadCell}
					align="right"
					sorter={lapsLeadSorter}
				/>
				<Table.Column
					id="championships"
					title="Championships"
					align="right"
					render={ChampionshipCell}
					sorter={championshipSorter}
				/>
			</Table>
		</div>
	);
}
