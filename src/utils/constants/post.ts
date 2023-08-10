const POST_ERROR = {
  NOT_FOUND: "존재하지 않는 게시글입니다.",
  FAIL_CREATE: "게시글 생성에 실패했습니다.",
  FAIL_UPDATE: "게시글 수정에 실패했습니다.",
  ALREADY_LIKED: "이미 좋아요를 누른 게시글입니다.",
};

const POST_FIND_PROJECTION = {
  _id: 1,
  title: 1,
  content: 1,
  thumbnail: 1,
  nid: 1,
  createdAt: 1,
  updatedAt: 1,
  tags: 1,
  series: 1,
  likeCount: { $size: "$likes" },
  viewCount: { $size: "$views" },
};

export { POST_ERROR, POST_FIND_PROJECTION };
