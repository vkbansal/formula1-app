const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

module.exports = async () => {
  const file = path.resolve(process.cwd(), `datastore/constructors/index.yaml`);
  const contents = await fs.promises.readFile(file, 'utf8');

  return { constructors: yaml.load(contents) };
};
