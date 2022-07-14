import { readJson } from 'helpers/readJson';

export type Seasons = number[];

export default async (): Promise<Seasons> => {
	const data = await readJson<Array<{ year: number }>>('data/seasons.json');

	return data.map((row) => row.year);
};
