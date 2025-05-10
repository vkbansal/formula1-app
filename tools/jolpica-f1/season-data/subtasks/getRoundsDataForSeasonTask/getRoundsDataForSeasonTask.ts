import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { delay, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky, slugify } from '../../../utils';
import type { SeasonContext } from '../../getSeasonData.types';
import { getAPIResponseSchema, RaceSchema } from '../../schemas';
import { getDataForRoundTask } from './subtasks';

dayjs.extend(advancedFormat);

const SeasonRacesAPIResponseSchema = getAPIResponseSchema({
	RaceTable: z.object({
		season: z.coerce.number(),
		Races: z.array(RaceSchema),
	}),
});

export function getRoundsDataForSeasonTask(
	year: number,
): ListrTask<SeasonContext> {
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
					round: race.round,
					id: slugify(race.raceName),
				};
			});

			ctx.rounds = rounds;
			ctx.teams = [];

			if (!fromCache) {
				await delay(1000);
			}

			return task.newListr(
				Races.map((race) =>
					getDataForRoundTask({ year, race, id: slugify(race.raceName) }),
				),
				{
					concurrent: false,
					rendererOptions: { showSubtasks: true, collapseSubtasks: false },
				},
			);
		},
	};
}
