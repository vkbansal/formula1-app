import get from 'just-safe-get';

import { BaseData } from './BaseData';
import { createIndexMap, groupByAndMapValues } from '../utils';

export interface IConstructorStanding {
	readonly constructorStandingsId: number;
	readonly raceId: number;
	readonly constructorId: number;
	readonly points: number;
	readonly position: number;
	readonly positionText: string;
	readonly wins: number;
}

export class ConstructorStandings extends BaseData<IConstructorStanding> {
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
	): ReadonlyArray<IConstructorStanding> {
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
