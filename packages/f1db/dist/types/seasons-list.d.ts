import { z } from 'zod';
export declare const SeasonsList: z.ZodArray<z.ZodObject<Pick<{
    year: z.ZodNumber;
    url: z.ZodString;
}, "year">, "strip", z.ZodTypeAny, {
    year: number;
}, {
    year: number;
}>, "many">;
export type ISeasonsList = z.infer<typeof SeasonsList>;
