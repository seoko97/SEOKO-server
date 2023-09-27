import { PipelineStage } from "mongoose";

const TAG_ERROR = {
  NOT_FOUND: "존재하지 않는 태그입니다.",
  ALREADY_EXIST: "이미 존재하는 태그입니다.",
};

const GET_TAGS_OPTIONS: PipelineStage[] = [
  { $lookup: { from: "posts", localField: "posts", foreignField: "_id", as: "posts" } },
  { $project: { _id: 1, name: 1, createdAt: 1, updatedAt: 1, postCount: { $size: "$posts" } } },
  { $sort: { postCount: -1 } },
];

export { TAG_ERROR, GET_TAGS_OPTIONS };
