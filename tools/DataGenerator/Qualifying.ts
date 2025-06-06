import { groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface F1Qualifying {
	readonly qualifyId: number;
	readonly raceId: number;
	readonly driverId: number;
	readonly constructorId: number;
	readonly number: number;
	readonly position: number;
	readonly q1: string | null;
	readonly q2: string | null;
	readonly q3: string | null;
}

export class Qualifying extends BaseData<F1Qualifying> {
	override filename = 'qualifying.csv';

	private qualifyingIndexesGroupedByDriverId: Record<number, number[]> = {};

	private qualifyingIndexesGroupedByRaceId: Record<number, number[]> = {};

	constructor() {
		super();
		this.loadData();

		this.qualifyingIndexesGroupedByDriverId = groupByAndMapValues(
			this.data,
			'driverId',
			(_, index) => index,
		);

		this.qualifyingIndexesGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(_, index) => index,
		);
	}

	getQualifyingByDriverId(driverId: number): ReadonlyArray<F1Qualifying> {
		const qualifyingIndexes =
			this.qualifyingIndexesGroupedByDriverId[driverId] || [];

		return qualifyingIndexes.map(
			(qualifyingIndex) => this.data[qualifyingIndex]!,
		);
	}

	getQualifyingByRaceId(raceId: number): ReadonlyArray<F1Qualifying> {
		const qualifyingIndexes =
			this.qualifyingIndexesGroupedByRaceId[raceId] || [];

		return qualifyingIndexes.map(
			(qualifyingIndex) => this.data[qualifyingIndex]!,
		);
	}
}
