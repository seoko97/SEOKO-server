import { TOKEN_STUB } from "test/utils/stub";

import { UserDocument } from "@/routes/user/user.schema";

const TOKEN_USER_STUB = {
  _id: "id",
};

const USER_ID_PASSWORD_STUB = {
  userId: "test",
  password: "test",
};

const USER_STUB_NON_PASSWORD = {
  ...TOKEN_USER_STUB,
  userId: "test",
  username: "test",
  refreshToken: TOKEN_STUB,
  nid: 1,
} as unknown as UserDocument;

const USER_STUB = {
  ...USER_STUB_NON_PASSWORD,
  password: "test",
} as unknown as UserDocument;

const USER_INPUT_STUB = {
  ...USER_ID_PASSWORD_STUB,
  username: "test",
};

export {
  TOKEN_USER_STUB,
  USER_ID_PASSWORD_STUB,
  USER_STUB_NON_PASSWORD,
  USER_STUB,
  USER_INPUT_STUB,
};
