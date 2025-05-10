import type { DataEntryMap } from 'astro:content';

export type SeasonContext = Omit<
	DataEntryMap['seasons'][string]['data'],
	'rounds'
> & {
	rounds: Array<{ id: string; round: number }>;
	round: DataEntryMap['seasons'][string]['data']['rounds'][number];
};
