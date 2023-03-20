import { z } from 'zod';
export declare const HomePageData: z.ZodObject<{
    races: z.ZodNumber;
    drivers: z.ZodNumber;
    seasons: z.ZodNumber;
    constructors: z.ZodNumber;
    driverChampions: z.ZodNumber;
    constructorChampions: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    races: number;
    drivers: number;
    seasons: number;
    constructors: number;
    driverChampions: number;
    constructorChampions: number;
}, {
    races: number;
    drivers: number;
    seasons: number;
    constructors: number;
    driverChampions: number;
    constructorChampions: number;
}>;
export type IHomePageData = z.infer<typeof HomePageData>;
