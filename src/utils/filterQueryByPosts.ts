import { Types, QueryFilter } from "mongoose";

import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { PostDocument } from "@/routes/post/post.schema";

const filterQueryByPosts = (dto: GetPostsDto): QueryFilter<PostDocument> => {
  const { series, tag, text } = dto;

  const query: QueryFilter<PostDocument> = {};

  if (series && Types.ObjectId.isValid(series)) {
    query.series = Types.ObjectId.createFromHexString(series);
  }

  if (tag) {
    query.tags = tag;
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
