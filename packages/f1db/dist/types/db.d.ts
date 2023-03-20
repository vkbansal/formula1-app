import { z } from 'zod';
export declare const Circuit: z.ZodObject<{
    circuitId: z.ZodNumber;
    circuitRef: z.ZodString;
    name: z.ZodString;
    location: z.ZodNullable<z.ZodString>;
    country: z.ZodNullable<z.ZodString>;
    lat: z.ZodNullable<z.ZodNumber>;
    lng: z.ZodNullable<z.ZodNumber>;
    alt: z.ZodNullable<z.ZodNumber>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    circuitId: number;
    circuitRef: string;
    name: string;
    location: string | null;
    country: string | null;
    lat: number | null;
    lng: number | null;
    alt: number | null;
    url: string;
}, {
    circuitId: number;
    circuitRef: string;
    name: string;
    location: string | null;
    country: string | null;
    lat: number | null;
    lng: number | null;
    alt: number | null;
    url: string;
}>;
export declare const ConstructorResult: z.ZodObject<{
    constructorResultsId: z.ZodNumber;
    raceId: z.ZodNumber;
    constructorId: z.ZodNumber;
    points: z.ZodNullable<z.ZodNumber>;
    status: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string | null;
    constructorResultsId: number;
    raceId: number;
    constructorId: number;
    points: number | null;
}, {
    status: string | null;
    constructorResultsId: number;
    raceId: number;
    constructorId: number;
    points: number | null;
}>;
export declare const ConstructorStanding: z.ZodObject<{
    constructorStandingsId: z.ZodNumber;
    raceId: z.ZodNumber;
    constructorId: z.ZodNumber;
    points: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    positionText: z.ZodNullable<z.ZodString>;
    wins: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    constructorId: number;
    points: number;
    constructorStandingsId: number;
    position: number | null;
    positionText: string | null;
    wins: number;
}, {
    raceId: number;
    constructorId: number;
    points: number;
    constructorStandingsId: number;
    position: number | null;
    positionText: string | null;
    wins: number;
}>;
export declare const Constructor: z.ZodObject<{
    constructorId: z.ZodNumber;
    constructorRef: z.ZodString;
    name: z.ZodString;
    nationality: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    url: string;
    constructorId: number;
    constructorRef: string;
    nationality: string | null;
}, {
    name: string;
    url: string;
    constructorId: number;
    constructorRef: string;
    nationality: string | null;
}>;
export declare const DriverStanding: z.ZodObject<{
    driverStandingsId: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    points: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    positionText: z.ZodNullable<z.ZodString>;
    wins: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    points: number;
    position: number | null;
    positionText: string | null;
    wins: number;
    driverStandingsId: number;
    driverId: number;
}, {
    raceId: number;
    points: number;
    position: number | null;
    positionText: string | null;
    wins: number;
    driverStandingsId: number;
    driverId: number;
}>;
export declare const Driver: z.ZodObject<{
    driverId: z.ZodNumber;
    driverRef: z.ZodString;
    number: z.ZodNullable<z.ZodNumber>;
    code: z.ZodNullable<z.ZodString>;
    forename: z.ZodString;
    surname: z.ZodString;
    dob: z.ZodNullable<z.ZodString>;
    nationality: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    number: number | null;
    code: string | null;
    url: string;
    nationality: string | null;
    driverId: number;
    driverRef: string;
    forename: string;
    surname: string;
    dob: string | null;
}, {
    number: number | null;
    code: string | null;
    url: string;
    nationality: string | null;
    driverId: number;
    driverRef: string;
    forename: string;
    surname: string;
    dob: string | null;
}>;
export declare const LapTime: z.ZodObject<{
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    lap: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    time: z.ZodNullable<z.ZodString>;
    milliseconds: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    position: number | null;
    driverId: number;
    lap: number;
    time: string | null;
    milliseconds: number | null;
}, {
    raceId: number;
    position: number | null;
    driverId: number;
    lap: number;
    time: string | null;
    milliseconds: number | null;
}>;
export declare const PitStop: z.ZodObject<{
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    stop: z.ZodNumber;
    lap: z.ZodNumber;
    time: z.ZodNumber;
    duration: z.ZodNullable<z.ZodString>;
    milliseconds: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    driverId: number;
    lap: number;
    time: number;
    milliseconds: number | null;
    stop: number;
    duration: string | null;
}, {
    raceId: number;
    driverId: number;
    lap: number;
    time: number;
    milliseconds: number | null;
    stop: number;
    duration: string | null;
}>;
export declare const Qualifying: z.ZodObject<{
    qualifyId: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    constructorId: z.ZodNumber;
    number: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    q1: z.ZodNullable<z.ZodString>;
    q2: z.ZodNullable<z.ZodString>;
    q3: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    raceId: number;
    constructorId: number;
    position: number | null;
    driverId: number;
    qualifyId: number;
    q1: string | null;
    q2: string | null;
    q3: string | null;
}, {
    number: number;
    raceId: number;
    constructorId: number;
    position: number | null;
    driverId: number;
    qualifyId: number;
    q1: string | null;
    q2: string | null;
    q3: string | null;
}>;
export declare const Race: z.ZodObject<{
    raceId: z.ZodNumber;
    year: z.ZodNumber;
    round: z.ZodNumber;
    circuitId: z.ZodNumber;
    name: z.ZodString;
    date: z.ZodString;
    time: z.ZodNullable<z.ZodNumber>;
    url: z.ZodNullable<z.ZodString>;
    fp1_date: z.ZodNullable<z.ZodString>;
    fp1_time: z.ZodNullable<z.ZodNumber>;
    fp2_date: z.ZodNullable<z.ZodString>;
    fp2_time: z.ZodNullable<z.ZodNumber>;
    fp3_date: z.ZodNullable<z.ZodString>;
    fp3_time: z.ZodNullable<z.ZodNumber>;
    quali_date: z.ZodNullable<z.ZodString>;
    quali_time: z.ZodNullable<z.ZodNumber>;
    sprint_date: z.ZodNullable<z.ZodString>;
    sprint_time: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    circuitId: number;
    name: string;
    url: string | null;
    raceId: number;
    time: number | null;
    year: number;
    round: number;
    date: string;
    fp1_date: string | null;
    fp1_time: number | null;
    fp2_date: string | null;
    fp2_time: number | null;
    fp3_date: string | null;
    fp3_time: number | null;
    quali_date: string | null;
    quali_time: number | null;
    sprint_date: string | null;
    sprint_time: number | null;
}, {
    circuitId: number;
    name: string;
    url: string | null;
    raceId: number;
    time: number | null;
    year: number;
    round: number;
    date: string;
    fp1_date: string | null;
    fp1_time: number | null;
    fp2_date: string | null;
    fp2_time: number | null;
    fp3_date: string | null;
    fp3_time: number | null;
    quali_date: string | null;
    quali_time: number | null;
    sprint_date: string | null;
    sprint_time: number | null;
}>;
export declare const Result: z.ZodObject<{
    resultId: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    constructorId: z.ZodNumber;
    number: z.ZodNumber;
    grid: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    positionText: z.ZodString;
    positionOrder: z.ZodNumber;
    points: z.ZodNumber;
    laps: z.ZodNumber;
    time: z.ZodNullable<z.ZodString>;
    milliseconds: z.ZodNullable<z.ZodNumber>;
    fastestLap: z.ZodNullable<z.ZodNumber>;
    rank: z.ZodNumber;
    fastestLapTime: z.ZodNullable<z.ZodString>;
    fastestLapSpeed: z.ZodNullable<z.ZodString>;
    statusId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    number: number;
    raceId: number;
    constructorId: number;
    points: number;
    position: number | null;
    positionText: string;
    driverId: number;
    time: string | null;
    milliseconds: number | null;
    resultId: number;
    grid: number;
    positionOrder: number;
    laps: number;
    fastestLap: number | null;
    rank: number;
    fastestLapTime: string | null;
    fastestLapSpeed: string | null;
    statusId: number;
}, {
    number: number;
    raceId: number;
    constructorId: number;
    points: number;
    position: number | null;
    positionText: string;
    driverId: number;
    time: string | null;
    milliseconds: number | null;
    resultId: number;
    grid: number;
    positionOrder: number;
    laps: number;
    fastestLap: number | null;
    rank: number;
    fastestLapTime: string | null;
    fastestLapSpeed: string | null;
    statusId: number;
}>;
export declare const Season: z.ZodObject<{
    year: z.ZodNumber;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    year: number;
}, {
    url: string;
    year: number;
}>;
export declare const SprintResult: z.ZodObject<{
    sprintResultId: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    constructorId: z.ZodNumber;
    number: z.ZodNumber;
    grid: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
    positionText: z.ZodString;
    positionOrder: z.ZodNumber;
    points: z.ZodNumber;
    laps: z.ZodNumber;
    time: z.ZodNullable<z.ZodString>;
    milliseconds: z.ZodNullable<z.ZodNumber>;
    fastestLap: z.ZodNullable<z.ZodNumber>;
    fastestLapTime: z.ZodNullable<z.ZodString>;
    statusId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    number: number;
    raceId: number;
    constructorId: number;
    points: number;
    position: number | null;
    positionText: string;
    driverId: number;
    time: string | null;
    milliseconds: number | null;
    grid: number;
    positionOrder: number;
    laps: number;
    fastestLap: number | null;
    fastestLapTime: string | null;
    statusId: number;
    sprintResultId: number;
}, {
    number: number;
    raceId: number;
    constructorId: number;
    points: number;
    position: number | null;
    positionText: string;
    driverId: number;
    time: string | null;
    milliseconds: number | null;
    grid: number;
    positionOrder: number;
    laps: number;
    fastestLap: number | null;
    fastestLapTime: string | null;
    statusId: number;
    sprintResultId: number;
}>;
export declare const Status: z.ZodObject<{
    statusId: z.ZodNumber;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    statusId: number;
}, {
    status: string;
    statusId: number;
}>;
export declare const DriverChampionship: z.ZodObject<{
    driverChampionshipId: z.ZodNumber;
    year: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    position: number | null;
    driverId: number;
    year: number;
    driverChampionshipId: number;
}, {
    raceId: number;
    position: number | null;
    driverId: number;
    year: number;
    driverChampionshipId: number;
}>;
export declare const ConstructorChampionship: z.ZodObject<{
    driverChampionshipId: z.ZodNumber;
    year: z.ZodNumber;
    raceId: z.ZodNumber;
    driverId: z.ZodNumber;
    position: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    raceId: number;
    position: number | null;
    driverId: number;
    year: number;
    driverChampionshipId: number;
}, {
    raceId: number;
    position: number | null;
    driverId: number;
    year: number;
    driverChampionshipId: number;
}>;
