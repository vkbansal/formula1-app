import fs from 'node:fs';
import path from 'node:path';

import * as p2r from 'path-to-regexp';
import yaml from 'js-yaml';
import slugify from 'slugify';

const PATH_REGEX = /^--\s*path\s*:\s*(.+)$/m;
const META_REGEX = /^--\s*meta\s*:\s*(.+)$/m;
const QUERY_REGEX =
  /^--\s+([a-z0-9A-Z]+):query:start((?:.|\n)+?)--\s+\1:query:end$/gm;

/**
 * Replaces the current file extension with given extension
 * @param {String} filePath
 * @param {String} ext
 * @returns {String}
 */
function replaceExtension(filePath, ext) {
  return filePath.replace(path.extname(filePath), ext);
}

/**
 * Read SQL File and process the metadata
 * @param {String} filePath
 */
export async function readSQLFile(filePath) {
  const sqlFile = await fs.promises.readFile(
    path.join(process.cwd(), filePath),
    'utf8'
  );

  let outputPath = replaceExtension(filePath, '.json');
  let isPathParameterized = false;

  const expectedPath = sqlFile.match(PATH_REGEX);

  if (expectedPath) {
    outputPath = expectedPath[1];

    // TODO: handle invalid paths

    const keys = [];
    p2r.pathToRegexp(outputPath, keys);

    isPathParameterized = keys.length > 0;
  }

  const queryMatches = sqlFile.matchAll(QUERY_REGEX);
  const queries = [...queryMatches].reduce(
    (obj, match) => ({ ...obj, [match[1]]: match[2].trim() }),
    {}
  );

  if (!queries.main) {
    throw new Error(
      [
        'Could not find the main query.',
        'Please make sure that it is present and is properly delimited using "-- main:query:start" and "-- main:query:end"'
      ].join('\n')
    );
  }

  if (isPathParameterized && !queries.params) {
    throw new Error(
      [
        'Path is parameterized but, could not find the params the query.',
        'Please make sure that it is present and is properly delimited using "-- params:query:start" and "-- params:query:end"'
      ].join('\n')
    );
  }

  let meta = {};
  const metaMatch = sqlFile.match(META_REGEX);

  if (metaMatch) {
    meta = yaml.load(metaMatch[1]);
  }

  return {
    getOutputPath: isPathParameterized
      ? p2r.compile(outputPath, {
          encode: (str) => slugify(str, { lower: true })
        })
      : () => outputPath,
    queries,
    meta
  };
}
