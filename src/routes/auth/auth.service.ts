import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { USER_STUB } from "test/utils/stub";

import { AuthConstantProvider } from "@/common/providers/auth-constant.provider";
import { UserService } from "@/routes/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authConstantProvider: AuthConstantProvider,
  ) {}

  // 로그인시 access token과 refresh token을 발급
  async signin(SignInDTO: any) {
    return ["string", "string"];
  }

  // 로그인 요청시 입력한 아이디와 비밀번호가 유저 정보와 일치하는지 확인
  // 확인됐다면 유저 정보를 반환
  async validateUser(SignInDTO: any) {
    return USER_STUB;
  }

  // refresh token 유효성 검사
  // 서버에 저장된 유저 토큰이 유효한 토큰인지 확인
  async verifyRefreshToken() {
    return true;
  }

  // response header에서 access token과 refresh token을 삭제
  async clearCookie() {
    return;
  }

  async comparePassword() {
    return true;
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
