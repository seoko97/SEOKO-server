import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsString } from "class-validator";
import { Document, Model, Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";
import { Post } from "@/routes/post/post.schema";

export type TagDocument = Tag & Document;
export type TagModel = Model<TagDocument>;

@Schema({ timestamps: true })
export class Tag extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({
    ref: "Post",
    type: [{ type: Types.ObjectId, ref: "Post" }],
    default: [],
    required: false,
  })
  posts?: Post[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
