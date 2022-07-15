import mariadb from 'mariadb';
import { globby } from 'globby';
import ora from 'ora';
import chalk from 'chalk';
import yaml from 'js-yaml';

import { readSQLFile } from './readSQLFile.mjs';
import { writeDataFile } from './writeDataFile.mjs';

const spinner = ora('Generating data').start();

export default async function generate({ input, output }) {
	const connection = await mariadb.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'f1db',
		bigIntAsNumber: true,
		dateStrings: true,
	});

	const filePaths = await globby(input);

	// loop over all the sql files
	for (const filePath of filePaths) {
		const {
			queries,
			meta: metadata,
			getOutputPath,
		} = await readSQLFile(filePath);

		let params = [];

		if (queries.params) {
			params = await connection.query(queries.params);
		} else {
			// for non parameterized queries just make the array length as 1
			params.push(null);
		}

		// now that parameters are collected, run the main query
		for (const param of params) {
			let text = `Executing main query from ${filePath}`;

			if (param) {
				text += `\nwith the following params:\n${yaml.dump(param)}`;
			}

			spinner.text = chalk.cyan(text);

			const data = await connection.query(
				{ namedPlaceholders: true, sql: queries.main },
				param,
			);

			const outputPath = getOutputPath(param);

			await writeDataFile({
				data: metadata.pickFirst === true ? data[0] : data,
				inputPath: filePath,
				outputPath,
				spinner,
				outDir: output,
			});
		}
	}

	spinner.stop();

	return connection.end();
}
