import { EMiddlewareTypes } from "@/common/transaction/type";

const TRANSACTION_KEY = "transaction";
const TRANSACTION_SESSION = Symbol("transaction_session");

const documentAndQueryMiddleware = ["updateOne", "deleteOne"] as const;

const middlewareGroups = {
  [EMiddlewareTypes.document]: ["save", ...documentAndQueryMiddleware],
  [EMiddlewareTypes.query]: [
    "deleteOne",
    "deleteMany",
    "updateMany",
    "find",
    "findOne",
    "create",
    "findById",
    "findOneAndDelete",
    "findOneAndUpdate",
    "updateOne",
  ],
  [EMiddlewareTypes.aggregate]: ["aggregate"],
  [EMiddlewareTypes.model]: ["insertMany"],
} as const;

const CONNECTION_NOT_FOUND = "Connection이 존재하지 않습니다.";

export {
  TRANSACTION_KEY,
  TRANSACTION_SESSION,
  CONNECTION_NOT_FOUND,
  documentAndQueryMiddleware,
  middlewareGroups,
};
