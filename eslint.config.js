import fs from 'node:fs';

import cspellESLintPluginRecommended from '@cspell/eslint-plugin/recommended';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsESLint from 'typescript-eslint';

const dirs = fs
	.readdirSync('./src', { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name);

export default tsESLint.config(
	eslint.configs.recommended,
	...tsESLint.configs.recommended,
	eslintConfigPrettier,
	cspellESLintPluginRecommended,
	...eslintPluginAstro.configs.recommended,
	{
		rules: {
			'@cspell/spellchecker': [
				'error',
				{
					configFile: new URL(
						'./cspell.config.yaml',
						import.meta.url,
					).toString(),
					checkScope: [
						['ImportDeclaration[moduleSpecifier] StringLiteral', true],
					],
				},
			],
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'no-console': 2,
			'no-unused-vars': 0,
			'@typescript-eslint/no-unused-expressions': 0,
			'@typescript-eslint/no-unused-vars': [
				2,
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/explicit-function-return-type': [
				2,
				{
					allowExpressions: true,
					allowHigherOrderFunctions: true,
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				2,
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			'@typescript-eslint/naming-convention': [
				2,
				{
					selector: ['interface', 'typeAlias'],
					format: ['StrictPascalCase'],
				},
			],
		},
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': [
				2,
				{
					groups: [
						// Side effect imports.
						['^\\u0000'],
						// Node.js builtins prefixed with `node:`.
						['^node:', '^astro:'],
						// Packages.
						// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
						['^@?\\w'],
						// Absolute imports and other imports such as Vue-style `@/foo`.
						// Anything not matched in another group.
						['^'],

						// Custom imports.
						dirs.map((dir) => `^${dir}`),
						// Relative imports.
						// Anything that starts with a dot.
						['^\\.'],
						// style files
						['\\.css$', '\\.scss$'],
					],
				},
			],
			'simple-import-sort/exports': 'error',
		},
	},
	{
		files: ['src/env.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
);
