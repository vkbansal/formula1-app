import { BaseData } from './BaseData';

export interface ISeason {
	readonly year: number;
	readonly url: string;
}

export class Seasons extends BaseData<ISeason> {
	override filename = 'seasons.csv';

	constructor() {
		super();
		this.loadData();
	}
}
