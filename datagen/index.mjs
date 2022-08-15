import ora from 'ora';
import { Datagen } from './Datagen.mjs';

const spinner = ora('').start();

const datagen = new Datagen(spinner);

await datagen.init();

await datagen.seasons();
await datagen.homePage();
await datagen.drivers();
await datagen.constructors();

spinner.stop();
process.exit(0);
