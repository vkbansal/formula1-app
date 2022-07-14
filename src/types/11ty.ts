import { F1GlobalData } from './data';

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

export interface CommonData<P = unknown> extends F1GlobalData {
	eleventy: EleventyData;
	pkg: Record<string, any>;
	page: Page;
	collections: { all: any[][] };
	pagination: P extends unknown ? never : Pagination<P>;
}
