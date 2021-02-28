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

## Prerequisites

You'll need [MariaDB 10.5](https://mariadb.com/) to be installed in your machine. The easiest way to do this is to use docker.
You can run the following command if you have docker installed already.

```
docker run -p 3306:3306 -v ~/mysql:/var/lib/mysql --name mariadb -e MYSQL_ROOT_PASSWORD=admin -d --rm mariadb:10.5
```

You can cutomise the arguments if you are familiar with docker.

Next, you'll need to import the data into the database from `__data/formula1.sql`. You can use a GUI program like [Seuqel Pro](com) (for Mac OS only).

First create a database with the name `formula1` or any name you like. Then import the data into the database.

## How start the app?

1. Clone this repo `git clone git@github.com/vkbansal/formula1-app.git`.
2. Change to the directory `cd formula1-app`
3. Install the pacakges. `yarn`
4. Copy `example.env` file to `.env`. `cp example.env .env`
5. Update the values in `.env` file accordingly.
6. Start the Servers.
   - Development Mode (You'll need to run the commands in 3 seperate tabs/windows):
     - `yarn client`. This will start the client build in watch mode.
     - `yarn server`. This will start the server build in watch mode.
     - `yarn start`. This start the server at http://localhost:3000 in watch mode.
   - Preview Mode (You can run these commands in a single tab/window):
     - `yarn build`. This is will build both the client and server code.
     - `yarn start`. This start the server at http://localhost:3000 in watch mode.
7. Go to http://localhost:3000
