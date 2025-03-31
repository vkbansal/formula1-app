import { delay, type ListrRendererFactory, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky } from '../utils';
import type { Context } from './getSeasonData.types';
import { getAPIResponseSchema, RaceSchema, ResultSchema } from './schemas';

const APIResponseSchema = getAPIResponseSchema({
	RaceTable: z.object({
		season: z.coerce.number(),
		Races: z.array(
			RaceSchema.extend({
				Results: z.array(ResultSchema),
			}),
		),
	}),
});

export function getPodiumDataForRoundTask(
	year: number,
	round: number,
): ListrTask<Context, ListrRendererFactory, ListrRendererFactory> {
	return {
		title: 'Fetching podium data',
		task: async (ctx) => {
			const apiData = await ky.get(`${year}/${round}/results.json`).json();

			const {
				fromCache,
				MRData: {
					RaceTable: { Races },
				},
			} = APIResponseSchema.parse(apiData);

			const Results = Races[0]!.Results;

			const race = ctx.rounds.find((r) => r.round === round);

			if (!race) {
				throw new Error(`Race not found for round ${round}`);
			}

			race.podium = Results.filter((r) => r.position <= 3)
				.map((r) => ({
					position: r.position,
					constructorRef: r.Constructor?.constructorId ?? '',
					driverRef: r.Driver.driverId,
				}))
				.toSorted((a, b) => a.position - b.position);

			if (!fromCache) {
				await delay(1000);
			}
		},
	};
}
