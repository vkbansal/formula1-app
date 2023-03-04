import { z } from 'zod';

export const HomePageData = z.object({
	races: z.number(),
	drivers: z.number(),
	seasons: z.number(),
	constructors: z.number(),
	driverChampions: z.number(),
	constructorChampions: z.number(),
});

export type IHomePageData = z.infer<typeof HomePageData>;
