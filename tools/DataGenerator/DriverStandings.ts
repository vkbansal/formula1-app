import get from 'just-safe-get';

import { createIndexMap, groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface DriverStanding {
	readonly driverStandingsId: number;
	readonly raceId: number;
	readonly driverId: number;
	readonly points: number;
	readonly position: number;
	readonly positionText: string;
	readonly wins: number;
}

export class DriverStandings extends BaseData<DriverStanding> {
	override filename = 'driver_standings.csv';

	private driverStandingIdsGroupedByRaceId: Record<number, number[]>;

	private driverStandingIdToDriverIndexMap: Record<number, number> = {};

	constructor() {
		super();

		this.loadData();

		this.driverStandingIdToDriverIndexMap = createIndexMap(
			this.data,
			'driverStandingsId',
		);

		this.driverStandingIdsGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(standing) => standing.driverStandingsId,
		);
	}

	getDriverStandingsByRaceId(raceId: number): ReadonlyArray<DriverStanding> {
		const standingIds = this.driverStandingIdsGroupedByRaceId[raceId] || [];

		return standingIds
			.map((standingId) =>
				get(
					this.data,
					String(
						get(this.driverStandingIdToDriverIndexMap, String(standingId)),
					),
				),
			)
			.toSorted((a, b) => a.position - b.position);
	}
}
