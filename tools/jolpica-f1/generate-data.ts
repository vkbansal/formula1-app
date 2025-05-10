import { Listr } from 'listr2';

import { getConstructorsDataTask } from './constructor-data/getConstructorsDataTask';
// import meow from 'meow';
// import prompts from 'prompts';
// import { getSeasonDataTask } from './season-data/getSeasonDataTask';

const season = 2025;

const tasks = new Listr([getConstructorsDataTask(season)], {
	concurrent: false,
	rendererOptions: { showSubtasks: true, collapseSubtasks: false },
});

await tasks.run();
