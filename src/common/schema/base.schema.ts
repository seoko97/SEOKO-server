import { Schema, Prop } from "@nestjs/mongoose";

import { IsMongoId, IsNumber } from "class-validator";

@Schema({ timestamps: true, _id: true })
export class BaseSchema {
  @IsMongoId()
  @Prop({ require: true })
  _id!: string;

  @IsNumber()
  @Prop({ require: true, unique: true })
  nid!: number;
}
