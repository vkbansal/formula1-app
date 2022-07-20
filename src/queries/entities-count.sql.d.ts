import type { QueryOptions } from 'db';

export interface EntitiesCount {
	seasons: number;
	drivers: number;
	constructors: number;
	circuits: number;
	races: number;
}

declare function getData(params?: unknown, options?: QueryOptions): Promise<EntitiesCount[]>;

export default getData;
