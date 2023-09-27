import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { MongoModule } from "@/common/modules/mongo.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongoModule],
})
export class CommonModule {}
