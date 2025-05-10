import dayjs from 'dayjs';
import type { ListrTask } from 'listr2';
import type { z } from 'zod';

import { writeFileToDataDir } from '../../../../../utils';
import type { SeasonContext } from '../../../../getSeasonData.types';
import type { RaceSchema } from '../../../../schemas';
import {
	getConstructorStandingsForRoundTask,
	getDriverStandingsForRoundTask,
} from './subtasks';

interface GetStandingsDataForRoundTaskArgs {
	year: number;
	race: z.infer<typeof RaceSchema>;
	id: string;
}

export function getDataForRoundTask({
	year,
	race,
	id,
}: GetStandingsDataForRoundTaskArgs): ListrTask<SeasonContext> {
	return {
		title: `Fetching data for round ${race.round} => ${race.raceName}`,
		skip: dayjs(race.date).isAfter(dayjs(), 'date'),
		task: async (ctx, task) => {
			ctx.round = {
				circuit: {
					country: race.Circuit.Location.country,
					location: race.Circuit.Location.locality,
					name: race.Circuit.circuitName,
				},
				constructorStandings: [],
				date: race.date,
				driverStandings: [],
				id,
				name: race.raceName,
				results: [],
				round: race.round,
			};

			return task.newListr(
				[
					getDriverStandingsForRoundTask(year, race.round),
					getConstructorStandingsForRoundTask(year, race.round),
					{
						title: `Writing ${year}/${id}.json`,
						task: async (ctx) => {
							await writeFileToDataDir(`seasons/${year}/${id}.json`, ctx.round);
						},
					},
				],
				{
					concurrent: false,
					rendererOptions: { showSubtasks: true, collapseSubtasks: false },
				},
			);
		},
	};
}
