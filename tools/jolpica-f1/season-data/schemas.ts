import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAPIResponseSchema<T extends z.ZodRawShape>(schema: T) {
	return z.object({
		fromCache: z.boolean().optional(),
		MRData: z
			.object({
				xmlns: z.string(),
				series: z.string(),
				url: z.string().url(),
				limit: z.coerce.number(),
				offset: z.coerce.number(),
				total: z.coerce.number(),
			})
			.extend(schema),
	});
}

export const RaceSchema = z.object({
	season: z.coerce.number(),
	round: z.coerce.number(),
	url: z.string(),
	raceName: z.string(),
	date: z.string(),
	time: z.string(),
	Circuit: z.object({
		circuitId: z.string(),
		url: z.string(),
		circuitName: z.string(),
		Location: z.object({
			lat: z.string(),
			long: z.string(),
			locality: z.string(),
			country: z.string(),
		}),
	}),
});

export type Race = z.infer<typeof RaceSchema>;

export const ConstructorSchema = z.object({
	constructorId: z.string(),
	url: z.string(),
	name: z.string(),
	nationality: z.string(),
});

export const DriverSchema = z.object({
	driverId: z.string(),
	permanentNumber: z.string(),
	code: z.string(),
	url: z.string().url(),
	givenName: z.string(),
	familyName: z.string(),
	dateOfBirth: z.string().date(),
	nationality: z.string(),
});

export const DriverStandingsSchema = z.object({
	position: z.coerce.number().optional(),
	positionText: z.string(),
	points: z.coerce.number(),
	wins: z.coerce.number(),
	Driver: DriverSchema,
	Constructors: z.array(ConstructorSchema),
});

export const ConstructorStandingsSchema = z.object({
	position: z.coerce.number(),
	positionText: z.string(),
	points: z.coerce.number(),
	wins: z.coerce.number(),
	Constructor: ConstructorSchema,
});

export const ResultSchema = z.object({
	// number: z.string(),
	position: z.coerce.number(),
	positionText: z.string(),
	points: z.coerce.number(),
	Driver: DriverSchema,
	Constructor: ConstructorSchema.optional(),
	// grid: z.coerce.number().optional(),
	// laps: z.coerce.number().optional(),
	// status: z.string().optional(),
});
