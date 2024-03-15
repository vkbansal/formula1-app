import get from 'just-safe-get';

import { BaseData } from './BaseData';
import { groupByAndMapValues } from '../utils';

export interface ILapTime {
	readonly raceId: number;
	readonly driverId: number;
	readonly lap: number;
	readonly position: number;
	readonly time: string;
	readonly milliseconds: number;
}

export class LapTimes extends BaseData<ILapTime> {
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

	getLapTimesByDriverId(driverId: number): ReadonlyArray<ILapTime> {
		const lapTimeIndexes = this.lapTimeIndexesGroupedByDriverId[driverId] || [];

		return lapTimeIndexes.map((lapTimeIndex) =>
			get(this.data, String(lapTimeIndex)),
		);
	}

	getLapTimesByRaceId(raceId: number): ReadonlyArray<ILapTime> {
		const lapTimeIndexes = this.lapTimeIndexesGroupedByRaceId[raceId] || [];

		return lapTimeIndexes.map((lapTimeIndex) =>
			get(this.data, String(lapTimeIndex)),
		);
	}
}
