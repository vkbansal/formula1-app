const ordinalSuffixes = new Map([
	['one', 'st'],
	['two', 'nd'],
	['few', 'rd'],
	['other', 'th'],
]);
const ordinalIntl = new Intl.PluralRules('en-IN', { type: 'ordinal' });

export function formatOrdinals(n: number): string {
	return `${n}${ordinalSuffixes.get(ordinalIntl.select(n))}`;
}

export function normalize<T>(data: T): T {
	if (typeof data === 'string') {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return data.normalize('NFD') as any;
	}

	return data;
}
