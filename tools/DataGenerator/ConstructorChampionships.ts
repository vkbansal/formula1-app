import get from 'just-safe-get';

import type { ConstructorStandings } from './ConstructorStandings';
import type { Races } from './Races';
import { createIndexMap, groupByAndMapValues } from '../utils';

export interface IConstructorChampionship {
	readonly constructorChampionshipId: number;
	readonly year: number;
	readonly raceId: number;
	readonly constructorId: number;
	readonly position: number;
}

export class ConstructorChampionships {
	protected data: ReadonlyArray<IConstructorChampionship> = [];

	protected constructorChampionshipIdsToIndexMap: Record<number, number> = {};

	protected constructorChampionshipIdsGroupedByConstructorId: Record<
		number,
		ReadonlyArray<number>
	>;

	constructor(races: Races, constructorStandings: ConstructorStandings) {
		let constructorChampionshipId = 1;

		this.data = Object.entries(
			races.getRaceIdsForAllSeasons(),
		).flatMap<IConstructorChampionship>(([season, raceIds]) => {
			// find the last race of the season
			const lastRaceId = raceIds.at(-1)!;
			const year = parseInt(season, 10);
			const constructorStandingsForLastRace =
				constructorStandings.getConstructorStandingsByRaceId(lastRaceId);

			return constructorStandingsForLastRace.map<IConstructorChampionship>(
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

	public getData(): ReadonlyArray<IConstructorChampionship> {
		return this.data;
	}

	public getConstructorChampionshipByConstructorId(
		constructorId: number,
	): ReadonlyArray<IConstructorChampionship> {
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
