import get from 'just-safe-get';

import { BaseData } from './BaseData';
import { createIndexMap, groupByAndMapValues } from '../utils';

export interface IDriverStanding {
	readonly driverStandingsId: number;
	readonly raceId: number;
	readonly driverId: number;
	readonly points: number;
	readonly position: number;
	readonly positionText: string;
	readonly wins: number;
}

export class DriverStandings extends BaseData<IDriverStanding> {
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

	getDriverStandingsByRaceId(raceId: number): ReadonlyArray<IDriverStanding> {
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
