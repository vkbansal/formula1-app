import { delay, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky } from '../../../utils';
import type { SeasonContext } from '../../getSeasonData.types';
import { ConstructorSchema, getAPIResponseSchema } from '../../schemas';
import { getDriversDataForConstructorTask } from './subtasks';

const SeasonConstructorAPIResponseSchema = getAPIResponseSchema({
	ConstructorTable: z.object({
		season: z.coerce.number(),
		Constructors: z.array(ConstructorSchema),
	}),
});

export function getConstructorsDataForSeasonTask(
	year: number,
): ListrTask<SeasonContext> {
	return {
		title: `Fetching constructor data for ${year}`,
		task: async (_ctx, task) => {
			const constructorsApiData = await ky
				.get(`${year}/constructors.json`)
				.json();

			const {
				fromCache,
				MRData: {
					ConstructorTable: { Constructors },
				},
			} = SeasonConstructorAPIResponseSchema.parse(constructorsApiData);

			if (!fromCache) {
				await delay(1000);
			}

			return task.newListr(
				Constructors.map((team) =>
					getDriversDataForConstructorTask(year, team),
				),
				{
					concurrent: false,
					rendererOptions: { showSubtasks: true, collapseSubtasks: false },
				},
			);
		},
	};
}
