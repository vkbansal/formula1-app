import { groupByAndMapValues, uniqWith } from '../utils';
import type { Races } from './Races';
import type { Results } from './Results';

export interface Team {
	constructorId: number;
	driverId: number;
	year: number;
}

export class Teams {
	private data: ReadonlyArray<Team> = [];

	private teamsBySeason: Readonly<Record<number, ReadonlyArray<Team>>> = {};

	constructor(results: Results, races: Races) {
		const allData = results.getData().map<Team>((result) => {
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

	getData(): ReadonlyArray<Team> {
		return this.data;
	}

	getTeamsBySeason(season: number): ReadonlyArray<Team> {
		return this.teamsBySeason[season] || [];
	}
}
