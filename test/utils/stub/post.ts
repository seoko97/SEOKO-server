import { SERIES_STUB } from "test/utils/stub/series";
import { TAG_STUB } from "test/utils/stub/tag";

const POST_CREATE_STUB = {
  title: "title",
  content: "content",
  thumbnail: "thumbnail",
  series: "series",
  tags: ["tags"],
};

const POST_UPDATE_STUB = {
  _id: "_id",
  title: "title",
  deleteTags: ["delete"],
  addTags: ["add"],
};

const POST_STUB = {
  _id: "_id",
  title: "title",
  content: "content",
  thumbnail: "thumbnail",
  series: SERIES_STUB,
  tags: TAG_STUB,
  likes: ["likes"],
  views: ["views"],
  nid: 1,
};

export { POST_CREATE_STUB, POST_UPDATE_STUB, POST_STUB };
