import { delay, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky } from '../../../../../../../utils';
import type { SeasonContext } from '../../../../../../getSeasonData.types';
import {
	DriverStandingsSchema,
	getAPIResponseSchema,
} from '../../../../../../schemas';

const SeasonDriverStandingsAPIResponseSchema = getAPIResponseSchema({
	StandingsTable: z.object({
		season: z.coerce.number(),
		round: z.coerce.number(),
		StandingsLists: z.array(
			z.object({
				season: z.coerce.number(),
				round: z.coerce.number(),
				DriverStandings: z.array(DriverStandingsSchema),
			}),
		),
	}),
});

export function getDriverStandingsForRoundTask(
	year: number,
	round: number,
): ListrTask<SeasonContext> {
	return {
		title: `Fetching driver standings data`,
		task: async (ctx, _task) => {
			const driverStandingsApiData = await ky
				// eslint-disable-next-line @cspell/spellchecker
				.get(`${year}/${round}/driverstandings.json`)
				.json();

			const {
				fromCache,
				MRData: {
					StandingsTable: { StandingsLists: DriverStandingsList },
				},
			} = SeasonDriverStandingsAPIResponseSchema.parse(driverStandingsApiData);

			const DriverStandings = DriverStandingsList[0]!.DriverStandings;

			const race = ctx.rounds.find((r) => r.round === round);

			if (!race) {
				throw new Error(`Race not found for round ${round}`);
			}

			race.driverStandings = DriverStandings.map((driver, index) => ({
				driverRef: driver.Driver.driverId,
				points: driver.points,
				position: driver.position ?? index + 1,
				wins: driver.wins,
			}));

			if (!fromCache) {
				await delay(1000);
			}
		},
	};
}
