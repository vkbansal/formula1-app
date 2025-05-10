import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { defineCollection, z } from 'astro:content';

import { globby } from 'globby';
/*******************************************************************************
 * Constructors Collection
 ******************************************************************************/
const constructorsCollection = defineCollection({
	loader: async () => {
		const constructorFiles = await globby(
			'./src/content/constructors/*/constructor.json',
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any[] = [];

		for (const constructorFile of constructorFiles) {
			const id = constructorFile.split('/').at(-2);

			if (!id) {
				throw new Error(
					`Unable to determine the constructor from ${constructorFile}`,
				);
			}

			const constructorContent = await readFile(constructorFile, 'utf8');
			const constructorData = JSON.parse(constructorContent);

			constructorData.id = id;
			constructorData.seasons = [];

			const seasonFiles = await globby([
				`./src/content/constructors/${id}/*.json`,
				`!./src/content/constructors/${id}/constructor.json`,
			]);

			for (const seasonFile of seasonFiles) {
				const year = basename(seasonFile, '.json');
				const seasonContent = await readFile(seasonFile, 'utf8');
				const seasonData = JSON.parse(seasonContent);

				constructorData.seasons.push({
					...seasonData,
					year: parseInt(year, 10),
				});
			}

			data.push(constructorData);
		}

		return data;
	},
	schema: z.object({
		constructorRef: z.string(),
		name: z.string(),
		nationality: z.string().nullable(),
		raceWins: z.number(),
		podiums: z.number(),
		totalRaces: z.number(),
		winPct: z.number(),
		seasons: z.array(
			z.object({
				championshipStanding: z.number().nullable(),
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
	loader: async () => {
		const driverFiles = await globby('./src/content/drivers/*/driver.json');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any[] = [];

		for (const driverFile of driverFiles) {
			const id = driverFile.split('/').at(-2);

			if (!id) {
				throw new Error(`Unable to determine the driver from ${driverFile}`);
			}

			const driverContent = await readFile(driverFile, 'utf8');
			const driverData = JSON.parse(driverContent);

			driverData.id = id;
			driverData.seasons = [];

			const seasonFiles = await globby([
				`./src/content/drivers/${id}/*.json`,
				`!./src/content/drivers/${id}/driver.json`,
			]);

			for (const seasonFile of seasonFiles) {
				const year = basename(seasonFile, '.json');
				const seasonContent = await readFile(seasonFile, 'utf8');
				const seasonData = JSON.parse(seasonContent);

				driverData.seasons.push({
					...seasonData,
					year: parseInt(year, 10),
				});
			}

			data.push(driverData);
		}

		return data;
	},
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
		seasons: z.array(
			z.object({
				year: z.number(),
				championshipStanding: z.number().nullable(),
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
 * Seasons Collection
 ******************************************************************************/
const seasonsCollection = defineCollection({
	loader: async () => {
		const seasonFiles = await globby('./src/content/seasons/*/season.json');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any[] = [];

		for (const seasonFile of seasonFiles) {
			const id = seasonFile.split('/').at(-2);

			if (!id) {
				throw new Error(`Unable to determine the season from ${seasonFile}`);
			}

			const seasonContent = await readFile(seasonFile, 'utf8');
			const seasonData = JSON.parse(seasonContent);

			seasonData.id = id;

			for (const round of seasonData.rounds) {
				const roundContent = await readFile(
					`./src/content/seasons/${id}/${round.id}.json`,
					'utf8',
				);
				const roundData = JSON.parse(roundContent);

				Object.assign(round, roundData);
			}

			data.push(seasonData);
		}

		return data;
	},
	schema: z.object({
		year: z.number(),
		rounds: z.array(
			z.object({
				round: z.number(),
				name: z.string(),
				date: z.string().date(),
				id: z.string(),
				circuit: z.object({
					name: z.string(),
					location: z.string().nullable(),
					country: z.string().nullable(),
				}),
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
				results: z.array(
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
	seasons: seasonsCollection,
};
