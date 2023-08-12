const IMAGE_ERROR = {
  INVALID_TYPE: "image/jpeg, image/png, image/jpg 형식의 파일만 업로드 가능합니다.",
  INVALID_SIZE: "이미지 파일은 10MB 이하만 업로드 가능합니다.",
  INVALID_UPLOAD_TYPE: "이미지 타입이 올바르지 않습니다.",
} as const;

const IMAGE_UPLOAD_TYPES = ["post", "series", "project", "skill"] as const;

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export { IMAGE_UPLOAD_TYPES, IMAGE_MIME_TYPES, MAX_FILE_SIZE, IMAGE_ERROR };
