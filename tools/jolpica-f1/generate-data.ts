import { Listr } from 'listr2';

// import meow from 'meow';
// import prompts from 'prompts';
import { getSeasonDataTask } from './season-data/getSeasonDataTask';

const season = 2025;

const tasks = new Listr([getSeasonDataTask(season)], {
	concurrent: false,
	rendererOptions: { showSubtasks: true, collapseSubtasks: false },
});

await tasks.run();
