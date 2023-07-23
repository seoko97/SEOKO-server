import { User } from "@/routes/user/user.schema";

type TTokenUser = Pick<User, "_id">;

export { TTokenUser };
