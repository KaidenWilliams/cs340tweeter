import { AuthEntity } from "../../entity/Auth";

export interface AuthDao {
  // Create + Read + Delete
  // also automatic expiration / deletion

  createAuth(auth: AuthEntity): Promise<void>;

  getAuth(token: string): Promise<AuthEntity | null>;

  deleteAuth(token: string): Promise<void>;
}
