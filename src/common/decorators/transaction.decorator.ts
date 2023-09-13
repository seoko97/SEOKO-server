import { InternalServerErrorException } from "@nestjs/common";

import { MongooseError } from "mongoose";

import { CONNECTION_NOT_FOUND, TRANSACTION_SESSION } from "@/common/transaction/constants";
import { ALS } from "@/common/transaction/core/AsyncLocalStorage";
import { ConnectionStore } from "@/common/transaction/core/ConnectionStore";

function Transactional(): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    const als = new ALS();

    descriptor.value = async function (...args: any[]) {
      return als.run(async () => {
        const connection = new ConnectionStore().getConnection();

        if (!connection) {
          throw new InternalServerErrorException(CONNECTION_NOT_FOUND);
        }

        const session = await connection.startSession();
        als.set(TRANSACTION_SESSION, session);
        session.startTransaction();

        try {
          const result = await originalMethod.apply(this, args);
          await session.commitTransaction();
          return result;
        } catch (e) {
          if (!(e instanceof MongooseError)) {
            await session.abortTransaction();
          }
          throw e;
        } finally {
          session.endSession();
        }
      });
    };
    return descriptor;
  };
}

export { Transactional };
