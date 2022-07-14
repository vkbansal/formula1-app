const fs = require('node:fs');
const path = require('node:path');

const sass = require('sass');
const postcss = require('postcss');
const cssModules = require('postcss-modules');
const pluginName = 'postcss-plugin';
const CSS_MODULE_REGEX = /\.module\.scss/;

/**
 * @param {Map<string, string>} ALL_CSS
 */
module.exports = function ESBuildPostCSSPlugin(ALL_CSS) {
	/**
	 * @type {import('esbuild').Plugin}
	 */
	const plugin = {
		name: pluginName,
		setup(build) {
			build.onLoad(
				{ filter: CSS_MODULE_REGEX, namespace: 'file' },
				async (args) => {
					let cssModulesMap = {};
					const sassResult = await sass.compile(args.path);
					const postCSSResult = await postcss([
						cssModules({
							generateScopedName: '[name]__[local]___[hash:base64:5]',
							scopeBehaviour: 'local',
							globalModulePaths: [/src\/styles/, /node_modules/],
							localsConvention: 'camelCaseOnly',
							getJSON(cssFileName, json) {
								if (!json || Object.keys(json).length === 0) {
									return;
								}

								cssModulesMap = json;

								const keys = Object.keys(json).join("' | '");
								const typeDef = `declare const css: Record<'${keys}', string>;\nexport default css;`;

								fs.writeFileSync(`${cssFileName}.d.ts`, typeDef, 'utf8');
							}
						})
					]).process(sassResult.css, { from: args.path });

					ALL_CSS.set(
						path.relative(process.cwd(), args.path),
						postCSSResult.css
					);

					const js = `export default ${JSON.stringify(cssModulesMap)}`;

					/**
					 * @type {import('esbuild').OnLoadResult}
					 */
					const result = {
						contents: js,
						loader: 'js'
					};

					return result;
				}
			);
		}
	};

	return plugin;
};
