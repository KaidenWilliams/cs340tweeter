import { UserEntity } from "../../entity/User";

export interface UserDao {
  // Create + Paged Read

  createUser(user: UserEntity): Promise<void>;

  getUser(alias: string): Promise<UserEntity | null>;
}
