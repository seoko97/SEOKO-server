import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsString } from "class-validator";
import { Document, Model, Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";
import { Post } from "@/routes/post/post.schema";

export type SeriesDocument = Series & Document;
export type SeriesModel = Model<SeriesDocument>;

@Schema()
export class Series extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  name!: string;

  @IsString()
  @Prop({ required: false, default: null })
  thumbnail?: string;

  @Prop({
    ref: "Post",
    type: [{ type: Types.ObjectId, ref: "Post" }],
    default: [],
    required: false,
  })
  posts: Post[];
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
