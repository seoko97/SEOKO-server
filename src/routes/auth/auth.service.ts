import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { USER_STUB } from "test/utils/stub";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConstantProvider: AuthConstantProvider,
  ) {}

  // 로그인시 access token과 refresh token을 발급
  async signin(SignInDTO: any) {
    return ["string", "string"];
  }

  // refresh token 유효성 검사
  // 서버에 저장된 유저 토큰이 유효한 토큰인지 확인
  async verifyRefreshToken(user: any, refreshToken: string) {
    return true;
  }

  // 로그인 요청시 입력한 아이디와 비밀번호가 유저 정보와 일치하는지 확인
  // 확인됐다면 유저 정보를 반환
  // 유저 패스워드와 입력받은 패스워드를 비교
  // 함수 단위를 작게 가져가기위해 내부에서 user 정보를 가져오지 않음
  async comparePassword(uPassword: string, password: string) {
    return true;
  }

  // response header에서 access token과 refresh token을 삭제
  async clearCookie() {
    return;
  }

  // 입력받은 데이터를 통해 토큰을 발급
  signature() {
    return "";
  }

  // 토큰을 쿠키에 등록
  registerTokenInCookie() {
    return;
  }
}
