/* eslint-disable camelcase */
import { z } from 'zod';
export const Circuit = z.object({
    circuitId: z.number(),
    circuitRef: z.string(),
    name: z.string(),
    location: z.string().nullable(),
    country: z.string().nullable(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    alt: z.number().nullable(),
    url: z.string(),
});
export const ConstructorResult = z.object({
    constructorResultsId: z.number(),
    raceId: z.number(),
    constructorId: z.number(),
    points: z.number().nullable(),
    status: z.string().nullable(),
});
export const ConstructorStanding = z.object({
    constructorStandingsId: z.number(),
    raceId: z.number(),
    constructorId: z.number(),
    points: z.number(),
    position: z.number().nullable(),
    positionText: z.string().nullable(),
    wins: z.number(),
});
export const Constructor = z.object({
    constructorId: z.number(),
    constructorRef: z.string(),
    name: z.string(),
    nationality: z.string().nullable(),
    url: z.string(),
});
export const DriverStanding = z.object({
    driverStandingsId: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    points: z.number(),
    position: z.number().nullable(),
    positionText: z.string().nullable(),
    wins: z.number(),
});
export const Driver = z.object({
    driverId: z.number(),
    driverRef: z.string(),
    number: z.number().nullable(),
    code: z.string().nullable(),
    forename: z.string(),
    surname: z.string(),
    dob: z.string().nullable(),
    nationality: z.string().nullable(),
    url: z.string(),
});
export const LapTime = z.object({
    raceId: z.number(),
    driverId: z.number(),
    lap: z.number(),
    position: z.number().nullable(),
    time: z.string().nullable(),
    milliseconds: z.number().nullable(),
});
export const PitStop = z.object({
    raceId: z.number(),
    driverId: z.number(),
    stop: z.number(),
    lap: z.number(),
    time: z.number(),
    duration: z.string().nullable(),
    milliseconds: z.number().nullable(),
});
export const Qualifying = z.object({
    qualifyId: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    constructorId: z.number(),
    number: z.number(),
    position: z.number().nullable(),
    q1: z.string().nullable(),
    q2: z.string().nullable(),
    q3: z.string().nullable(),
});
export const Race = z.object({
    raceId: z.number(),
    year: z.number(),
    round: z.number(),
    circuitId: z.number(),
    name: z.string(),
    date: z.string(),
    time: z.number().nullable(),
    url: z.string().nullable(),
    fp1_date: z.string().nullable(),
    fp1_time: z.number().nullable(),
    fp2_date: z.string().nullable(),
    fp2_time: z.number().nullable(),
    fp3_date: z.string().nullable(),
    fp3_time: z.number().nullable(),
    quali_date: z.string().nullable(),
    quali_time: z.number().nullable(),
    sprint_date: z.string().nullable(),
    sprint_time: z.number().nullable(),
});
export const Result = z.object({
    resultId: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    constructorId: z.number(),
    number: z.number(),
    grid: z.number(),
    position: z.number().nullable(),
    positionText: z.string(),
    positionOrder: z.number(),
    points: z.number(),
    laps: z.number(),
    time: z.string().nullable(),
    milliseconds: z.number().nullable(),
    fastestLap: z.number().nullable(),
    rank: z.number(),
    fastestLapTime: z.string().nullable(),
    fastestLapSpeed: z.string().nullable(),
    statusId: z.number(),
});
export const Season = z.object({
    year: z.number(),
    url: z.string(),
});
export const SprintResult = z.object({
    sprintResultId: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    constructorId: z.number(),
    number: z.number(),
    grid: z.number(),
    position: z.number().nullable(),
    positionText: z.string(),
    positionOrder: z.number(),
    points: z.number(),
    laps: z.number(),
    time: z.string().nullable(),
    milliseconds: z.number().nullable(),
    fastestLap: z.number().nullable(),
    fastestLapTime: z.string().nullable(),
    statusId: z.number(),
});
export const Status = z.object({
    statusId: z.number(),
    status: z.string(),
});
export const DriverChampionship = z.object({
    driverChampionshipId: z.number(),
    year: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    position: z.number().nullable(),
});
export const ConstructorChampionship = z.object({
    driverChampionshipId: z.number(),
    year: z.number(),
    raceId: z.number(),
    driverId: z.number(),
    position: z.number().nullable(),
});
