import { BaseData } from './BaseData';

export interface SprintResult {
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

export class SprintResults extends BaseData<SprintResult> {
	override filename = 'sprint_results.csv';

	constructor() {
		super();
		this.loadData();
	}
}
