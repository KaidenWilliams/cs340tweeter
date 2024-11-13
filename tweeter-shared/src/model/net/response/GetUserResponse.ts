import { UserDto } from "../../dto/UserDto";

export interface GetUserResponse {
  readonly user: UserDto | null;
}
