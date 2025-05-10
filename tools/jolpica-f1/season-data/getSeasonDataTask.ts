import type { ListrTask } from 'listr2';

import { writeFileToDataDir } from '../utils';
import type { SeasonContext } from './getSeasonData.types';
import {
	getConstructorsDataForSeasonTask,
	getRoundsDataForSeasonTask,
} from './subtasks';

export function getSeasonDataTask(year: number): ListrTask<SeasonContext> {
	return {
		title: 'Fetching season data',
		task: async (ctx, task) => {
			ctx.year = year;
			return task.newListr(
				[
					getRoundsDataForSeasonTask(year),
					getConstructorsDataForSeasonTask(year),
					{
						title: `Writing ${year}.json`,
						task: async (ctx) => {
							await writeFileToDataDir(`seasons/${year}/season.json`, {
								rounds: ctx.rounds,
								teams: ctx.teams,
								year,
							});
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
