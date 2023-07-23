import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";

export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
