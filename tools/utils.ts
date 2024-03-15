export function groupByAndMapValues<T, U>(
	arr: ReadonlyArray<T>,
	groupBy: keyof T | ((item: T) => string | number),
	mapValue: (value: T, index: number) => U,
): Record<string, U[]> {
	return arr.reduce<Record<string, U[]>>((acc, item, index) => {
		const value =
			typeof groupBy === 'function' ? groupBy(item) : (item[groupBy] as string);

		if (!Array.isArray(acc[value])) {
			acc[value] = [];
		}
		acc[value]!.push(mapValue(item, index));

		return acc;
	}, {});
}

export function createIndexMap<T>(
	arr: ReadonlyArray<T>,
	key: keyof T | ((item: T) => string | number),
): Record<string | number, number> {
	return arr.reduce<Record<string | number, number>>((acc, item, index) => {
		const keyValue =
			typeof key === 'function' ? key(item) : (item[key] as string);

		acc[keyValue] = index;
		return acc;
	}, {});
}

export function uniqWith<T>(
	arr: ReadonlyArray<T>,
	comparator: (a: T, b: T) => boolean,
): T[] {
	return arr.reduce<T[]>((acc, item) => {
		if (!acc.some((accItem) => comparator(accItem, item))) {
			acc.push(item);
		}
		return acc;
	}, []);
}
