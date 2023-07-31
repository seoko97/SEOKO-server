import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SequenceRepository } from "./sequence.repository";
import { Sequence, SequenceSchema } from "./sequence.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Sequence.name, schema: SequenceSchema }])],
  exports: [SequenceRepository],
  providers: [SequenceRepository],
})
export class SequenceModule {}
