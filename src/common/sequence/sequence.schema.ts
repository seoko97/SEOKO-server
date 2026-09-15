import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

type SequenceDocument = Sequence & Document;
type SequenceModel = Model<SequenceDocument>;

@Schema()
class Sequence {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true, default: 0 })
  seq: number;
}

const SequenceSchema = SchemaFactory.createForClass(Sequence);

export { Sequence, SequenceSchema };
export type { SequenceDocument, SequenceModel };
