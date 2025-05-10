import { delay, type ListrTask } from 'listr2';
import { z } from 'zod';

import { ky } from '../../../../../utils';
import type { SeasonContext } from '../../../../getSeasonData.types';
import {
	type ConstructorSchema,
	DriverSchema,
	getAPIResponseSchema,
} from '../../../../schemas';

const SeasonConstructorDriverAPIResponseSchema = getAPIResponseSchema({
	DriverTable: z.object({
		season: z.coerce.number(),
		Drivers: z.array(DriverSchema),
	}),
});

export function getDriversDataForConstructorTask(
	year: number,
	team: z.infer<typeof ConstructorSchema>,
): ListrTask<SeasonContext> {
	return {
		title: `Fetching drivers for ${team.name}`,
		task: async (ctx) => {
			const driversApiData = await ky
				.get(`${year}/constructors/${team.constructorId}/drivers.json`)
				.json();

			const {
				fromCache,
				MRData: {
					DriverTable: { Drivers },
				},
			} = SeasonConstructorDriverAPIResponseSchema.parse(driversApiData);

			ctx.teams.push({
				constructorRef: team.constructorId,
				drivers: Drivers.map((driver) => ({
					driverRef: driver.driverId,
					name: `${driver.givenName} ${driver.familyName}`,
					nationality: driver.nationality,
				})),
				name: team.name,
				nationality: team.nationality,
			});

			if (!fromCache) {
				await delay(1000);
			}
		},
	};
}
