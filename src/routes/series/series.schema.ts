import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { HydratedDocument, Model, Schema as MongooseSchema, Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";

export type SeriesDocument = HydratedDocument<Series>;
export type SeriesModel = Model<Series>;

@Schema({ timestamps: true })
export class Series extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  name!: string;

  @IsString()
  @Prop({ required: false, default: null })
  thumbnail?: string;

  @Prop({
    ref: "Post",
    type: [{ type: MongooseSchema.Types.ObjectId, ref: "Post" }],
    default: [],
    required: false,
  })
  posts: Types.ObjectId[];
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
