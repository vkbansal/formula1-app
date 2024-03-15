import { BaseData } from './BaseData';

export interface IStatus {
	readonly statusId: number;
	readonly status: string;
}

export class Status extends BaseData<IStatus> {
	override filename = 'status.csv';

	constructor() {
		super();
		this.loadData();
	}
}
