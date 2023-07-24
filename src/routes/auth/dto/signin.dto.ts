import { PickType } from "@nestjs/mapped-types";

import { User } from "@/routes/user/user.schema";

export class SigninDTO extends PickType(User, ["userId", "password"]) {}
