import get from 'just-safe-get';

import { createIndexMap, groupByAndMapValues } from '../utils';
import { BaseData } from './BaseData';

export interface ConstructorStanding {
	readonly constructorStandingsId: number;
	readonly raceId: number;
	readonly constructorId: number;
	readonly points: number;
	readonly position: number;
	readonly positionText: string;
	readonly wins: number;
}

export class ConstructorStandings extends BaseData<ConstructorStanding> {
	override filename = 'constructor_standings.csv';

	private constructorStandingIdsGroupedByRaceId: Record<number, number[]>;

	private constructorStandingIdToConstructorIndexMap: Record<number, number> =
		{};

	constructor() {
		super();
		this.loadData();
		this.constructorStandingIdToConstructorIndexMap = createIndexMap(
			this.data,
			'constructorStandingsId',
		);

		this.constructorStandingIdsGroupedByRaceId = groupByAndMapValues(
			this.data,
			'raceId',
			(standing) => standing.constructorStandingsId,
		);
	}

	getConstructorStandingsByRaceId(
		raceId: number,
	): ReadonlyArray<ConstructorStanding> {
		const standingIds =
			this.constructorStandingIdsGroupedByRaceId[raceId] || [];
		return standingIds
			.map((standingId) =>
				get(
					this.data,
					String(
						get(
							this.constructorStandingIdToConstructorIndexMap,
							String(standingId),
						),
					),
				),
			)
			.toSorted((a, b) => a.position - b.position);
	}
}
