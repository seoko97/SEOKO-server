import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsString } from "class-validator";
import { Document, Model } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";

export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;

@Schema()
export class User extends BaseSchema {
  @IsString()
  @Prop({ required: true })
  username!: string;

  @IsString()
  @Prop({ required: true })
  userId!: string;

  @IsString()
  @Prop({ required: true })
  password!: string;

  @IsString()
  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
