import type { HydratedDocument, Model, QueryFilter, QueryOptions } from "mongoose";

import { SequenceRepository } from "@/common/sequence/sequence.repository";

export class BaseRepository<RawDocument extends object, CreateDto = unknown, UpdateDto = unknown> {
  constructor(
    private readonly model: Model<RawDocument>,
    private readonly sequenceRepository: SequenceRepository,
  ) {}

  async create(data: CreateDto) {
    const modelName = this.model.modelName.toLowerCase();

    const nid = await this.sequenceRepository.getNextSequence(modelName);

    const created = new this.model({ nid, ...data });

    return created.save() as unknown as HydratedDocument<RawDocument>;
  }

  async update(_id: string, data: UpdateDto) {
    return this.model.updateOne({ _id }, data);
  }

  async findOneAndUpdate(
    filter: QueryFilter<RawDocument>,
    data: UpdateDto,
    options: QueryOptions<RawDocument> = {},
  ) {
    return this.model.findOneAndUpdate(filter, data, { returnDocument: "after", ...options });
  }

  async findOneAndDelete(
    filter: QueryFilter<RawDocument>,
    options: QueryOptions<RawDocument> = {},
  ) {
    return this.model.findOneAndDelete(filter, options);
  }

  async delete(_id: string) {
    await this.model.deleteOne({ _id });
  }

  getOne(
    filter: QueryFilter<RawDocument> = {},
    projection: string | Record<string, number | boolean | string | object> = {},
    options: QueryOptions<RawDocument> = {},
  ) {
    return this.model.findOne(filter).setOptions(options).select(projection);
  }

  getById(
    _id: string,
    projection: string | Record<string, number | boolean | string | object> = {},
    options: QueryOptions<RawDocument> = {},
  ) {
    return this.model.findById(_id).setOptions(options).select(projection);
  }

  getAll(
    filter: QueryFilter<RawDocument> = {},
    projection: string | Record<string, number | boolean | string | object> = {},
    options: QueryOptions<RawDocument> = {},
  ) {
    return this.model.find(filter).setOptions(options).select(projection);
  }
}
