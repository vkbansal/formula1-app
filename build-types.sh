# Generate OpenAPI types for client
npx restful-react import --file ./src/server/rest/openapi.yaml --output src/client/rest/services.tsx
npx prettier --write src/client/rest/services.tsx --loglevel=error

# Generate OpenAPI types for server
npx restful-react import --file ./src/server/rest/openapi.yaml --output src/server/rest/types.tsx --skip-react
npx prettier --write src/server/rest/types.tsx --loglevel=error

# Generate GraphQL type for client and server
npx graphql-codegen
npx prettier --write src/client/graphql/services.ts src/server/graphql/types.ts --loglevel=error
