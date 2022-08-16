import { h, type VNode } from 'preact';
import { useMemo } from 'preact/hooks';
import type { Constructor as OriginalConstructor } from 'helpers/data';
import { CharNav, CHARS } from 'components/CharNav';
import { useHashChange } from 'client/hooks/useHashChange';
import { Table } from 'components/Table';
import { Nationality } from 'components/Nationality';

export type Constructor = Pick<
	OriginalConstructor,
	| 'name'
	| 'nationality'
	| 'championshipStandings'
	| 'constructorRef'
	| 'podiums'
	| 'totalRaces'
	| 'raceWins'
>;

function NameCell(props: Constructor): VNode {
	return <a href={`/constructors/${props.constructorRef}`}>{props.name}</a>;
}

function NationalityCell(props: Constructor): VNode {
	return (
		<div class="flex-center-y">
			<Nationality nationality={props.nationality} />
			<span>{props.nationality}</span>
		</div>
	);
}

function championshipSorter(a: Constructor, b: Constructor, sortAsc: boolean): number {
	const wonA = (a.championshipStandings || []).filter((c) => c.position === 1);
	const wonB = (b.championshipStandings || []).filter((c) => c.position === 1);

	return sortAsc ? wonA.length - wonB.length : wonB.length - wonA.length;
}

function ChampionshipCell(props: Constructor): VNode {
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

export interface ConstructorsProps {
	constructors: Constructor[];
	currentSeason: number;
	currentConstructors: string[];
}

export function Constructors(props: ConstructorsProps): VNode {
	const { constructors, currentSeason, currentConstructors } = props;
	const hash = useHashChange();
	const [groupedData, constructorsRefsIndexMap] = useMemo(() => {
		const grouped: Record<string, string[]> = {};
		const map: Record<string, number> = {};
		constructors.forEach((con, i) => {
			const key = con.name.charAt(0).normalize('NFD').toUpperCase();

			if (!Array.isArray(grouped[key])) {
				grouped[key] = [];
			}

			grouped[key].push(con.constructorRef);
			map[con.constructorRef] = i;
		}, {} as Record<string, number[]>);

		return [grouped, map];
	}, [constructors]);

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

		if (dataKey === '@') return constructors;

		const data = dataKey in groupedData ? groupedData[dataKey] : currentConstructors;

		return data.map((ref) => {
			const index = constructorsRefsIndexMap[ref];

			return constructors[index];
		});
	}, [hash, constructors, constructorsRefsIndexMap]);

	return (
		<div class="drivers-data">
			<CharNav
				currentSeason={currentSeason}
				active={hash.slice(0, 1)}
				disabledChars={disabledChars}
			/>
			<Table
				data={tableData}
				rowId="constructorRef"
				stickyHeader="var(--char-nav-height)"
				fixedLayout
			>
				<Table.Column<Constructor> id="name" title="Constructor" render={NameCell} sortBy="name" />
				<Table.Column<Constructor>
					id="country"
					title="Nationality"
					render={NationalityCell}
					sortBy="nationality"
				/>
				<Table.Column<Constructor>
					id="total-races"
					title="Total Races"
					render="totalRaces"
					align="right"
					sortBy="totalRaces"
				/>
				<Table.Column<Constructor>
					id="races-won"
					title="Races Won"
					render="raceWins"
					align="right"
					sortBy="raceWins"
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
