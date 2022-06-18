import fs from 'node:fs';
import path from 'node:path';

import { MongoClient } from 'mongodb';
import { globby } from 'globby';
import yaml from 'js-yaml';

const mongo_client = new MongoClient('mongodb://localhost:27017');

await mongo_client.connect();

const db = mongo_client.db('formula1');

const queries = await globby(['datagen/queries/*.mjs']);

async function writeData({ data, path: filepath }) {
  const finalPath = path.resolve('datastore', filepath);
  const dir = path.dirname(finalPath);

  console.log(`Writing: ${filepath}`);

  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }

  await fs.promises.writeFile(
    path.resolve('datastore', filepath),
    yaml.dump(data),
    'utf8'
  );

  console.log(`Done writing: ${filepath}`);
}

for (const file of queries) {
  const relativePath = path.relative('datagen', file);
  const { query } = await import(`./${relativePath}`);

  if (typeof query !== 'function') {
    throw new Error(''); // TODO: write error message
  }

  console.log(`Running query from ${relativePath}`);
  const queryData = await query(db);
  console.log(`Completed query from ${relativePath}`);

  if (Array.isArray(queryData)) {
    const writeAll = queryData.map(writeData);
    await Promise.all(writeAll);
  } else {
    await writeData(queryData);
  }
}

process.exit(0);
