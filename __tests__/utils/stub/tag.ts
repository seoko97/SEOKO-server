const TAG_INPUT_STUB = {
  name: "태그",
};

const TAG_STUB = {
  ...TAG_INPUT_STUB,
  _id: "_id",
  nid: 1,
  posts: [{ _id: "post_id" }],
};

const TAG_STUB_WITHOUT_POSTS = {
  ...TAG_STUB,
  posts: [],
};

export { TAG_INPUT_STUB, TAG_STUB, TAG_STUB_WITHOUT_POSTS };
