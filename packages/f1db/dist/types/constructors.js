import { z } from 'zod';
import { Season, Constructor, ConstructorChampionship, Result } from './db.js';
export const ConstructorResult = z.object({
    round: z.number(),
    roundName: z.string(),
    results: z.array(Result.pick({
        points: true,
        position: true,
    }).extend({
        driver: z.string(),
    })),
});
export const ConstructorSeaon = Season.pick({ year: true }).extend({
    rounds: z.array(ConstructorResult),
});
export const ChampionshipStanding = ConstructorChampionship.pick({ year: true, position: true });
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
