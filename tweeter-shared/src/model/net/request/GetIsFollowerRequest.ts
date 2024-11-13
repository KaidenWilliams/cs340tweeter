import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetIsFollowerRequest extends TweeterRequest {
  readonly token: string;
  readonly currentUser: UserDto;
  readonly selectedUser: UserDto;
}
