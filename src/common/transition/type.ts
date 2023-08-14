const enum EMiddlewareTypes {
  document = "document",
  query = "query",
  aggregate = "aggregate",
  model = "model",
}

type TMiddlewareType = keyof typeof EMiddlewareTypes;

export { EMiddlewareTypes, TMiddlewareType };
