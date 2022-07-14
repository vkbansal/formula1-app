export function pick<T, U extends keyof T>(obj: T, keys: U[]): Pick<T, U> {
	return keys.reduce(
		(og, key) => ({
			...og,
			[key]: obj[key]
		}),
		{}
	) as Pick<T, U>;
}

export function omit<T, U extends keyof T>(obj: T, keys: U[]): Omit<T, U> {
	const objKeys = new Set<U>(Object.keys(obj) as U[]);

	keys.forEach((key) => objKeys.delete(key as U));

	return pick(obj, [...objKeys]) as unknown as Omit<T, U>;
}

export function mapKeys<T = unknown, U = unknown, V extends keyof U = never>(
	obj: U,
	fn: (key: V, value: U[V], o: U) => string
): V {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [fn(key as V, value, obj), value])
	) as unknown as V;
}

export function mapValues<T, U extends keyof T, V>(
	obj: T,
	fn: (key: U, value: T[U], o: T) => V
): Record<U, V> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key as U,
			fn(key as U, value, obj)
		])
	) as Record<U, V>;
}
