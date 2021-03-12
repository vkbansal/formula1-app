import express from 'express';
import path from 'path';
import cors from 'cors';
import { mariadbPool } from './common/db';

import restApp from './rest';
import graphqlApp from './graphql';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client'), {}));
app.use(
  cors({
    origin: 'http://localhost:5000'
  })
);

app.use('/api/rest', restApp);
app.use('/api/graphql', graphqlApp);

// Handler for SPA behaviour
app.get('*', (_req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
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
