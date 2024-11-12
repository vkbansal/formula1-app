import { BaseData } from './BaseData';

export interface ConstructorResult {
	readonly constructorResultsId: number;
	readonly raceId: number;
	readonly constructorId: number;
	readonly points: number;
	readonly status: string | null;
}

export class ConstructorResults extends BaseData<ConstructorResult> {
	override filename = 'constructor_results.csv';

	constructor() {
		super();
		this.loadData();
	}
}
