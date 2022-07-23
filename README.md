# Formula 1 Statistics

An app for statistics and data visualizations around **The Formula 1 World Championship**. The main goal of this project is to be restricted as a Static Site and uses [Astro](https://astro.build/) as the static site generator and [Preact](https://preactjs.com/) for interactive elements.

## Data Source

The data is taken from http://ergast.com/mrd/.

## Local development

### Prerequisites

- [nodejs](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [docker](https://www.docker.com/) - only required for working with data

### Site development

- Clone the repository: `git clone git@github.com:vkbansal/formula1-app.git`
- Change to the project directory and run `pnpm install`.
- Run `pnpm run dev` to start the local development server. This will start Astro's development server and logs the url in console. It is usually `http://localhost:3000`.
- The source code resides in `src` folder.

### Data development

- Clone the repository: `git clone git@github.com:vkbansal/formula1-app.git`
- Change to the project directory and run `pnpm install`.
- Run `pnpm run data`. This is will download the latest data.
- Run `docker compose up -d`. This will startup MariaDB and populate it with data.
- Data related code resides in `datagen` folder.
- All the generated data is stored as `.yaml` files under `src/data` folder.

## License

[MIT](./LICENSE.md)
