import { Controller } from "@nestjs/common";

import { AuthService } from "@/routes/auth/auth.service";
import { UserService } from "@/routes/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  async signin() {
    return ["string", "string"];
  }

  async signout() {
    return;
  }

  async refresh() {
    return ["string", "string"];
  }
}
