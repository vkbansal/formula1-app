import { Datagen } from './Datagen.mjs';

const datagen = new Datagen();

await datagen.init();

const seasonsData = await datagen.executeQueryFromFile('seasons.sql');

await datagen.writeDataFile(
	'seasons.yaml',
	seasonsData.map(({ year }) => year),
);
// await datagen.homePage();
// await datagen.seasons(seasonsData);
await datagen.drivers();
// await datagen.constructors();

process.exit(0);
