import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';
/*******************************************************************************
 * Constructors Collection
 ******************************************************************************/
const constructorsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/constructors' }),
	schema: z.object({
		constructorRef: z.string(),
		name: z.string(),
		nationality: z.string().nullable(),
		raceWins: z.number(),
		podiums: z.number(),
		totalRaces: z.number(),
		winPct: z.number(),
		championshipStandings: z.array(
			z.object({
				year: z.number(),
				position: z.number().nullable(),
			}),
		),
		seasons: z.array(
			z.object({
				year: z.number(),
				rounds: z.array(
					z.object({
						round: z.number(),
						roundName: z.string(),
						results: z.array(
							z.object({
								points: z.number(),
								position: z.number().nullable(),
								driver: z.string(),
							}),
						),
					}),
				),
			}),
		),
	}),
});

/*******************************************************************************
 * Drivers Collection
 ******************************************************************************/
const driversCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/drivers' }),
	schema: z.object({
		driverId: z.number(),
		driverRef: z.string(),
		dob: z.string().nullable(),
		nationality: z.string().nullable(),
		code: z.string().nullable(),
		name: z.string(),
		image: z.string().nullable(),
		raceWins: z.number(),
		podiums: z.number(),
		totalLaps: z.number().nullable(),
		totalRaces: z.number(),
		lapsLead: z.number().nullable(),
		championshipStandings: z.array(
			z.object({
				year: z.number(),
				position: z.number().nullable(),
			}),
		),
		seasons: z.array(
			z.object({
				year: z.number(),
				results: z.array(
					z.object({
						round: z.number(),
						roundName: z.string(),
						constructor: z.string(),
						points: z.number(),
						position: z.number().nullable(),
					}),
				),
			}),
		),
	}),
});

/*******************************************************************************
 * Rounds Collection
 ******************************************************************************/
const roundsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/rounds' }),
	schema: z.object({
		raceId: z.number(),
		year: z.number(),
		round: z.number(),
		name: z.string(),
		slug: z.string(),
		date: z.string(),
		circuit: z.object({
			name: z.string(),
			location: z.string().nullable(),
			country: z.string().nullable(),
			circuitRef: z.string(),
		}),
		driversData: z.array(
			z.object({
				grid: z.number(),
				position: z.number().nullable(),
				points: z.number(),
				positionText: z.string(),
				positionOrder: z.number(),
				driverRef: z.string(),
				constructorRef: z.string(),
				qualifying: z
					.object({
						position: z.number().nullable(),
						q1: z.string().nullable(),
						q2: z.string().nullable(),
						q3: z.string().nullable(),
					})
					.optional(),
			}),
		),
	}),
});

/*******************************************************************************
 * Seasons Collection
 ******************************************************************************/
const seasonsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/seasons' }),
	schema: z.object({
		year: z.number(),
		rounds: z.array(
			z.object({
				round: z.number(),
				name: z.string(),
				date: z.string(),
				slug: z.string(),
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
	constructors: constructorsCollection,
	drivers: driversCollection,
	rounds: roundsCollection,
	seasons: seasonsCollection,
};
