import type { QueryOptions } from 'db';

export interface Seasons {
	year: number;
}

declare function getData(
	params?: unknown,
	options?: QueryOptions,
): Promise<Seasons[]>;

export default getData;
