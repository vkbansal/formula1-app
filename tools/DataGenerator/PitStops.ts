import get from 'just-safe-get';

import { groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface PitStop {
	readonly raceId: number;
	readonly driverId: number;
	readonly stop: number;
	readonly lap: number;
	readonly time: string;
	readonly duration: string;
	readonly milliseconds: number;
}

export class PitStops extends BaseData<PitStop> {
	override filename = 'pit_stops.csv';

	private pitStopIndexesGroupedByRaceId: Record<number, number[]>;

	constructor() {
		super();
		this.loadData();

		this.pitStopIndexesGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(_, index) => index,
		);
	}

	getPitStopsByRaceId(raceId: number): ReadonlyArray<PitStop> {
		const pitStopIndexes = this.pitStopIndexesGroupedByRaceId[raceId] || [];

		return pitStopIndexes.map((pitStopIndex) =>
			get(this.data, String(pitStopIndex)),
		);
	}
}
