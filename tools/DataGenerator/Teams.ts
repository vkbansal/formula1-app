import type { Races } from './Races';
import type { Results } from './Results';
import { groupByAndMapValues, uniqWith } from '../utils';

export interface ITeam {
	constructorId: number;
	driverId: number;
	year: number;
}

export class Teams {
	private data: ReadonlyArray<ITeam> = [];

	private teamsBySeason: Readonly<Record<number, ReadonlyArray<ITeam>>> = {};

	constructor(results: Results, races: Races) {
		const allData = results.getData().map<ITeam>((result) => {
			const race = races.getRaceByRaceId(result.raceId)!;

			return {
				constructorId: result.constructorId,
				driverId: result.driverId,
				year: race.year,
			};
		});

		this.data = uniqWith(
			allData,
			(a, b) =>
				a.constructorId === b.constructorId &&
				a.driverId === b.driverId &&
				a.year === b.year,
		);

		this.teamsBySeason = groupByAndMapValues(this.data, 'year', (val) => val);
	}

	getData(): ReadonlyArray<ITeam> {
		return this.data;
	}

	getTeamsBySeason(season: number): ReadonlyArray<ITeam> {
		return this.teamsBySeason[season] || [];
	}
}
