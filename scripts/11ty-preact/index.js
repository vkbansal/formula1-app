const vm = require('node:vm');
// const fs = require('node:fs');
const path = require('node:path');
const _eval = require('eval');

const builtinModules = require('builtin-modules');
const { h, Fragment } = require('preact');
const esbuild = require('esbuild');
const preactRender = require('preact-render-to-string');
const { isPlainObject, vmContext } = require('../utils');

const postCSSPlugin = require('./esbuild-postcss-plugin');
const prod = process.env.NODE_ENV === 'production';

module.exports = (eleventyConfig, ALL_CSS) => {
	async function buildAndEvalFile(inputPath) {
		const result = await esbuild.build({
			entryPoints: [inputPath],
			outdir: path.dirname(inputPath),
			bundle: true,
			loader: {
				'.css': 'css',
				'.tsx': 'tsx'
			},
			format: 'cjs',
			target: 'es2020',
			jsxFactory: 'h',
			jsxFragment: 'Fragment',
			external: ['node:*', ...builtinModules],
			write: false,
			minify: prod,
			plugins: [postCSSPlugin(ALL_CSS)]
		});

		const jsFile = result.outputFiles[0];

		const evaledModule = _eval(jsFile.text, { h, Fragment }, true);

		return evaledModule;
	}

	eleventyConfig.addExtension('11ty.tsx', {
		compile: async function (_inputContent, inputPath) {
			const evaledModule = await buildAndEvalFile(inputPath);
			const that = this;
			// console.log('that', that.config.javascriptFunctions);

			return async function (data) {
				const newData = { ...data };

				if (typeof data.eleventyComputed === 'function') {
					const computedData = await data.eleventyComputed(data);

					Object.assign(newData, computedData);
				} else if (isPlainObject(data.eleventyComputed)) {
					const keys = Object.keys(data.eleventyComputed);

					const promises = keys.map((key) => {
						const value = data.eleventyComputed[key];
						if (typeof value === 'function') {
							return value(data);
						}
						throw new Error(
							`${key} in eleventyComputed must be a function, but got ${typeof value}`
						);
					});

					const computedData = await Promise.all(promises);

					keys.forEach((key, i) => {
						newData[key] = computedData[i];
					});
				}

				const html = preactRender(
					h(evaledModule.render, newData),
					{ filters: that.config.javascriptFunctions },
					{
						pretty: true
					}
				);

				return `<!DOCTYPE html>\n${html}`;
			};
		},
		getData: ['data'],
		getInstanceFromInputPath: async (inputPath) => {
			const evaledModule = await buildAndEvalFile(inputPath);
			let data = {};

			if (typeof evaledModule.getData === 'function') {
				data = await evaledModule.getData();
			}

			return { data };
		},
		read: false,
		compileOptions: {
			permalink: () => (data) => {
				return typeof data.permalink === 'function'
					? data.permalink(data)
					: data.permalink;
			}
		}
	});
};