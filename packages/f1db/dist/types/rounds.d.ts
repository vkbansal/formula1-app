import { z } from 'zod';
export declare const RaceCircuit: z.ZodObject<Pick<{
    circuitId: z.ZodNumber;
    circuitRef: z.ZodString;
    name: z.ZodString;
    location: z.ZodNullable<z.ZodString>;
    country: z.ZodNullable<z.ZodString>;
    lat: z.ZodNullable<z.ZodNumber>;
    lng: z.ZodNullable<z.ZodNumber>;
    alt: z.ZodNullable<z.ZodNumber>;
    url: z.ZodString;
}, "circuitRef" | "name" | "location" | "country">, "strip", z.ZodTypeAny, {
    circuitRef: string;
    name: string;
    location: string | null;
    country: string | null;
}, {
    circuitRef: string;
    name: string;
    location: string | null;
    country: string | null;
}>;
export type IRaceCircuit = z.infer<typeof RaceCircuit>;
export declare const DriverData: z.ZodObject<{
    points: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    positionText: z.ZodString;
    grid: z.ZodNumber;
    positionOrder: z.ZodNumber;
    driverRef: z.ZodString;
    constructorRef: z.ZodString;
    qualifying: z.ZodOptional<z.ZodObject<Pick<{
        qualifyId: z.ZodNumber;
        raceId: z.ZodNumber;
        driverId: z.ZodNumber;
        constructorId: z.ZodNumber;
        number: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
        q1: z.ZodNullable<z.ZodString>;
        q2: z.ZodNullable<z.ZodString>;
        q3: z.ZodNullable<z.ZodString>;
    }, "position" | "q1" | "q2" | "q3">, "strip", z.ZodTypeAny, {
        position: number | null;
        q1: string | null;
        q2: string | null;
        q3: string | null;
    }, {
        position: number | null;
        q1: string | null;
        q2: string | null;
        q3: string | null;
    }>>;
    lapPositions: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
    pitStops: z.ZodDefault<z.ZodArray<z.ZodObject<Pick<{
        raceId: z.ZodNumber;
        driverId: z.ZodNumber;
        stop: z.ZodNumber;
        lap: z.ZodNumber;
        time: z.ZodNumber;
        duration: z.ZodNullable<z.ZodString>;
        milliseconds: z.ZodNullable<z.ZodNumber>;
    }, "lap" | "stop">, "strip", z.ZodTypeAny, {
        lap: number;
        stop: number;
    }, {
        lap: number;
        stop: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    points: number;
    position: number | null;
    positionText: string;
    constructorRef: string;
    driverRef: string;
    grid: number;
    positionOrder: number;
    lapPositions: (number | null)[];
    pitStops: {
        lap: number;
        stop: number;
    }[];
    qualifying?: {
        position: number | null;
        q1: string | null;
        q2: string | null;
        q3: string | null;
    } | undefined;
}, {
    points: number;
    position: number | null;
    positionText: string;
    constructorRef: string;
    driverRef: string;
    grid: number;
    positionOrder: number;
    qualifying?: {
        position: number | null;
        q1: string | null;
        q2: string | null;
        q3: string | null;
    } | undefined;
    lapPositions?: (number | null)[] | undefined;
    pitStops?: {
        lap: number;
        stop: number;
    }[] | undefined;
}>;
export type IRaceResult = z.infer<typeof DriverData>;
export declare const RaceData: z.ZodObject<{
    name: z.ZodString;
    raceId: z.ZodNumber;
    year: z.ZodNumber;
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
    }, "circuitRef" | "name" | "location" | "country">, "strip", z.ZodTypeAny, {
        circuitRef: string;
        name: string;
        location: string | null;
        country: string | null;
    }, {
        circuitRef: string;
        name: string;
        location: string | null;
        country: string | null;
    }>;
    driversData: z.ZodArray<z.ZodObject<{
        points: z.ZodNumber;
        position: z.ZodNullable<z.ZodNumber>;
        positionText: z.ZodString;
        grid: z.ZodNumber;
        positionOrder: z.ZodNumber;
        driverRef: z.ZodString;
        constructorRef: z.ZodString;
        qualifying: z.ZodOptional<z.ZodObject<Pick<{
            qualifyId: z.ZodNumber;
            raceId: z.ZodNumber;
            driverId: z.ZodNumber;
            constructorId: z.ZodNumber;
            number: z.ZodNumber;
            position: z.ZodNullable<z.ZodNumber>;
            q1: z.ZodNullable<z.ZodString>;
            q2: z.ZodNullable<z.ZodString>;
            q3: z.ZodNullable<z.ZodString>;
        }, "position" | "q1" | "q2" | "q3">, "strip", z.ZodTypeAny, {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        }, {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        }>>;
        lapPositions: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
        pitStops: z.ZodDefault<z.ZodArray<z.ZodObject<Pick<{
            raceId: z.ZodNumber;
            driverId: z.ZodNumber;
            stop: z.ZodNumber;
            lap: z.ZodNumber;
            time: z.ZodNumber;
            duration: z.ZodNullable<z.ZodString>;
            milliseconds: z.ZodNullable<z.ZodNumber>;
        }, "lap" | "stop">, "strip", z.ZodTypeAny, {
            lap: number;
            stop: number;
        }, {
            lap: number;
            stop: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        points: number;
        position: number | null;
        positionText: string;
        constructorRef: string;
        driverRef: string;
        grid: number;
        positionOrder: number;
        lapPositions: (number | null)[];
        pitStops: {
            lap: number;
            stop: number;
        }[];
        qualifying?: {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        } | undefined;
    }, {
        points: number;
        position: number | null;
        positionText: string;
        constructorRef: string;
        driverRef: string;
        grid: number;
        positionOrder: number;
        qualifying?: {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        } | undefined;
        lapPositions?: (number | null)[] | undefined;
        pitStops?: {
            lap: number;
            stop: number;
        }[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    raceId: number;
    year: number;
    round: number;
    date: string;
    circuit: {
        circuitRef: string;
        name: string;
        location: string | null;
        country: string | null;
    };
    driversData: {
        points: number;
        position: number | null;
        positionText: string;
        constructorRef: string;
        driverRef: string;
        grid: number;
        positionOrder: number;
        lapPositions: (number | null)[];
        pitStops: {
            lap: number;
            stop: number;
        }[];
        qualifying?: {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        } | undefined;
    }[];
}, {
    name: string;
    raceId: number;
    year: number;
    round: number;
    date: string;
    circuit: {
        circuitRef: string;
        name: string;
        location: string | null;
        country: string | null;
    };
    driversData: {
        points: number;
        position: number | null;
        positionText: string;
        constructorRef: string;
        driverRef: string;
        grid: number;
        positionOrder: number;
        qualifying?: {
            position: number | null;
            q1: string | null;
            q2: string | null;
            q3: string | null;
        } | undefined;
        lapPositions?: (number | null)[] | undefined;
        pitStops?: {
            lap: number;
            stop: number;
        }[] | undefined;
    }[];
}>;
export type IRaceData = z.infer<typeof RaceData>;
