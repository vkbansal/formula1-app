import crypto from 'node:crypto';
import stringify from 'fast-json-stable-stringify';

import mariadb, { type Connection } from 'mariadb';
import Redis from 'ioredis';

// const PROD
const redis = new Redis();
let __DB: Connection;

export async function getDb(): Promise<Connection> {
	if (!__DB) {
		__DB = await mariadb.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'f1db',
			bigIntAsNumber: true,
			dateStrings: true,
		});
	}

	return __DB;
}

export interface QueryOptions {
	skipCache?: boolean;
}

export async function executeQuery<Data = unknown, Params = unknown>(
	sql: string,
	params?: Params,
	options: QueryOptions = {},
): Promise<Data> {
	const cacheKey = crypto
		.createHash('sha256')
		.update(stringify({ sql, params }))
		.digest('hex');

	if (!options.skipCache) {
		const cachedData = await redis.get(cacheKey);

		if (cachedData) {
			return JSON.parse(cachedData);
		}
	}

	const db = await getDb();
	const data = await db.query({ sql, namedPlaceholders: true }, params);

	redis.set(cacheKey, JSON.stringify(data));

	return data;
}
