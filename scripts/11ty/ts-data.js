const _eval = require('eval');
const esbuild = require('esbuild');
const builtinModules = require('builtin-modules');

module.exports = function (eleventyConfig) {
	eleventyConfig.addDataExtension('ts', {
		parser: async (file) => {
			const result = await esbuild.build({
				entryPoints: [file],
				outdir: './',
				format: 'cjs',
				target: 'es2020',
				external: ['node:*', ...builtinModules],
				bundle: true,
				write: false,
			});

			const jsFile = result.outputFiles[0];

			const evaledModule = _eval(jsFile.text, true);

			let __data = {};

			if (typeof evaledModule.default === 'function') {
				__data = await evaledModule.default();
			} else {
				__data = evaledModule.default ?? {};
			}

			// console.log('data2', data);

			return __data;
		},
		read: false,
	});
};
