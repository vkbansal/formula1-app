import type { DataEntryMap } from 'astro:content';

export interface Context {
	data: DataEntryMap['constructors'][string]['data'];
}
