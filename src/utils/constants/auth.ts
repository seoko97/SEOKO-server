const IS_PUBLIC_KEY = "isPublic";

const AUTH_ERROR = {
  NO_SIGN: "로그인이 필요합니다.",
  EXPIRED_TOKEN: "인증 시간이 만료되었습니다.",
  INVALID_TOKEN: "유효하지 않은 정보입니다.",
  UNAUTHORIZED: "인증오류가 발생했습니다.",
} as const;

export { IS_PUBLIC_KEY, AUTH_ERROR };
