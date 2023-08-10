import { SERIES_STUB } from "test/utils/stub/series";
import { TAG_STUB } from "test/utils/stub/tag";

import { CreatePostDto } from "@/routes/post/dto/create-post.dto";
import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { UpdatePostDto } from "@/routes/post/dto/update-post.dto";

const POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES = {
  title: "title",
  content: "content",
  thumbnail: "thumbnail",
};

const POST_CREATE_STUB: CreatePostDto = {
  ...POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES,
  series: SERIES_STUB.name,
  tags: ["tags"],
};

const GET_POSTS_DTO_STUB: GetPostsDto = {
  skip: 0,
  limit: 10,
  series: "series",
  tag: "tag",
  text: "text",
};

const POST_UPDATE_STUB: UpdatePostDto = {
  ...POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES,
  series: "change_series",
  deleteTags: ["delete"],
  addTags: ["add"],
};

const POST_STUB = {
  _id: "_id",
  ...POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES,
  series: SERIES_STUB,
  tags: [TAG_STUB],
  likes: ["likes"],
  views: ["views"],
  nid: 1,
};

export {
  POST_CREATE_STUB_WITHOUT_TAGS_AND_SERIES,
  POST_CREATE_STUB,
  POST_UPDATE_STUB,
  GET_POSTS_DTO_STUB,
  POST_STUB,
};
