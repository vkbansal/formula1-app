module.exports = {
	root: true,
	parser: 'espree',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	plugins: [],
	env: {
		node: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		'no-new-object': 2,
		'no-lonely-if': 2,
		camelcase: 2,
		'no-console': 0,
		'no-restricted-imports': 0,
		'no-unused-vars': [
			2,
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
			},
		],
	},
};
