import { z } from 'zod';
import { Season, Driver, DriverChampionship, Result } from './db.js';

export const DriverResult = z
	.object({ round: z.number(), roundName: z.string(), constructor: z.string() })
	.merge(Result.pick({ points: true, position: true }));

export type IDriverResult = z.infer<typeof DriverResult>;

export const DriverSeaon = Season.pick({ year: true }).extend({
	results: z.array(DriverResult),
});

export type IDriverSeaon = z.infer<typeof DriverSeaon>;

export const ChampionshipStanding = DriverChampionship.pick({ year: true, position: true });

export type IChampionshipStanding = z.infer<typeof ChampionshipStanding>;

export const DriverData = Driver.pick({
	driverId: true,
	driverRef: true,
	dob: true,
	nationality: true,
	code: true,
}).extend({
	name: z.string(),
	image: z.string().optional(),
	raceWins: z.number(),
	podiums: z.number(),
	totalLaps: z.number().nullable(),
	totalRaces: z.number(),
	lapsLead: z.number().nullable(),
	championshipStandings: z.array(ChampionshipStanding),
	seasons: z.array(DriverSeaon),
});

export type IDriverData = z.infer<typeof DriverData>;
