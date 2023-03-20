import { z } from 'zod';
export declare const DriverResult: z.ZodObject<{
    round: z.ZodNumber;
    roundName: z.ZodString;
    constructor: z.ZodString & Function;
    points: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    points: number;
    position: number | null;
    round: number;
    roundName: string;
    constructor: string;
}, {
    points: number;
    position: number | null;
    round: number;
    roundName: string;
    constructor: string;
}>;
export type IDriverResult = z.infer<typeof DriverResult>;
export declare const DriverSeaon: z.ZodObject<{
    year: z.ZodNumber;
    results: z.ZodArray<z.ZodObject<{
        round: z.ZodNumber;
        roundName: z.ZodString;
        constructor: z.ZodString & Function;
        points: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        points: number;
        position: number | null;
        round: number;
        roundName: string;
        constructor: string;
    }, {
        points: number;
        position: number | null;
        round: number;
        roundName: string;
        constructor: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    year: number;
    results: {
        points: number;
        position: number | null;
        round: number;
        roundName: string;
        constructor: string;
    }[];
}, {
    year: number;
    results: {
        points: number;
        position: number | null;
        round: number;
        roundName: string;
        constructor: string;
    }[];
}>;
export type IDriverSeaon = z.infer<typeof DriverSeaon>;
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
export declare const DriverData: z.ZodObject<{
    code: z.ZodNullable<z.ZodString>;
    nationality: z.ZodNullable<z.ZodString>;
    driverId: z.ZodNumber;
    driverRef: z.ZodString;
    dob: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    raceWins: z.ZodNumber;
    podiums: z.ZodNumber;
    totalLaps: z.ZodNullable<z.ZodNumber>;
    totalRaces: z.ZodNumber;
    lapsLead: z.ZodNullable<z.ZodNumber>;
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
        results: z.ZodArray<z.ZodObject<{
            round: z.ZodNumber;
            roundName: z.ZodString;
            constructor: z.ZodString & Function;
            points: z.ZodNumber;
            position: z.ZodNullable<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }, {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        year: number;
        results: {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }[];
    }, {
        year: number;
        results: {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    seasons: {
        year: number;
        results: {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }[];
    }[];
    code: string | null;
    name: string;
    nationality: string | null;
    driverId: number;
    driverRef: string;
    dob: string | null;
    raceWins: number;
    podiums: number;
    totalLaps: number | null;
    totalRaces: number;
    lapsLead: number | null;
    championshipStandings: {
        position: number | null;
        year: number;
    }[];
    image?: string | undefined;
}, {
    seasons: {
        year: number;
        results: {
            points: number;
            position: number | null;
            round: number;
            roundName: string;
            constructor: string;
        }[];
    }[];
    code: string | null;
    name: string;
    nationality: string | null;
    driverId: number;
    driverRef: string;
    dob: string | null;
    raceWins: number;
    podiums: number;
    totalLaps: number | null;
    totalRaces: number;
    lapsLead: number | null;
    championshipStandings: {
        position: number | null;
        year: number;
    }[];
    image?: string | undefined;
}>;
export type IDriverData = z.infer<typeof DriverData>;
