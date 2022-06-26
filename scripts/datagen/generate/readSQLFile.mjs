import fs from 'node:fs';
import path from 'node:path';

import * as p2r from 'path-to-regexp';
import yaml from 'js-yaml';
import slugify from 'slugify';

import {
  PATH_REGEX,
  META_REGEX,
  getQueryDelimiterRegex,
  replaceExtension
} from './utils.mjs';

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

  const mainQueryMatch = sqlFile.match(getQueryDelimiterRegex('main'));

  if (!mainQueryMatch) {
    throw new Error(
      [
        'Could not find the main query.',
        'Please make sure that it is present and is properly delimited using "-- main:query:start" and "-- main:query:end"'
      ].join('\n')
    );
  }

  let meta = {};
  const metaMatch = sqlFile.match(META_REGEX);

  if (metaMatch) {
    meta = yaml.load(metaMatch[1]);
  }

  let paramsQuery;

  if (isPathParameterized) {
    const paramsQueryMatch = sqlFile.match(getQueryDelimiterRegex('params'));

    if (!paramsQueryMatch) {
      throw new Error(
        [
          'Path is parameterized but, could not find the params the query.',
          'Please make sure that it is present and is properly delimited using "-- params:query:start" and "-- params:query:end"'
        ].join('\n')
      );
    }

    paramsQuery = paramsQueryMatch[1].trim();
  }

  return {
    getOutputPath: isPathParameterized
      ? p2r.compile(outputPath, {
          encode: (str) => slugify(str, { lower: true })
        })
      : () => outputPath,
    paramsQuery,
    mainQuery: mainQueryMatch[1].trim(),
    meta
  };
}
