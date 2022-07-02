rm -rf public
mkdir -p public/assets

npx esbuild src/_assets/scripts/homepage.js     --bundle --target=esnext --outfile=public/assets/homepage.js
npx esbuild src/_assets/scripts/drivers.js      --bundle --target=esnext --outfile=public/assets/drivers.js
npx esbuild src/_assets/scripts/constructors.js --bundle --target=esnext --outfile=public/assets/constructors.js

npx concurrently \
  "npx @11ty/eleventy --serve" \
  "npx sass --watch --no-source-map src/_assets/styles/styles.scss public/assets/styles.css" \
  "npx esbuild src/_assets/scripts/season/index.js --bundle --watch --target=esnext --outfile=public/assets/season.js"
