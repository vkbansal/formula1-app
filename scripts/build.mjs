/* global $ */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import 'zx/globals';

const OUT_DIR = 'public';
const ASSETS_FILE = 'src/_data/assets.json';
const assets = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'));

await $`rm -rf ${OUT_DIR}`;
await $`mkdir -p ${OUT_DIR}/assets`;
await $`node scripts/esbuild.mjs`;

const hashesMap = {};

for (const [_input, _output] of Object.entries(assets)) {
  const output = path.normalize(path.join(OUT_DIR, _output));

  const fileBuffer = fs.readFileSync(output);
  const hash = crypto
    .createHash('sha256')
    .update(fileBuffer)
    .digest('hex')
    .slice(0, 8);

  const outputExt = path.extname(output);
  const hashedOutput = output.replace(outputExt, `.${hash}${outputExt}`);

  await $`mv ${output} ${hashedOutput}`;

  hashesMap[_input] = _output.replace(outputExt, `.${hash}${outputExt}`);
}

fs.writeFileSync(ASSETS_FILE, JSON.stringify(hashesMap, null, 2), 'utf8');

await $`npx @11ty/eleventy`;

process.exit(0);
