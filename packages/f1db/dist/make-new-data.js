/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z, ZodError } from 'zod';
import prompts from 'prompts';
import meow from 'meow';
import mariadb from 'mariadb';
import { SingleBar, Presets } from 'cli-progress';
import stringify from 'fast-json-stable-stringify';
import prettier from 'prettier';
import driverImages from './driver-images.json' assert { type: 'json' };
import { HomePageData } from './types/homepage.js';
import { SeasonsList } from './types/seasons-list.js';
import * as driverTypes from './types/drivers.js';
import * as contructorTypes from './types/constructors.js';
import * as seasonTypes from './types/seasons.js';
import * as raceTypes from './types/rounds.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const queries_dir = path.resolve(__dirname, '../queries');
const data_dir = path.resolve(__dirname, '../data');
/** CLI INIT ******************************************************************/
const cli = meow('', {
    importMeta: import.meta,
    flags: {
        query: { type: 'string', isMultiple: true },
        allQueries: { type: 'boolean' },
        debug: { type: 'boolean' },
    },
});
const { query: queries = [], allQueries, debug } = cli.flags;
/** DB INIT *******************************************************************/
const db = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'f1db',
    bigIntAsNumber: true,
    dateStrings: true,
});
/** Common Functions **********************************************************/
function debugLog(msg) {
    if (debug) {
        console.log(msg);
    }
}
function formatZodError(e) {
    switch (e.code) {
        case 'invalid_arguments':
            return `${e.path.join('.')} =>`;
        case 'invalid_date':
            return `${e.path.join('.')} =>`;
        case 'invalid_enum_value':
            return `${e.path.join('.')} =>`;
        case 'invalid_intersection_types':
            return `${e.path.join('.')} =>`;
        case 'invalid_literal':
            return `${e.path.join('.')} =>`;
        case 'invalid_return_type':
            return `${e.path.join('.')} =>`;
        case 'invalid_string':
            return `${e.path.join('.')} =>`;
        case 'invalid_type':
            return `${e.path.join('.')} => Expected: ${e.expected}; received: ${e.received};`;
        case 'invalid_union':
            return `${e.path.join('.')} =>`;
        case 'invalid_union_discriminator':
            return `${e.path.join('.')} =>`;
        case 'not_finite':
            return `${e.path.join('.')} =>`;
        case 'not_multiple_of':
            return `${e.path.join('.')} =>`;
        case 'too_big':
            return `${e.path.join('.')} =>`;
        case 'too_small':
            return `${e.path.join('.')} =>`;
        case 'unrecognized_keys':
            return `${e.path.join('.')} =>`;
        default:
            return stringify(e);
    }
}
const queryCache = {};
async function executeQueryFromFile(filepath, params = {}) {
    const sql = queryCache[filepath] || (await fs.readFile(path.resolve(queries_dir, filepath), 'utf8'));
    debugLog(`executing query from ${filepath} with params => ${JSON.stringify(params)}`);
    if (!queryCache[filepath]) {
        queryCache[filepath] = sql;
    }
    const data = await db.query({ sql, namedPlaceholders: true, bigIntAsNumber: true }, params);
    return data;
}
async function writeDataFile(filepath, data) {
    const finalPath = path.resolve(data_dir, filepath);
    await fs.mkdir(path.dirname(finalPath), { recursive: true });
    const isJSON = filepath.endsWith('.json');
    return fs.writeFile(finalPath, prettier.format(data, {
        useTabs: true,
        parser: isJSON ? 'json' : 'typescript',
    }), 'utf8');
}
/** Query Functions ***********************************************************/
const bar = new SingleBar({}, Presets.shades_classic);
const queryFns = {
    async homepage() {
        const [data] = await executeQueryFromFile('home-page.sql');
        return writeDataFile('homepage.json', stringify(HomePageData.parse(data)));
    },
    async seasons_list() {
        const data = await executeQueryFromFile('seasons-list.sql');
        return writeDataFile('seasons-list.json', stringify(SeasonsList.parse(data)));
    },
    async seasons() {
        const rawData = await executeQueryFromFile('seasons-list.sql');
        const data = SeasonsList.parse(rawData);
        bar.start(data.length, 0);
        const indexFileImports = [];
        const indexFileExports = [];
        let i = 0;
        for (const row of data) {
            const rawRounds = await executeQueryFromFile('seasons/rounds.sql', row);
            const rounds = z.array(seasonTypes.SeasonRound).parse(rawRounds);
            const rawTeams = await executeQueryFromFile('seasons/teams.sql', row);
            const teams = z.array(seasonTypes.Team).parse(rawTeams);
            bar.update(++i);
            indexFileImports.push(`import _${row.year} from "./${row.year}.json";`);
            indexFileExports.push(`"${row.year}": _${row.year}`);
            await writeDataFile(`seasons/${row.year}.json`, stringify(seasonTypes.SeasonData.parse({
                ...row,
                rounds,
                teams,
            })));
        }
        const indexFile = `${indexFileImports.join('\n')}

		export default {\n${indexFileExports.join(',')}\n}
		`;
        await writeDataFile(`seasons/index.js`, indexFile);
        bar.stop();
    },
    async drivers() {
        const rawData = await executeQueryFromFile('drivers/drivers.sql');
        const data = z
            .array(driverTypes.DriverData.partial({ seasons: true }).extend({
            hasImage: z.preprocess((arg) => !!arg, z.boolean()),
        }))
            .parse(rawData);
        bar.start(data.length, 0);
        const indexFileImports = [];
        const indexFileExports = [];
        let i = 0;
        for (const driver of data) {
            driver.image = driverImages[driver.driverRef];
            const rawSeasonData = await executeQueryFromFile('drivers/driver-seasons.sql', driver);
            const seasonData = z.array(driverTypes.DriverSeaon).parse(rawSeasonData);
            driver.seasons = seasonData.filter((row) => typeof row.year === 'number');
            bar.update(++i);
            await writeDataFile(`drivers/${driver.driverRef}.json`, stringify(driverTypes.DriverData.parse(driver)));
            indexFileImports.push(`import ${driver.driverRef} from "./${driver.driverRef}.json";`);
            indexFileExports.push(`${driver.driverRef}`);
        }
        const indexFile = `${indexFileImports.join('\n')}

		export {\n${indexFileExports.join(',')}\n}
		`;
        await writeDataFile(`drivers/index.js`, indexFile);
        bar.stop();
    },
    async constructors() {
        const rawData = await executeQueryFromFile('constructors/constructors.sql');
        const data = z.array(contructorTypes.ConstructorData.partial({ seasons: true })).parse(rawData);
        bar.start(data.length, 0);
        const indexFileImports = [];
        const indexFileExports = [];
        let i = 0;
        for (const row of data) {
            const rawSeasonData = await executeQueryFromFile('constructors/constructor-seasons.sql', row);
            const seasonData = z.array(contructorTypes.ConstructorSeaon).parse(rawSeasonData);
            row.seasons = seasonData.filter((row) => typeof row.year === 'number');
            bar.update(++i);
            await writeDataFile(`constructors/${row.constructorRef}.json`, stringify(contructorTypes.ConstructorData.parse(row)));
            indexFileImports.push(`import ${row.constructorRef} from "./${row.constructorRef}.json";`);
            indexFileExports.push(`${row.constructorRef}`);
        }
        const indexFile = `${indexFileImports.join('\n')}

		export {\n${indexFileExports.join(',')}\n}
		`;
        await writeDataFile(`constructors/index.js`, indexFile);
        bar.stop();
    },
    async races() {
        const rawData = await executeQueryFromFile('rounds/races-list.sql');
        const data = z
            .array(raceTypes.RaceData.extend({
            driversData: z.array(raceTypes.DriverData.partial({
                qualifying: true,
                pitStops: true,
                lapPositions: true,
            })),
        }))
            .parse(rawData);
        bar.start(data.length, 0);
        const indexFileImports = [];
        const indexFileExports = [];
        let i = 0;
        const driverRaceData = raceTypes.DriverData.pick({
            driverRef: true,
            qualifying: true,
            pitStops: true,
            lapPositions: true,
        });
        for (const race of data) {
            const rawDriversData = await executeQueryFromFile(`rounds/drivers-data.sql`, race);
            console.log('race', race.raceId);
            const driversData = z.array(driverRaceData).parse(rawDriversData);
            const driversDataMap = driversData.reduce((p, c) => ({ ...p, [c.driverRef]: c }), {});
            race.driversData = race.driversData.map((data) => ({
                ...data,
                ...driversDataMap[data.driverRef],
            }));
            bar.update(++i);
            const filename = `round_${race.round.toString().padStart(2, '0')}`;
            const filepath = `${race.year}/${filename}.json`;
            await writeDataFile(`rounds/${filepath}`, stringify(raceTypes.RaceData.parse(race)));
            indexFileImports.push(`import ${filename}_${race.year} from "./${filepath}";`);
            indexFileExports.push(`${filename}_${race.year}`);
        }
        const indexFile = `${indexFileImports.join('\n')}

		export {\n${indexFileExports.join(',')}\n}
		`;
        await writeDataFile(`rounds/index.js`, indexFile);
        bar.stop();
    },
};
/** CLI Logic *****************************************************************/
const LIST_QUERIES = Object.keys(queryFns);
if (queries.length === 0 && !allQueries) {
    const responses = await prompts([
        {
            name: 'query',
            type: 'multiselect',
            message: 'Please select all the queries you want to generate',
            choices: LIST_QUERIES.map((value) => ({ value, title: value })),
        },
    ]);
    queries.splice(0, queries.length, ...responses.query);
}
else if (allQueries) {
    queries.splice(0, queries.length, ...LIST_QUERIES);
}
if (queries.length === 0) {
    console.log('No query selceted. Exiting!');
    process.exit(0);
}
for (const query of queries) {
    try {
        console.log(`Executing ${query} query...`);
        await queryFns[query]();
    }
    catch (e) {
        if (e instanceof ZodError) {
            console.log(e.errors.map(formatZodError).join('\n'));
            process.exit(1);
        }
        else {
            console.log(e);
            process.exit(1);
        }
    }
}
process.exit(0);
