import type { QueryOptions } from 'db';

export interface EntitiesCount {
	seasons: number;
	drivers: number;
	driverNationalities: number;
	constructors: number;
	constructorNationalities: number;
	circuits: number;
	circuitCountries: number;
	races: number;
}

declare function getData(
	params?: unknown,
	options?: QueryOptions,
): Promise<EntitiesCount[]>;

export default getData;
