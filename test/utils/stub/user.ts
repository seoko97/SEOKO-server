import mongoose from "mongoose";

const USER_STUB = {
  _id: new mongoose.Types.ObjectId(),
  username: "test",
  userId: "test",
  password: "test",
  refreshToken: null,
  nid: 1,
};

export { USER_STUB };
