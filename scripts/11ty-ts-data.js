const vm = require('node:vm');

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
				write: false
			});

			const jsFile = result.outputFiles[0];

			const evaledModule = vm.runInContext(
				jsFile.text,
				vm.createContext({ module, require, process })
			);

			let data = {};

			if (typeof evaledModule.default === 'function') {
				data = await evaledModule.default();
			} else {
				data = evaledModule.default ?? {};
			}

			// console.log('data2', data);

			return data;
		},
		read: false
	});
};
