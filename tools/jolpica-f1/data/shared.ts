import { z } from 'astro/zod';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAPIResponseSchema<T extends z.ZodRawShape>(schema: T) {
	return z.object({
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
