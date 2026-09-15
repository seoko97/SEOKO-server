import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDateString, IsString } from "class-validator";
import { HydratedDocument, Model } from "mongoose";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";
import { BaseSchema } from "@/common/schema/base.schema";

export type ExperienceDocument = HydratedDocument<Experience>;
export type ExperienceModel = Model<Experience>;

@Schema({ timestamps: true })
export class Experience extends BaseSchema {
  @IsString()
  @Prop({ required: true, unique: true })
  title!: string;

  @IsString()
  @Prop({ required: true })
  description!: string;

  @IsDateString()
  @Prop({ required: true })
  start!: string;

  @IsOptionalCustom(IsDateString())
  @Prop({ required: false, default: null })
  end?: string;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
