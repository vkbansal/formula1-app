import { z } from 'astro/zod';
import ky from 'ky';

import { getAPIResponseSchema } from './shared';

const RaceSchema = z.object({
	season: z.coerce.number(),
	round: z.coerce.number(),
	url: z.string(),
	raceName: z.string(),
	date: z.string(),
	time: z.string(),
	Circuit: z.object({
		circuitId: z.string(),
		url: z.string(),
		circuitName: z.string(),
		Location: z.object({
			lat: z.string(),
			long: z.string(),
			locality: z.string(),
			country: z.string(),
		}),
	}),
});

type Race = z.infer<typeof RaceSchema>;

const APIResponseSchema = getAPIResponseSchema({
	RaceTable: z.object({
		season: z.coerce.number(),
		Races: z.array(RaceSchema),
	}),
});

export async function getRacesData(year: number): Promise<Race[]> {
	const apiData = await ky
		.get(`https://api.jolpi.ca/ergast/f1/${year}/races/`)
		.json();

	const data = APIResponseSchema.parse(apiData);

	return data.MRData.RaceTable.Races;
}
