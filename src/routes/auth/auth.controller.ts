import { Controller } from "@nestjs/common";

import { AuthService } from "@/routes/auth/auth.service";
import { UserService } from "@/routes/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  // localGuard를 통해 검증된 User 정보를 가져옴
  // 해당 User 정보를 통해 access token과 refresh token을 발급
  // 발급된 token을 response header에 담아서 전송
  async signin(SigninDTO: any, user: any, res: any) {
    return ["string", "string"];
  }

  // AuthGuard를 통해 검증된 User 정보를 가져옴
  // response header에 담겨있는 token을 제거
  async signout(user: any, res: any) {
    return;
  }

  // AuthGuard를 통해 검증된 User 정보를 가져옴
  // 검증된 User 정보를 통해 access token 재발급
  async refresh(user: any, res: any) {
    return;
  }
}
