import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';

export async function writeDataFile(options) {
  const { data, /*inputPath,*/ outDir, outputPath, spinner } = options;
  const finalPath = path.resolve(outDir, outputPath);
  const dir = path.dirname(finalPath);

  // const { processData } = await importIfExists(`${inputPath}.mjs`);

  // if (typeof processData === 'function') {
  //   console.log(chalk.cyan(`INFO: Processing data using: ${inputPath}.mjs`));
  //   data = processData(data);
  // }

  spinner.text = chalk.cyan(`Writing: ${outputPath}`);

  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }

  await fs.promises.writeFile(finalPath, JSON.stringify(data, null, 2), 'utf8');

  spinner.text = chalk.green(`Done writing: ${outputPath}`);
}
