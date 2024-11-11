import { UserDto } from "../../dto/UserDto";

export interface GetIsFollowerRequest {
  readonly token: string;
  readonly currentUser: UserDto;
  readonly selectedUser: UserDto;
}
