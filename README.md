# Formula 1 Statistics

An app for statistics and data visualizations around **The Formula 1 World Championship**. The main goal of this project is to be restricted as a Static Site and uses [Astro](https://astro.build/) as the static site generator and [Preact](https://preactjs.com/) for interactive elements.

## Data Source

The data is taken from http://ergast.com/mrd/.

## Local development

### Prerequisites

- [nodejs](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [docker](https://www.docker.com/) - only required for working with data

### Development

- Clone the repository: `git clone git@github.com:vkbansal/formula1-app.git`
- Change to the project directory and run `pnpm install`.
- Run `pnpm run dev` to start the local development server. This will start Astro's development server and logs the url in console.
- The source code resides in `src` folder.
- All the data is stored as `.json` files under `src/content` folder to utilize [Astro's content collection API](https://docs.astro.build/en/guides/content-collections/).
- To download latest data, run `pnpm run data:up`.
- To update data, once newer data is downloaded:
  - Run `docker compose up -d` to startup MariaDB and populate it with data.
  - Run `pnpm run data:gen` to update the data. You might have to wait for about minute before running this command after you have run previous docker command in order for the database to be ready.
- Data generation related code resides in `tools` folder.

## License

[MIT](./LICENSE.md)
