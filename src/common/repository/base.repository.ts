import { FilterQuery, Document as MDocument, Model, ProjectionType, QueryOptions } from "mongoose";

import { SequenceRepository } from "@/common/sequence/sequence.repository";

export class BaseRepository<Document extends MDocument, CreateDto = unknown, UpdateDto = unknown> {
  constructor(
    private readonly model: Model<Document>,
    private readonly sequenceRepository: SequenceRepository,
  ) {}

  async create(data: CreateDto): Promise<Document> {
    const modelName = this.model.modelName.toLowerCase();

    const nid = await this.sequenceRepository.getNextSequence(modelName);

    return this.model.create({ nid, ...data });
  }

  async update(_id: string, data: UpdateDto) {
    return this.model.updateOne({ _id }, data);
  }

  async findOneAndUpdate(
    filter: FilterQuery<Document>,
    data: UpdateDto,
    options: QueryOptions<Document> = {},
  ) {
    return this.model.findOneAndUpdate(filter, data, { ...options, new: true });
  }

  async delete(_id: string) {
    await this.model.deleteOne({ _id });
  }

  async getOne(
    filter: FilterQuery<Document> = {},
    projection: ProjectionType<Document> = {},
    options: QueryOptions<Document> = {},
  ) {
    return this.model.findOne(filter, projection, options);
  }

  async getById(
    _id: string,
    projection: ProjectionType<Document> = {},
    options: QueryOptions<Document> = {},
  ) {
    return this.model.findById(_id, projection, options);
  }

  async getAll(
    filter: FilterQuery<Document> = {},
    projection: ProjectionType<Document> = {},
    options: QueryOptions<Document> = {},
  ) {
    return this.model.find(filter, projection, options);
  }
}
