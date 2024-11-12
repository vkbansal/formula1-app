import get from 'just-safe-get';

import { groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface Race {
	readonly raceId: number;
	readonly year: number;
	readonly round: number;
	readonly circuitId: number;
	readonly name: string;
	readonly date: string;
	readonly time: string;
	readonly url: string;
	readonly fp1_date: string | null;
	readonly fp1_time: string | null;
	readonly fp2_date: string | null;
	readonly fp2_time: string | null;
	readonly fp3_date: string | null;
	readonly fp3_time: string | null;
	readonly quali_date: string | null;
	readonly quali_time: string | null;
	readonly sprint_date: string | null;
	readonly sprint_time: string | null;
}

export class Races extends BaseData<Race> {
	override filename = 'races.csv';

	private raceIdToRaceIndexMap: Record<number, number> = {};

	private raceIdsBySeason: Readonly<Record<number, ReadonlyArray<number>>> = {};

	constructor() {
		super();
		this.loadData();

		this.raceIdToRaceIndexMap = this.data.reduce<Record<number, number>>(
			(acc, race, index) => {
				acc[race.raceId] = index;
				return acc;
			},
			{},
		);

		const racesBySeason = groupByAndMapValues(this.data, 'year', (val) => val);

		this.raceIdsBySeason = Object.fromEntries(
			Object.entries(racesBySeason).map(([season, races]) => {
				return [
					season,
					races
						.toSorted((a, b) => a.round - b.round)
						.map((race) => race.raceId),
				];
			}),
		);
	}

	getRaceByRaceId(raceId: number): Race | undefined {
		return get(
			this.data,
			String(get(this.raceIdToRaceIndexMap, String(raceId))),
		);
	}

	getRacesBySeason(season: number): ReadonlyArray<Race> {
		const raceIds = this.raceIdsBySeason[season] || [];

		return raceIds.map((raceId) =>
			get(this.data, String(get(this.raceIdToRaceIndexMap, String(raceId)))),
		);
	}

	getRaceIdsForAllSeasons(): Record<number, ReadonlyArray<number>> {
		return this.raceIdsBySeason;
	}
}
