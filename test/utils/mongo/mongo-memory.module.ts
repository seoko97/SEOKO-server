import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoMemoryServer } from "test/utils/mongo/mongodb-memory-server-setup";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        await MongoMemoryServer.start();

        return {
          uri: MongoMemoryServer.mongoUri,
        };
      },
    }),
  ],
})
export class MongoMemoryModule {}
