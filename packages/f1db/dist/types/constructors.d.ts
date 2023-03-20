import { z } from 'zod';
export declare const ConstructorResult: z.ZodObject<{
    round: z.ZodNumber;
    roundName: z.ZodString;
    results: z.ZodArray<z.ZodObject<{
        points: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
        driver: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        points: number;
        position: number | null;
        driver: string;
    }, {
        points: number;
        position: number | null;
        driver: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    round: number;
    roundName: string;
    results: {
        points: number;
        position: number | null;
        driver: string;
    }[];
}, {
    round: number;
    roundName: string;
    results: {
        points: number;
        position: number | null;
        driver: string;
    }[];
}>;
export type IConstructorResult = z.infer<typeof ConstructorResult>;
export declare const ConstructorSeaon: z.ZodObject<{
    year: z.ZodNumber;
    rounds: z.ZodArray<z.ZodObject<{
        round: z.ZodNumber;
        roundName: z.ZodString;
        results: z.ZodArray<z.ZodObject<{
            points: z.ZodNumber;
            position: z.ZodNullable<z.ZodNumber>;
            driver: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            points: number;
            position: number | null;
            driver: string;
        }, {
            points: number;
            position: number | null;
            driver: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        round: number;
        roundName: string;
        results: {
            points: number;
            position: number | null;
            driver: string;
        }[];
    }, {
        round: number;
        roundName: string;
        results: {
            points: number;
            position: number | null;
            driver: string;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    year: number;
    rounds: {
        round: number;
        roundName: string;
        results: {
            points: number;
            position: number | null;
            driver: string;
        }[];
    }[];
}, {
    year: number;
    rounds: {
        round: number;
        roundName: string;
        results: {
            points: number;
            position: number | null;
            driver: string;
        }[];
    }[];
}>;
export type IConstructorSeaon = z.infer<typeof ConstructorSeaon>;
export declare const ChampionshipStanding: z.ZodObject<Pick<{
    driverChampionshipId: z.ZodNumber;
    year: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
}, "position" | "year">, "strip", z.ZodTypeAny, {
    position: number | null;
    year: number;
}, {
    position: number | null;
    year: number;
}>;
export type IChampionshipStanding = z.infer<typeof ChampionshipStanding>;
export declare const ConstructorData: z.ZodObject<{
    name: z.ZodString;
    constructorId: z.ZodNumber;
    constructorRef: z.ZodString;
    nationality: z.ZodNullable<z.ZodString>;
    raceWins: z.ZodNumber;
    podiums: z.ZodNumber;
    totalRaces: z.ZodNumber;
    winPct: z.ZodNumber;
    championshipStandings: z.ZodArray<z.ZodObject<Pick<{
        driverChampionshipId: z.ZodNumber;
        year: z.ZodNumber;
        raceId: z.ZodNumber;
        driverId: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
    }, "position" | "year">, "strip", z.ZodTypeAny, {
        position: number | null;
        year: number;
    }, {
        position: number | null;
        year: number;
    }>, "many">;
    seasons: z.ZodArray<z.ZodObject<{
        year: z.ZodNumber;
        rounds: z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            roundName: z.ZodString;
            results: z.ZodArray<z.ZodObject<{
                points: z.ZodNumber;
                position: z.ZodNullable<z.ZodNumber>;
                driver: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                points: number;
                position: number | null;
                driver: string;
            }, {
                points: number;
                position: number | null;
                driver: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }, {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        year: number;
        rounds: {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }[];
    }, {
        year: number;
        rounds: {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    seasons: {
        year: number;
        rounds: {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }[];
    }[];
    name: string;
    constructorId: number;
    constructorRef: string;
    nationality: string | null;
    raceWins: number;
    podiums: number;
    totalRaces: number;
    championshipStandings: {
        position: number | null;
        year: number;
    }[];
    winPct: number;
}, {
    seasons: {
        year: number;
        rounds: {
            round: number;
            roundName: string;
            results: {
                points: number;
                position: number | null;
                driver: string;
            }[];
        }[];
    }[];
    name: string;
    constructorId: number;
    constructorRef: string;
    nationality: string | null;
    raceWins: number;
    podiums: number;
    totalRaces: number;
    championshipStandings: {
        position: number | null;
        year: number;
    }[];
    winPct: number;
}>;
export type IConstructorData = z.infer<typeof ConstructorData>;
