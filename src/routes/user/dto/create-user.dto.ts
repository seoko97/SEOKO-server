import { PickType } from "@nestjs/mapped-types";

import { User } from "@/routes/user/user.schema";

export class CreateUserDTO extends PickType(User, ["userId", "password", "username"]) {}
