import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Model } from "mongoose";

export type SequenceDocument = Sequence & Document;
export type SequenceModel = Model<SequenceDocument>;

@Schema()
export class Sequence {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true, default: 0 })
  seq: number;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
