import { BaseData } from './BaseData';

export interface Season {
	readonly year: number;
	readonly url: string;
}

export class Seasons extends BaseData<Season> {
	override filename = 'seasons.csv';

	constructor() {
		super();
		this.loadData();
	}
}
