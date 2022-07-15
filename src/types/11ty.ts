/* eslint-disable @typescript-eslint/no-explicit-any */
import type { F1GlobalData } from './data';

export interface Pagination<T> {
	items: T[];
	page: {
		previous: T | null;
		next: T | null;
		first: T;
		last: T;
	};
	pageNumber: number;
	previousPageLink: string | null;
	previous: string | null;
	nextPageLink: string | null;
	next: string | null;
	firstPageLink: string;
	lastPageLink: string;
	links: string[];
	pageLinks: string[];
	previousPageHref: string | null;
	nextPageHref: string | null;
	firstPageHref: string;
	lastPageHref: string;
	hrefs: string[];
	href: {
		previous: string | null;
		next: string | null;
		first: string;
		last: string;
	};
}

export interface EleventyData {
	version: string;
	generator: string;
	env: {
		source: string;
		config: string;
		root: string;
	};
}

export interface Page {
	date: Date;
	inputPath: string;
	fileSlug: string;
	filePathStem: string;
	outputFileExtension?: string;
	templateSyntax: string;
	url: string;
	outputPath: string;
}

export type EleventyComputedFn<
	T extends CommonData<any> = CommonData<any>,
	U = unknown,
> = (data: T) => Promise<U>;

export type EleventyComputed = EleventyComputedFn;

export interface CommonData<P = never> extends F1GlobalData {
	eleventy: EleventyData;
	pkg: Record<string, any>;
	page: Page;
	collections: { all: any[][] };
	pagination: P extends never ? never : Pagination<P>;
}

export interface CommonTemplateConfig<
	T extends CommonData<any> = CommonData<any>,
	U = unknown,
> {
	permalink: string | ((data: T) => string);
	pagination?: {
		data: string;
		size: number;
		alias?: string;
	};
	eleventyComputed?: EleventyComputedFn<T, U>;
}

export interface Context {
	filters: {
		assets(input: string, name?: string): string;
	};
	eleventy: CommonData;
}

export interface PreactThis {
	context: Context;
}
