import path from 'node:path';

export const PATH_REGEX = /^--\s*path\s*:\s*(.+)$/m;
export const META_REGEX = /^--\s*meta\s*:\s*(.+)$/m;

/**
 * Get delimiter regex for SQL query
 * @param {String} queryName
 */
export function getQueryDelimiterRegex(queryName) {
  return new RegExp(
    `^--\\s+${queryName}:query:start((?:.|\n)+?)--\\s+${queryName}:query:end$`,
    'm'
  );
}

/**
 * Replaces the current file extension with given extension
 * @param {String} filePath
 * @param {String} ext
 * @returns {String}
 */
export function replaceExtension(filePath, ext) {
  return filePath.replace(path.extname(filePath), ext);
}
