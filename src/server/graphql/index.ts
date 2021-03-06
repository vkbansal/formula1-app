import { Router } from 'express';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import gqlSchema from './schema.gql';
import resolvers from './resolvers';

const schema = buildSchema(gqlSchema);
const router = Router();

router.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

export default router;
