import get from 'just-safe-get';

import { createIndexMap, groupByAndMapValues } from '../utils';
import type { DriverStandings } from './DriverStandings';
import type { Races } from './Races';

export interface DriverChampionship {
	readonly driverChampionshipId: number;
	readonly year: number;
	readonly raceId: number;
	readonly driverId: number;
	readonly position: number;
}

export class DriverChampionships {
	protected data: ReadonlyArray<DriverChampionship> = [];

	protected driverChampionshipIdsToIndexMap: Record<number, number> = {};

	protected driverChampionshipIdsGroupedByDriverId: Record<
		number,
		ReadonlyArray<number>
	>;

	constructor(races: Races, driverStandings: DriverStandings) {
		let driverChampionshipId = 1;

		this.data = Object.entries(
			races.getRaceIdsForAllSeasons(),
		).flatMap<DriverChampionship>(([_season, raceIds]) => {
			// find the last race of the season
			const lastRaceId = raceIds.at(-1)!;
			const race = races.getRaceByRaceId(lastRaceId)!;
			const driverStandingsForLastRace =
				driverStandings.getDriverStandingsByRaceId(lastRaceId);

			return driverStandingsForLastRace.map<DriverChampionship>((standing) => {
				return {
					driverChampionshipId: driverChampionshipId++,
					driverId: standing.driverId,
					position: standing.position,
					raceId: lastRaceId,
					year: race.year,
				};
			});
		});

		this.driverChampionshipIdsToIndexMap = createIndexMap(
			this.data,
			'driverChampionshipId',
		);

		this.driverChampionshipIdsGroupedByDriverId = groupByAndMapValues(
			this.data,
			'driverId',
			(standing) => standing.driverChampionshipId,
		);
	}

	public getData(): ReadonlyArray<DriverChampionship> {
		return this.data;
	}

	public getDriverChampionshipByDriverId(
		driverId: number,
	): ReadonlyArray<DriverChampionship> {
		const championshipIds =
			this.driverChampionshipIdsGroupedByDriverId[driverId] || [];
		return championshipIds.map((championshipId) =>
			get(
				this.data,
				String(
					get(this.driverChampionshipIdsToIndexMap, String(championshipId)),
				),
			),
		);
	}
}
