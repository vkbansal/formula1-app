import type { DataEntryMap } from 'astro:content';

export type Context = DataEntryMap['seasons'][string]['data'];
