const yaml = require('js-yaml');
const fs = require('node:fs');

const cache = {};

module.exports = async (file) => {
  if (file in cache) {
    return cache[file];
  }

  const contents = await fs.promises.readFile(file, 'utf-8');
  const data = yaml.load(contents);
  cache[file] = data;

  return data;
};
