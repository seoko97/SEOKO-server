const SERIES_CREATE_INPUT_STUB = {
  name: "title",
  thumbnail: "thumbnail",
};

const SERIES_UPDATE_INPUT_STUB = {
  ...SERIES_CREATE_INPUT_STUB,
};

const SERIES_STUB_WITHOUT_POSTS = {
  ...SERIES_UPDATE_INPUT_STUB,
  posts: [],
};

const SERIES_STUB = {
  ...SERIES_STUB_WITHOUT_POSTS,
  _id: "id",
  posts: [{ _id: "id" }],
  nid: 1,
};

export {
  SERIES_CREATE_INPUT_STUB,
  SERIES_UPDATE_INPUT_STUB,
  SERIES_STUB_WITHOUT_POSTS,
  SERIES_STUB,
};
