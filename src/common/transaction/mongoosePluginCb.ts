import {
  Model,
  Schema,
  ClientSession,
  MongooseQueryMiddleware,
  MongooseDocumentMiddleware,
  Document,
  Query,
  Aggregate,
} from "mongoose";

import {
  TRANSACTION_SESSION,
  documentAndQueryMiddleware,
  middlewareGroups,
} from "@/common/transaction/constants";
import { ALS } from "@/common/transaction/core/AsyncLocalStorage";
import { EMiddlewareTypes, TMiddlewareType } from "@/common/transaction/type";

function transactionPlugin(schema: Schema) {
  for (const middlewareType in middlewareGroups) {
    middlewareGroups[middlewareType as TMiddlewareType].forEach((method) => {
      if (middlewareType === EMiddlewareTypes.model) {
        overwriteMethod(schema, method);
      } else if (
        middlewareType === EMiddlewareTypes.document &&
        documentAndQueryMiddleware.includes(method)
      ) {
        schema.pre(method as MongooseDocumentMiddleware, { document: true, query: true }, preCb);
      } else {
        schema.pre(method as MongooseQueryMiddleware, preCb);
      }
    });
  }
}

function preCb(this: any, next: any) {
  const als = new ALS();
  const session = als.get<ClientSession>(TRANSACTION_SESSION);

  if (this instanceof Document) {
    this.$session() || this.$session(session);
  } else if (this instanceof Query) {
    this.getOptions().session || this.session(session);
  } else if (this instanceof Aggregate) {
    this.options.session || this.session(session);
  }

  next();
}

function overwriteMethod(schema: Schema, method: string) {
  const als = new ALS();

  schema.statics[method] = function (...args: any) {
    const session = als.get<ClientSession>(TRANSACTION_SESSION);

    if (session) {
      const options = args[1] || {};

      if (!options?.session) {
        args[1] = Object.assign(options, { session });
      }
    }

    return Model[method].apply(this, args);
  };
}

export { transactionPlugin };
