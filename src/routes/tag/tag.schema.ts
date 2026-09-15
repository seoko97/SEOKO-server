import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Schema as MongooseSchema, type HydratedDocument, type Model, type Types } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";

export type TagDocument = HydratedDocument<Tag>;
export type TagModel = Model<Tag>;

@Schema({ timestamps: true })
export class Tag extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: "Post" }],
    default: [],
    required: false,
  })
  posts!: Types.ObjectId[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
