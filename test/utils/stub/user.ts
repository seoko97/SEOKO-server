const USER_STUB_NON_PASSWORD = {
  _id: "id",
  username: "test",
  userId: "test",
  refreshToken: null,
  nid: 1,
};

const USER_STUB = {
  ...USER_STUB_NON_PASSWORD,
  password: "test",
};

const USER_INPUT_STUB = {
  username: "test",
  userId: "test",
  password: "test",
};

export { USER_STUB_NON_PASSWORD, USER_STUB, USER_INPUT_STUB };
