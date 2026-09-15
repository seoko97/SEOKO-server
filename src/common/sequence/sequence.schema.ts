import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type SequenceDocument = HydratedDocument<Sequence>;
export type SequenceModel = Model<Sequence>;

@Schema()
export class Sequence {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true, default: 0 })
  seq: number;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
