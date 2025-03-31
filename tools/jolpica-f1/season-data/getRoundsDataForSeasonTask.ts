import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { delay, type ListrRendererFactory, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky, slugify } from '../utils';
import type { Context } from './getSeasonData.types';
import { getStandingsDataForRoundTask } from './getStandingsDataForRoundTask';
import { getAPIResponseSchema, RaceSchema } from './schemas';

dayjs.extend(advancedFormat);

const SeasonRacesAPIResponseSchema = getAPIResponseSchema({
	RaceTable: z.object({
		season: z.coerce.number(),
		Races: z.array(RaceSchema),
	}),
});

export function getRoundsDataForSeasonTask(
	year: number,
): ListrTask<Context, ListrRendererFactory, ListrRendererFactory> {
	return {
		title: `Fetching rounds data for ${year}`,
		task: async (ctx, task) => {
			const racesApiData = await ky.get(`${year}/races.json`).json();

			const {
				fromCache,
				MRData: {
					RaceTable: { Races },
				},
			} = SeasonRacesAPIResponseSchema.parse(racesApiData);

			const rounds = Races.map((race) => {
				return {
					circuit: {
						name: race.Circuit.circuitName,
						location: race.Circuit.Location.locality,
						country: race.Circuit.Location.country,
					},
					date: dayjs(race.date).format('Do MMM YYYY'),
					name: race.raceName,
					round: race.round,
					slug: slugify(race.raceName),
					driverStandings: [],
					constructorStandings: [],
					podium: [],
				};
			});

			ctx.rounds = rounds;
			ctx.teams = [];

			if (!fromCache) {
				await delay(1000);
			}

			return task.newListr(
				Races.map((race) => getStandingsDataForRoundTask({ year, race })),
				{
					concurrent: false,
					rendererOptions: { showSubtasks: true, collapseSubtasks: false },
				},
			);
		},
	};
}
