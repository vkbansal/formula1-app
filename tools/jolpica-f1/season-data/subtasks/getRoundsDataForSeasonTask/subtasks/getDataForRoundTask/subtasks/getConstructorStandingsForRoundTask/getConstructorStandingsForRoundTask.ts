import { delay, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky } from '../../../../../../../utils';
import type { SeasonContext } from '../../../../../../getSeasonData.types';
import {
	ConstructorStandingsSchema,
	getAPIResponseSchema,
} from '../../../../../../schemas';

const SeasonConstructorStandingsAPIResponseSchema = getAPIResponseSchema({
	StandingsTable: z.object({
		season: z.coerce.number(),
		round: z.coerce.number(),
		StandingsLists: z.array(
			z.object({
				season: z.coerce.number(),
				round: z.coerce.number(),
				ConstructorStandings: z.array(ConstructorStandingsSchema),
			}),
		),
	}),
});

export function getConstructorStandingsForRoundTask(
	year: number,
	round: number,
): ListrTask<SeasonContext> {
	return {
		title: `Fetching constructor standings data`,
		task: async (ctx, _task) => {
			const constructorStandingsApiData = await ky
				// eslint-disable-next-line @cspell/spellchecker
				.get(`${year}/${round}/constructorstandings.json`)
				.json();

			const {
				fromCache,
				MRData: {
					StandingsTable: { StandingsLists: ConstructorStandingsList },
				},
			} = SeasonConstructorStandingsAPIResponseSchema.parse(
				constructorStandingsApiData,
			);

			const ConstructorStandings =
				ConstructorStandingsList[0]!.ConstructorStandings;

			const race = ctx.rounds.find((r) => r.round === round);

			if (!race) {
				throw new Error(`Race not found for round ${round}`);
			}

			ctx.round.constructorStandings = ConstructorStandings.map((con) => ({
				constructorRef: con.Constructor.constructorId,
				points: con.points,
				position: con.position,
				wins: con.wins,
			}));

			if (!fromCache) {
				await delay(1000);
			}
		},
	};
}
