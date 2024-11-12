import get from 'just-safe-get';

import { groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface LapTime {
	readonly raceId: number;
	readonly driverId: number;
	readonly lap: number;
	readonly position: number;
	readonly time: string;
	readonly milliseconds: number;
}

export class LapTimes extends BaseData<LapTime> {
	override filename = 'lap_times.csv';

	private lapTimeIndexesGroupedByDriverId: Record<number, number[]>;

	private lapTimeIndexesGroupedByRaceId: Record<number, number[]>;

	constructor() {
		super();
		this.loadData();

		this.lapTimeIndexesGroupedByDriverId = groupByAndMapValues(
			this.data,
			'driverId',
			(_, index) => index,
		);

		this.lapTimeIndexesGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(_, index) => index,
		);
	}

	getLapTimesByDriverId(driverId: number): ReadonlyArray<LapTime> {
		const lapTimeIndexes = this.lapTimeIndexesGroupedByDriverId[driverId] || [];

		return lapTimeIndexes.map((lapTimeIndex) =>
			get(this.data, String(lapTimeIndex)),
		);
	}

	getLapTimesByRaceId(raceId: number): ReadonlyArray<LapTime> {
		const lapTimeIndexes = this.lapTimeIndexesGroupedByRaceId[raceId] || [];

		return lapTimeIndexes.map((lapTimeIndex) =>
			get(this.data, String(lapTimeIndex)),
		);
	}
}
