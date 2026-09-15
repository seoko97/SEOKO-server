import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { HydratedDocument, Model, Schema as MongooseSchema, Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";
import { Series } from "@/routes/series/series.schema";
import { Tag } from "@/routes/tag/tag.schema";

export type PostDocument = HydratedDocument<Post>;
export type PostModel = Model<Post>;

@Schema({ timestamps: true })
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

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Series.name,
    required: false,
    default: null,
  })
  series?: Types.ObjectId;

  @Prop({
    type: [{ type: String }],
    required: false,
    default: [],
  })
  likes?: string[];

  @Prop({
    type: [{ type: String }],
    required: false,
    default: [],
  })
  views?: string[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Tag.name }],
    required: false,
    default: [],
  })
  tags?: Types.ObjectId[];

  @Prop()
  isLiked?: boolean;

  @Prop()
  likeCount?: number;

  @Prop()
  viewCount?: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
