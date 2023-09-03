import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IsDateString, IsString } from "class-validator";
import { Document, Model } from "mongoose";

import { IsOptionalCustom } from "@/common/decorators/is-optional.decorator";
import { BaseSchema } from "@/common/schema/base.schema";

export type ProjectDocument = Project & Document;
export type ProjectModel = Model<ProjectDocument>;

@Schema({ timestamps: true })
export class Project extends BaseSchema {
  @IsString()
  @Prop({ required: true })
  title!: string;

  @IsString()
  @Prop({ required: true })
  description!: string;

  @IsString()
  @Prop({ required: true })
  content!: string;

  @IsString()
  @Prop({ required: true })
  thumbnail!: string;

  @IsString()
  @Prop({ required: true })
  github!: string;

  @IsDateString()
  @Prop({ required: true })
  start!: string;

  @IsOptionalCustom(IsDateString())
  @Prop({ required: false, default: null })
  end?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
