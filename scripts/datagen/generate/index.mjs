import mariadb from 'mariadb';
import { globby } from 'globby';
import ora from 'ora';
import chalk from 'chalk';

import { readSQLFile } from './readSQLFile.mjs';
import { writeDataFile } from './writeDataFile.mjs';

const spinner = ora('Generating data').start();

export default async function generate({ input, output }) {
  const connection = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'f1db',
    bigIntAsNumber: true,
    dateStrings: true
  });

  const filePaths = await globby(input);

  // loop over all the sql files
  for (const filePath of filePaths) {
    const {
      paramsQuery,
      mainQuery,
      meta: metadata,
      getOutputPath
    } = await readSQLFile(filePath);

    let params = [];

    if (paramsQuery) {
      params = await connection.query(paramsQuery);
    } else {
      // for non parameterized queries just populate an empty object
      params.push({});
    }

    // now that parameters are collected, run the main query
    for (const param of params) {
      spinner.text = chalk.cyan(
        `Executing main query from ${filePath} with params: ${JSON.stringify(
          param
        )}`
      );

      const data = await connection.query(
        { namedPlaceholders: true, sql: mainQuery },
        param
      );

      const outputPath = getOutputPath(param);

      await writeDataFile({
        data: metadata.pickFirst === true ? data[0] : data,
        inputPath: filePath,
        outputPath,
        spinner,
        outDir: output
      });
    }
  }

  spinner.stop();

  return connection.end();
}
