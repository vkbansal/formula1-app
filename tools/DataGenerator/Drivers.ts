import get from 'just-safe-get';

import { createIndexMap } from '../utils';
import { BaseData } from './BaseData';

export interface Driver {
	readonly driverId: number;
	readonly driverRef: string;
	readonly number: number | null;
	readonly code: string | null;
	readonly forename: string;
	readonly surname: string;
	readonly dob: string | null;
	readonly nationality: string;
	readonly url: string;
}

export class Drivers extends BaseData<Driver> {
	override filename = 'drivers.csv';

	private driverIdToIndexMap: Record<number, number>;

	constructor() {
		super();
		this.loadData();
		this.driverIdToIndexMap = createIndexMap(this.data, 'driverId');
	}

	getDriverByDriverId(driverId: number): Driver | undefined {
		return get(
			this.data,
			String(get(this.driverIdToIndexMap, String(driverId))),
		);
	}

	getDriverRefByDriverId(driverId: number): string {
		return get(this.getDriverByDriverId(driverId)!, 'driverRef', '');
	}

	getDriverNameFromDriver(driver: Driver): string {
		return `${driver.forename} ${driver.surname}`;
	}

	getDriverNameByDriverId(driverId: number): string {
		return this.getDriverNameFromDriver(this.getDriverByDriverId(driverId)!);
	}
}
