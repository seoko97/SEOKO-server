const SERIES_ERROR = {
  BAD_REQUEST: "올바르지 않은 시리즈 정보입니다.",
  NOT_FOUND: "시리즈를 찾을 수 없습니다.",
  ALREADY_EXISTS: "이미 존재하는 시리즈입니다.",
};

const SERIES_FIND_PROJECTION = {
  _id: 1,
  nid: 1,
  name: 1,
  thumbnail: 1,
  posts: 1,
  postCount: { $size: "$posts" },
  updatedAt: 1,
  createdAt: 1,
};

const SERIES_FIND_OPTIONS = {
  populate: "posts",
};

export { SERIES_ERROR, SERIES_FIND_PROJECTION, SERIES_FIND_OPTIONS };
