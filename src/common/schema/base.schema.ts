import { Schema, Prop } from "@nestjs/mongoose";

import { IsDateString, IsMongoId, IsNumber } from "class-validator";

@Schema({ _id: true })
export class BaseSchema {
  @IsMongoId()
  _id!: string;

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;

  @IsNumber()
  @Prop({ require: true, unique: true })
  nid!: number;
}
