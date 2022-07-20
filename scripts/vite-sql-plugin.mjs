const FILE_REGEX = /\.sql$/;

export default function viteSQLPlugin() {
	return {
		name: 'vite-sql-plugin',
		transform(src, id) {
			if (FILE_REGEX.test(id)) {
				return {
					code: [
						'import { executeQuery } from "db";',
						'export default async function getData(params, options) {',
						`	return executeQuery(${JSON.stringify(src)}, params, options);`,
						'}',
					].join(''),
					map: null,
				};
			}
		},
	};
}
