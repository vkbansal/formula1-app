rm -rf public
mkdir -p public/assets

NODE_ENV=production


npx sass --no-source-map src/_assets/styles/styles.scss public/assets/styles.css
npx esbuild src/_assets/scripts/homepage.js     --bundle --minify --target=esnext --outfile=public/assets/homepage.js
npx esbuild src/_assets/scripts/drivers.js      --bundle --minify --target=esnext --outfile=public/assets/drivers.js
npx esbuild src/_assets/scripts/constructors.js --bundle --minify --target=esnext --outfile=public/assets/constructors.js
npx esbuild src/_assets/scripts/season/index.js --bundle --minify --target=esnext --outfile=public/assets/season.js

## TODO: add hashing logic

npx @11ty/eleventy
