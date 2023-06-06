import { z } from 'zod';
import { Race, Circuit, Result, PitStop, Qualifying } from './db.js';

export const RaceCircuit = Circuit.pick({
	name: true,
	country: true,
	location: true,
	circuitRef: true,
});

export type IRaceCircuit = z.infer<typeof RaceCircuit>;

export const DriverData = Result.pick({
	grid: true,
	points: true,
	position: true,
	positionOrder: true,
	positionText: true,
}).extend({
	driverRef: z.string(),
	constructorRef: z.string(),
	qualifying: Qualifying.pick({ position: true, q1: true, q2: true, q3: true }).optional(),
	lapPositions: z.array(z.number().nullable()).default([]),
	pitStops: z.array(PitStop.pick({ lap: true, stop: true })).default([]),
});

export type IRaceResult = z.infer<typeof DriverData>;

export const RaceData = Race.pick({
	raceId: true,
	year: true,
	round: true,
	date: true,
	name: true,
}).extend({
	circuit: RaceCircuit,
	driversData: z.array(DriverData),
});

export type IRaceData = z.infer<typeof RaceData>;
