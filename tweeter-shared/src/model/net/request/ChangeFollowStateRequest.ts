import { UserDto } from "../../dto/UserDto";

export interface ChangeFollowStateRequest {
  readonly token: string;
  readonly user: UserDto;
}
