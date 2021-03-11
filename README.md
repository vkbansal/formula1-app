# Formula 1 App

A demo app for "Formula 1 world Championship (1950 - 2020)". Data is taken from http://ergast.com/mrd/.

## Technologies used

- npm packages
  - [React](https://reactjs.org/)
  - [React Router (DOM)](https://reactrouter.com/)
  - [restful-react](https://github.com/contiamo/restful-react/)
  - [GraphQL](https://github.com/graphql/graphql-js)
  - [graphql-codegenerator](http://graphql-code-generator.com/)
  - [Webpack](https://webpack.js.org/)
  - [DotEnv](https://github.com/motdotla/dotenv)
  - [TypeScript](https://www.typescriptlang.org/)
  - [urql](https://formidable.com/open-source/urql/)
  - [Chakra UI](https://chakra-ui.com/)
- Database
  - [MariaDB 10.5](https://mariadb.com/)
- API formats
  - [OpenAPI (formerly known as Swagger)](https://swagger.io/docs/specification/about/)
  - [GraphQL](https://graphql.org/)

## How to run the app locally?

Please follow the the instructions in [development](#development) section below.

## Development

### Prerequisites

You'll need [MariaDB 10.5](https://mariadb.com/) to be installed in your machine. The easiest way to do this is to use docker.
You can run the following command if you have docker installed already. This will import the reqiured the data into the database automatically.

> Note: You need to run the following command from within this folder

```
docker run \
  -p 3306:3306 \
  -v './__data:/docker-entrypoint-initdb.d/' \
  --name formula1-data \
  -e MYSQL_ROOT_PASSWORD=admin \
  -e MYSQL_DATABASE=formula1 \
  -d --rm mariadb:10.5
```

A `docker-compose.yml` file is also provided, you can use that instead.

### How start the app?

1. Clone this repo `git clone git@github.com/vkbansal/formula1-app.git`.
2. Change to the directory `cd formula1-app`
3. Install the pacakges using `yarn`
4. Copy `example.env` file to `.env`. `cp example.env .env`
5. The default values in `.env` file should work fine unless you have modified the docker command. If you have, then update the file accordingly.
6. Start the servers by running the command `yarn start`.
7. Go to http://localhost:3000
