declare module '*.gql' {
  const query: string;

  export default query;
}

declare module '*.sql' {
  const query: string;

  export default query;
}

declare module '*.yaml' {
  const data: Record<any, any>;

  export default data;
}

declare module '*.yml' {
  const data: Record<any, any>;

  export default data;
}
