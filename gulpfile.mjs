import { Transform } from 'node:stream';
import gulp from 'gulp';
import merge from 'merge-stream';
import Vinyl from 'vinyl';
import { gulpIf, gulpSass, gulpFilesHash } from '@vkbansal/gulp-plugins';
import path from 'node:path';

const HASH_LOCATION = '../../src/_data/assets.json';
const SRC_PATH = path.join(process.cwd(), 'src');

const hashesMap = new Map();

function gulpAssestMap() {
  const stream = new Transform({ objectMode: true });

  stream._transform = function (file, _, done) {
    if (file.isNull()) {
      done(null, file);
      return;
    }

    if (file.isStream()) {
      done(null, file);
      return;
    }

    hashesMap.set(
      path.relative(SRC_PATH, file.path),
      `/assets/${file.relative}`
    );

    done(null, file);
  };

  stream._flush = function (done) {
    const contents = Object.fromEntries([...hashesMap.entries()]);

    const file = new Vinyl({
      cwd: process.cwd(),
      base: '.',
      path: HASH_LOCATION,
      contents: Buffer.from(JSON.stringify(contents, null, 2))
    });
    this.push(file);
    done();
  };

  return stream;
}

const PROD = process.env.NODE_ENV === 'production';

export function build(cb) {
  merge(
    gulp.src('src/_assets/scripts/*.js'),
    gulp.src('src/_assets/styles/styles.scss').pipe(gulpSass())
  )
    .pipe(
      gulpIf(
        PROD,
        gulpFilesHash({
          hashFile: HASH_LOCATION,
          customizeHashFile: (hashes) => {
            const processed = Object.entries(hashes).map(([key, value]) => [
              path.relative(SRC_PATH, key),
              `/assets/${value}`
            ]);
            return Object.fromEntries(processed);
          }
        }),
        gulpAssestMap()
      )
    )
    .pipe(gulp.dest('public/assets/'));

  cb();
}

export function watch() {
  gulp.watch('src/_assets/**/*.*', { ignoreInitial: false }, build);
}
