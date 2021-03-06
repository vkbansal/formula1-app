import { Router } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import type { RouteMetadata } from 'express-openapi-validator/dist/framework/openapi.spec.loader';
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import spec from './openapi.yaml';
import resolvers from './resolvers';

const router = Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec: spec as any,
    validateApiSpec: true,
    validateRequests: true,
    validateResponses: false,
    operationHandlers: {
      basePath: '',
      resolver(
        _handlersPath: string,
        route: RouteMetadata,
        apiDoc: OpenAPIV3.Document
      ) {
        const openapiRoute = route.openApiRoute.replace(
          new RegExp(`^${route.basePath}`),
          ''
        );

        const { operationId } = apiDoc.paths[openapiRoute][
          route.method.toLowerCase()
        ];

        if (!operationId) {
          throw new Error(
            `"operationId" not defined for route "${openapiRoute}"`
          );
        }

        if (!resolvers[operationId]) {
          throw new Error(
            `Could not find a resolver for "${operationId}" operationId`
          );
        }

        return resolvers[operationId];
      }
    }
  })
);

export default router;
