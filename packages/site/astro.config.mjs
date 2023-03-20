import { defineConfig } from 'astro/config';
import { netlifyFunctions } from '@astrojs/netlify';

export default defineConfig({
	output: 'server',
	adapter: netlifyFunctions(),
});
