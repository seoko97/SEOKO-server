import { InternalServerErrorException } from "@nestjs/common";

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

        try {
          let result: any;

          await session.withTransaction(async () => {
            result = await originalMethod.apply(this, args);
          });

          return result;
        } catch (error) {
          throw error;
        } finally {
          session.endSession();
        }
      });
    };
    return descriptor;
  };
}

export { Transactional };
