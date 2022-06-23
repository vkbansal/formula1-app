const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

module.exports = async () => {
  const file = path.resolve(process.cwd(), `datastore/drivers/index.yaml`);
  const contents = await fs.promises.readFile(file, 'utf8');

  return { drivers: yaml.load(contents) };
};
