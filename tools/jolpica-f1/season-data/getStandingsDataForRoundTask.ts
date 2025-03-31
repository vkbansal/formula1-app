import dayjs from 'dayjs';
import type { ListrRendererFactory, ListrTask } from 'listr2';
import type { z } from 'zod';

import { getConstructorStandingsForRoundTask } from './getConstructorStandingsForRoundTask';
import { getDriverStandingsForRoundTask } from './getDriverStandingsForRoundTask';
import { getPodiumDataForRoundTask } from './getPodiumDataForRoundTask';
import type { Context } from './getSeasonData.types';
import type { RaceSchema } from './schemas';

interface GetStandingsDataForRoundTaskArgs {
	year: number;
	race: z.infer<typeof RaceSchema>;
}

export function getStandingsDataForRoundTask({
	year,
	race,
}: GetStandingsDataForRoundTaskArgs): ListrTask<
	Context,
	ListrRendererFactory,
	ListrRendererFactory
> {
	return {
		title: `Fetching data for round ${race.round} => ${race.raceName}`,
		skip: dayjs(race.date).isAfter(dayjs(), 'date'),
		task: async (_ctx, task) => {
			return task.newListr(
				[
					getDriverStandingsForRoundTask(year, race.round),
					getConstructorStandingsForRoundTask(year, race.round),
					getPodiumDataForRoundTask(year, race.round),
				],
				{
					concurrent: false,
					rendererOptions: { showSubtasks: true, collapseSubtasks: false },
				},
			);
		},
	};
}
