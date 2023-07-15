import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("DB_URI"),
        dbName: configService.get("DB_NAME"),
        user: configService.get("DB_USERNAME"),
        pass: configService.get("DB_PASSWORD"),
        replicaSet: configService.get("DB_REPLICA_SET"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
