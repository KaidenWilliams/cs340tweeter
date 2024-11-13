import { UserDto } from "../../dto/UserDto";

export interface SignInResponse {
  readonly user: UserDto;
  readonly token: string;
}
