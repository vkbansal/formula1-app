const getDB = require('./db');
const getRedis = require('./redis');

module.exports = async function (key, query) {
  if (typeof key !== 'string') {
    throw new Error('key must a string');
  }

  if (typeof query !== 'function') {
    throw new Error('query must a function');
  }

  const redis = await getRedis();
  const redisData = await redis.get(key);

  if (redisData) {
    return JSON.parse(redisData);
  }

  const db = await getDB();

  const data = await query(db);

  await redis.set(key, JSON.stringify(data));

  return data;
};
