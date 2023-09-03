import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsEnum, IsString } from "class-validator";
import { Document, Model } from "mongoose";

import { BaseSchema } from "@/common/schema/base.schema";
import { SkillType } from "@/types";

export type SkillDocument = Skill & Document;
export type SkillModel = Model<SkillDocument>;

@Schema({ timestamps: true })
export class Skill extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  name!: string;

  @IsEnum(SkillType)
  @Prop({ required: true, enum: SkillType })
  type!: SkillType;

  @IsString()
  @Prop({ required: true })
  icon!: string;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
