import get from 'just-safe-get';

import { BaseData } from './BaseData';
import { groupByAndMapValues } from '../utils';

export interface IResult {
	readonly resultId: number;
	readonly raceId: number;
	readonly driverId: number;
	readonly constructorId: number;
	readonly number: number;
	readonly grid: number;
	readonly position: number | null;
	readonly positionText: string;
	readonly positionOrder: number;
	readonly points: number;
	readonly laps: number;
	readonly time: string | null;
	readonly milliseconds: number | null;
	readonly fastestLap: number | null;
	readonly rank: number | null;
	readonly fastestLapTime: string | null;
	readonly fastestLapSpeed: string | null;
	readonly statusId: number;
}

export class Results extends BaseData<IResult> {
	override filename = 'results.csv';

	private resultIdsToResultIndexMap: Record<number, number> = {};

	private resultIdsGroupedByRaceId: Readonly<
		Record<number, ReadonlyArray<number>>
	>;

	private resultIdsGroupedByDriverId: Readonly<
		Record<number, ReadonlyArray<number>>
	>;

	private resultIdsGroupedByConstructorId: Readonly<
		Record<number, ReadonlyArray<number>>
	>;

	constructor() {
		super();
		this.loadData();

		this.resultIdsToResultIndexMap = this.data.reduce<Record<number, number>>(
			(acc, result, index) => {
				acc[result.resultId] = index;
				return acc;
			},
			{},
		);

		this.resultIdsGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(result) => result.resultId,
		);

		this.resultIdsGroupedByDriverId = groupByAndMapValues(
			this.data,
			'driverId',
			(result) => result.resultId,
		);

		this.resultIdsGroupedByConstructorId = groupByAndMapValues(
			this.data,
			'constructorId',
			(result) => result.resultId,
		);
	}

	getResultsByRaceId(raceId: number): IResult[] {
		const resultIds = this.resultIdsGroupedByRaceId[raceId] || [];

		return resultIds
			.map((resultId) =>
				get(
					this.data,
					String(get(this.resultIdsToResultIndexMap, String(resultId))),
				),
			)
			.toSorted((a, b) => a.positionOrder - b.positionOrder);
	}

	getPodiumsByRaceId(raceId: number): IResult[] {
		return this.getResultsByRaceId(raceId).slice(0, 3);
	}

	getResultsByDriverId(driverId: number): IResult[] {
		const resultIds = this.resultIdsGroupedByDriverId[driverId] || [];

		return resultIds.map((resultId) =>
			get(
				this.data,
				String(get(this.resultIdsToResultIndexMap, String(resultId))),
			),
		);
	}

	getResultsByConstructorId(constructorId: number): IResult[] {
		const resultIds = this.resultIdsGroupedByConstructorId[constructorId] || [];

		return resultIds.map((resultId) =>
			get(
				this.data,
				String(get(this.resultIdsToResultIndexMap, String(resultId))),
			),
		);
	}
}
