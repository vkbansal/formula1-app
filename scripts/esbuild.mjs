/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import { globby } from 'globby';
import esbuild from 'esbuild';
import postcss from 'postcss';
import cssNested from 'postcss-nested';
import cssImports from 'postcss-import';
import cssModules from 'postcss-modules';
import stringify from 'fast-json-stable-stringify';

const ASSETS_FILE = 'src/_data/assets.json';

const watch = process.argv.includes('--watch');
const PROD = process.env.NODE_ENV === 'production';
const jsFiles = await globby(['src/**/*.client.js']);

const entryPoints = ['src/styles/styles.css', ...jsFiles];

console.log('Build the following files');
console.log(entryPoints.join('\n'));

/**
 * @type {import('esbuild').Plugin}
 */
const postCSSPlugin = {
	name: 'postcss-plugin',
	setup(build) {
		build.onLoad({ filter: /\.css/ }, async (onLoadArgs) => {
			const css = await fs.promises.readFile(onLoadArgs.path, 'utf8');
			const result = await postcss([
				cssImports({
					plugins: [
						cssNested(),
						cssModules({
							generateScopedName: '[name]__[local]___[hash:base64:5]',
							scopeBehaviour: 'local',
							globalModulePaths: [/src\/styles/, /node_modules/],
							localsConvention: 'camelCaseOnly',
							getJSON(cssFileName, json) {
								if (!json || Object.keys(json).length === 0) {
									return;
								}

								const jsonFile = cssFileName.replace(
									path.extname(cssFileName),
									'.json'
								);

								fs.writeFileSync(
									jsonFile,
									stringify({ css: json }, null, 2),
									'utf8'
								);
							}
						})
					]
				})
			]).process(css, { from: onLoadArgs.path });

			return {
				contents: result.css,
				loader: 'css',
				watchFiles: [
					...new Set(
						result.messages
							.filter((m) => m.type === 'dependency')
							.flatMap((m) => [m.file, m.parent])
					)
				]
			};
		});
	}
};

const result = await esbuild.build({
	entryPoints,
	bundle: true,
	target: 'esnext',
	outdir: 'public/assets',
	entryNames: PROD ? '[name].[hash]' : '[name]',
	watch: watch
		? {
				onRebuild(error) {
					if (error) {
						console.error('watch build failed:', error);
					} else {
						console.log(
							'[WATCH] build succeeded at ',
							new Date().toLocaleString()
						);
					}
				}
		  }
		: undefined,
	minify: PROD,
	metafile: true,
	plugins: [postCSSPlugin]
});

if (result.metafile) {
	const assets = Object.entries(result.metafile.outputs).map(
		([output, input]) => [
			path.relative('src', input.entryPoint),
			'/' + path.relative('public', output)
		]
	);

	await fs.promises.writeFile(
		ASSETS_FILE,
		stringify(Object.fromEntries(assets), null, 2),
		'utf8'
	);
}
