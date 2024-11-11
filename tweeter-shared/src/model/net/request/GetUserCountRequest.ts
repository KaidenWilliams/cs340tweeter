import { UserDto } from "../../dto/UserDto";

export interface GetUserCountRequest {
  readonly token: string;
  readonly user: UserDto;
}
