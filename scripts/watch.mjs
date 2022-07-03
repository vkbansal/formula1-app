/* global $ */
import fs from 'node:fs';
import path from 'node:path';

import 'zx/globals';

const OUT_DIR = 'public';
const SRC_DIR = 'src';
const ASSETS_FILE = 'src/_data/assets.json';
const assets = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'));

const CSS_INPUT = '_assets/styles/styles.scss';
const JS_INPUT = '_assets/scripts/season/index.js';

// prettier-ignore
const commands = [
  `"npx @11ty/eleventy --serve"`,
  `"npx sass --watch --no-source-map ${path.normalize(path.join(SRC_DIR, CSS_INPUT))} ${path.normalize(path.join(OUT_DIR, assets[CSS_INPUT]))}"`,
  `"npx esbuild ${path.normalize(path.join(SRC_DIR, JS_INPUT))} --bundle --watch --target=esnext --outfile=${path.normalize(path.join(OUT_DIR, assets[JS_INPUT]))}"`
];

await $`echo ${commands.join(' ')}`;

await $`npx concurrently -n 11ty,sass,esbuild ${commands[0]} ${commands[1]} ${commands[2]}`;
