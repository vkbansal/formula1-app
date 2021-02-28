import express from 'express';
import { mariadbPool } from './common/db';

import restApp from './rest';
import graphqlApp from './graphql';

const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/rest', restApp);
app.use('/graphql', graphqlApp);

app.use((_req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Not Found'
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message || 'Something went wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App started on port: ${PORT}`);
});

async function shutdown(): Promise<void> {
  mariadbPool.end();
  process.exit(1);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGUSR2', shutdown);
