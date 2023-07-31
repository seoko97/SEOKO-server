import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsString } from "class-validator";
import { Document, Model, Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";
import { Tag } from "@/routes/tag/tag.schema";

export type PostDocument = Post & Document;
export type PostModel = Model<PostDocument>;

@Schema()
export class Post extends BaseSchema {
  @IsString()
  @Prop({ required: true })
  title!: string;

  @IsString()
  @Prop({ required: true })
  content!: string;

  @IsString()
  @Prop({ required: true })
  thumbnail!: string;

  @Prop({ type: Types.ObjectId, ref: "Series", required: false })
  series?: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId }],
    ref: "Tag",
    required: false,
    default: [],
  })
  tags?: Tag[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
