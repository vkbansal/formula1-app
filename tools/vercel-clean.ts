/* eslint-disable no-console */
import { createInterface } from 'node:readline/promises';

import chalk from 'chalk';
import ky from 'ky';

if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_API_TOKEN) {
	throw new Error('VERCEL_PROJECT_ID and VERCEL_TOKEN are required');
}

const rl = createInterface(process.stdin, process.stdout);

const deployments = (await ky
	.get('https://api.vercel.com/v6/deployments', {
		searchParams: {
			projectId: process.env.VERCEL_PROJECT_ID,
			limit: 20,
		},
		headers: {
			Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	.json()) as any;

const count = deployments.pagination.count;

console.log(`Found ${count} deployments`);

const askForConfirmation = (): Promise<string> =>
	rl.question(
		`Do you want delete ${count - 2} oldest deployments? [(y)es/(N)o]`,
	);

let answer = await askForConfirmation();

while (!answer.match(/^(n|y)$/)) {
	console.log(chalk.red('Only y/n are allowed. Please try again!'));
	answer = await askForConfirmation();
}

if (answer === 'n') {
	console.log('Exiting...');
	process.exit(0);
}

for (const deployment of deployments.deployments.slice(2)) {
	console.log(`Deleting ${deployment.url}...`);
	await ky.delete(`https://api.vercel.com/v13/deployments/${deployment.uid}`, {
		headers: {
			Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
		},
	});
}

console.log('Done!');
process.exit(0);
