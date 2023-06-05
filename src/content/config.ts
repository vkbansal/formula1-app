import { z, defineCollection } from 'astro:content';

/*******************************************************************************
 * Seasons Collection
 ******************************************************************************/
const seasonsCollection = defineCollection({
	type: 'data',
	schema: z.object({
		year: z.number(),
		rounds: z.array(
			z.object({
				round: z.number(),
				name: z.string(),
				date: z.string(),
				circuit: z.object({
					name: z.string(),
					location: z.string().nullable(),
					country: z.string().nullable(),
				}),
				podium: z.array(
					z.object({
						driverRef: z.string(),
						constructorRef: z.string(),
						position: z.number(),
					}),
				),
				driverStandings: z.array(
					z.object({
						points: z.number(),
						position: z.number().nullable(),
						wins: z.number(),
						driverRef: z.string(),
					}),
				),
				constructorStandings: z.array(
					z.object({
						constructorRef: z.string(),
						points: z.number(),
						position: z.number().nullable(),
						wins: z.number(),
					}),
				),
			}),
		),
		teams: z.array(
			z.object({
				constructorRef: z.string(),
				name: z.string(),
				nationality: z.string().nullable(),
				drivers: z.array(
					z.object({
						driverRef: z.string(),
						name: z.string(),
						nationality: z.string().nullable(),
					}),
				),
			}),
		),
	}),
});

/*******************************************************************************
 * All Collections
 ******************************************************************************/

export const collections = {
	seasons: seasonsCollection,
};
