import { BaseData } from './BaseData';

export interface RaceStatus {
	readonly statusId: number;
	readonly status: string;
}

export class Status extends BaseData<RaceStatus> {
	override filename = 'status.csv';

	constructor() {
		super();
		this.loadData();
	}
}
