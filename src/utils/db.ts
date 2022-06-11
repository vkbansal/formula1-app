import { MongoClient, type Db as MongoDb } from 'mongodb';
import Redis from 'ioredis';

const mongo_client = new MongoClient('mongodb://localhost:27017');
const redis_client = new Redis();

let DB_CONNECTED = false;

export async function getDB(): Promise<MongoDb> {
  if (!DB_CONNECTED) {
    await mongo_client.connect();
    DB_CONNECTED = true;
  }

  return mongo_client.db('formula1');
}

export async function getRedisClient(): Promise<Redis> {
  return redis_client;
}

export interface QueryOptions {
  skipCache?: boolean;
}

export async function query<T = unknown>(
  key: string,
  queryFn: (db: MongoDb) => Promise<T>,
  opts: QueryOptions = {}
): Promise<T> {
  if (typeof key !== 'string') {
    throw new Error('key must a string');
  }

  if (typeof query !== 'function') {
    throw new Error('query must a function');
  }

  const redis = await getRedisClient();

  if (opts.skipCache) {
    await redis.del(key);
  } else {
    const redisData = await redis.get(key);

    if (redisData) {
      return JSON.parse(redisData);
    }
  }

  const db = await getDB();

  const data = await queryFn(db);

  if (redis) {
    await redis.set(key, JSON.stringify(data));
  }

  return data;
}
