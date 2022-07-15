import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import generate from './generate/index.mjs';

yargs(hideBin(process.argv))
	.version(false)
	.scriptName('mariadb-datagen')
	.usage('$0 <cmd> [args]')
	.command(
		'generate',
		'Generate data from SQL files',
		(y) => {
			y.option('i', {
				alias: 'input',
				description: 'Path/Glob to SQL query files to be used for generation',
				array: true,
				demandOption: false,
				default: ['queries/**/*.sql'],
			}).option('o', {
				alias: 'output',
				description: 'Path to write the output data',
				demandOption: false,
				default: 'data',
			});
		},
		generate,
	)
	.help()
	.demandCommand().argv;
