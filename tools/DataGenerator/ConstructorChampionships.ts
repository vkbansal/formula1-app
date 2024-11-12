import get from 'just-safe-get';

import { createIndexMap, groupByAndMapValues } from '../utils';
import type { ConstructorStandings } from './ConstructorStandings';
import type { Races } from './Races';

export interface ConstructorChampionship {
	readonly constructorChampionshipId: number;
	readonly year: number;
	readonly raceId: number;
	readonly constructorId: number;
	readonly position: number;
}

export class ConstructorChampionships {
	protected data: ReadonlyArray<ConstructorChampionship> = [];

	protected constructorChampionshipIdsToIndexMap: Record<number, number> = {};

	protected constructorChampionshipIdsGroupedByConstructorId: Record<
		number,
		ReadonlyArray<number>
	>;

	constructor(races: Races, constructorStandings: ConstructorStandings) {
		let constructorChampionshipId = 1;

		this.data = Object.entries(
			races.getRaceIdsForAllSeasons(),
		).flatMap<ConstructorChampionship>(([season, raceIds]) => {
			// find the last race of the season
			const lastRaceId = raceIds.at(-1)!;
			const year = parseInt(season, 10);
			const constructorStandingsForLastRace =
				constructorStandings.getConstructorStandingsByRaceId(lastRaceId);

			return constructorStandingsForLastRace.map<ConstructorChampionship>(
				(standing) => {
					return {
						constructorChampionshipId: constructorChampionshipId++,
						constructorId: standing.constructorId,
						position: standing.position,
						raceId: lastRaceId,
						year,
					};
				},
			);
		});

		this.constructorChampionshipIdsToIndexMap = createIndexMap(
			this.data,
			'constructorChampionshipId',
		);

		this.constructorChampionshipIdsGroupedByConstructorId = groupByAndMapValues(
			this.data,
			'constructorId',
			(standing) => standing.constructorChampionshipId,
		);
	}

	public getData(): ReadonlyArray<ConstructorChampionship> {
		return this.data;
	}

	public getConstructorChampionshipByConstructorId(
		constructorId: number,
	): ReadonlyArray<ConstructorChampionship> {
		const championshipIds =
			this.constructorChampionshipIdsGroupedByConstructorId[constructorId] ||
			[];

		return championshipIds.map((championshipId) =>
			get(
				this.data,
				String(
					get(
						this.constructorChampionshipIdsToIndexMap,
						String(championshipId),
					),
				),
			),
		);
	}
}
