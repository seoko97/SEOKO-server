import { FilterQuery } from "mongoose";

import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { PostDocument } from "@/routes/post/post.schema";

const filterQueryByPosts = (dto: GetPostsDto) => {
  const { series, tag, text } = dto;

  const query: FilterQuery<PostDocument> = {};

  if (series) {
    query.series = series;
  }

  if (tag) {
    query.tags = { $elemMatch: { name: tag } };
  }

  if (text) {
    query.$or = [
      { title: { $regex: text, $options: "i" } },
      { content: { $regex: text, $options: "i" } },
    ];
  }

  return query;
};

export { filterQueryByPosts };