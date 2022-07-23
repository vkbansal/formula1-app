module.exports = {
	plugins: [require.resolve('prettier-plugin-astro')],
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	bracketSpacing: true,
	arrowParens: 'always',
	overrides: [
		{
			files: ['*.yml', '*.yaml'],
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
		{
			files: ['*.astro'],
			options: {
				parser: 'astro',
			},
		},
	],
};
