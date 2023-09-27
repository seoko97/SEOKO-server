import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Sequence, SequenceModel } from "@/common/sequence/sequence.schema";

@Injectable()
export class SequenceRepository {
  constructor(@InjectModel(Sequence.name) protected readonly sequenceModel: SequenceModel) {}

  async getNextSequence(target: string) {
    const sequence = await this.sequenceModel.findOne({ target });

    if (sequence) {
      sequence.seq += 1;

      await sequence.save();

      return sequence.seq;
    } else {
      const sequenceDocument = await this.sequenceModel.create({ target });

      return sequenceDocument.seq;
    }
  }
}
