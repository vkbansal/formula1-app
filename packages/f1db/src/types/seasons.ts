import { z } from 'zod';

import {
	Season,
	Race,
	Circuit,
	DriverStanding,
	ConstructorStanding,
	Constructor,
	Driver,
} from './db.js';

export const Team = Constructor.pick({
	constructorRef: true,
	name: true,
	nationality: true,
}).extend({
	drivers: z.array(
		Driver.pick({
			driverRef: true,
			nationality: true,
		}).extend({
			name: z.string(),
		}),
	),
});

export type ITeam = z.infer<typeof Team>;

export const Podium = z.object({
	driverRef: z.string(),
	constructorRef: z.string(),
	position: z.number(),
});

export type IPodium = z.infer<typeof Podium>;

export const SeasonRound = Race.pick({
	round: true,
	name: true,
	date: true,
}).extend({
	circuit: Circuit.pick({
		name: true,
		location: true,
		country: true,
	}),
	podium: z.array(Podium),
	driverStandings: z.array(
		DriverStanding.pick({
			points: true,
			position: true,
			wins: true,
		}).extend({
			driverRef: z.string(),
		}),
	),
	constructorStandings: z.array(
		ConstructorStanding.pick({
			points: true,
			position: true,
			wins: true,
		}).extend({
			constructorRef: z.string(),
		}),
	),
});

export type ISeasonRound = z.infer<typeof SeasonRound>;

export const SeasonData = Season.pick({
	year: true,
}).extend({
	rounds: z.array(SeasonRound),
	teams: z.array(Team),
});

export type ISeasonData = z.infer<typeof SeasonData>;
