import type { ListrRendererFactory, ListrTask } from 'listr2';

import { writeFileToDataDir } from '../utils';
import { getConstructorsDataForSeasonTask } from './getConstructorsDataForSeasonTask';
import { getRoundsDataForSeasonTask } from './getRoundsDataForSeasonTask';
import type { Context } from './getSeasonData.types';

export function getSeasonDataTask(
	year: number,
): ListrTask<Context, ListrRendererFactory, ListrRendererFactory> {
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
							await writeFileToDataDir(`seasons/${year}.json`, {
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
