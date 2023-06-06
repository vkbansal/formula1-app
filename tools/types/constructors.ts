import { z } from 'zod';
import { Season, Constructor, ConstructorChampionship, Result } from './db.js';

export const ConstructorResult = z.object({
	round: z.number(),
	roundName: z.string(),
	results: z.array(
		Result.pick({
			points: true,
			position: true,
		}).extend({
			driver: z.string(),
		}),
	),
});

export type IConstructorResult = z.infer<typeof ConstructorResult>;

export const ConstructorSeaon = Season.pick({ year: true }).extend({
	rounds: z.array(ConstructorResult),
});

export type IConstructorSeaon = z.infer<typeof ConstructorSeaon>;

export const ChampionshipStanding = ConstructorChampionship.pick({ year: true, position: true });

export type IChampionshipStanding = z.infer<typeof ChampionshipStanding>;

export const ConstructorData = Constructor.omit({
	url: true,
}).extend({
	raceWins: z.number(),
	podiums: z.number(),
	totalRaces: z.number(),
	winPct: z.number(),
	championshipStandings: z.array(ChampionshipStanding),
	seasons: z.array(ConstructorSeaon),
});

export type IConstructorData = z.infer<typeof ConstructorData>;
