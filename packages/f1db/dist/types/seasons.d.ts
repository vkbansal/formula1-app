import { z } from 'zod';
export declare const Team: z.ZodObject<{
    name: z.ZodString;
    constructorRef: z.ZodString;
    nationality: z.ZodNullable<z.ZodString>;
    drivers: z.ZodArray<z.ZodObject<{
        nationality: z.ZodNullable<z.ZodString>;
        driverRef: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        nationality: string | null;
        driverRef: string;
    }, {
        name: string;
        nationality: string | null;
        driverRef: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    drivers: {
        name: string;
        nationality: string | null;
        driverRef: string;
    }[];
    name: string;
    constructorRef: string;
    nationality: string | null;
}, {
    drivers: {
        name: string;
        nationality: string | null;
        driverRef: string;
    }[];
    name: string;
    constructorRef: string;
    nationality: string | null;
}>;
export type ITeam = z.infer<typeof Team>;
export declare const Podium: z.ZodObject<{
    driverRef: z.ZodString;
    constructorRef: z.ZodString;
    position: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    position: number;
    constructorRef: string;
    driverRef: string;
}, {
    position: number;
    constructorRef: string;
    driverRef: string;
}>;
export type IPodium = z.infer<typeof Podium>;
export declare const SeasonRound: z.ZodObject<{
    name: z.ZodString;
    round: z.ZodNumber;
    date: z.ZodString;
    circuit: z.ZodObject<Pick<{
        circuitId: z.ZodNumber;
        circuitRef: z.ZodString;
        name: z.ZodString;
        location: z.ZodNullable<z.ZodString>;
        country: z.ZodNullable<z.ZodString>;
        lat: z.ZodNullable<z.ZodNumber>;
        lng: z.ZodNullable<z.ZodNumber>;
        alt: z.ZodNullable<z.ZodNumber>;
        url: z.ZodString;
    }, "name" | "location" | "country">, "strip", z.ZodTypeAny, {
        name: string;
        location: string | null;
        country: string | null;
    }, {
        name: string;
        location: string | null;
        country: string | null;
    }>;
    podium: z.ZodArray<z.ZodObject<{
        driverRef: z.ZodString;
        constructorRef: z.ZodString;
        position: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        position: number;
        constructorRef: string;
        driverRef: string;
    }, {
        position: number;
        constructorRef: string;
        driverRef: string;
    }>, "many">;
    driverStandings: z.ZodArray<z.ZodObject<{
        points: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
        wins: z.ZodNumber;
        driverRef: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        points: number;
        position: number | null;
        wins: number;
        driverRef: string;
    }, {
        points: number;
        position: number | null;
        wins: number;
        driverRef: string;
    }>, "many">;
    constructorStandings: z.ZodArray<z.ZodObject<{
        points: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
        wins: z.ZodNumber;
        constructorRef: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        points: number;
        position: number | null;
        wins: number;
        constructorRef: string;
    }, {
        points: number;
        position: number | null;
        wins: number;
        constructorRef: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    round: number;
    date: string;
    circuit: {
        name: string;
        location: string | null;
        country: string | null;
    };
    podium: {
        position: number;
        constructorRef: string;
        driverRef: string;
    }[];
    driverStandings: {
        points: number;
        position: number | null;
        wins: number;
        driverRef: string;
    }[];
    constructorStandings: {
        points: number;
        position: number | null;
        wins: number;
        constructorRef: string;
    }[];
}, {
    name: string;
    round: number;
    date: string;
    circuit: {
        name: string;
        location: string | null;
        country: string | null;
    };
    podium: {
        position: number;
        constructorRef: string;
        driverRef: string;
    }[];
    driverStandings: {
        points: number;
        position: number | null;
        wins: number;
        driverRef: string;
    }[];
    constructorStandings: {
        points: number;
        position: number | null;
        wins: number;
        constructorRef: string;
    }[];
}>;
export type ISeasonRound = z.infer<typeof SeasonRound>;
export declare const SeasonData: z.ZodObject<{
    year: z.ZodNumber;
    rounds: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        round: z.ZodNumber;
        date: z.ZodString;
        circuit: z.ZodObject<Pick<{
            circuitId: z.ZodNumber;
            circuitRef: z.ZodString;
            name: z.ZodString;
            location: z.ZodNullable<z.ZodString>;
            country: z.ZodNullable<z.ZodString>;
            lat: z.ZodNullable<z.ZodNumber>;
            lng: z.ZodNullable<z.ZodNumber>;
            alt: z.ZodNullable<z.ZodNumber>;
            url: z.ZodString;
        }, "name" | "location" | "country">, "strip", z.ZodTypeAny, {
            name: string;
            location: string | null;
            country: string | null;
        }, {
            name: string;
            location: string | null;
            country: string | null;
        }>;
        podium: z.ZodArray<z.ZodObject<{
            driverRef: z.ZodString;
            constructorRef: z.ZodString;
            position: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            position: number;
            constructorRef: string;
            driverRef: string;
        }, {
            position: number;
            constructorRef: string;
            driverRef: string;
        }>, "many">;
        driverStandings: z.ZodArray<z.ZodObject<{
            points: z.ZodNumber;
            position: z.ZodNullable<z.ZodNumber>;
            wins: z.ZodNumber;
            driverRef: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }, {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }>, "many">;
        constructorStandings: z.ZodArray<z.ZodObject<{
            points: z.ZodNumber;
            position: z.ZodNullable<z.ZodNumber>;
            wins: z.ZodNumber;
            constructorRef: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }, {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        round: number;
        date: string;
        circuit: {
            name: string;
            location: string | null;
            country: string | null;
        };
        podium: {
            position: number;
            constructorRef: string;
            driverRef: string;
        }[];
        driverStandings: {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }[];
        constructorStandings: {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }[];
    }, {
        name: string;
        round: number;
        date: string;
        circuit: {
            name: string;
            location: string | null;
            country: string | null;
        };
        podium: {
            position: number;
            constructorRef: string;
            driverRef: string;
        }[];
        driverStandings: {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }[];
        constructorStandings: {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }[];
    }>, "many">;
    teams: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        constructorRef: z.ZodString;
        nationality: z.ZodNullable<z.ZodString>;
        drivers: z.ZodArray<z.ZodObject<{
            nationality: z.ZodNullable<z.ZodString>;
            driverRef: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            nationality: string | null;
            driverRef: string;
        }, {
            name: string;
            nationality: string | null;
            driverRef: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        drivers: {
            name: string;
            nationality: string | null;
            driverRef: string;
        }[];
        name: string;
        constructorRef: string;
        nationality: string | null;
    }, {
        drivers: {
            name: string;
            nationality: string | null;
            driverRef: string;
        }[];
        name: string;
        constructorRef: string;
        nationality: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    year: number;
    rounds: {
        name: string;
        round: number;
        date: string;
        circuit: {
            name: string;
            location: string | null;
            country: string | null;
        };
        podium: {
            position: number;
            constructorRef: string;
            driverRef: string;
        }[];
        driverStandings: {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }[];
        constructorStandings: {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }[];
    }[];
    teams: {
        drivers: {
            name: string;
            nationality: string | null;
            driverRef: string;
        }[];
        name: string;
        constructorRef: string;
        nationality: string | null;
    }[];
}, {
    year: number;
    rounds: {
        name: string;
        round: number;
        date: string;
        circuit: {
            name: string;
            location: string | null;
            country: string | null;
        };
        podium: {
            position: number;
            constructorRef: string;
            driverRef: string;
        }[];
        driverStandings: {
            points: number;
            position: number | null;
            wins: number;
            driverRef: string;
        }[];
        constructorStandings: {
            points: number;
            position: number | null;
            wins: number;
            constructorRef: string;
        }[];
    }[];
    teams: {
        drivers: {
            name: string;
            nationality: string | null;
            driverRef: string;
        }[];
        name: string;
        constructorRef: string;
        nationality: string | null;
    }[];
}>;
export type ISeasonData = z.infer<typeof SeasonData>;
